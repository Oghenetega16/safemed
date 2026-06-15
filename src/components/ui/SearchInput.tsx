"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/cn";

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-xl border border-border bg-bg-subtle py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-brand focus:bg-bg-surface focus:outline-none"
      />
    </div>
  );
}
