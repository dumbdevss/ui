import { useSorokit } from "@/context/SorokitProvider";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { NetworkName } from "@/lib/client";

const NETWORKS: {
  name: NetworkName;
  label: string;
  description: string;
  color: string;
  badgeVariant: "success" | "warning" | "purple" | "default";
}[] = [
  {
    name: "mainnet",
    label: "Mainnet",
    description: "Public Global Stellar Network — real assets",
    color: "var(--color-brand-green)",
    badgeVariant: "success",
  },
  {
    name: "testnet",
    label: "Testnet",
    description: "Test SDF Network — free test XLM via Friendbot",
    color: "var(--color-brand-orange)",
    badgeVariant: "warning",
  },
  {
    name: "futurenet",
    label: "Futurenet",
    description: "Test SDF Future Network — bleeding edge features",
    color: "var(--color-brand-purple)",
    badgeVariant: "purple",
  },
  {
    name: "localnet",
    label: "Localnet",
    description: "Local development network — requires local node",
    color: "var(--color-steel)",
    badgeVariant: "default",
  },
];

export function NetworkScreen() {
  const { network, switchNetwork } = useSorokit();

  return (
    <div className="space-y-[var(--spacing-xl)]">
      <div>
        <h2 className="text-[var(--font-size-heading-4)] font-semibold text-[var(--color-ink)] leading-[var(--line-height-heading-4)]">
          Network
        </h2>
        <p className="text-[var(--font-size-body-sm)] text-[var(--color-steel)] mt-1">
          Switch between Stellar networks
        </p>
      </div>

      {/* Current network info */}
      {network && (
        <div className="rounded-[var(--rounded-lg)] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-[var(--spacing-xl)] space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[1px] text-[var(--color-stone)]">
            Active Network
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow label="Name" value={network.name} />
            <InfoRow label="Passphrase" value={network.passphrase} mono />
            <InfoRow label="RPC URL" value={network.rpcUrl} mono />
            <InfoRow label="Horizon URL" value={network.horizonUrl} mono />
          </div>
        </div>
      )}

      {/* Network selector */}
      <div className="grid gap-3">
        {NETWORKS.map((net) => {
          const isActive = network?.name === net.name;
          return (
            <button
              key={net.name}
              onClick={() => switchNetwork(net.name)}
              className={cn(
                "w-full text-left rounded-[var(--rounded-lg)] border p-[var(--spacing-xl)] transition-colors cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
                isActive
                  ? "border-[var(--color-primary)] bg-[var(--color-card-tint-lavender)]"
                  : "border-[var(--color-hairline)] bg-[var(--color-canvas)] hover:bg-[var(--color-surface)]",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: net.color }}
                  />
                  <div>
                    <p className="text-[var(--font-size-body-sm)] font-medium text-[var(--color-charcoal)]">
                      {net.label}
                    </p>
                    <p className="text-[var(--font-size-caption)] text-[var(--color-steel)] mt-0.5">
                      {net.description}
                    </p>
                  </div>
                </div>
                {isActive && (
                  <Badge variant={net.badgeVariant} dot>
                    Active
                  </Badge>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function InfoRow({
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
        className={cn(
          "text-[var(--font-size-caption)] text-[var(--color-charcoal)] break-all",
          mono && "font-[var(--font-family-mono)]",
        )}
      >
        {value}
      </span>
    </div>
  );
}
