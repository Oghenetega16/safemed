import { create } from "zustand";
import { conversations as initialConversations, autoReplies } from "@/data/communications";
import type { ChatMessage, Conversation } from "@/types";

interface CommunicationsState {
  conversations: Conversation[];
  activeId: string;
  setActive: (id: string) => void;
  sendMessage: (text: string) => void;
}

function now() {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export const useCommunicationsStore = create<CommunicationsState>((set, get) => ({
  conversations: initialConversations,
  activeId: initialConversations[0].id,
  setActive: (id) =>
    set((state) => ({
      activeId: id,
      conversations: state.conversations.map((c) => (c.id === id ? { ...c, unread: 0 } : c)),
    })),
  sendMessage: (text) => {
    const { activeId } = get();
    const message: ChatMessage = { id: Math.random().toString(36).slice(2), sender: "me", text, time: now() };

    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === activeId ? { ...c, messages: [...c.messages, message], lastMessage: text, lastMessageTime: "Now" } : c
      ),
    }));

    setTimeout(() => {
      const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      const replyMessage: ChatMessage = { id: Math.random().toString(36).slice(2), sender: "them", text: reply, time: now() };
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === activeId ? { ...c, messages: [...c.messages, replyMessage], lastMessage: reply, lastMessageTime: "Now" } : c
        ),
      }));
    }, 1200);
  },
}));
