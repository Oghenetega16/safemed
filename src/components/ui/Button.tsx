import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-600 shadow-soft",
  secondary: "bg-bg-subtle text-ink hover:bg-border",
  outline: "border border-border bg-bg-surface text-ink hover:bg-bg-subtle",
  ghost: "text-ink-muted hover:bg-bg-subtle hover:text-ink",
  danger: "bg-rose text-white hover:opacity-90",
  success: "bg-mint text-white hover:opacity-90",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs gap-1",
  md: "px-4 py-2.5 text-sm gap-1.5",
  lg: "px-5 py-3 text-base gap-2",
};

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}
