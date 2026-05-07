import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[var(--font-size-body-sm)] font-medium text-[var(--color-charcoal)] leading-[var(--line-height-body-sm)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 w-full rounded-[var(--rounded-md)] border bg-[var(--color-canvas)] px-[var(--spacing-md)]",
            "text-[var(--font-size-body-md)] text-[var(--color-ink)] leading-[var(--line-height-body-md)]",
            "placeholder:text-[var(--color-muted)]",
            "transition-colors outline-none",
            error
              ? "border-[var(--color-semantic-error)] focus:border-[var(--color-semantic-error)] focus:ring-1 focus:ring-[var(--color-semantic-error)]"
              : "border-[var(--color-hairline-strong)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className,
          )}
          {...props}
        />
        {error && (
          <p className="text-[var(--font-size-caption)] text-[var(--color-semantic-error)]">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-[var(--font-size-caption)] text-[var(--color-steel)]">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
