import { API_ENDPOINTS } from "./api";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatConfig {
  temperature?: number;
  maxTokens?: number;
}

/**
 * Send chat messages securely through backend AI route
 * Protects Gemini API keys on the server and applies portfolio-only guardrails
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  config?: ChatConfig,
): Promise<string> {
  const response = await fetch(API_ENDPOINTS.AI_CHAT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const errorMessage =
      error.message ||
      `AI service request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.message || "No response generated.";
}

export function createMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export const suggestedQuestions = [
  "Who is Yihune Belay?",
  "What projects have you built?",
  "What are your active GitHub repositories?",
  "Tell me about AriitiMarket organization work",
  "What technologies and languages do you use?",
  "What services do you offer?",
  "How can I contact or hire you?",
  "What is your professional experience?",
];
