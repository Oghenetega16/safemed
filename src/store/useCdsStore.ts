import { create } from "zustand";
import { cdsAlerts } from "@/data/cdsAlerts";
import type { AlertStatus, AssistantMessage, ClinicalAlert } from "@/types";

function generateAssistantReply(query: string, alerts: ClinicalAlert[]): string {
  const q = query.toLowerCase();

  const critical = alerts.filter((a) => a.severity === "critical" && a.status !== "resolved");
  const active = alerts.filter((a) => a.status !== "resolved");

  if (q.includes("sepsis")) {
    const match = alerts.find((a) => a.category === "Sepsis Risk");
    return match
      ? `${match.patientName} (${match.patientId}) is showing early sepsis indicators with ${match.confidence}% model confidence. Recommended action: ${match.recommendation}`
      : "No active sepsis-risk alerts at this time.";
  }

  if (q.includes("critical") || q.includes("urgent")) {
    if (critical.length === 0) return "There are currently no critical-severity alerts requiring immediate action.";
    return `There are ${critical.length} critical alert(s) right now: ${critical
      .map((a) => `${a.patientName} — ${a.title}`)
      .join("; ")}.`;
  }

  if (q.includes("summary") || q.includes("overview") || q.includes("today")) {
    return `Currently tracking ${active.length} active insight(s) across the unit: ${critical.length} critical, ${alerts.filter(
      (a) => a.severity === "high" && a.status !== "resolved"
    ).length} high, and ${alerts.filter((a) => a.severity === "moderate" && a.status !== "resolved").length} moderate priority. Average model confidence is ${Math.round(
      alerts.reduce((sum, a) => sum + a.confidence, 0) / alerts.length
    )}%.`;
  }

  if (q.includes("readmission")) {
    const match = alerts.find((a) => a.category === "Readmission Risk");
    return match
      ? `${match.patientName} has a ${match.confidence}% predicted readmission risk. ${match.recommendation}`
      : "No elevated readmission-risk alerts at this time.";
  }

  const patientMatch = alerts.find((a) => q.includes(a.patientName.toLowerCase().split(" ")[0]));
  if (patientMatch) {
    return `${patientMatch.patientName}: "${patientMatch.title}" — ${patientMatch.description} Confidence: ${patientMatch.confidence}%. Suggested action: ${patientMatch.recommendation}`;
  }

  return "Based on current vitals, lab trends, and history across the unit, I don't see a direct match for that query. Try asking about a specific patient, \"critical alerts\", \"sepsis risk\", or \"today's summary\".";
}

interface CdsState {
  alerts: ClinicalAlert[];
  messages: AssistantMessage[];
  isThinking: boolean;
  setStatus: (id: string, status: AlertStatus) => void;
  sendMessage: (content: string) => void;
}

export const useCdsStore = create<CdsState>((set, get) => ({
  alerts: cdsAlerts,
  messages: [
    {
      id: "intro",
      role: "assistant",
      content:
        "Hi, I'm SafeMed AI. Ask me about active alerts, a specific patient, or request a summary of today's clinical risks.",
    },
  ],
  isThinking: false,
  setStatus: (id, status) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, status } : a)),
    })),
  sendMessage: (content) => {
    const userMessage: AssistantMessage = { id: Math.random().toString(36).slice(2), role: "user", content };
    set((state) => ({ messages: [...state.messages, userMessage], isThinking: true }));

    setTimeout(() => {
      const reply = generateAssistantReply(content, get().alerts);
      const assistantMessage: AssistantMessage = { id: Math.random().toString(36).slice(2), role: "assistant", content: reply };
      set((state) => ({ messages: [...state.messages, assistantMessage], isThinking: false }));
    }, 850);
  },
}));
