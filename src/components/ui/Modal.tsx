"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/cn";
import { Portal } from "./Portal";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({ open, onClose, title, description, children, footer, size = "md" }: ModalProps) {
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
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
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
              aria-labelledby="modal-title"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "scrollbar-thin relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-xl2 bg-bg-surface p-6 shadow-soft",
                sizeClasses[size]
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 id="modal-title" className="text-lg font-bold text-ink">
                    {title}
                  </h2>
                  {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-ink-faint hover:bg-bg-subtle hover:text-ink"
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="mt-4">{children}</div>
              {footer && <div className="mt-6 flex flex-wrap justify-end gap-2">{footer}</div>}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
