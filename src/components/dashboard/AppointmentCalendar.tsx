"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { calendarDays, dateLegends } from "@/data/dashboard";
import { useUIStore } from "@/store/useUIStore";

const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export function AppointmentCalendar() {
  const { selectedDate, setSelectedDate } = useUIStore();

  return (
    <div className="rounded-xl2 border border-border bg-bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-ink">Appointment Calendar</h2>
          <p className="mt-0.5 text-xs text-ink-faint">
            Schedule your health appointments with ease
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border px-2 py-1">
          <button
            className="rounded p-0.5 text-ink-muted hover:bg-bg-subtle"
            aria-label="Previous month"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="px-1 text-xs font-semibold text-ink">February 2025</span>
          <button
            className="rounded p-0.5 text-ink-muted hover:bg-bg-subtle"
            aria-label="Next month"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Weekday header */}
      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {weekdays.map((day) => (
          <span key={day} className="text-[11px] font-semibold text-ink-faint">
            {day}
          </span>
        ))}
      </div>

      {/* Day grid */}
      <div className="mt-1 grid grid-cols-7 gap-1">
        {calendarDays.map((day, i) => {
          const isSelected = day.isCurrentMonth && day.date === selectedDate;
          return (
            <button
              key={i}
              onClick={() => day.isCurrentMonth && setSelectedDate(day.date)}
              disabled={!day.isCurrentMonth}
              aria-current={isSelected ? "date" : undefined}
              aria-label={`February ${day.date}${day.isToday ? " (today)" : ""}`}
              className={cn(
                "flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg text-xs font-medium transition-colors",
                !day.isCurrentMonth && "text-ink-faint/40",
                day.isCurrentMonth && !isSelected && "text-ink-muted hover:bg-bg-subtle",
                isSelected && "bg-brand text-white shadow-soft"
              )}
            >
              {day.date}
              {day.dots && (
                <span className="flex gap-0.5">
                  {day.dots.map((c, idx) => (
                    <span
                      key={idx}
                      className="h-1 w-1 rounded-full"
                      style={{ backgroundColor: isSelected ? "#fff" : c }}
                    />
                  ))}
                </span>
              )}
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
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: legend.color }}
                aria-hidden="true"
              />
              {legend.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
