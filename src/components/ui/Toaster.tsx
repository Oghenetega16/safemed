"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { useToastStore } from "@/store/useToastStore";
import { cn } from "@/lib/cn";

const icons = { success: CheckCircle2, error: XCircle, info: Info };
const toneClasses = { success: "text-mint", error: "text-rose", info: "text-brand-600" };

export function Toaster() {
  const { toasts, dismiss } = useToastStore();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = icons[toast.tone ?? "info"];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl2 border border-border bg-bg-surface p-3.5 shadow-soft"
              role="status"
            >
              <Icon size={18} className={cn("mt-0.5 shrink-0", toneClasses[toast.tone ?? "info"])} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">{toast.title}</p>
                {toast.description && <p className="mt-0.5 text-xs text-ink-muted">{toast.description}</p>}
              </div>
              <button
                onClick={() => dismiss(toast.id)}
                className="text-ink-faint hover:text-ink"
                aria-label="Dismiss notification"
              >
                <X size={15} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
