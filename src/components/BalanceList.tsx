import { useSorokit } from "@/context/SorokitProvider";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { truncateAddress } from "@/lib/utils";
import type { Balance } from "@/lib/client";

function AssetBadge({ balance }: { balance: Balance }) {
  const symbol =
    balance.assetType === "native"
      ? "XLM"
      : (balance.assetCode ?? balance.asset);
  const isNative = balance.assetType === "native";

  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--color-hairline-soft)] last:border-0">
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
          style={{
            backgroundColor: isNative
              ? "var(--color-card-tint-sky)"
              : "var(--color-card-tint-lavender)",
            color: isNative
              ? "var(--color-brand-teal)"
              : "var(--color-brand-purple)",
          }}
        >
          {symbol.slice(0, 2)}
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[var(--font-size-body-sm)] font-medium text-[var(--color-charcoal)]">
            {symbol}
          </span>
          {balance.assetIssuer && (
            <span
              data-address
              className="text-[11px] text-[var(--color-stone)]"
            >
              {truncateAddress(balance.assetIssuer, 8, 4)}
            </span>
          )}
          {isNative && (
            <span className="text-[11px] text-[var(--color-stone)]">
              Stellar Lumens
            </span>
          )}
        </div>
      </div>
      <div className="text-right">
        <span className="text-[var(--font-size-body-sm)] font-medium text-[var(--color-ink)]">
          {parseFloat(balance.balance).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 7,
          })}
        </span>
      </div>
    </div>
  );
}

export function BalanceList() {
  const { balances, isLoadingAccount, isConnected } = useSorokit();

  if (!isConnected) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Assets</CardTitle>
          {!isLoadingAccount && (
            <Badge variant="outline">{balances.length} assets</Badge>
          )}
        </div>
        <CardDescription>Token balances on this account</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingAccount ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-surface)] animate-pulse" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-24 rounded bg-[var(--color-surface)] animate-pulse" />
                  <div className="h-3 w-32 rounded bg-[var(--color-surface)] animate-pulse" />
                </div>
                <div className="h-3.5 w-16 rounded bg-[var(--color-surface)] animate-pulse" />
              </div>
            ))}
          </div>
        ) : balances.length === 0 ? (
          <p className="text-[var(--font-size-body-sm)] text-[var(--color-steel)] text-center py-4">
            No assets found
          </p>
        ) : (
          <div>
            {balances.map((b) => (
              <AssetBadge key={b.asset} balance={b} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
