import { Skeleton } from "@/components/ui/Skeleton";
import type { Balance } from "@/lib/client";
import { cn, truncateAddress } from "@/lib/utils";

const ASSET_COLORS: Record<string, { bg: string; text: string }> = {
  XLM: { bg: "bg-[rgba(20,184,166,0.12)]", text: "text-teal" },
  USDC: { bg: "bg-[rgba(86,69,212,0.12)]", text: "text-brand" },
  USDT: { bg: "bg-success-dim-strong", text: "text-green" },
  BTC: { bg: "bg-[rgba(249,115,22,0.12)]", text: "text-orange" },
  ETH: { bg: "bg-[rgba(168,85,247,0.12)]", text: "text-purple" },
};

function getAssetColor(code: string) {
  return ASSET_COLORS[code] ?? { bg: "bg-surface-2", text: "text-ink-2" };
}

interface AssetBadgeProps {
  balance: Balance;
  showIssuer?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AssetBadge({
  balance,
  showIssuer = true,
  size = "md",
  className,
}: AssetBadgeProps) {
  const code =
    balance.assetType === "native"
      ? "XLM"
      : (balance.assetCode ?? balance.asset);
  const { bg, text } = getAssetColor(code);

  const iconSize =
    size === "sm"
      ? "w-6 h-6 text-[9px]"
      : size === "lg"
        ? "w-10 h-10 text-[13px]"
        : "w-8 h-8 text-[11px]";
  const labelSize =
    size === "sm"
      ? "text-[11px]"
      : size === "lg"
        ? "text-[14px]"
        : "text-[13px]";
  const subSize = size === "sm" ? "text-[10px]" : "text-[11px]";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "rounded-full flex items-center justify-center font-bold shrink-0",
          iconSize,
          bg,
          text,
        )}
      >
        {code.slice(0, 2)}
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className={cn("font-medium text-ink leading-none", labelSize)}>
          {code}
        </span>
        {showIssuer &&
          (balance.assetType === "native" ? (
            <span className={cn("text-ink-3", subSize)}>Stellar Lumens</span>
          ) : balance.assetIssuer ? (
            <span data-address className={subSize}>
              {truncateAddress(balance.assetIssuer, 6, 4)}
            </span>
          ) : null)}
      </div>
    </div>
  );
}

/** Skeleton placeholder matching AssetBadge + amount (card row layout) */
export function AssetRowSkeleton() {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-line last:border-0">
      <div className="flex items-center gap-2.5">
        <Skeleton circle className="w-8 h-8" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3.5 w-14" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

/** Inline pill version — just the code with colored dot */
export function AssetPill({
  assetCode,
  className,
}: {
  assetCode: string;
  className?: string;
}) {
  const { bg, text } = getAssetColor(assetCode);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border border-line-2",
        bg,
        text,
        className,
      )}
    >
      {assetCode}
    </span>
  );
}
