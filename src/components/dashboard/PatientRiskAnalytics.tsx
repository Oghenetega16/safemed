"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Sparkles, TrendingUp, ChevronUp } from "lucide-react";
import { riskSegments, aiInsights } from "@/data/dashboard";

export function PatientRiskAnalytics() {
  const total = riskSegments.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="rounded-xl2 border border-border bg-bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-ink">Patient Risk Analytics</h2>
          <p className="mt-0.5 text-xs text-ink-faint">
            Identifies high-risk patients based on predictive analytics
          </p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-brand-50 px-2.5 py-1.5 text-xs font-semibold text-brand-600">
          <Sparkles size={13} />
          AI Insight
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
        {/* Donut chart */}
        <div className="relative mx-auto h-44 w-44 shrink-0 sm:mx-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskSegments}
                dataKey="count"
                nameKey="label"
                innerRadius={52}
                outerRadius={72}
                paddingAngle={3}
                cornerRadius={8}
                startAngle={90}
                endAngle={-270}
                isAnimationActive
                animationDuration={800}
              >
                {riskSegments.map((seg) => (
                  <Cell key={seg.id} fill={seg.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold text-ink">{total}</span>
            <span className="text-[11px] text-ink-faint">Total Patients</span>
          </div>
        </div>

        {/* Legend */}
        <ul className="flex-1 space-y-3">
          {riskSegments.map((seg) => (
            <li key={seg.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: seg.color }}
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-ink-muted">
                  {seg.count} Patients
                </span>
              </div>
              <span className="text-sm font-semibold text-ink">{seg.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* AI Insights — signature element */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="relative mt-5 overflow-hidden rounded-xl border border-brand-100 bg-gradient-to-br from-brand-50 via-violet-soft to-brand-50 p-4"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white">
            <Sparkles size={12} className="animate-pulse-glow" />
          </span>
          <h3 className="text-sm font-bold text-ink">AI Insights</h3>
          <span className="ml-auto flex items-center gap-1 rounded-full bg-mint-soft px-2 py-0.5 text-[11px] font-semibold text-mint">
            <ChevronUp size={11} />
            Live
          </span>
        </div>
        <ul className="mt-2.5 space-y-1.5">
          {aiInsights.map((insight, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-ink-muted">
              <TrendingUp size={13} className="mt-0.5 shrink-0 text-brand-600" />
              {insight}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
