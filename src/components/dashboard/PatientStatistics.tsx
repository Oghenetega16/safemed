"use client";

import { BarChart, Bar, ResponsiveContainer, Cell, LabelList } from "recharts";
import { ArrowUpRight, MoreHorizontal } from "lucide-react";
import { patientStats } from "@/data/dashboard";

export function PatientStatistics() {
  const chartData = patientStats.map((s) => ({
    name: s.label,
    value: s.percentage,
    fill: s.color,
  }));

  return (
    <div className="rounded-xl2 border border-border bg-bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-ink">Patients Statistics</h2>
          <p className="mt-0.5 text-xs text-ink-faint">
            Figuring out details to start better health choices
          </p>
        </div>
        <button
          className="rounded-lg p-1.5 text-ink-faint hover:bg-bg-subtle"
          aria-label="More options"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="mt-4 h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={18} margin={{ top: 24, right: 0, left: 0, bottom: 0 }}>
            <Bar dataKey="value" radius={[10, 10, 10, 10]} maxBarSize={56} isAnimationActive animationDuration={700}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} fillOpacity={0.85} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                formatter={(v: number) => `${v}%`}
                style={{ fontSize: 13, fontWeight: 700, fill: "#171A2B" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {patientStats.map((stat) => (
          <li key={stat.id} className="flex items-center gap-1.5 text-xs text-ink-muted">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: stat.color }}
              aria-hidden="true"
            />
            {stat.label}
            <span className="flex items-center font-semibold text-mint">
              <ArrowUpRight size={11} />
              {stat.trend}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
