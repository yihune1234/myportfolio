import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ChevronDown,
  Code2,
} from "lucide-react";
import {
  sendChatMessage,
  ChatMessage,
  createMessageId,
  suggestedQuestions,
} from "@/lib/ai-chat";

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5 px-4 py-2">
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/30 ring-1 ring-white/10">
        <Bot className="w-3.5 h-3.5 text-[#050816]" />
      </div>
      <div className="flex items-center gap-1 px-3.5 py-2.5 rounded-xl bg-[#0A0F1E] border border-white/[0.06] shadow-sm">
        <span
          className="w-1.5 h-1.5 bg-amber-400/80 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-1.5 h-1.5 bg-amber-400/80 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-1.5 h-1.5 bg-amber-400/80 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}

function SuggestedQuestions({
  onSelect,
  visible,
}: {
  onSelect: (q: string) => void;
  visible: boolean;
}) {
  if (!visible) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 pb-3"
    >
      <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.15em] px-1 mb-2.5">
        Quick Questions
      </p>
      <div className="flex flex-wrap gap-1.5">
        {suggestedQuestions.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="text-[11px] font-medium px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:text-amber-300 hover:border-amber-500/25 hover:bg-amber-500/5 transition-all duration-300 whitespace-nowrap"
          >
            {q}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function EmptyState({ onSelect }: { onSelect: (q: string) => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center">
      <div className="relative mb-5">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-600/10 rounded-2xl blur-xl" />
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-xl shadow-orange-500/25 ring-1 ring-white/10">
          <Sparkles className="w-7 h-7 text-[#050816]" />
        </div>
      </div>
      <h3 className="text-base font-bold text-zinc-100 mb-1.5 tracking-tight">
        Hey there! I'm Yihune's AI
      </h3>
      <p className="text-[11px] text-zinc-500 leading-relaxed max-w-[220px] mb-5 font-medium">
        Ask me about his projects, skills, experience — anything
        portfolio-related.
      </p>
      <SuggestedQuestions onSelect={onSelect} visible />
    </div>
  );
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const addMessage = (role: "user" | "assistant", content: string) => {
    const msg: ChatMessage = {
      id: createMessageId(),
      role,
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, msg]);
  };

  const handleSend = async (text?: string) => {
    const message = (text || input).trim();
    if (!message || isLoading) return;

    setInput("");
    setShowSuggestions(false);
    setError(null);
    addMessage("user", message);

    setIsLoading(true);
    try {
      const updatedMessages: ChatMessage[] = [
        ...messages,
        {
          id: createMessageId(),
          role: "user" as const,
          content: message,
          timestamp: Date.now(),
        },
      ];
      const response = await sendChatMessage(updatedMessages);
      addMessage("assistant", response);
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "Something went wrong";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedQuestion = (q: string) => {
    setShowSuggestions(false);
    handleSend(q);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16, x: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16, x: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 sm:right-6 z-[100] w-[calc(100vw-32px)] sm:w-[380px] h-[560px] sm:h-[580px] rounded-xl bg-[#060A13]/95 backdrop-blur-2xl border border-white/[0.07] shadow-2xl shadow-black/70 flex flex-col overflow-hidden"
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: "32px 32px",
              }}
            />

            <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-gradient-to-r from-[#0A0F1E] to-[#0D0F1A] flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-500/20 rounded-lg blur-md" />
                  <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25 ring-1 ring-white/10">
                    <Code2 className="w-4 h-4 text-[#050816]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-zinc-100 tracking-tight">
                      Yihune's AI
                    </h3>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/20 text-[8px] font-bold text-amber-300/90 uppercase tracking-wider">
                      Beta
                    </span>
                  </div>
                  <p className="text-[9px] font-medium text-zinc-500 tracking-wide">
                    Portfolio Intelligence
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.08] transition-all"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 scroll-smooth">
              {messages.length === 0 ? (
                <EmptyState onSelect={handleSuggestedQuestion} />
              ) : (
                <div className="space-y-2.5 px-3">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className={`flex items-start gap-2.5 ${
                        msg.role === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${
                          msg.role === "user"
                            ? "bg-zinc-800/80 border border-white/[0.06]"
                            : "bg-gradient-to-br from-amber-500 to-orange-600 shadow-orange-500/20 ring-1 ring-white/10"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <User className="w-3.5 h-3.5 text-zinc-400" />
                        ) : (
                          <Bot className="w-3.5 h-3.5 text-[#050816]" />
                        )}
                      </div>
                      <div
                        className={`max-w-[88%] px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed ${
                          msg.role === "user"
                            ? "bg-gradient-to-br from-amber-500/10 to-orange-600/5 border border-amber-500/15 text-zinc-200"
                            : "bg-[#0A0F1E] border border-white/[0.06] text-zinc-300 shadow-sm"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <div className="prose prose-invert prose-sm max-w-none [&_a]:text-amber-400 [&_a]:font-semibold [&_a]:no-underline hover:[&_a]:underline [&_strong]:text-zinc-100 [&_code]:text-amber-300/90 [&_code]:text-[11px] [&_code]:bg-white/[0.04] [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_p]:leading-relaxed [&_p]:text-[13px] [&_ul]:text-[13px] [&_li]:leading-relaxed [&_li]:my-0.5">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: formatMessage(msg.content),
                              }}
                            />
                          </div>
                        ) : (
                          <p className="text-[13px] leading-relaxed">
                            {msg.content}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && <TypingIndicator />}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mx-1 p-2.5 rounded-lg bg-red-500/8 border border-red-500/15"
                    >
                      <p className="text-[10px] font-medium text-red-400/80">
                        {error}
                      </p>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {messages.length === 0 && showSuggestions && (
              <div className="flex-shrink-0">
                <SuggestedQuestions
                  onSelect={handleSuggestedQuestion}
                  visible
                />
              </div>
            )}

            <div className="flex-shrink-0 px-3 py-2.5 border-t border-white/[0.06] bg-[#060A13]/80">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about Yihune..."
                  disabled={isLoading}
                  className="flex-1 px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-200 placeholder:text-zinc-600 text-sm outline-none focus:border-amber-500/30 focus:bg-white/[0.06] transition-all disabled:opacity-30"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-[#050816] hover:shadow-[0_0_16px_rgba(245,158,11,0.25)] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 shadow-lg shadow-orange-500/15"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[8px] text-zinc-600 text-center mt-1.5 font-medium tracking-wide">
                Powered by OpenAI · Portfolio-aware responses
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 sm:right-6 z-[100] w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-orange-500/35 hover:shadow-orange-500/45 border border-white/10 transition-shadow"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-[#050816]" />
        ) : (
          <MessageSquare className="w-5 h-5 text-[#050816]" />
        )}
      </motion.button>
    </>
  );
}

function formatMessage(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      if (p.startsWith("- ") || p.startsWith("* ")) {
        const items = p
          .split(/\n/)
          .map((l) => l.replace(/^[-*]\s/, "").trim())
          .filter(Boolean);
        return `<ul class="space-y-0.5 my-1">${items.map((i) => `<li class="flex items-start gap-1.5"><span class="text-amber-400/60 mt-1.5 flex-shrink-0">\u2022</span><span>${inlineFormat(i)}</span></li>`).join("")}</ul>`;
      }
      if (p.startsWith("#")) {
        const level = p.match(/^#{1,3}/)?.[0].length || 1;
        const text = p.replace(/^#{1,3}\s/, "");
        return `<h${level + 2} class="text-sm font-bold text-zinc-100 mt-2.5 mb-1">${inlineFormat(text)}</h${level + 2}>`;
      }
      return `<p class="mb-1 last:mb-0">${inlineFormat(p)}</p>`;
    })
    .join("");
}

function inlineFormat(text: string): string {
  return text
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-amber-400 font-semibold no-underline hover:underline">$1</a>',
    )
    .replace(
      /\*\*([^*]+)\*\*/g,
      '<strong class="text-zinc-100 font-semibold">$1</strong>',
    )
    .replace(
      /`([^`]+)`/g,
      '<code class="text-amber-300/90 bg-white/[0.04] px-1 py-0.5 rounded text-[11px]">$1</code>',
    )
    .replace(/^###?\s?(.*)$/gm, '<strong class="text-zinc-100">$1</strong>');
}
