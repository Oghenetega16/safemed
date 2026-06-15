import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-border bg-bg-subtle/60 px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-surface text-ink-faint shadow-card">
        <Icon size={22} />
      </div>
      <h3 className="mt-3 text-sm font-bold text-ink">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-xs text-ink-faint">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
