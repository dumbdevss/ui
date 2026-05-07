import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "base" | "feature" | "inset";
}

export function Card({
  variant = "base",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--rounded-lg)] border border-[var(--color-hairline)] bg-[var(--color-canvas)]",
        variant === "base" && "p-[var(--spacing-xl)]",
        variant === "feature" && "p-[var(--spacing-xxl)]",
        variant === "inset" &&
          "p-[var(--spacing-md)] bg-[var(--color-surface)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-1 mb-[var(--spacing-md)]", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-[var(--font-size-heading-5)] font-semibold leading-[var(--line-height-heading-5)] text-[var(--color-ink)]",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-[var(--font-size-body-sm)] text-[var(--color-steel)] leading-[var(--line-height-body-sm)]",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 mt-[var(--spacing-md)] pt-[var(--spacing-md)] border-t border-[var(--color-hairline)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
