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
} from "lucide-react";
import {
  sendChatMessage,
  ChatMessage,
  createMessageId,
  suggestedQuestions,
  isApiKeyConfigured,
} from "@/lib/ai-chat";

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF8A00] to-[#FF6B00] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#FF8A00]/20">
        <Bot className="w-4 h-4 text-[#050816]" />
      </div>
      <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-[#0B1637] border border-white/[0.08]">
        <span className="w-2 h-2 bg-[#FF8A00]/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 bg-[#FF8A00]/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 bg-[#FF8A00]/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

function SuggestedQuestions({ onSelect, visible }: { onSelect: (q: string) => void; visible: boolean }) {
  if (!visible) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 pb-3 space-y-1.5"
    >
      <p className="text-[10px] font-bold text-[#B7C0D1] uppercase tracking-widest px-1 mb-2">
        Suggested Questions
      </p>
      <div className="flex flex-wrap gap-1.5">
        {suggestedQuestions.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[#B7C0D1] hover:text-[#FF8A00] hover:border-[#FF8A00]/30 hover:bg-[#FF8A00]/[0.03] transition-all duration-300 whitespace-nowrap"
          >
            {q}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function ConfigWarning() {
  return (
    <div className="mx-4 mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
      <p className="text-[11px] font-bold text-red-400 leading-relaxed">
        OpenAI API key not configured. Add <code className="text-red-300 bg-red-500/10 px-1 rounded">VITE_OPENAI_API_KEY</code> to your .env file.
      </p>
    </div>
  );
}

function EmptyState({ onSelect }: { onSelect: (q: string) => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF8A00]/10 to-[#FF6B00]/10 border border-[#FF8A00]/20 flex items-center justify-center mb-5">
        <Sparkles className="w-8 h-8 text-[#FF8A00]" />
      </div>
      <h3 className="text-lg font-black text-[#F5F7FA] mb-2">
        Yihune's AI Assistant
      </h3>
      <p className="text-xs text-[#B7C0D1] leading-relaxed max-w-xs mb-6">
        Ask me anything about Yihune's projects, skills, experience, or how to get in touch.
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
  const configured = isApiKeyConfigured();

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
    if (!message || isLoading || !configured) return;

    setInput("");
    setShowSuggestions(false);
    setError(null);
    addMessage("user", message);

    setIsLoading(true);
    try {
      const updatedMessages: ChatMessage[] = [
        ...messages,
        { id: createMessageId(), role: "user" as const, content: message, timestamp: Date.now() },
      ];
      const response = await sendChatMessage(updatedMessages);
      addMessage("assistant", response);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to get response";
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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-24 right-4 sm:right-6 z-[100] w-[calc(100vw-32px)] sm:w-[400px] h-[560px] sm:h-[600px] rounded-2xl bg-[#050816]/95 backdrop-blur-2xl border border-white/[0.08] shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.08] bg-gradient-to-r from-[#FF8A00]/10 to-[#FF6B00]/5 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF8A00] to-[#FF6B00] flex items-center justify-center shadow-lg shadow-[#FF8A00]/20">
                  <Bot className="w-5 h-5 text-[#050816]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#F5F7FA] leading-tight">
                    AI Assistant
                  </h3>
                  <p className="text-[9px] font-bold text-[#B7C0D1] uppercase tracking-wider">
                    Yihune's Digital Rep
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[#B7C0D1] hover:text-[#F5F7FA] hover:bg-white/[0.06] transition-all"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto py-4 scroll-smooth">
              {messages.length === 0 ? (
                <EmptyState onSelect={handleSuggestedQuestion} />
              ) : (
                <div className="space-y-3 px-4">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start gap-3 ${
                        msg.role === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                          msg.role === "user"
                            ? "bg-[#0B1637] border border-white/[0.08]"
                            : "bg-gradient-to-br from-[#FF8A00] to-[#FF6B00] shadow-[#FF8A00]/20"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <User className="w-4 h-4 text-[#B7C0D1]" />
                        ) : (
                          <Bot className="w-4 h-4 text-[#050816]" />
                        )}
                      </div>
                      <div
                        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-[#0B1637] border border-white/[0.08] text-[#F5F7FA]"
                            : "bg-[#0B1637]/60 border border-white/[0.06] text-[#D5D9E3]"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <div className="prose prose-invert prose-sm max-w-none [&_a]:text-[#FF8A00] [&_a]:font-bold [&_a]:no-underline hover:[&_a]:underline [&_strong]:text-[#F5F7FA] [&_code]:text-[#FFB84D] [&_code]:text-[11px] [&_code]:bg-white/[0.03] [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_p]:leading-relaxed [&_p]:text-[13px] [&_ul]:text-[13px] [&_li]:leading-relaxed">
                            <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                          </div>
                        ) : (
                          <p className="text-[13px] leading-relaxed">{msg.content}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && <TypingIndicator />}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mx-1 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
                    >
                      <p className="text-[11px] font-bold text-red-400">{error}</p>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Suggested Questions (when no messages) */}
            {messages.length === 0 && showSuggestions && configured && (
              <div className="flex-shrink-0">
                <SuggestedQuestions onSelect={handleSuggestedQuestion} visible />
              </div>
            )}

            {/* Config Warning */}
            {!configured && <ConfigWarning />}

            {/* Input */}
            <div className="flex-shrink-0 p-3 border-t border-white/[0.08] bg-[#050816]/60">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={configured ? "Ask about Yihune's work..." : "Configure API key to chat..."}
                  disabled={!configured || isLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#F5F7FA] placeholder:text-[#B7C0D1]/30 text-sm outline-none focus:border-[#FF8A00]/50 focus:bg-white/[0.05] transition-all disabled:opacity-40"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || !configured || isLoading}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] text-[#050816] hover:shadow-[0_0_20px_rgba(255,138,0,0.3)] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[9px] text-[#B7C0D1]/40 text-center mt-2 font-medium">
                Powered by OpenAI · Answers based on portfolio data only
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 sm:right-6 z-[100] w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF8A00] to-[#FF6B00] flex items-center justify-center shadow-2xl shadow-[#FF8A00]/30 hover:shadow-[#FF8A00]/40 border border-white/10 transition-shadow"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-[#050816]" />
        ) : (
          <MessageSquare className="w-6 h-6 text-[#050816]" />
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
        const items = p.split(/\n/).map((l) => l.replace(/^[-*]\s/, "").trim()).filter(Boolean);
        return `<ul class="space-y-1 my-1">${items.map((i) => `<li>${inlineFormat(i)}</li>`).join("")}</ul>`;
      }
      if (p.startsWith("#")) {
        const level = p.match(/^#{1,3}/)?.[0].length || 1;
        const text = p.replace(/^#{1,3}\s/, "");
        return `<h${level + 2} class="text-sm font-bold text-[#F5F7FA] mt-3 mb-1">${inlineFormat(text)}</h${level + 2}>`;
      }
      return `<p class="mb-1.5">${inlineFormat(p)}</p>`;
    })
    .join("");
}

function inlineFormat(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}
