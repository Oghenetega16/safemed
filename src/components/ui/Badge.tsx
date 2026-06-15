import { cn } from "@/lib/cn";

type Tone = "brand" | "mint" | "rose" | "amber" | "violet" | "sky" | "neutral";

const toneClasses: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-600",
  mint: "bg-mint-soft text-mint",
  rose: "bg-rose-soft text-rose",
  amber: "bg-amber-soft text-amber",
  violet: "bg-violet-soft text-violet",
  sky: "bg-sky-soft text-sky",
  neutral: "bg-bg-subtle text-ink-muted",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold leading-none",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
