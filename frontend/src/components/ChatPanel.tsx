import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, User } from "lucide-react";
import type { ChatMessage } from "../types";
import { suggestedQuestions } from "../data/mockResults";

interface ChatPanelProps {
  initialMessages: ChatMessage[];
}

const MOCK_REPLIES = [
  "Good question — based on the pattern here, the safest path is to validate and escape all untrusted input before it reaches a sensitive sink like a query, shell command, or the DOM.",
  "This class of bug shows up whenever trust boundaries get crossed silently. The fix is almost always: treat anything from the user as data, never as code.",
  "I'd tackle the Very High severity items first since they're the easiest for an attacker to exploit with the highest impact, then work down the list.",
];

export default function ChatPanel({ initialMessages }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: "Now",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "ai",
        content:
          MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)],
        timestamp: "Now",
      };
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 1100);
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-surface">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-3.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue to-violet">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">
            AI Security Assistant
          </p>
          <p className="flex items-center gap-1 text-[11px] text-low">
            <span className="h-1.5 w-1.5 rounded-full bg-low" />
            Online
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue to-violet">
                <Bot className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-surface-2 px-3.5 py-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Suggested questions */}
      <div className="border-t border-border px-4 py-3">
        <p className="mb-2 flex items-center gap-1 text-[11px] font-medium text-text-muted">
          <Sparkles className="h-3 w-3 text-violet" />
          Suggested
        </p>
        <div className="flex flex-wrap gap-1.5">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="focus-ring rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] text-text-secondary transition-colors hover:border-blue/40 hover:text-text-primary"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex items-center gap-2 border-t border-border px-3 py-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this vulnerability…"
          className="focus-ring flex-1 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue text-white transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-2 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-surface-3" : "bg-gradient-to-br from-blue to-violet"
        }`}
      >
        {isUser ? (
          <User className="h-3.5 w-3.5 text-text-secondary" />
        ) : (
          <Bot className="h-3.5 w-3.5 text-white" />
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-tr-sm bg-blue-dim/30 text-text-primary"
            : "rounded-tl-sm bg-surface-2 text-text-secondary"
        }`}
      >
        {message.content}
      </div>
    </motion.div>
  );
}
