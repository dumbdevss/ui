import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "destructive" | "link";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
  loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-primary-pressed)] active:bg-[var(--color-primary-deep)]",
  secondary:
    "bg-transparent text-[var(--color-ink)] border border-[var(--color-hairline-strong)] hover:bg-[var(--color-surface)]",
  ghost:
    "bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-surface)]",
  destructive: "bg-[var(--color-semantic-error)] text-white hover:opacity-90",
  link: "bg-transparent text-[var(--color-link-blue)] underline-offset-4 hover:underline p-0 h-auto",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-8 px-3 text-[var(--font-size-caption)]",
  md: "h-9 px-[18px] text-[var(--font-size-button-md)]",
  lg: "h-11 px-6 text-[var(--font-size-body-md)]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      asChild = false,
      loading = false,
      className,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-colors cursor-pointer select-none",
          "rounded-[var(--rounded-md)] leading-[var(--line-height-button-md)]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-1",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {loading && (
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </Comp>
    );
  },
);

Button.displayName = "Button";
