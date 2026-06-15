"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Send, Search, Circle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { useCommunicationsStore } from "@/store/useCommunicationsStore";
import { quickReplies } from "@/data/communications";
import { cn } from "@/lib/cn";

export default function CommunicationsPage() {
  const { conversations, activeId, setActive, sendMessage } = useCommunicationsStore();
  const [search, setSearch] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "thread">("list");
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];

  const filtered = useMemo(() => {
    if (!search.trim()) return conversations;
    const q = search.trim().toLowerCase();
    return conversations.filter((c) => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q));
  }, [conversations, search]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active?.messages.length, activeId]);

  const handleSelect = (id: string) => {
    setActive(id);
    setMobileView("thread");
  };

  const submit = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setInput("");
  };

  return (
    <>
      <PageHeader title="Communications" description="Secure messaging with care teams and departments." />

      <div className="px-4 lg:px-6">
        <div className="grid h-[calc(100vh-200px)] min-h-[480px] grid-cols-1 overflow-hidden rounded-xl2 border border-border bg-bg-surface shadow-card lg:grid-cols-[320px_1fr]">
          {/* Conversation list */}
          <div className={cn("flex h-full flex-col border-r border-border", mobileView === "thread" && "hidden lg:flex")}>
            <div className="border-b border-border p-4">
              <SearchInput value={search} onChange={setSearch} placeholder="Search conversations..." />
            </div>
            <ul className="scrollbar-thin flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <li className="p-6 text-center text-sm text-ink-faint">
                  <Search size={20} className="mx-auto mb-2" />
                  No conversations found
                </li>
              ) : (
                filtered.map((conv) => (
                  <li key={conv.id}>
                    <button
                      onClick={() => handleSelect(conv.id)}
                      aria-current={conv.id === activeId ? "true" : undefined}
                      className={cn(
                        "flex w-full items-start gap-3 border-b border-border p-4 text-left transition-colors hover:bg-bg-subtle",
                        conv.id === activeId && "bg-brand-50"
                      )}
                    >
                      <span className="relative shrink-0">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: conv.avatarColor }} aria-hidden="true">
                          {conv.name.charAt(0)}
                        </span>
                        {conv.online && (
                          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-mint ring-2 ring-bg-surface" aria-label="Online" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-ink">{conv.name}</p>
                          <span className="shrink-0 text-xs text-ink-faint">{conv.lastMessageTime}</span>
                        </div>
                        <p className="truncate text-xs text-ink-faint">{conv.role}</p>
                        <p className="mt-1 truncate text-xs text-ink-muted">{conv.lastMessage}</p>
                      </div>
                      {conv.unread > 0 && (
                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-brand px-1.5 text-[11px] font-bold text-white">
                          {conv.unread}
                        </span>
                      )}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Thread */}
          <div className={cn("flex h-full flex-col", mobileView === "list" && "hidden lg:flex")}>
            {active && (
              <>
                <div className="flex items-center gap-3 border-b border-border p-4">
                  <button onClick={() => setMobileView("list")} className="rounded-lg p-1.5 text-ink-muted hover:bg-bg-subtle lg:hidden" aria-label="Back to conversations">
                    <ArrowLeft size={18} />
                  </button>
                  <span className="relative shrink-0">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: active.avatarColor }} aria-hidden="true">
                      {active.name.charAt(0)}
                    </span>
                    {active.online && <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-mint ring-2 ring-bg-surface" />}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink">{active.name}</p>
                    <p className="flex items-center gap-1 truncate text-xs text-ink-faint">
                      <Circle size={7} className={active.online ? "fill-mint text-mint" : "fill-ink-faint text-ink-faint"} />
                      {active.online ? "Online" : "Offline"} · {active.role}
                    </p>
                  </div>
                </div>

                <div ref={scrollRef} className="scrollbar-thin flex-1 space-y-3 overflow-y-auto p-4">
                  {active.messages.map((message) => (
                    <div key={message.id} className={cn("flex items-end gap-2", message.sender === "me" && "flex-row-reverse")}>
                      {message.sender === "them" && (
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: active.avatarColor }} aria-hidden="true">
                          {active.name.charAt(0)}
                        </span>
                      )}
                      <div className={cn("max-w-[78%] rounded-xl px-3.5 py-2 text-sm leading-relaxed sm:max-w-[65%]", message.sender === "me" ? "bg-brand text-white" : "bg-bg-subtle text-ink")}>
                        {message.text}
                        <span className={cn("mt-1 block text-[10px]", message.sender === "me" ? "text-white/70" : "text-ink-faint")}>{message.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border p-3">
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => submit(reply)}
                        className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-ink-muted transition-colors hover:bg-bg-subtle hover:text-ink"
                      >
                        {reply}
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
                      placeholder={`Message ${active.name}...`}
                      aria-label="Message input"
                      className="w-full rounded-xl border border-border bg-bg-subtle px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-brand focus:bg-bg-surface focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white transition-opacity disabled:opacity-40"
                      aria-label="Send message"
                    >
                      <Send size={16} />
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
