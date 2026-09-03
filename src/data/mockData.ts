import { 
  Conversation, 
  Workflow, 
  SavedKnowledgeItem, 
  SuggestedPrompt, 
  UserSettings 
} from '../types';

export const INITIAL_SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    id: 'gcp-troubleshoot',
    title: 'Troubleshoot a GCP problem',
    prompt: 'I am experiencing HTTP 504 Gateway Timeouts on my Google Cloud Run service communicating with Cloud SQL via Serverless VPC Access connector. How can I diagnose and fix this bottleneck?',
    category: 'cloud',
    icon: 'Cloud',
    badge: 'GCP Cloud Run',
  },
  {
    id: 'linux-command',
    title: 'Explain this Linux command.',
    prompt: 'Explain how `ss -tulpn | grep :8080` works and how to safely terminate the process holding the port using `fuser` or `kill`.',
    category: 'linux',
    icon: 'Terminal',
    badge: 'Networking',
  },
  {
    id: 'review-python',
    title: 'Review my Python code.',
    prompt: 'Review my async FastAPI endpoint with Redis connection pooling for race conditions, memory leaks, and error handling bottlenecks.',
    category: 'code',
    icon: 'Code2',
    badge: 'FastAPI / Async',
  },
  {
    id: 'generate-sql',
    title: 'Generate a SQL query.',
    prompt: 'Write an optimized PostgreSQL query with CTEs and window functions to calculate 7-day rolling active user retention per acquisition cohort.',
    category: 'database',
    icon: 'Database',
    badge: 'PostgreSQL',
  },
  {
    id: 'interview-prep',
    title: 'Help me prepare for a technical interview.',
    prompt: 'Conduct a Senior Backend / Systems Engineer mock interview on designing a globally distributed rate limiter with Redis and sliding window counters.',
    category: 'interview',
    icon: 'GraduationCap',
    badge: 'System Design',
  },
];

export const INITIAL_WORKFLOWS: Workflow[] = [
  {
    id: 'cloud-troubleshooter',
    name: 'Cloud Troubleshooter',
    category: 'Infrastructure & GCP',
    iconName: 'CloudRain',
    description: 'Diagnose VPC latency, IAM permission denials, Kubernetes CrashLoopBackOff states, and Cloud Run cold starts.',
    prompt: 'Please run a diagnostic analysis for this cloud infrastructure problem on [Provider: GCP/AWS/Azure]:\n\nSymptoms: ',
    promptTemplate: 'Please run a diagnostic analysis for this cloud infrastructure problem on [Provider: GCP/AWS/Azure]:\n\nSymptoms: ',
    inputPlaceholder: 'e.g., GKE Ingress returning 502 Bad Gateway with healthy backend pods...',
    tags: ['GCP', 'Kubernetes', 'VPC & IAM', 'Cloud Run'],
    difficulty: 'Intermediate',
    estimatedTime: '2-3 min',
    enabled: true,
    isCustom: false,
    temperature: 0.2,
    maxOutputTokens: 4096,
  },
  {
    id: 'code-explainer',
    name: 'Code Explainer & Refactor',
    category: 'Software Engineering',
    iconName: 'Code',
    description: 'Deconstruct complex algorithms, legacy codebases, concurrency locks, and TypeScript generics with line-by-line annotations.',
    prompt: 'Analyze and explain this code snippet, highlighting Big-O complexity, potential edge case bugs, and modern idiomatic refactoring options:\n\n```\n',
    promptTemplate: 'Analyze and explain this code snippet, highlighting Big-O complexity, potential edge case bugs, and modern idiomatic refactoring options:\n\n```\n',
    inputPlaceholder: 'Paste code snippet here (Python, TypeScript, Rust, Go, Java)...',
    tags: ['Algorithms', 'Refactoring', 'Type Safety', 'Performance'],
    difficulty: 'Beginner',
    estimatedTime: '1-2 min',
    enabled: true,
    isCustom: false,
    temperature: 0.2,
    maxOutputTokens: 4096,
  },
  {
    id: 'sql-generator',
    name: 'SQL Generator & Optimizer',
    category: 'Data & Analytics',
    iconName: 'Database',
    description: 'Produce high-performance PostgreSQL, BigQuery, MySQL, and DuckDB queries with indexing advice and EXPLAIN plans.',
    prompt: 'Generate an optimized SQL query for the following schema and analytical requirement:\n\nSchema / Table structure: ',
    promptTemplate: 'Generate an optimized SQL query for the following schema and analytical requirement:\n\nSchema / Table structure: ',
    inputPlaceholder: 'e.g., Orders and UserEvents tables, need monthly churn rate by region...',
    tags: ['PostgreSQL', 'BigQuery', 'Query Plans', 'Window Functions'],
    difficulty: 'Intermediate',
    estimatedTime: '1 min',
    enabled: true,
    isCustom: false,
    temperature: 0.2,
    maxOutputTokens: 4096,
  },
  {
    id: 'linux-assistant',
    name: 'Linux Assistant & Shell Architect',
    category: 'Systems & DevOps',
    iconName: 'Terminal',
    description: 'Craft bulletproof Bash/Zsh automation scripts, systemd unit files, cron jobs, iptables rules, and kernel parameter tuning.',
    prompt: 'Provide a robust Linux terminal solution / script with safety checks and error trapping for:\n\nTask: ',
    promptTemplate: 'Provide a robust Linux terminal solution / script with safety checks and error trapping for:\n\nTask: ',
    inputPlaceholder: 'e.g., Automatically rotate logs older than 7 days and push to GCS bucket...',
    tags: ['Bash', 'systemd', 'Disk / Memory', 'Networking'],
    difficulty: 'Intermediate',
    estimatedTime: '2 min',
    enabled: true,
    isCustom: false,
    temperature: 0.2,
    maxOutputTokens: 4096,
  },
  {
    id: 'docker-devops-builder',
    name: 'DevOps & Docker Pipeline',
    category: 'CI/CD & Containers',
    iconName: 'Cpu',
    description: 'Generate hardened multi-stage Dockerfiles, GitHub Actions CI/CD workflows, and Terraform infrastructure-as-code blueprints.',
    prompt: 'Design a minimal, hardened production Dockerfile and CI/CD workflow for:\n\nApp Stack: ',
    promptTemplate: 'Design a minimal, hardened production Dockerfile and CI/CD workflow for:\n\nApp Stack: ',
    inputPlaceholder: 'e.g., Node.js TypeScript monorepo with pnpm and Prisma...',
    tags: ['Docker', 'CI/CD', 'Terraform', 'Security Hardening'],
    difficulty: 'Advanced',
    estimatedTime: '3 min',
    enabled: true,
    isCustom: false,
    temperature: 0.2,
    maxOutputTokens: 4096,
  },
  {
    id: 'interview-system-designer',
    name: 'System Design Interviewer',
    category: 'Career & Knowledge',
    iconName: 'Layers',
    description: 'Simulate high-level architecture rounds with capacity calculations, API contracts, caching tiers, and failover designs.',
    prompt: 'Act as a Senior Principal Staff Interviewer. Guide me through designing: ',
    promptTemplate: 'Act as a Senior Principal Staff Interviewer. Guide me through designing: ',
    inputPlaceholder: 'e.g., Design a real-time collaborative document editor like Google Docs...',
    tags: ['System Design', 'Scale', 'High Availability', 'Architecture'],
    difficulty: 'Advanced',
    estimatedTime: '5 min',
    enabled: true,
    isCustom: false,
    temperature: 0.3,
    maxOutputTokens: 4096,
  }
];

export const INITIAL_SAVED_KNOWLEDGE: SavedKnowledgeItem[] = [
  {
    id: 'knowledge-1',
    title: 'GCP Cloud Run with Serverless VPC Connector Timeout Fix',
    category: 'cloud',
    categoryLabel: 'Google Cloud',
    tags: ['GCP', 'Cloud Run', 'VPC Connector', 'Networking'],
    dateSaved: '2026-08-28',
    description: 'Resolution for intermittent 504 timeouts when invoking private Cloud SQL instances via Google Serverless VPC Access connector.',
    solutionSummary: 'Increase max instances on the Serverless VPC Connector (`e2-micro` instances scale out too slowly under spike traffic) and switch to Direct VPC Egress for modern Cloud Run revisions.',
    codeSnippet: {
      language: 'bash',
      fileName: 'deploy-cloud-run-direct-vpc.sh',
      code: `# Switch to Direct VPC egress for sub-millisecond private IP connection
gcloud run deploy cyvora-backend \\
  --image asia-southeast1-docker.pkg.dev/project-id/cyvora/api:latest \\
  --network default \\
  --subnet default \\
  --vpc-egress private-ranges-only \\
  --cpu 2 \\
  --memory 2Gi \\
  --max-instances 20 \\
  --region asia-southeast1`
    },
    keyTakeaways: [
      'Direct VPC egress eliminates Serverless VPC Connector throughput bottlenecks',
      'Ensure Private Google Access is enabled on the target subnet',
      'Set connection pooling min-idle connections to 2 to avoid cold-connect overhead'
    ],
    starred: true
  },
  {
    id: 'knowledge-2',
    title: 'Linux Systemd Service Auto-Restart with Exponential Backoff',
    category: 'linux',
    categoryLabel: 'Linux / Systems',
    tags: ['systemd', 'DevOps', 'Reliability', 'Linux'],
    dateSaved: '2026-08-25',
    description: 'Standard production-grade unit template for background daemon workers with watchdog integration and memory cgroups.',
    solutionSummary: 'Configures `Restart=on-failure`, `RestartSec=5s`, `MemoryMax=1.5G`, and standard unprivileged user execution context.',
    codeSnippet: {
      language: 'ini',
      fileName: '/etc/systemd/system/cyvora-worker.service',
      code: `[Unit]
Description=Cyvora Background Telemetry Worker
After=network.target network-online.target
Wants=network-online.target

[Service]
Type=simple
User=cyvora
Group=cyvora
WorkingDirectory=/opt/cyvora-worker
ExecStart=/opt/cyvora-worker/bin/worker --config /etc/cyvora/prod.yaml
Restart=on-failure
RestartSec=5s
MemoryMax=1.5G
MemoryAccounting=true
StandardOutput=journal
StandardError=journal
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target`
    },
    keyTakeaways: [
      'Always limit maximum open file descriptors via LimitNOFILE for network daemons',
      'Utilize MemoryMax to prevent OOM cascade across adjacent microservices',
      'Reload systemd with `sudo systemctl daemon-reload` after edits'
    ],
    starred: true
  },
  {
    id: 'knowledge-3',
    title: 'PostgreSQL 7-Day Rolling Retention Cohort Query',
    category: 'database',
    categoryLabel: 'SQL / Databases',
    tags: ['PostgreSQL', 'CTEs', 'Analytics', 'Performance'],
    dateSaved: '2026-08-20',
    description: 'High efficiency analytical query calculating user retention cohorts using date trunc and array aggregation without expensive self-joins.',
    solutionSummary: 'Uses CTEs with dense ranking and window functions to group first-seen registration timestamps against activity logs.',
    codeSnippet: {
      language: 'sql',
      fileName: 'retention_cohort.sql',
      code: `WITH cohort_users AS (
  SELECT 
    user_id,
    DATE_TRUNC('week', created_at) AS signup_week
  FROM users
),
user_activities AS (
  SELECT DISTINCT
    user_id,
    DATE_TRUNC('week', activity_timestamp) AS activity_week
  FROM telemetry_events
)
SELECT 
  c.signup_week,
  COUNT(DISTINCT c.user_id) AS cohort_size,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN a.activity_week = c.signup_week + INTERVAL '1 week' THEN a.user_id END) / COUNT(DISTINCT c.user_id), 2) AS week_1_pct,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN a.activity_week = c.signup_week + INTERVAL '2 week' THEN a.user_id END) / COUNT(DISTINCT c.user_id), 2) AS week_2_pct,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN a.activity_week = c.signup_week + INTERVAL '4 week' THEN a.user_id END) / COUNT(DISTINCT c.user_id), 2) AS week_4_pct
FROM cohort_users c
LEFT JOIN user_activities a ON c.user_id = a.user_id
GROUP BY c.signup_week
ORDER BY c.signup_week DESC;`
    },
    keyTakeaways: [
      'Pre-aggregating activity_week in CTE reduces join cardinality by over 90%',
      'Create compound index on `telemetry_events(user_id, activity_timestamp)`'
    ],
    starred: false
  },
  {
    id: 'knowledge-4',
    title: 'TypeScript Discriminated Unions for Resilient API Result Pattern',
    category: 'code',
    categoryLabel: 'TypeScript / Code',
    tags: ['TypeScript', 'Architecture', 'Clean Code'],
    dateSaved: '2026-08-15',
    description: 'Zero-throw error handling architecture ensuring exhaustive type safety across asynchronous backend services.',
    solutionSummary: 'Encapsulates domain outputs in `Ok<T>` and `Err<E>` variants with pattern matching helpers.',
    codeSnippet: {
      language: 'typescript',
      fileName: 'result.ts',
      code: `export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

export const ok = <T>(data: T): Result<T, never> => ({ success: true, data });
export const err = <E>(error: E): Result<never, E> => ({ success: false, error });

export async function wrapAsync<T>(promise: Promise<T>): Promise<Result<T, Error>> {
  try {
    const data = await promise;
    return ok(data);
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)));
  }
}`
    },
    keyTakeaways: [
      'Eliminates unhandled promise rejection edge cases',
      'Forces compiler-level checking before accessing `.data` payload'
    ],
    starred: true
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    title: 'GCP Cloud Run Serverless VPC Gateway Timeout Debugging',
    date: '2026-08-30',
    updatedAt: '10 mins ago',
    messageCount: 6,
    category: 'cloud',
    snippet: 'Diagnosed intermittent 504 Gateway Timeout responses between Cloud Run and private Cloud SQL instance.',
    isPinned: true,
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'I am experiencing HTTP 504 Gateway Timeouts on my Google Cloud Run service communicating with Cloud SQL via Serverless VPC Access connector. How can I diagnose and fix this bottleneck?',
        timestamp: '10:14 AM'
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: 'This 504 Gateway Timeout pattern is common when the **Serverless VPC Access connector** becomes saturated or faces cold scaling delays under sudden traffic spikes.\n\n### Root Cause Breakdown\n1. **Connector Throughput Saturation**: Default `e2-micro` instances support only ~100 Mbps throughput per instance and take 2-4 minutes to scale out.\n2. **Database Connection Pool Exhaustion**: Cloud Run containers scaling from 0 to 50 can spawn hundreds of unmanaged SQL connections.\n3. **Modern Alternative**: Google Cloud now recommends **Direct VPC Egress** over legacy connectors for sub-millisecond private IP routing.\n\nHere is the recommended mitigation plan:',
        timestamp: '10:15 AM',
        codeBlocks: [
          {
            language: 'bash',
            filename: 'switch-to-direct-vpc.sh',
            code: `# Deploy Cloud Run with Direct VPC Egress (bypasses connector latency)
gcloud run deploy cyvora-app \\
  --image asia-southeast1-docker.pkg.dev/cyvora-prod/apps/api:latest \\
  --network default \\
  --subnet default \\
  --vpc-egress private-ranges-only \\
  --set-env-vars DB_HOST=10.128.0.4,DB_NAME=cyvora_db \\
  --min-instances 1 \\
  --max-instances 30 \\
  --region asia-southeast1`
          }
        ],
        metadata: {
          model: 'Cyvora Ultra Copilot',
          latencyMs: 340,
          tokens: 412,
          category: 'cloud'
        }
      }
    ]
  },
  {
    id: 'conv-2',
    title: 'Optimizing Linux Network Ports and ss / fuser Diagnostics',
    date: '2026-08-29',
    updatedAt: 'Yesterday',
    messageCount: 4,
    category: 'linux',
    snippet: 'Analyzed socket states, TIME_WAIT socket proliferation, and automated zombie process cleanup with fuser.',
    isPinned: false,
    messages: [
      {
        id: 'msg-3',
        role: 'user',
        content: 'Explain how `ss -tulpn | grep :8080` works and how to safely terminate the process holding the port using `fuser` or `kill`.',
        timestamp: '03:45 PM'
      },
      {
        id: 'msg-4',
        role: 'assistant',
        content: 'The `ss` (socket statistics) command is the modern Linux replacement for legacy `netstat`.\n\n- `-t`: Display TCP sockets\n- `-u`: Display UDP sockets\n- `-l`: Show only listening sockets\n- `-p`: Show process name and PID using the socket (requires root for non-owned processes)\n- `-n`: Numeric ports instead of resolving service names\n\nTo safely diagnose and terminate the process holding port 8080:',
        timestamp: '03:46 PM',
        codeBlocks: [
          {
            language: 'bash',
            filename: 'port-manager.sh',
            code: `# 1. Identify PID and process details
sudo ss -tulpn | grep :8080

# 2. Inspect process command line before killing
sudo fuser 8080/tcp

# 3. Graceful SIGTERM termination
sudo fuser -k -15 8080/tcp

# 4. If unresponsive after 5s, forced SIGKILL
sudo fuser -k -9 8080/tcp`
          }
        ],
        metadata: {
          model: 'Cyvora Fast Reasoning',
          latencyMs: 210,
          tokens: 280,
          category: 'linux'
        }
      }
    ]
  },
  {
    id: 'conv-3',
    title: 'PostgreSQL 7-Day Rolling Retention Analytical Query',
    date: '2026-08-28',
    updatedAt: '3 days ago',
    messageCount: 8,
    category: 'database',
    snippet: 'Generated window function query for weekly user retention calculation with execution explain plan.',
    isPinned: false,
    messages: [
      {
        id: 'msg-5',
        role: 'user',
        content: 'Write an optimized PostgreSQL query with CTEs and window functions to calculate 7-day rolling active user retention per acquisition cohort.',
        timestamp: '09:12 AM'
      },
      {
        id: 'msg-6',
        role: 'assistant',
        content: 'Here is an optimized query that calculates acquisition cohorts aggregated by week with rolling activity checkpoints:',
        timestamp: '09:13 AM',
        codeBlocks: [
          {
            language: 'sql',
            filename: 'cohort_retention.sql',
            code: `WITH user_cohorts AS (
  SELECT 
    id AS user_id,
    DATE_TRUNC('week', created_at) AS cohort_week
  FROM app_users
),
weekly_activity AS (
  SELECT DISTINCT
    user_id,
    DATE_TRUNC('week', event_time) AS active_week
  FROM user_events
)
SELECT 
  c.cohort_week,
  COUNT(DISTINCT c.user_id) AS total_signups,
  COUNT(DISTINCT CASE WHEN a.active_week = c.cohort_week + INTERVAL '1 week' THEN a.user_id END) AS week_1_retained,
  COUNT(DISTINCT CASE WHEN a.active_week = c.cohort_week + INTERVAL '2 week' THEN a.user_id END) AS week_2_retained
FROM user_cohorts c
LEFT JOIN weekly_activity a ON c.user_id = a.user_id
GROUP BY c.cohort_week
ORDER BY c.cohort_week DESC;`
          }
        ]
      }
    ]
  },
  {
    id: 'conv-4',
    title: 'System Design: Distributed Rate Limiter with Redis & Sliding Logs',
    date: '2026-08-24',
    updatedAt: '1 week ago',
    messageCount: 12,
    category: 'interview',
    snippet: 'Architected sliding window log rate limiter using Redis sorted sets (ZSET) with microsecond latency.',
    isPinned: false,
    messages: []
  },
  {
    id: 'conv-5',
    title: 'FastAPI Async Connection Pooling & Race Condition Audit',
    date: '2026-08-21',
    updatedAt: '2 weeks ago',
    messageCount: 5,
    category: 'code',
    snippet: 'Audited Python async def routes with aioredis pool locks and SQLAlchemy async session lifespans.',
    isPinned: false,
    messages: []
  }
];

export const DEFAULT_USER_SETTINGS: UserSettings = {
  profile: {
    name: 'Suman Chaitanya',
    email: 'sumanchaitanya66@gmail.com',
    role: 'Lead Cloud Architect & Engineer',
    organization: 'Cyvora Studio Labs',
    tier: 'Developer Pro',
    apiKeyStatus: 'Configured'
  },
  appearance: {
    theme: 'dark-cyber',
    fontSize: 'normal',
    codeFontLigatures: true,
    showLineNumbers: true
  },
  aiPreferences: {
    defaultModel: 'Cyvora Ultra Copilot',
    temperature: 0.2,
    maxOutputTokens: 4096,
    systemPrompt: 'You are Cyvora AI, a precise, high-rigor AI technology copilot for cloud architecture, Linux systems engineering, high-throughput backend code, database performance, and generative AI infrastructure.',
    streamResponses: true,
    autoCodeExplain: true
  },
  notifications: {
    workflowCompleteAlert: true,
    weeklyKnowledgeDigest: true,
    securityAdvisories: true,
    soundEffects: false
  },
  privacy: {
    storeConversationHistory: true,
    telemetryOptIn: false,
    localCacheOnly: true,
    retentionDays: 90
  }
};
