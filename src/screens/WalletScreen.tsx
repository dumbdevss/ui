import { useSorokit } from "@/context/SorokitProvider";
import { AccountCard } from "@/components/AccountCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { truncateAddress } from "@/lib/utils";

export function WalletScreen() {
  const { address, isConnected, disconnectWallet, network } = useSorokit();

  return (
    <div className="space-y-[var(--spacing-xl)]">
      <div>
        <h2 className="text-[var(--font-size-heading-4)] font-semibold text-[var(--color-ink)] leading-[var(--line-height-heading-4)]">
          Wallet
        </h2>
        <p className="text-[var(--font-size-body-sm)] text-[var(--color-steel)] mt-1">
          Manage your connected wallet
        </p>
      </div>

      {/* Status card */}
      <div className="rounded-[var(--rounded-lg)] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-[var(--spacing-xl)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0">
              {address ? address.slice(0, 2) : "??"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--font-size-body-sm)] font-medium text-[var(--color-charcoal)]">
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
                <Badge variant={isConnected ? "success" : "default"} dot>
                  {isConnected ? "Active" : "Inactive"}
                </Badge>
              </div>
              {address && (
                <span
                  data-address
                  className="text-[var(--font-size-caption)] text-[var(--color-slate)]"
                >
                  {truncateAddress(address, 12, 6)}
                </span>
              )}
            </div>
          </div>
          {isConnected && (
            <Button variant="secondary" size="sm" onClick={disconnectWallet}>
              Disconnect
            </Button>
          )}
        </div>

        {network && (
          <div className="mt-4 pt-4 border-t border-[var(--color-hairline)] flex items-center gap-4 flex-wrap">
            <InfoItem label="Network" value={network.name} />
            <InfoItem label="RPC" value={network.rpcUrl} mono />
          </div>
        )}
      </div>

      <AccountCard />
    </div>
  );
}

function InfoItem({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-semibold uppercase tracking-[1px] text-[var(--color-stone)]">
        {label}
      </span>
      <span
        className={`text-[var(--font-size-caption)] text-[var(--color-charcoal)] ${mono ? "font-[var(--font-family-mono)]" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
