"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/cn";
import { Portal } from "./Portal";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}

export function Drawer({ open, onClose, title, description, children, footer, width = "max-w-lg" }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
    };
  }, [open, onClose]);

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[90] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="drawer-title"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className={cn("relative z-10 flex h-full w-full flex-col bg-bg-surface shadow-soft", width)}
            >
              <div className="flex items-start justify-between gap-3 border-b border-border p-5">
                <div>
                  <h2 id="drawer-title" className="text-lg font-bold text-ink">
                    {title}
                  </h2>
                  {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-ink-faint hover:bg-bg-subtle hover:text-ink"
                  aria-label="Close panel"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="scrollbar-thin flex-1 overflow-y-auto p-5">{children}</div>
              {footer && <div className="flex justify-end gap-2 border-t border-border p-4">{footer}</div>}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
