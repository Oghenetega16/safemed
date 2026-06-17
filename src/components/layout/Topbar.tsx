"use client";

import { Menu, Bell } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { Avatar } from "@/components/ui/Avatar";
import { GlobalSearch } from "./GlobalSearch";

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

        <GlobalSearch />

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          <button
            className="relative rounded-lg p-2 text-ink-muted hover:bg-bg-subtle"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose ring-2 ring-bg-surface" />
          </button>
          
          <div className="flex items-center gap-2.5 rounded-xl border border-border py-1 pl-1 pr-3">
            <Avatar 
              name="Dr. Amelia Cruz" 
              color="#3E6BFF" 
              size={32}
              // Optional: If the slug generation still fails, uncomment the line below 
              // to force the exact file path directly.
              // src="/avatars/dr-amelia-cruz.jpg" 
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