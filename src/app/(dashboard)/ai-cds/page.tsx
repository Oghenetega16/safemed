"use client";

import { useMemo, useState } from "react";
import { RefreshCw, AlertTriangle, ShieldCheck, Gauge, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/cn";
import { AlertCard } from "@/components/cds/AlertCard";
import { AskAiPanel } from "@/components/cds/AskAiPanel";
import { useCdsStore } from "@/store/useCdsStore";
import { useToastStore } from "@/store/useToastStore";
import type { AlertSeverity } from "@/types";

const severityFilters: Array<AlertSeverity | "All"> = ["All", "critical", "high", "moderate", "low"];

export default function AiCdsPage() {
  const { alerts, setStatus } = useCdsStore();
  const showToast = useToastStore((s) => s.show);
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | "All">("All");
  const [showResolved, setShowResolved] = useState(false);

  const stats = useMemo(() => {
    const active = alerts.filter((a) => a.status !== "resolved");
    const critical = active.filter((a) => a.severity === "critical").length;
    const avgConfidence = Math.round(alerts.reduce((sum, a) => sum + a.confidence, 0) / alerts.length);
    const resolved = alerts.filter((a) => a.status === "resolved").length;
    return { active: active.length, critical, avgConfidence, resolved };
  }, [alerts]);

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      if (!showResolved && a.status === "resolved") return false;
      if (severityFilter !== "All" && a.severity !== severityFilter) return false;
      return true;
    });
  }, [alerts, severityFilter, showResolved]);

  return (
    <>
      <PageHeader
        title="AI Clinical Decision Support"
        description="Predictive risk alerts generated from real-time vitals, labs and patient history."
        actions={
          <Button
            variant="outline"
            onClick={() =>
              showToast({ title: "Insights refreshed", description: "Model re-scored all active patients.", tone: "success" })
            }
          >
            <RefreshCw size={15} />
            Refresh Insights
          </Button>
        }
      />

      <div className="space-y-4 px-4 lg:px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatPill icon={AlertTriangle} label="Active Insights" value={stats.active} tone="brand" />
          <StatPill icon={ShieldCheck} label="Critical" value={stats.critical} tone="rose" />
          <StatPill icon={Gauge} label="Avg. Confidence" value={`${stats.avgConfidence}%`} tone="violet" />
          <StatPill icon={CheckCircle2} label="Resolved" value={stats.resolved} tone="mint" />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl2 border border-border bg-bg-surface p-3 shadow-card">
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by severity">
                {severityFilters.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSeverityFilter(s)}
                    aria-pressed={severityFilter === s}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors",
                      severityFilter === s ? "bg-brand text-white" : "bg-bg-subtle text-ink-muted hover:text-ink"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 text-xs font-medium text-ink-muted">
                <input
                  type="checkbox"
                  checked={showResolved}
                  onChange={(e) => setShowResolved(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-brand focus:ring-brand"
                />
                Show resolved
              </label>
            </div>

            {filtered.length === 0 ? (
              <EmptyState icon={ShieldCheck} title="No insights match these filters" description="Try a different severity or enable resolved alerts." />
            ) : (
              <div className="space-y-3">
                {filtered.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} onSetStatus={setStatus} />
                ))}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-20 lg:h-fit">
            <AskAiPanel />
          </div>
        </div>
      </div>
    </>
  );
}

function StatPill({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: number | string;
  tone: "brand" | "rose" | "violet" | "mint";
}) {
  const toneClasses = {
    brand: "bg-brand-50 text-brand-600",
    rose: "bg-rose-soft text-rose",
    violet: "bg-violet-soft text-violet",
    mint: "bg-mint-soft text-mint",
  };
  return (
    <div className="rounded-xl2 border border-border bg-bg-surface p-4 shadow-card">
      <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", toneClasses[tone])}>
        <Icon size={17} />
      </div>
      <p className="mt-3 text-2xl font-extrabold tracking-tight text-ink">{value}</p>
      <p className="text-xs font-medium text-ink-muted">{label}</p>
    </div>
  );
}
