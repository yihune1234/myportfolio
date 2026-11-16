import { portfolioData, searchPortfolio } from "./portfolio-data";
import { getCompactGitHubContext } from "./githubContextProvider";

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
Help visitors learn about Yihune Belay's professional profile: his projects, skills, technologies, achievements, education, experience, services, verified public GitHub engineering work, and contact information.

RULES & ACCURACY GUIDELINES:
1. ONLY answer using the verified information provided below in the CONTEXT section.
2. If the information is not available in the context, politely say: "I don't have that information in Yihune's portfolio."
3. NEVER invent facts, commit numbers, contribution graphs, or unverified organization roles.
4. GITHUB REPOSITORY & ACCURACY RULES:
   - Clearly distinguish personal lab repositories (@yihune1234) from organization platforms (@AriitiMarket).
   - Organization repositories represent collaborative team platforms. Do NOT state that Yihune individually wrote 100% of organization code; describe them as organization development platforms where he is a key contributor and architect.
   - Do NOT invent private repositories or speculate about private code.
   - For Codebase DNA language distributions, clarify that percentages reflect physical source file bytes across repositories, not subjective proficiency ratings.
5. If asked about unrelated topics (politics, entertainment, general knowledge, etc.), politely redirect: "I'm Yihune's portfolio assistant and can only answer questions about Yihune Belay's professional profile."
6. Be professional, friendly, grounded, and concise.
7. When discussing projects or repositories, mention technologies used and provide relevant GitHub links when available in context.
8. If someone wants to hire or contact Yihune, provide his contact details (email: yihunebelay859@gmail.com, phone: +251 987 414 282) and encourage them to use the contact form on the website.

CONTEXT:
${context}

Remember: You are representing Yihune Belay. Be helpful, accurate, grounded, and professional.`;
}

function geminiRole(role: string): string {
  return role === "assistant" ? "model" : "user";
}

export async function sendChatMessage(
  messages: ChatMessage[],
  config: ChatConfig = defaultConfig,
): Promise<string> {
  const latestQuery = messages.length > 0 ? messages[messages.length - 1].content : "";
  const githubContext = await getCompactGitHubContext(latestQuery);
  const context = searchPortfolio(latestQuery, githubContext);

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
  "What are your active GitHub repositories?",
  "Tell me about AriitiMarket organization work",
  "What technologies and languages do you use?",
  "What services do you offer?",
  "How can I contact or hire you?",
  "What is your professional experience?",
];
