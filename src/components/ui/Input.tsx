import { cn } from "@/lib/cn";

export const fieldControlClass =
  "w-full rounded-xl border border-border bg-bg-subtle px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-brand focus:bg-bg-surface focus:outline-none disabled:opacity-60";

export function Field({
  label,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-rose"> *</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-faint">{hint}</span>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldControlClass, props.className)} {...props} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(fieldControlClass, "appearance-none", props.className)} {...props} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldControlClass, "resize-none", props.className)} {...props} />;
}
