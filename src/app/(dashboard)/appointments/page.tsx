"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  CalendarCheck,
  CalendarClock,
  CalendarX2,
  CheckCircle2,
  List,
  Calendar as CalendarIcon,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { NewAppointmentModal } from "@/components/appointments/NewAppointmentModal";
import { useAppointmentsStore } from "@/store/useAppointmentsStore";
import { useToastStore } from "@/store/useToastStore";
import { doctorOptions } from "@/data/appointments";
import { calendarDays } from "@/data/dashboard";
import { cn } from "@/lib/cn";
import type { AppointmentRecord, AppointmentStatus } from "@/types";

const statusTone: Record<AppointmentStatus, "mint" | "amber" | "rose" | "sky"> = {
  confirmed: "mint",
  pending: "amber",
  cancelled: "rose",
  completed: "sky",
};

const statusFilters: Array<AppointmentStatus | "All"> = ["All", "confirmed", "pending", "completed", "cancelled"];
const PAGE_SIZE = 8;
const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function formatDateLabel(date: string) {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export default function AppointmentsPage() {
  const { appointments, setStatus } = useAppointmentsStore();
  const showToast = useToastStore((s) => s.show);

  const [view, setView] = useState<"list" | "calendar">("list");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "All">("All");
  const [doctorFilter, setDoctorFilter] = useState<string>("All");
  const [page, setPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState("2025-02-18");
  const [newOpen, setNewOpen] = useState(false);

  const stats = useMemo(() => {
    const total = appointments.length;
    const confirmed = appointments.filter((a) => a.status === "confirmed").length;
    const pending = appointments.filter((a) => a.status === "pending").length;
    const cancelled = appointments.filter((a) => a.status === "cancelled").length;
    return { total, confirmed, pending, cancelled };
  }, [appointments]);

  const filtered = useMemo(() => {
    let result = appointments;
    if (statusFilter !== "All") result = result.filter((a) => a.status === statusFilter);
    if (doctorFilter !== "All") result = result.filter((a) => a.doctor === doctorFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (a) => a.patientName.toLowerCase().includes(q) || a.type.toLowerCase().includes(q) || a.id.toLowerCase().includes(q)
      );
    }
    return [...result].sort((a, b) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)));
  }, [appointments, search, statusFilter, doctorFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const dayCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    appointments.forEach((a) => {
      if (a.date.startsWith("2025-02-")) {
        const day = parseInt(a.date.slice(8), 10);
        counts[day] = (counts[day] ?? 0) + 1;
      }
    });
    return counts;
  }, [appointments]);

  const dayAppointments = useMemo(
    () => appointments.filter((a) => a.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time)),
    [appointments, selectedDate]
  );

  const handleStatus = (record: AppointmentRecord, status: AppointmentStatus) => {
    setStatus(record.id, status);
    const messages: Record<AppointmentStatus, string> = {
      confirmed: "Appointment confirmed",
      pending: "Appointment moved to pending",
      cancelled: "Appointment cancelled",
      completed: "Appointment marked as completed",
    };
    showToast({ title: messages[status], description: `${record.patientName} · ${record.date} at ${record.time}`, tone: status === "cancelled" ? "info" : "success" });
  };

  const updateFilter = (fn: () => void) => {
    fn();
    setPage(1);
  };

  return (
    <>
      <PageHeader
        title="Appointments"
        description="Schedule, confirm and track every patient appointment in one place."
        actions={
          <Button onClick={() => setNewOpen(true)}>
            <Plus size={16} />
            New Appointment
          </Button>
        }
      />

      <div className="space-y-4 px-4 lg:px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatPill icon={CalendarCheck} label="Total Appointments" value={stats.total} tone="brand" />
          <StatPill icon={CheckCircle2} label="Confirmed" value={stats.confirmed} tone="mint" />
          <StatPill icon={CalendarClock} label="Pending" value={stats.pending} tone="amber" />
          <StatPill icon={CalendarX2} label="Cancelled" value={stats.cancelled} tone="rose" />
        </div>

        {/* View toggle + filters */}
        <div className="rounded-xl2 border border-border bg-bg-surface p-4 shadow-card">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-1 rounded-xl bg-bg-subtle p-1">
              <button aria-label="List view"
                onClick={() => setView("list")}
                aria-pressed={view === "list"}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  view === "list" ? "bg-bg-surface text-ink shadow-card" : "text-ink-muted hover:text-ink"
                )}
              >
                <List size={14} />
                List
              </button>
              <button aria-label="Calendar view"
                onClick={() => setView("calendar")}
                aria-pressed={view === "calendar"}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  view === "calendar" ? "bg-bg-surface text-ink shadow-card" : "text-ink-muted hover:text-ink"
                )}
              >
                <CalendarIcon size={14} />
                Calendar
              </button>
            </div>

            {view === "list" && (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <SearchInput value={search} onChange={(v) => updateFilter(() => setSearch(v))} placeholder="Search patient, type or ID..." className="sm:w-64" />
                <div className="flex gap-2 text-xs">
                  <Select value={statusFilter} onChange={(e) => updateFilter(() => setStatusFilter(e.target.value as typeof statusFilter))} className="w-auto" aria-label="Filter by status">
                    {statusFilters.map((s) => (
                      <option key={s} value={s} className="capitalize">
                        {s === "All" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </Select>
                  <Select value={doctorFilter} onChange={(e) => updateFilter(() => setDoctorFilter(e.target.value))} className="w-auto" aria-label="Filter by doctor">
                    <option value="All">All Doctors</option>
                    {doctorOptions.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>

        {view === "list" ? (
          <div className="rounded-xl2 border border-border bg-bg-surface shadow-card">
            {pageItems.length === 0 ? (
              <EmptyState icon={CalendarCheck} title="No appointments found" description="Try adjusting your search or filters." />
            ) : (
              <>
                <div className="scrollbar-thin hidden overflow-x-auto lg:block">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-faint">
                        <th className="px-5 py-3 font-semibold">Patient</th>
                        <th className="px-5 py-3 font-semibold">Date &amp; Time</th>
                        <th className="px-5 py-3 font-semibold">Doctor</th>
                        <th className="px-5 py-3 font-semibold">Department</th>
                        <th className="px-5 py-3 font-semibold">Type</th>
                        <th className="px-5 py-3 font-semibold">Status</th>
                        <th className="px-5 py-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageItems.map((appt) => (
                        <tr key={appt.id} className="border-b border-border last:border-0 hover:bg-bg-subtle">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: appt.avatarColor }} aria-hidden="true">
                                {appt.patientName.charAt(0)}
                              </span>
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-ink">{appt.patientName}</p>
                                <p className="text-xs text-ink-faint">{appt.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-ink-muted">
                            {formatDateLabel(appt.date)}
                            <br />
                            <span className="text-xs text-ink-faint">{appt.time} · {appt.duration}</span>
                          </td>
                          <td className="px-5 py-3 text-ink-muted">{appt.doctor}</td>
                          <td className="px-5 py-3 text-ink-muted">{appt.department}</td>
                          <td className="px-5 py-3 text-ink-muted">{appt.type}</td>
                          <td className="px-5 py-3">
                            <Badge tone={statusTone[appt.status]} className="capitalize">{appt.status}</Badge>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex justify-end">
                              <AppointmentActions appt={appt} onStatus={handleStatus} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <ul className="divide-y divide-border lg:hidden">
                  {pageItems.map((appt) => (
                    <li key={appt.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: appt.avatarColor }} aria-hidden="true">
                          {appt.patientName.charAt(0)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="truncate text-sm font-semibold text-ink">{appt.patientName}</p>
                              <p className="text-xs text-ink-faint">{appt.doctor} · {appt.department}</p>
                            </div>
                            <Badge tone={statusTone[appt.status]} className="shrink-0 capitalize">{appt.status}</Badge>
                          </div>
                          <p className="mt-1.5 text-xs text-ink-muted">
                            {formatDateLabel(appt.date)} · {appt.time} · {appt.type}
                          </p>
                          <div className="mt-2">
                            <AppointmentActions appt={appt} onStatus={handleStatus} />
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="px-5 pb-4">
                  <Pagination page={page} totalPages={totalPages} onChange={setPage} total={filtered.length} pageSize={PAGE_SIZE} />
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-xl2 border border-border bg-bg-surface p-5 shadow-card lg:col-span-1">
              <h2 className="text-base font-bold text-ink">February 2025</h2>
              <p className="mt-0.5 text-xs text-ink-faint">Tap a date to view its schedule</p>
              <div className="mt-4 grid grid-cols-7 gap-1 text-center">
                {weekdays.map((day) => (
                  <span key={day} className="text-[11px] font-semibold text-ink-faint">{day}</span>
                ))}
              </div>
              <div className="mt-1 grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => {
                  const dateStr = `2025-02-${String(day.date).padStart(2, "0")}`;
                  const isSelected = day.isCurrentMonth && dateStr === selectedDate;
                  const count = day.isCurrentMonth ? dayCounts[day.date] ?? 0 : 0;
                  return (
                    <button
                      key={i}
                      onClick={() => day.isCurrentMonth && setSelectedDate(dateStr)}
                      disabled={!day.isCurrentMonth}
                      aria-current={isSelected ? "date" : undefined}
                      aria-label={`February ${day.date}${count > 0 ? `, ${count} appointments` : ""}`}
                      className={cn(
                        "flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg text-xs font-medium transition-colors",
                        !day.isCurrentMonth && "text-ink-faint/40",
                        day.isCurrentMonth && !isSelected && "text-ink-muted hover:bg-bg-subtle",
                        isSelected && "bg-brand text-white shadow-soft"
                      )}
                    >
                      {day.date}
                      {count > 0 && (
                        <span className={cn("h-1 w-1 rounded-full", isSelected ? "bg-white" : "bg-brand")} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 lg:col-span-2">
              <h2 className="text-base font-bold text-ink">
                {new Date(`${selectedDate}T00:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </h2>
              {dayAppointments.length === 0 ? (
                <EmptyState icon={CalendarIcon} title="No appointments on this date" description="Select a different date or schedule a new appointment." />
              ) : (
                dayAppointments.map((appt) => (
                  <div key={appt.id} className="flex flex-wrap items-center gap-3 rounded-xl2 border border-border bg-bg-surface p-4 shadow-card">
                    <span className="w-20 shrink-0 text-sm font-semibold text-ink-muted">{appt.time}</span>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: appt.avatarColor }} aria-hidden="true">
                      {appt.patientName.charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{appt.patientName}</p>
                      <p className="truncate text-xs text-ink-faint">{appt.doctor} · {appt.department} · {appt.type} · {appt.duration}</p>
                    </div>
                    <Badge tone={statusTone[appt.status]} className="capitalize">{appt.status}</Badge>
                    <AppointmentActions appt={appt} onStatus={handleStatus} />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <NewAppointmentModal open={newOpen} onClose={() => setNewOpen(false)} />
    </>
  );
}

function AppointmentActions({
  appt,
  onStatus,
}: {
  appt: AppointmentRecord;
  onStatus: (appt: AppointmentRecord, status: AppointmentStatus) => void;
}) {
  if (appt.status === "pending") {
    return (
      <div className="flex gap-1.5">
        <Button size="sm" variant="success" onClick={() => onStatus(appt, "confirmed")}>
          <CheckCircle2 size={13} />
          Confirm
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onStatus(appt, "cancelled")} aria-label="Cancel appointment">
          <XCircle size={13} />
        </Button>
      </div>
    );
  }
  if (appt.status === "confirmed") {
    return (
      <div className="flex gap-1.5">
        <Button size="sm" variant="outline" onClick={() => onStatus(appt, "completed")}>
          Complete
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onStatus(appt, "cancelled")} aria-label="Cancel appointment">
          <XCircle size={13} />
        </Button>
      </div>
    );
  }
  if (appt.status === "cancelled") {
    return (
      <Button size="sm" variant="ghost" onClick={() => onStatus(appt, "pending")}>
        <RotateCcw size={13} />
        Restore
      </Button>
    );
  }
  return <span className="text-xs text-ink-faint">No actions</span>;
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
  tone: "brand" | "mint" | "amber" | "rose";
}) {
  const toneClasses = {
    brand: "bg-brand-50 text-brand-600",
    mint: "bg-mint-soft text-mint",
    amber: "bg-amber-soft text-amber",
    rose: "bg-rose-soft text-rose",
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
