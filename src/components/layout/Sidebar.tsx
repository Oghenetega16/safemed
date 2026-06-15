"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BrainCircuit,
  CalendarClock,
  Activity,
  Wallet,
  FileText,
  Boxes,
  BarChart3,
  MessageCircle,
  ShieldPlus,
  X,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { useUIStore } from "@/store/useUIStore";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "layout-dashboard": LayoutDashboard,
  users: Users,
  "brain-circuit": BrainCircuit,
  "calendar-clock": CalendarClock,
  "clipboard-pulse": Activity,
  wallet: Wallet,
  "file-text": FileText,
  boxes: Boxes,
  "bar-chart-3": BarChart3,
  "message-circle": MessageCircle,
};

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "layout-dashboard", href: "/" },
  { id: "patients", label: "Patients", icon: "users", href: "/patients" },
  { id: "cds", label: "AI CDS", icon: "brain-circuit", href: "/ai-cds" },
  { id: "appointments", label: "Appointments", icon: "calendar-clock", href: "/appointments" },
  { id: "clinical", label: "Clinical Operations", icon: "clipboard-pulse", href: "/clinical" },
  { id: "billing", label: "Billing & Revenue", icon: "wallet", href: "/billing" },
  { id: "mr", label: "MR & Docs", icon: "file-text", href: "/mr-docs" },
  { id: "inventory", label: "Inventory & Supplies", icon: "boxes", href: "/inventory" },
  { id: "reports", label: "Reports & Analytics", icon: "bar-chart-3", href: "/reports" },
  { id: "comms", label: "Communications", icon: "message-circle", href: "/communications" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const { sidebarOpen, sidebarCollapsed, closeSidebar, toggleCollapsed } = useUIStore();
  const pathname = usePathname();

  const content = (
    <div className="flex h-full flex-col bg-bg-surface">
      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-3 px-6 pt-6 pb-4",
          sidebarCollapsed && "lg:justify-center lg:px-0"
        )}
      >
        <Link
          href="/"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-soft"
          aria-label="SafeMed home"
        >
          <ShieldPlus size={19} strokeWidth={2.25} />
        </Link>
        <span
          className={cn(
            "text-lg font-extrabold tracking-tight text-ink",
            sidebarCollapsed && "lg:hidden"
          )}
        >
          SafeMed
        </span>
        <button
          onClick={closeSidebar}
          className="ml-auto rounded-lg p-1.5 text-ink-muted hover:bg-bg-subtle lg:hidden"
          aria-label="Close navigation menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav
        className="scrollbar-thin flex-1 overflow-y-auto px-3 py-2"
        aria-label="Primary navigation"
      >
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = isActivePath(pathname, item.href);
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={closeSidebar}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    sidebarCollapsed && "lg:justify-center lg:px-2",
                    isActive
                      ? "text-brand-600"
                      : "text-ink-muted hover:bg-bg-subtle hover:text-ink"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active-pill"
                      className="absolute inset-0 rounded-xl bg-brand-50"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon
                    size={19}
                    className={cn(
                      "relative z-10 shrink-0",
                      isActive ? "text-brand-600" : "text-ink-muted group-hover:text-ink"
                    )}
                  />
                  <span
                    className={cn(
                      "relative z-10 whitespace-nowrap",
                      sidebarCollapsed && "lg:hidden"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle (desktop only) */}
      <div className="hidden border-t border-border p-3 lg:block">
        <button
          onClick={toggleCollapsed}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-bg-subtle hover:text-ink",
            sidebarCollapsed && "justify-center px-2"
          )}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <ChevronsRight size={19} /> : <ChevronsLeft size={19} />}
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 border-r border-border transition-all duration-300 lg:block",
          sidebarCollapsed ? "w-[76px]" : "w-[260px]"
        )}
      >
        {content}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-[260px] shadow-2xl lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
