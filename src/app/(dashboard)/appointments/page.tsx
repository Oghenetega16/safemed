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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import { NewAppointmentModal } from "@/components/appointments/NewAppointmentModal";
import { useAppointmentsStore } from "@/store/useAppointmentsStore";
import { useToastStore } from "@/store/useToastStore";
import { doctorOptions } from "@/data/appointments";
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
  const _today = new Date();
  const todayStr = `${_today.getFullYear()}-${String(_today.getMonth() + 1).padStart(2, "0")}-${String(_today.getDate()).padStart(2, "0")}`;

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [calViewYear, setCalViewYear] = useState(_today.getFullYear());
  const [calViewMonth, setCalViewMonth] = useState(_today.getMonth());
  const [newOpen, setNewOpen] = useState(false);

  const calMonthLabel = new Date(calViewYear, calViewMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const calGrid = useMemo(() => {
    const firstDay = new Date(calViewYear, calViewMonth, 1).getDay();
    const startOffset = (firstDay + 6) % 7;
    const daysInMonth = new Date(calViewYear, calViewMonth + 1, 0).getDate();
    const daysInPrev = new Date(calViewYear, calViewMonth, 0).getDate();
    const cells: { date: number; isCurrentMonth: boolean }[] = [];
    for (let i = startOffset - 1; i >= 0; i--) cells.push({ date: daysInPrev - i, isCurrentMonth: false });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ date: d, isCurrentMonth: true });
    const rem = (7 - (cells.length % 7)) % 7;
    for (let d = 1; d <= rem; d++) cells.push({ date: d, isCurrentMonth: false });
    return cells;
  }, [calViewYear, calViewMonth]);

  const prevCalMonth = () => {
    if (calViewMonth === 0) { setCalViewMonth(11); setCalViewYear((y) => y - 1); }
    else setCalViewMonth((m) => m - 1);
  };
  const nextCalMonth = () => {
    if (calViewMonth === 11) { setCalViewMonth(0); setCalViewYear((y) => y + 1); }
    else setCalViewMonth((m) => m + 1);
  };

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
    const prefix = `${calViewYear}-${String(calViewMonth + 1).padStart(2, "0")}-`;
    const counts: Record<number, number> = {};
    appointments.forEach((a) => {
      if (a.date.startsWith(prefix)) {
        const day = parseInt(a.date.slice(8), 10);
        counts[day] = (counts[day] ?? 0) + 1;
      }
    });
    return counts;
  }, [appointments, calViewYear, calViewMonth]);

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
              <button
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
              <button
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
                <div className="flex gap-2">
                  <Select value={statusFilter} onChange={(e) => updateFilter(() => setStatusFilter(e.target.value as typeof statusFilter))} className="w-auto border border-dashed text-sm" aria-label="Filter by status">
                    {statusFilters.map((s) => (
                      <option key={s} value={s} className="capitalize">
                        {s === "All" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </Select>
                  <Select value={doctorFilter} onChange={(e) => updateFilter(() => setDoctorFilter(e.target.value))} className="w-auto border border-dashed text-sm" aria-label="Filter by doctor">
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
                              <Avatar name={appt.patientName} color={appt.avatarColor} size={36} />
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-ink">{appt.patientName}</p>
                                <p className="text-xs text-ink-faint">{appt.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-ink-muted text-xs">
                            {formatDateLabel(appt.date)}
                            <br />
                            <span className="text-xs text-ink-faint">{appt.time} · {appt.duration}</span>
                          </td>
                          <td className="px-5 py-3 text-ink-muted text-xs">{appt.doctor}</td>
                          <td className="px-5 py-3 text-ink-muted text-xs">{appt.department}</td>
                          <td className="px-5 py-3 text-ink-muted text-xs">{appt.type}</td>
                          <td className="px-5 py-3 text-xs">
                            <Badge tone={statusTone[appt.status]} className="capitalize">{appt.status}</Badge>
                          </td>
                          <td className="px-5 py-3 text-xs">
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
                        <Avatar name={appt.patientName} color={appt.avatarColor} size={40} />
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
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-ink">{calMonthLabel}</h2>
                  <p className="mt-0.5 text-xs text-ink-faint">Tap a date to view its schedule</p>
                </div>
                <div className="flex items-center gap-1 rounded-lg border border-border px-2 py-1">
                  <button onClick={prevCalMonth} className="rounded p-0.5 text-ink-muted hover:bg-bg-subtle" aria-label="Previous month"><ChevronLeft size={14} /></button>
                  <button onClick={nextCalMonth} className="rounded p-0.5 text-ink-muted hover:bg-bg-subtle" aria-label="Next month"><ChevronRight size={14} /></button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-7 gap-1 text-center">
                {weekdays.map((day) => (
                  <span key={day} className="text-[11px] font-semibold text-ink-faint">{day}</span>
                ))}
              </div>
              <div className="mt-1 grid grid-cols-7 gap-1">
                {calGrid.map((cell, i) => {
                  const dateStr = cell.isCurrentMonth
                    ? `${calViewYear}-${String(calViewMonth + 1).padStart(2, "0")}-${String(cell.date).padStart(2, "0")}`
                    : "";
                  const isSelected = cell.isCurrentMonth && dateStr === selectedDate;
                  const count = cell.isCurrentMonth ? dayCounts[cell.date] ?? 0 : 0;
                  const isToday = cell.isCurrentMonth && dateStr === todayStr;
                  return (
                    <button
                      key={i}
                      onClick={() => cell.isCurrentMonth && setSelectedDate(dateStr)}
                      disabled={!cell.isCurrentMonth}
                      aria-current={isToday ? "date" : undefined}
                      aria-label={cell.isCurrentMonth ? `${dateStr}${count > 0 ? `, ${count} appointments` : ""}` : undefined}
                      className={cn(
                        "flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg text-xs font-medium transition-colors",
                        !cell.isCurrentMonth && "text-ink-faint/40 cursor-default",
                        cell.isCurrentMonth && !isSelected && !isToday && "text-ink-muted hover:bg-bg-subtle",
                        isToday && !isSelected && "ring-1 ring-brand text-brand font-bold",
                        isSelected && "bg-brand text-white shadow-soft"
                      )}
                    >
                      {cell.date}
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
                {selectedDate
                  ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
                  : "Select a date"}
              </h2>
              {dayAppointments.length === 0 ? (
                <EmptyState icon={CalendarIcon} title="No appointments on this date" description="Select a different date or schedule a new appointment." />
              ) : (
                dayAppointments.map((appt) => (
                  <div key={appt.id} className="flex flex-wrap items-center gap-3 rounded-xl2 border border-border bg-bg-surface p-4 shadow-card">
                    <span className="w-20 shrink-0 text-sm font-semibold text-ink-muted">{appt.time}</span>
                    <Avatar name={appt.patientName} color={appt.avatarColor} size={40} />
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
