"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Users, CalendarClock, CreditCard, X } from "lucide-react";
import { usePatientsStore } from "@/store/usePatientsStore";
import { useAppointmentsStore } from "@/store/useAppointmentsStore";
import { useBillingStore } from "@/store/useBillingStore";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/ui/Avatar";

interface SearchResult {
  id: string;
  label: string;
  sublabel: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  avatarName?: string;
  avatarColor?: string;
}

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const patients = usePatientsStore((s) => s.patients);
  const appointments = useAppointmentsStore((s) => s.appointments);
  const invoices = useBillingStore((s) => s.invoices);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const results: SearchResult[] = [];

  if (query.trim().length >= 1) {
    const q = query.trim().toLowerCase();

    patients
      .filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.condition.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .forEach((p) =>
        results.push({
          id: `p-${p.id}`,
          label: p.name,
          sublabel: `${p.id} · ${p.condition} · ${p.status}`,
          href: "/patients",
          icon: Users,
          avatarName: p.name,
          avatarColor: p.avatarColor,
        })
      );

    appointments
      .filter((a) =>
        a.patientName.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.doctor.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q)
      )
      .slice(0, 3)
      .forEach((a) =>
        results.push({
          id: `a-${a.id}`,
          label: a.patientName,
          sublabel: `${a.id} · ${a.type} · ${a.date} ${a.time}`,
          href: "/appointments",
          icon: CalendarClock,
          avatarName: a.patientName,
          avatarColor: a.avatarColor,
        })
      );

    invoices
      .filter((i) =>
        i.patientName.toLowerCase().includes(q) ||
        i.invoiceNo.toLowerCase().includes(q) ||
        i.service.toLowerCase().includes(q)
      )
      .slice(0, 3)
      .forEach((i) =>
        results.push({
          id: `i-${i.id}`,
          label: i.invoiceNo,
          sublabel: `${i.patientName} · ${i.service} · $${i.amount}`,
          href: "/billing",
          icon: CreditCard,
          avatarName: i.patientName,
          avatarColor: i.avatarColor,
        })
      );
  }

  const handleSelect = (result: SearchResult) => {
    router.push(result.href);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative hidden max-w-md flex-1 md:block">
      {/* Input */}
      <div className="relative">
        <Search
          size={17}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search patients, records, invoices and more..."
          aria-label="Global search"
          aria-expanded={open && results.length > 0}
          aria-haspopup="listbox"
          className="w-full rounded-xl border border-border bg-bg-subtle py-2 pl-9 pr-8 text-sm text-ink placeholder:text-ink-faint focus:border-brand focus:bg-bg-surface focus:outline-none"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setOpen(false); }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && query.trim().length >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl2 border border-border bg-bg-surface shadow-soft"
            role="listbox"
            aria-label="Search results"
          >
            {results.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-ink-faint">
                No results for &ldquo;{query}&rdquo;
              </p>
            ) : (
              <ul>
                {results.map((result, i) => {
                  const Icon = result.icon;
                  return (
                    <li key={result.id}>
                      <button
                        role="option"
                        aria-selected="false"
                        onClick={() => handleSelect(result)}
                        className={cn(
                          "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-bg-subtle",
                          i !== 0 && "border-t border-border"
                        )}
                      >
                        {result.avatarName && result.avatarColor ? (
                          <Avatar name={result.avatarName} color={result.avatarColor} size={32} />
                        ) : (
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg-subtle text-ink-faint">
                            <Icon size={15} />
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-ink">{result.label}</p>
                          <p className="truncate text-xs text-ink-faint">{result.sublabel}</p>
                        </div>
                        <Icon size={13} className="shrink-0 text-ink-faint" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="border-t border-border px-4 py-2 text-[11px] text-ink-faint">
              Press <kbd className="rounded bg-bg-subtle px-1 py-0.5 font-mono">Esc</kbd> to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
