import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "purple"
  | "teal"
  | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--color-surface)] text-[var(--color-charcoal)] border border-[var(--color-hairline)]",
  success: "bg-[var(--color-card-tint-mint)] text-[var(--color-brand-green)]",
  warning: "bg-[var(--color-card-tint-peach)] text-[var(--color-brand-orange)]",
  error: "bg-[#fde8e8] text-[var(--color-semantic-error)]",
  purple: "bg-[var(--color-primary)] text-[var(--color-on-primary)]",
  teal: "bg-[var(--color-card-tint-sky)] text-[var(--color-brand-teal)]",
  outline:
    "bg-transparent text-[var(--color-steel)] border border-[var(--color-hairline-strong)]",
};

export function Badge({
  variant = "default",
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[var(--rounded-full)] px-[10px] py-[4px]",
        "text-[var(--font-size-caption)] font-semibold leading-[var(--line-height-caption)]",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full flex-shrink-0",
            variant === "success" && "bg-[var(--color-brand-green)]",
            variant === "warning" && "bg-[var(--color-brand-orange)]",
            variant === "error" && "bg-[var(--color-semantic-error)]",
            variant === "purple" && "bg-white",
            variant === "teal" && "bg-[var(--color-brand-teal)]",
            (variant === "default" || variant === "outline") &&
              "bg-[var(--color-steel)]",
          )}
        />
      )}
      {children}
    </span>
  );
}
