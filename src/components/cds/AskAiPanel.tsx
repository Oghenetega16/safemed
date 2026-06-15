"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Send, Bot, User } from "lucide-react";
import { useCdsStore } from "@/store/useCdsStore";
import { cn } from "@/lib/cn";

const suggestions = ["Today's summary", "Critical alerts", "Sepsis risk", "Readmission risk"];

export function AskAiPanel() {
  const { messages, isThinking, sendMessage } = useCdsStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking]);

  const submit = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || isThinking) return;
    sendMessage(trimmed);
    setInput("");
  };

  return (
    <div className="flex h-full flex-col rounded-xl2 border border-border bg-bg-surface shadow-card">
      <div className="flex items-center gap-2 border-b border-border p-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white">
          <Sparkles size={15} />
        </span>
        <div>
          <h2 className="text-sm font-bold text-ink">Ask SafeMed AI</h2>
          <p className="text-xs text-ink-faint">Clinical insight assistant</p>
        </div>
      </div>

      <div ref={scrollRef} className="scrollbar-thin flex-1 space-y-3 overflow-y-auto p-4" style={{ maxHeight: 420 }}>
        {messages.map((message) => (
          <div key={message.id} className={cn("flex items-start gap-2", message.role === "user" && "flex-row-reverse")}>
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                message.role === "user" ? "bg-brand-50 text-brand-600" : "bg-violet-soft text-violet"
              )}
            >
              {message.role === "user" ? <User size={13} /> : <Bot size={13} />}
            </span>
            <div
              className={cn(
                "max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed",
                message.role === "user" ? "bg-brand text-white" : "bg-bg-subtle text-ink"
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex items-start gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-soft text-violet">
              <Bot size={13} />
            </span>
            <div className="flex items-center gap-1 rounded-xl bg-bg-subtle px-3 py-2.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-ink-faint"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => submit(s)}
              className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-ink-muted transition-colors hover:bg-bg-subtle hover:text-ink"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a patient or alert..."
            aria-label="Ask SafeMed AI"
            className="w-full rounded-xl border border-border bg-bg-subtle px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-brand focus:bg-bg-surface focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white transition-opacity disabled:opacity-40"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
