"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { dateLegends } from "@/data/dashboard";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function buildCalendarGrid(year: number, month: number) {
  // month is 0-indexed
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  // Shift so week starts on Monday: Mon=0 … Sun=6
  const startOffset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells: { date: number; isCurrentMonth: boolean }[] = [];

  // Trailing days from previous month
  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({ date: daysInPrev - i, isCurrentMonth: false });
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: d, isCurrentMonth: true });
  }
  // Fill remainder to complete last row
  const remaining = (7 - (cells.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ date: d, isCurrentMonth: false });
  }
  return cells;
}

export function AppointmentCalendar() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const grid = useMemo(() => buildCalendarGrid(viewYear, viewMonth), [viewYear, viewMonth]);

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const isToday = (date: number) =>
    date === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const isSelected = (date: number) =>
    date === selectedDate && viewMonth === selectedMonth && viewYear === selectedYear;

  return (
    <div className="rounded-xl2 border border-border bg-bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-ink">Appointment Calendar</h2>
          <p className="mt-0.5 text-xs text-ink-faint">Schedule your health appointments with ease</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border px-2 py-1">
          <button onClick={prevMonth} className="rounded p-0.5 text-ink-muted hover:bg-bg-subtle" aria-label="Previous month">
            <ChevronLeft size={15} />
          </button>
          <span className="min-w-[108px] px-1 text-center text-xs font-semibold text-ink">{monthLabel}</span>
          <button onClick={nextMonth} className="rounded p-0.5 text-ink-muted hover:bg-bg-subtle" aria-label="Next month">
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Weekday header */}
      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {weekdays.map((day) => (
          <span key={day} className="text-[11px] font-semibold text-ink-faint">{day}</span>
        ))}
      </div>

      {/* Day grid */}
      <div className="mt-1 grid grid-cols-7 gap-1">
        {grid.map((cell, i) => {
          const selected = cell.isCurrentMonth && isSelected(cell.date);
          const todayCell = cell.isCurrentMonth && isToday(cell.date);
          return (
            <button
              key={i}
              onClick={() => {
                if (!cell.isCurrentMonth) return;
                setSelectedDate(cell.date);
                setSelectedMonth(viewMonth);
                setSelectedYear(viewYear);
              }}
              disabled={!cell.isCurrentMonth}
              aria-current={todayCell ? "date" : undefined}
              aria-label={cell.isCurrentMonth ? `${monthLabel} ${cell.date}` : undefined}
              className={cn(
                "flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg text-xs font-medium transition-colors",
                !cell.isCurrentMonth && "text-ink-faint/40 cursor-default",
                cell.isCurrentMonth && !selected && !todayCell && "text-ink-muted hover:bg-bg-subtle",
                todayCell && !selected && "ring-1 ring-brand text-brand font-bold",
                selected && "bg-brand text-white shadow-soft"
              )}
            >
              {cell.date}
            </button>
          );
        })}
      </div>

      {/* Date legends */}
      <div className="mt-5 border-t border-border pt-4">
        <h3 className="text-sm font-bold text-ink">Date Legends</h3>
        <p className="mt-0.5 text-xs text-ink-faint">Effortlessly track your health check-ups</p>
        <ul className="mt-3 space-y-2">
          {dateLegends.map((legend) => (
            <li key={legend.id} className="flex items-center gap-2 text-xs text-ink-muted">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: legend.color }} aria-hidden="true" />
              {legend.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
