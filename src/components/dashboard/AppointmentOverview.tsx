"use client";

import { motion } from "framer-motion";
import { ChevronRight, CheckCircle2, AlertCircle, Clock3, XCircle } from "lucide-react";
import { appointments, appointmentOverviewStats } from "@/data/dashboard";
import { cn } from "@/lib/cn";
import type { Appointment } from "@/types";

const statusConfig: Record<
  Appointment["status"],
  { icon: React.ComponentType<{ size?: number; className?: string }>; className: string }
> = {
  confirmed: { icon: CheckCircle2, className: "bg-mint text-white" },
  urgent: { icon: AlertCircle, className: "bg-rose text-white" },
  pending: { icon: Clock3, className: "bg-sky text-white" },
};

export function AppointmentOverview() {
  return (
    <div className="rounded-xl2 border border-border bg-bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-ink">Appointment Overview</h2>
          <p className="mt-0.5 text-xs text-ink-faint">Smart health appointment schedule</p>
        </div>
        <button
          className="rounded-lg p-1.5 text-ink-faint hover:bg-bg-subtle"
          aria-label="View all appointments"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Stat row */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {appointmentOverviewStats.map((stat, i) => (
          <div key={stat.id}>
            <p className="text-2xl font-extrabold tracking-tight text-ink">{stat.value}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-faint">
              {i === 1 && <CheckCircle2 size={12} className="text-mint" />}
              {i === 2 && <XCircle size={12} className="text-rose" />}
              {i === 3 && <XCircle size={12} className="text-amber" />}
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Appointment list */}
      <ul className="mt-5 space-y-3">
        {appointments.map((appt, i) => {
          const Status = statusConfig[appt.status];
          const StatusIcon = Status.icon;
          return (
            <motion.li
              key={appt.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * i }}
              className={cn(
                "flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:border-border hover:bg-bg-subtle",
                appt.status === "urgent" && "border-rose-soft bg-rose-soft/50"
              )}
            >
              <span className="w-16 shrink-0 text-xs font-semibold text-ink-muted">
                {appt.time}
              </span>
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: appt.avatarColor }}
                aria-hidden="true"
              >
                {appt.patientName.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "truncate text-sm font-semibold",
                    appt.status === "urgent" ? "text-rose" : "text-ink"
                  )}
                >
                  {appt.patientName}
                </p>
                <p className="truncate text-xs text-ink-faint">{appt.reason}</p>
              </div>
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                  Status.className
                )}
              >
                <StatusIcon size={13} />
              </span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
