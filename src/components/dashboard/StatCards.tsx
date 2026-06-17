"use client";

import { motion } from "framer-motion";
import {
  CalendarCheck,
  Users,
  BedDouble,
  Stethoscope,
  HeartPulse,
  ArrowUpRight,
} from "lucide-react";
import { statCards } from "@/data/dashboard";
import { cn } from "@/lib/cn";
import type { StatCardData } from "@/types";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "calendar-check": CalendarCheck,
  users: Users,
  bed: BedDouble,
  stethoscope: Stethoscope,
  "heart-pulse": HeartPulse,
};

const accentStyles: Record<StatCardData["accent"], { bg: string; fg: string }> = {
  rose: { bg: "bg-rose-soft", fg: "text-rose" },
  amber: { bg: "bg-amber-soft", fg: "text-amber" },
  violet: { bg: "bg-violet-soft", fg: "text-violet" },
  sky: { bg: "bg-sky-soft", fg: "text-sky" },
  mint: { bg: "bg-mint-soft", fg: "text-mint" },
};

export function StatCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {statCards.map((card, i) => {
        const Icon = iconMap[card.icon];
        const accent = accentStyles[card.accent];
        return (
          <motion.article
            key={card.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05, ease: "easeOut" }}
            className="rounded-xl2 border border-border bg-bg-surface p-4 shadow-card transition-shadow hover:shadow-soft"
          >
            <div className="flex items-start justify-between">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", accent.bg)}>
                <Icon size={19} className={accent.fg} />
              </div>
              <ArrowUpRight size={18} className="text-ink-faint" aria-hidden="true" />
            </div>
            <p className="mt-4 text-sm font-medium text-ink-muted">
              {card.label}
              <span className="ml-1 text-ink-faint text-xs">· {card.sublabel}</span>
            </p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight text-ink">{card.value}</p>
            <p className="mt-1 truncate text-xs text-ink-faint">{card.trendLabel}</p>
          </motion.article>
        );
      })}
    </div>
  );
}
