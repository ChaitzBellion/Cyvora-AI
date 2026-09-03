import { auth } from '../lib/firebase';

export interface ChatRequestHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

export interface GeminiChatResponse {
  reply: string;
  model: string;
  latencyMs: number;
  completedAt: string;
  verifiedUid?: string;
}

export interface WorkflowExecutionConfig {
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
  modelPreference?: string;
  workflowId?: string;
  workflowName?: string;
}

/**
 * Dispatches an authenticated chat prompt to the server-side Gemini API layer.
 * Retrieves a fresh Firebase ID token to verify user identity on the server.
 */
export async function sendChatMessage(
  message: string,
  conversationId?: string,
  history: ChatRequestHistoryItem[] = [],
  workflowConfig?: WorkflowExecutionConfig
): Promise<GeminiChatResponse> {
  const currentUser = auth?.currentUser;
  if (!currentUser) {
    throw new Error('Your authentication session has expired. Please sign in again.');
  }

  let idToken: string;
  try {
    idToken = await currentUser.getIdToken(false);
  } catch (tokenErr) {
    console.error('[Cyvora Gemini Service] Failed to retrieve Firebase ID token:', tokenErr);
    throw new Error('Your authentication session has expired. Please sign in again.');
  }

  let response: Response;
  try {
    response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        message,
        conversationId,
        history,
        workflowConfig,
      }),
    });
  } catch (networkErr) {
    console.error('[Cyvora Gemini Service] Network connection error:', networkErr);
    throw new Error('Unable to connect to Cyvora AI. Please check your connection and try again.');
  }

  if (response.status === 401) {
    throw new Error('Your authentication session has expired. Please sign in again.');
  }

  if (!response.ok) {
    let errorMessage = 'Cyvora AI is temporarily unavailable. Please try again.';
    try {
      const errorData = await response.json();
      if (errorData?.error && typeof errorData.error === 'string') {
        errorMessage = errorData.error;
      }
    } catch {
      // Fallback
    }
    throw new Error(errorMessage);
  }

  const data: GeminiChatResponse = await response.json();
  return data;
}
