"use client";

import { useMemo, useState } from "react";
import { BedDouble, Activity, UserCheck, ClipboardList, Play, Clock4, CheckCircle2, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { useClinicalStore } from "@/store/useClinicalStore";
import { useToastStore } from "@/store/useToastStore";
import { Avatar } from "@/components/ui/Avatar";
import { wards as wardData } from "@/data/clinical";
import { cn } from "@/lib/cn";
import type { StaffStatus, OperationStatus } from "@/types";

const staffStatusTone: Record<StaffStatus, "mint" | "amber" | "neutral"> = {
  "On Duty": "mint",
  "On Break": "amber",
  "Off Duty": "neutral",
};

const opStatusTone: Record<OperationStatus, "sky" | "amber" | "mint" | "rose"> = {
  Scheduled: "sky",
  "In Progress": "amber",
  Completed: "mint",
  Delayed: "rose",
};

function occupancyColor(pct: number) {
  if (pct >= 90) return "bg-rose";
  if (pct >= 70) return "bg-amber";
  return "bg-mint";
}

export default function ClinicalOperationsPage() {
  const { staff, operations, cycleStaffStatus, setOperationStatus } = useClinicalStore();
  const showToast = useToastStore((s) => s.show);
  const [deptFilter, setDeptFilter] = useState("All");

  const bedStats = useMemo(() => {
    const totalCapacity = wardData.reduce((sum, w) => sum + w.capacity, 0);
    const totalOccupied = wardData.reduce((sum, w) => sum + w.occupied, 0);
    const onDuty = staff.filter((s) => s.status === "On Duty").length;
    return { totalCapacity, totalOccupied, available: totalCapacity - totalOccupied, onDuty };
  }, [wardData, staff]);

  const departments = useMemo(() => ["All", ...Array.from(new Set(staff.map((s) => s.department)))], [staff]);

  const filteredStaff = useMemo(
    () => (deptFilter === "All" ? staff : staff.filter((s) => s.department === deptFilter)),
    [staff, deptFilter]
  );

  const handleCycleStaff = (id: string) => {
    const updated = cycleStaffStatus(id);
    if (updated) {
      showToast({ title: `${updated.name} is now ${updated.status}`, tone: "info" });
    }
  };

  const handleOpStatus = (id: string, procedure: string, status: OperationStatus) => {
    setOperationStatus(id, status);
    showToast({ title: `${procedure}: ${status}`, tone: status === "Completed" ? "success" : "info" });
  };

  return (
    <>
      <PageHeader title="Clinical Operations" description="Monitor ward capacity, staff availability and operating theater schedules in real time." />

      <div className="space-y-4 px-4 lg:px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatPill icon={BedDouble} label="Total Beds" value={bedStats.totalCapacity} tone="brand" />
          <StatPill icon={Activity} label="Occupied" value={bedStats.totalOccupied} tone="rose" />
          <StatPill icon={BedDouble} label="Available" value={bedStats.available} tone="mint" />
          <StatPill icon={UserCheck} label="Staff On Duty" value={bedStats.onDuty} tone="sky" />
        </div>

        {/* Ward occupancy */}
        <div className="rounded-xl2 border border-border bg-bg-surface p-5 shadow-card">
          <h2 className="text-base font-bold text-ink">Ward Occupancy</h2>
          <p className="mt-0.5 text-xs text-ink-faint">Live bed utilization across all wards and units</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {wardData.map((ward) => {
              const pct = Math.round((ward.occupied / ward.capacity) * 100);
              return (
                <div key={ward.id} className="rounded-xl border border-border bg-bg-subtle p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-ink">{ward.name}</p>
                      <p className="text-xs text-ink-faint">{ward.type} · {ward.floor}</p>
                    </div>
                    <span className="shrink-0 text-sm font-extrabold text-ink">{pct}%</span>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border">
                    <div className={cn("h-full rounded-full transition-all", occupancyColor(pct))} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-ink-muted">{ward.occupied} of {ward.capacity} beds occupied</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Staff on duty */}
          <div className="rounded-xl2 border border-border bg-bg-surface p-5 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-ink">Staff Directory</h2>
                <p className="mt-0.5 text-xs text-ink-faint">Tap a status badge to update availability</p>
              </div>
              <Select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="w-auto" aria-label="Filter by department">
                {departments.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </Select>
            </div>
            <ul className="mt-4 max-h-[420px] space-y-2 overflow-y-auto scrollbar-thin pr-1">
              {filteredStaff.map((member) => (
                <li key={member.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                  <Avatar name={member.name} color={member.avatarColor} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{member.name}</p>
                    <p className="truncate text-xs text-ink-faint">{member.role} · {member.shift}</p>
                  </div>
                  <button onClick={() => handleCycleStaff(member.id)} aria-label={`Change status for ${member.name}, currently ${member.status}`}>
                    <Badge tone={staffStatusTone[member.status]} className="cursor-pointer">
                      {member.status}
                    </Badge>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* OT Schedule */}
          <div className="rounded-xl2 border border-border bg-bg-surface p-5 shadow-card">
            <div className="flex items-center gap-2">
              <ClipboardList size={18} className="text-brand-600" />
              <div>
                <h2 className="text-base font-bold text-ink">Operating Theater Schedule</h2>
                <p className="mt-0.5 text-xs text-ink-faint">Today's procedures across all theaters</p>
              </div>
            </div>
            <ul className="mt-4 space-y-2">
              {operations.map((op) => (
                <li key={op.id} className="rounded-xl border border-border p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-ink">{op.procedure}</p>
                      <p className="text-xs text-ink-faint">{op.patientName} · {op.surgeon}</p>
                      <p className="mt-1 text-xs text-ink-muted">{op.room} · {op.time}</p>
                    </div>
                    <Badge tone={opStatusTone[op.status]}>{op.status}</Badge>
                  </div>
                  <div className="mt-2 flex justify-end gap-1.5">
                    {op.status === "Scheduled" && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleOpStatus(op.id, op.procedure, "In Progress")}>
                          <Play size={12} />
                          Start
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleOpStatus(op.id, op.procedure, "Delayed")}>
                          <Clock4 size={12} />
                          Delay
                        </Button>
                      </>
                    )}
                    {op.status === "Delayed" && (
                      <Button size="sm" variant="outline" onClick={() => handleOpStatus(op.id, op.procedure, "In Progress")}>
                        <Play size={12} />
                        Start
                      </Button>
                    )}
                    {op.status === "In Progress" && (
                      <Button size="sm" variant="success" onClick={() => handleOpStatus(op.id, op.procedure, "Completed")}>
                        <CheckCircle2 size={12} />
                        Complete
                      </Button>
                    )}
                    {op.status === "Completed" && (
                      <span className="flex items-center gap-1 text-xs text-mint">
                        <CheckCircle2 size={12} /> Done
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-faint">
              <AlertCircle size={12} />
              Theater availability updates automatically as procedures progress.
            </p>
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
  value: number;
  tone: "brand" | "rose" | "mint" | "sky";
}) {
  const toneClasses = {
    brand: "bg-brand-50 text-brand-600",
    rose: "bg-rose-soft text-rose",
    mint: "bg-mint-soft text-mint",
    sky: "bg-sky-soft text-sky",
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
