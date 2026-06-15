"use client";

import { Search, Menu, Bell } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";

export function Topbar() {
  const { toggleSidebar } = useUIStore();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg-surface/90 backdrop-blur-sm">
      <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-ink-muted hover:bg-bg-subtle lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        {/* Search */}
        <div className="relative hidden max-w-md flex-1 md:block">
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
          />
          <input
            type="search"
            placeholder="Search patients, records, invoices and more..."
            className="w-full rounded-xl border border-border bg-bg-subtle py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-brand focus:bg-bg-surface focus:outline-none"
            aria-label="Search"
          />
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          <button
            className="rounded-lg p-2 text-ink-muted hover:bg-bg-subtle md:hidden"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          <button
            className="relative rounded-lg p-2 text-ink-muted hover:bg-bg-subtle"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose ring-2 ring-bg-surface" />
          </button>
          <div className="flex items-center gap-2.5 rounded-xl border border-border py-1 pl-1 pr-3">
            <div
              className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-brand to-violet"
              role="img"
              aria-label="User avatar"
            />
            <div className="hidden text-left leading-tight sm:block">
              <p className="text-xs font-semibold text-ink">Dr. Amelia Cruz</p>
              <p className="text-[11px] text-ink-faint">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
