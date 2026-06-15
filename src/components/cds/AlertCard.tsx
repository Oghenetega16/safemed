"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { AlertSeverity, AlertStatus, ClinicalAlert } from "@/types";

const severityTone: Record<AlertSeverity, "rose" | "amber" | "violet" | "sky"> = {
  critical: "rose",
  high: "amber",
  moderate: "violet",
  low: "sky",
};

const severityBar: Record<AlertSeverity, string> = {
  critical: "bg-rose",
  high: "bg-amber",
  moderate: "bg-violet",
  low: "bg-sky",
};

const severityIconWrap: Record<AlertSeverity, string> = {
  critical: "bg-rose-soft",
  high: "bg-amber-soft",
  moderate: "bg-violet-soft",
  low: "bg-sky-soft",
};

const severityIconColor: Record<AlertSeverity, string> = {
  critical: "text-rose",
  high: "text-amber",
  moderate: "text-violet",
  low: "text-sky",
};

const statusTone: Record<AlertStatus, "brand" | "violet" | "mint"> = {
  new: "brand",
  acknowledged: "violet",
  resolved: "mint",
};

export function AlertCard({
  alert,
  onSetStatus,
}: {
  alert: ClinicalAlert;
  onSetStatus: (id: string, status: AlertStatus) => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "rounded-xl2 border bg-bg-surface p-4 shadow-card",
        alert.severity === "critical" && alert.status === "new" ? "border-rose-soft" : "border-border"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", severityIconWrap[alert.severity])}>
            <AlertTriangle size={17} className={severityIconColor[alert.severity]} />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={severityTone[alert.severity]} className="capitalize">
                {alert.severity}
              </Badge>
              <Badge tone="neutral">{alert.category}</Badge>
              <Badge tone={statusTone[alert.status]} className="capitalize">
                {alert.status}
              </Badge>
            </div>
            <h3 className="mt-1.5 text-sm font-bold text-ink">{alert.title}</h3>
            <p className="text-xs text-ink-faint">
              {alert.patientName} · {alert.patientId} · {alert.timestamp}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-ink-faint">Confidence</p>
          <p className="text-lg font-extrabold text-ink">{alert.confidence}%</p>
        </div>
      </div>

      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-bg-subtle">
        <div className={cn("h-full rounded-full", severityBar[alert.severity])} style={{ width: `${alert.confidence}%` }} />
      </div>

      <p className="mt-3 text-sm text-ink-muted">{alert.description}</p>

      <div className="mt-3 flex items-start gap-2 rounded-xl bg-brand-50 p-3">
        <Sparkles size={15} className="mt-0.5 shrink-0 text-brand-600" />
        <p className="text-xs text-ink">
          <span className="font-semibold text-brand-600">Recommended: </span>
          {alert.recommendation}
        </p>
      </div>

      <div className="mt-3 flex justify-end gap-2">
        {alert.status === "new" && (
          <>
            <Button size="sm" variant="outline" onClick={() => onSetStatus(alert.id, "acknowledged")}>
              Acknowledge
            </Button>
            <Button size="sm" variant="success" onClick={() => onSetStatus(alert.id, "resolved")}>
              <CheckCircle2 size={14} />
              Resolve
            </Button>
          </>
        )}
        {alert.status === "acknowledged" && (
          <Button size="sm" variant="success" onClick={() => onSetStatus(alert.id, "resolved")}>
            <CheckCircle2 size={14} />
            Mark Resolved
          </Button>
        )}
        {alert.status === "resolved" && (
          <Button size="sm" variant="ghost" onClick={() => onSetStatus(alert.id, "new")}>
            <RotateCcw size={14} />
            Reopen
          </Button>
        )}
      </div>
    </motion.article>
  );
}
