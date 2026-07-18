import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, User } from "lucide-react";
import type { ChatMessage, ChatResponseBody, ScanResult } from "../types";
import { suggestedQuestions } from "../data/mockResults";

interface ChatPanelProps {
  result: ScanResult;
}

const CHAT_API_URL = "http://localhost:3001/api/chat";

export default function ChatPanel({ result }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping, error]);

  async function sendMessage(text: string) {
    const content = text.trim();
    if (!content || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: "Now",
    };
    const conversation = [...messages, userMsg];
    setMessages(conversation);
    setInput("");
    setError(null);
    setIsTyping(true);

    try {
      const res = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversation.map(({ role, content: messageContent }) => ({
            role: role === "ai" ? "assistant" : role,
            content: messageContent,
          })),
          scanContext: result,
        }),
      });
      const data = (await res.json()) as ChatResponseBody & { error?: string };
      if (!res.ok) throw new Error(data.error || "The assistant could not respond.");

      setMessages((previous) => [
        ...previous,
        {
          id: `msg-${Date.now() + 1}`,
          role: "ai",
          content: data.message,
          timestamp: "Now",
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't reach the AI service.");
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-surface">
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-3.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue to-violet">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">AI Security Assistant</p>
          <p className="flex items-center gap-1 text-[11px] text-low">
            <span className="h-1.5 w-1.5 rounded-full bg-low" /> Online
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <p className="text-sm leading-relaxed text-text-secondary">
            Ask about the findings in this scan, their impact, or how to fix them.
          </p>
        )}
        {messages.map((message) => <ChatBubble key={message.id} message={message} />)}
        {error && <p className="rounded-lg border border-critical/30 bg-critical/10 px-3 py-2 text-xs text-critical">{error}</p>}
        <AnimatePresence>
          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue to-violet"><Bot className="h-3.5 w-3.5 text-white" /></div>
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-surface-2 px-3.5 py-3">
                {[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted" style={{ animationDelay: `${i * 0.15}s` }} />)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-border px-4 py-3">
        <p className="mb-2 flex items-center gap-1 text-[11px] font-medium text-text-muted"><Sparkles className="h-3 w-3 text-violet" /> Suggested</p>
        <div className="flex flex-wrap gap-1.5">
          {suggestedQuestions.map((question) => (
            <button key={question} onClick={() => sendMessage(question)} disabled={isTyping} className="focus-ring rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] text-text-secondary transition-colors hover:border-blue/40 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50">
              {question}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); void sendMessage(input); }} className="flex items-center gap-2 border-t border-border px-3 py-3">
        <input value={input} onChange={(event) => setInput(event.target.value)} disabled={isTyping} placeholder="Ask about this vulnerability..." className="focus-ring flex-1 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted disabled:cursor-not-allowed" />
        <button type="submit" disabled={!input.trim() || isTyping} className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue text-white transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"><Send className="h-4 w-4" /></button>
      </form>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className={`flex items-start gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${isUser ? "bg-surface-3" : "bg-gradient-to-br from-blue to-violet"}`}>
        {isUser ? <User className="h-3.5 w-3.5 text-text-secondary" /> : <Bot className="h-3.5 w-3.5 text-white" />}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${isUser ? "rounded-tr-sm bg-blue-dim/30 text-text-primary" : "rounded-tl-sm bg-surface-2 text-text-secondary"}`}>
        {isUser ? message.content : <AssistantMessage content={message.content} />}
      </div>
    </motion.div>
  );
}

function AssistantMessage({ content }: { content: string }) {
  const blocks = content.trim().split(/\n\s*\n/);

  return (
    <div className="space-y-3">
      {blocks.map((block, index) => {
        if (block.startsWith("```") && block.endsWith("```")) {
          const code = block.replace(/^```[^\n]*\n?/, "").replace(/```$/, "");
          return <pre key={index} className="overflow-x-auto rounded-md bg-bg p-3 font-mono text-xs text-text-primary"><code>{code}</code></pre>;
        }

        const lines = block.split("\n");
        const isOrderedList = lines.every((line) => /^\d+\.\s+/.test(line));
        const isBulletList = lines.every((line) => /^[-*]\s+/.test(line));

        if (isOrderedList) {
          return <ol key={index} className="list-decimal space-y-1 pl-5">{lines.map((line, lineIndex) => <li key={lineIndex}>{renderInlineMarkdown(line.replace(/^\d+\.\s+/, ""))}</li>)}</ol>;
        }
        if (isBulletList) {
          return <ul key={index} className="list-disc space-y-1 pl-5">{lines.map((line, lineIndex) => <li key={lineIndex}>{renderInlineMarkdown(line.replace(/^[-*]\s+/, ""))}</li>)}</ul>;
        }

        return <p key={index} className="whitespace-pre-wrap">{renderInlineMarkdown(block)}</p>;
      })}
    </div>
  );
}

function renderInlineMarkdown(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={index} className="font-semibold text-text-primary">{part.slice(2, -2)}</strong>
      : part
  );
}
