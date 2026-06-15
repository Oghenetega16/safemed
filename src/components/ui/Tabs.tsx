"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export interface TabItem {
  id: string;
  label: string;
}

export function Tabs({
  tabs,
  defaultTab,
  onChange,
  children,
}: {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (id: string) => void;
  children: (activeTab: string) => React.ReactNode;
}) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);

  const handleChange = (id: string) => {
    setActive(id);
    onChange?.(id);
  };

  return (
    <div>
      <div role="tablist" className="flex gap-1 rounded-xl bg-bg-subtle p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={active === tab.id}
            onClick={() => handleChange(tab.id)}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
              active === tab.id ? "bg-bg-surface text-ink shadow-card" : "text-ink-muted hover:text-ink"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">{children(active)}</div>
    </div>
  );
}
