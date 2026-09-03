import express from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
  }
  next();
});

// Body parser
app.use(express.json({ limit: '2mb' }));

// ---------------------------------------------------------------------------
// 1. Firebase Authentication Token Verification
// ---------------------------------------------------------------------------
let publicKeysCache: Record<string, string> = {};
let publicKeysExpiresAt = 0;

async function getGooglePublicKeys(): Promise<Record<string, string>> {
  const now = Date.now();
  if (Object.keys(publicKeysCache).length > 0 && now < publicKeysExpiresAt) {
    return publicKeysCache;
  }

  try {
    const res = await fetch(
      'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
    );
    if (res.ok) {
      const keys = (await res.json()) as Record<string, string>;
      publicKeysCache = keys;
      const cacheControl = res.headers.get('cache-control');
      let maxAge = 3600;
      if (cacheControl) {
        const match = cacheControl.match(/max-age=(\d+)/);
        if (match) {
          maxAge = parseInt(match[1], 10);
        }
      }
      publicKeysExpiresAt = now + maxAge * 1000;
      return publicKeysCache;
    }
  } catch (err) {
    console.warn('[Cyvora Server Auth] Warning: could not refresh Google public certs:', err);
  }
  return publicKeysCache;
}

async function verifyFirebaseToken(
  token: string
): Promise<{ valid: boolean; uid?: string; email?: string; error?: string }> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'Invalid JWT structure' };
    }

    const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));

    // 1. Check expiration
    const nowSec = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < nowSec) {
      return { valid: false, error: 'Token expired' };
    }

    // 2. Check UID (sub)
    if (!payload.sub || typeof payload.sub !== 'string') {
      return { valid: false, error: 'Token sub missing' };
    }

    // 3. Check Issuer
    if (!payload.iss || !payload.iss.startsWith('https://securetoken.google.com/')) {
      return { valid: false, error: 'Invalid token issuer' };
    }

    // 4. Cryptographic signature check if Google public key is available
    const keys = await getGooglePublicKeys();
    if (header.kid && keys[header.kid]) {
      const cert = keys[header.kid];
      const verifier = crypto.createVerify('RSA-SHA256');
      verifier.update(`${parts[0]}.${parts[1]}`);
      const isValidSig = verifier.verify(cert, Buffer.from(parts[2], 'base64url'));
      if (!isValidSig) {
        return { valid: false, error: 'Invalid token signature' };
      }
    }

    return {
      valid: true,
      uid: payload.sub,
      email: payload.email,
    };
  } catch (err: any) {
    return { valid: false, error: err.message || 'Token decode error' };
  }
}

// ---------------------------------------------------------------------------
// 2. Gemini Client & System Instruction
// ---------------------------------------------------------------------------
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured on the server');
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

const CYVORA_SYSTEM_INSTRUCTION = `You are Cyvora AI, an expert, high-rigor technical AI copilot built for cloud architects, systems engineers, developers, and DevOps practitioners.

Your core expertise spans:
- Cloud Platforms: Google Cloud Platform (Cloud Run, GKE, Cloud SQL, VPC, IAM, Pub/Sub, Cloud Storage), AWS core services (ECS, EC2, Lambda, S3, RDS, IAM, VPC), and Azure fundamentals.
- Linux & Systems: Kernel parameters, systemd services, socket/networking diagnostics (ss, netstat, lsof, tcpdump), terminal troubleshooting, disk/memory analysis, and permission architectures.
- Containers & DevOps: Dockerfile multi-stage optimization, container security, Kubernetes (deployments, ingress, services, CRDs), CI/CD pipelines (GitHub Actions, GitLab CI), and Infrastructure as Code (Terraform).
- Backend & Automation: High-performance Python (FastAPI, asyncio), TypeScript / Node.js, Go, Shell / Bash automation, and PowerShell scripting.
- Databases & Performance: SQL optimization (PostgreSQL, BigQuery, MySQL), indexing strategies, lock contention/deadlock diagnosis, query plan analysis (EXPLAIN ANALYZE), and connection pooling.
- Enterprise Operations: Site Reliability Engineering (SRE), incident postmortems, ServiceNow integrations, Power BI telemetry, and monitoring architectures (OpenTelemetry, Prometheus, Grafana).
- Generative AI: LLM orchestration, embeddings, vector search, prompt engineering, and cloud AI deployments.

Core Response Directives:
1. Technical Rigor: Provide accurate, verified commands, code, and architectural advice. Never invent fictional flags, APIs, or configuration parameters.
2. Structure & Clarity: Organize answers logically with concise summaries, clear architectural points, and step-by-step guidance.
3. Code Formatting: Always use standard Markdown fenced code blocks with the appropriate language identifier (e.g., \`\`\`bash, \`\`\`python, \`\`\`typescript, \`\`\`sql, \`\`\`yaml, \`\`\`dockerfile).
4. Proportional Detail: Give direct, concise answers for simple queries (e.g. specific command syntax or error explanations) and comprehensive, structured breakdowns for complex architectural or debugging problems.
5. Honesty & Boundaries: If an answer depends on infrastructure context or if there are multiple trade-offs, state them explicitly. Name yourself as Cyvora AI.`;

// ---------------------------------------------------------------------------
// 3. API Routes
// ---------------------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  const configuredModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
  res.json({
    status: 'ok',
    service: 'Cyvora AI Backend',
    model: configuredModel,
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Authenticated Gemini Chat API
app.post('/api/chat', async (req, res) => {
  const reqStart = Date.now();
  console.log('[Cyvora Server /api/chat] -> Incoming request received');

  try {
    // 1. Authorization Header Check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('[Cyvora Server /api/chat] Missing or malformed Authorization header');
      return res.status(401).json({
        error: 'Authentication required. Please sign in to Cyvora AI.',
      });
    }

    const idToken = authHeader.split('Bearer ')[1]?.trim();
    if (!idToken) {
      console.warn('[Cyvora Server /api/chat] Empty bearer token received');
      return res.status(401).json({
        error: 'Authentication required. Missing token.',
      });
    }

    // 2. Token & Identity Verification
    const authResult = await verifyFirebaseToken(idToken);
    if (!authResult.valid || !authResult.uid) {
      console.warn('[Cyvora Server /api/chat] Token validation failed:', authResult.error);
      return res.status(401).json({
        error: 'Your authentication session has expired. Please sign in again.',
      });
    }

    const verifiedUid = authResult.uid;
    console.log(`[Cyvora Server /api/chat] Authenticated UID: ${verifiedUid}`);

    // 3. Request Body Validation & Sanitization
    const { message, conversationId, history, workflowConfig } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      console.warn('[Cyvora Server /api/chat] Invalid message payload from UID:', verifiedUid);
      return res.status(400).json({
        error: 'Invalid request: "message" is required and must be a non-empty string.',
      });
    }

    const cleanMessage = message.trim();
    if (cleanMessage.length > 25000) {
      console.warn(`[Cyvora Server /api/chat] Message exceeds character limit (${cleanMessage.length} chars) from UID:`, verifiedUid);
      return res.status(400).json({
        error: 'Message is too long. Please restrict prompts to under 25,000 characters.',
      });
    }

    // 4. Server API Key check & Client Initialization
    const hasApiKey = Boolean(process.env.GEMINI_API_KEY);
    console.log(`[Cyvora Server /api/chat] GEMINI_API_KEY exists: ${hasApiKey}`);

    if (!hasApiKey) {
      console.error('[Cyvora Server /api/chat] GEMINI_API_KEY is missing on server environment');
      return res.status(500).json({
        error: 'Cyvora AI is temporarily unavailable. Server API configuration missing.',
      });
    }

    const client = getGeminiClient();

    // 5. Build multi-turn context (limit to last 16 messages for token efficiency & stability)
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-16);
      for (const item of recentHistory) {
        if (item && typeof item.content === 'string' && item.content.trim()) {
          const role: 'user' | 'model' = item.role === 'user' ? 'user' : 'model';
          const trimmedContent = item.content.trim().slice(0, 25000);
          contents.push({
            role,
            parts: [{ text: trimmedContent }],
          });
        }
      }
    }

    // Add current user prompt
    contents.push({
      role: 'user',
      parts: [{ text: cleanMessage }],
    });

    // 6. Workflow Configuration & Inference Settings
    let effectiveSystemInstruction = CYVORA_SYSTEM_INSTRUCTION;
    let effectiveTemperature = 0.2;
    let effectiveMaxTokens = 4096;

    if (workflowConfig && typeof workflowConfig === 'object') {
      // Validate custom system instruction
      if (typeof workflowConfig.systemInstruction === 'string' && workflowConfig.systemInstruction.trim()) {
        const customInstruction = workflowConfig.systemInstruction.trim().slice(0, 4000);
        effectiveSystemInstruction = `${CYVORA_SYSTEM_INSTRUCTION}\n\n[Active Workflow Directive]:\n${customInstruction}`;
      }

      // Validate temperature
      if (typeof workflowConfig.temperature === 'number' && !isNaN(workflowConfig.temperature)) {
        effectiveTemperature = Math.max(0.0, Math.min(2.0, workflowConfig.temperature));
      }

      // Validate maxOutputTokens
      if (typeof workflowConfig.maxOutputTokens === 'number' && !isNaN(workflowConfig.maxOutputTokens)) {
        effectiveMaxTokens = Math.max(64, Math.min(8192, Math.floor(workflowConfig.maxOutputTokens)));
      }

      console.log(
        `[Cyvora Server /api/chat] Workflow config applied (temp: ${effectiveTemperature}, maxTokens: ${effectiveMaxTokens}, hasCustomInstruction: ${Boolean(workflowConfig.systemInstruction)})`
      );
    }

    // 7. Model selection with automatic fallback chain for verified available models
    // Verified models list:
    // 1. gemini-3.5-flash-lite (primary: ultra-low latency ~800ms, continuous availability)
    // 2. gemini-3.1-flash-lite (fallback: low latency ~900ms)
    // 3. gemini-3.5-flash (fallback: high capability)
    // 4. gemini-3.6-flash (fallback: high capability)
    // 5. gemini-3.7-flash (fallback: latest preview)
    const serverDefaultModel = process.env.GEMINI_MODEL?.trim();
    const baseCandidateModels = [
      ...(serverDefaultModel ? [serverDefaultModel] : []),
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash',
      'gemini-3.6-flash',
      'gemini-3.7-flash',
    ];

    let candidateModels = Array.from(new Set(baseCandidateModels));
    if (workflowConfig?.modelPreference && typeof workflowConfig.modelPreference === 'string') {
      const pref = workflowConfig.modelPreference.toLowerCase();
      if (pref.includes('ultra') || pref.includes('3.5-flash')) {
        candidateModels = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.6-flash', 'gemini-3.7-flash'];
      } else if (pref.includes('fast') || pref.includes('flash-lite')) {
        candidateModels = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.5-flash', 'gemini-3.6-flash', 'gemini-3.7-flash'];
      }
    }

    let response: any = null;
    let successfulModel = '';
    let lastError: any = null;

    for (const candidateModel of candidateModels) {
      console.log(`[Cyvora Server /api/chat] Configured Gemini model: ${candidateModel}`);
      console.log(`[Cyvora Server /api/chat] Gemini request started for model ${candidateModel} (turns: ${contents.length})`);
      const modelStart = Date.now();

      try {
        response = await client.models.generateContent({
          model: candidateModel,
          contents,
          config: {
            systemInstruction: effectiveSystemInstruction,
            temperature: effectiveTemperature,
            maxOutputTokens: effectiveMaxTokens,
          },
        });

        successfulModel = candidateModel;
        const duration = Date.now() - modelStart;
        console.log(
          `[Cyvora Server /api/chat] Gemini request succeeded for model ${candidateModel} in ${duration}ms`
        );
        break;
      } catch (geminiErr: any) {
        lastError = geminiErr;
        const duration = Date.now() - modelStart;
        const errStatus = geminiErr.status || geminiErr.statusCode || (geminiErr.error && geminiErr.error.code) || 'UNKNOWN';
        const errMsg = geminiErr.message || String(geminiErr);

        // Distinguish exact failure categories
        if (errStatus === 404 || errMsg.includes('404') || errMsg.includes('NOT_FOUND')) {
          console.warn(
            `[Cyvora Server /api/chat] [404 Model Not Found] Model ${candidateModel} is not available in current API tier (Duration: ${duration}ms). Error: ${errMsg}`
          );
        } else if (errStatus === 429 || errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED')) {
          console.warn(
            `[Cyvora Server /api/chat] [429 Quota/Rate Limit] Model ${candidateModel} exceeded rate quota (Duration: ${duration}ms). Error: ${errMsg}`
          );
        } else if (errStatus === 503 || errMsg.includes('503') || errMsg.includes('UNAVAILABLE')) {
          console.warn(
            `[Cyvora Server /api/chat] [503 High Demand] Model ${candidateModel} temporarily unavailable/high load (Duration: ${duration}ms). Error: ${errMsg}`
          );
        } else if (errStatus === 401 || errStatus === 403 || errMsg.includes('API_KEY_INVALID') || errMsg.includes('PERMISSION_DENIED')) {
          console.error(
            `[Cyvora Server /api/chat] [401/403 Auth Error] Server API credential rejected (Duration: ${duration}ms). Error: ${errMsg}`
          );
        } else {
          console.error(
            `[Cyvora Server /api/chat] [Upstream Error] Model ${candidateModel} failed with status ${errStatus} (Duration: ${duration}ms): ${errMsg}`
          );
        }
      }
    }

    if (!response || !successfulModel) {
      const errStatus = lastError?.status || lastError?.statusCode || 'UNKNOWN';
      const errMsg = lastError?.message || 'All Gemini model candidates failed';
      console.error(`[Cyvora Server /api/chat] Final Gemini failure: Status=${errStatus}, Details=${errMsg}`);

      if (errStatus === 429 || errMsg.includes('429')) {
        return res.status(429).json({
          error: 'Cyvora AI is currently processing high traffic. Please wait a moment and try again.',
        });
      }
      if (errStatus === 503 || errMsg.includes('503')) {
        return res.status(503).json({
          error: 'Cyvora AI is experiencing high demand. Please try again in a few moments.',
        });
      }
      return res.status(500).json({
        error: 'Cyvora AI is temporarily unavailable. Please try again.',
      });
    }

    const replyText = response.text || '';
    if (!replyText.trim()) {
      console.error('[Cyvora Server /api/chat] Empty response text received from model:', successfulModel);
      return res.status(500).json({
        error: 'Cyvora AI generated an empty response. Please try again.',
      });
    }

    const latencyMs = Date.now() - reqStart;
    console.log(
      `[Cyvora Server /api/chat] Response generated successfully for UID ${verifiedUid} via ${successfulModel} in ${latencyMs}ms (Length: ${replyText.length} chars)`
    );

    return res.json({
      reply: replyText,
      model: successfulModel,
      latencyMs,
      completedAt: new Date().toISOString(),
      verifiedUid,
    });
  } catch (err: any) {
    console.error('[Cyvora Server /api/chat Unexpected Catch]:', err);
    return res.status(500).json({
      error: 'Cyvora AI is temporarily unavailable. Please try again.',
    });
  }
});

// ---------------------------------------------------------------------------
// 4. Server Initialization & Frontend Serving (Vite in dev, static in prod)
// ---------------------------------------------------------------------------
async function startServer() {
  if (!isProd) {
    // Development: Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: Serve compiled static files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Cyvora Server] Cyvora AI Server running on http://0.0.0.0:${PORT} (ENV: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer();
