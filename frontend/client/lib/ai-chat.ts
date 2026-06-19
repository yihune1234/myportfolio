import { portfolioData, searchPortfolio } from "./portfolio-data";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.0-flash-lite";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatConfig {
  temperature: number;
  maxTokens: number;
}

const defaultConfig: ChatConfig = {
  temperature: 0.3,
  maxTokens: 1024,
};

function buildSystemPrompt(context: string): string {
  return `You are Yihune Belay's AI Assistant — a digital representative of Yihune Belay, a Full-Stack Software Engineer from Addis Ababa, Ethiopia.

YOUR PURPOSE:
Help visitors learn about Yihune Belay's professional profile: his projects, skills, technologies, achievements, education, experience, services, and contact information.

RULES:
1. ONLY answer using the portfolio information provided below in the CONTEXT section.
2. If the information is not available in the context, politely say: "I don't have that information in Yihune's portfolio."
3. NEVER invent facts, exaggerate, or provide information outside the provided context.
4. If asked about unrelated topics (politics, entertainment, general knowledge, etc.), politely redirect: "I'm Yihune's portfolio assistant and can only answer questions about Yihune Belay's professional profile."
5. Be professional, friendly, and concise.
6. When discussing projects, mention technologies used and provide GitHub/demo links when available.
7. If someone wants to hire or contact Yihune, provide the contact information from the context and encourage them to use the contact form on the website.
8. Keep responses focused and avoid unnecessary elaboration.

CONTEXT:
${context}

Remember: You are representing Yihune Belay. Be helpful, accurate, and professional.`;
}

function geminiRole(role: string): string {
  return role === "assistant" ? "model" : "user";
}

export async function sendChatMessage(
  messages: ChatMessage[],
  config: ChatConfig = defaultConfig,
): Promise<string> {
  const context = searchPortfolio(
    messages.length > 0 ? messages[messages.length - 1].content : "",
  );

  const systemInstruction = buildSystemPrompt(context);

  const contents = messages.map((m) => ({
    role: geminiRole(m.role),
    parts: [{ text: m.content }],
  }));

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents,
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      generationConfig: {
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const errorMessage =
      error.error?.message ||
      `API request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated."
  );
}

export function createMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export const suggestedQuestions = [
  "Who is Yihune Belay?",
  "What projects have you built?",
  "What technologies do you use?",
  "What services do you offer?",
  "How can I contact or hire you?",
  "What is your professional experience?",
  "Show me your skills and expertise",
  "Tell me about your education",
];
