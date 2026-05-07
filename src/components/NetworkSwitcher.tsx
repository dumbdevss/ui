import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSorokit } from "@/context/SorokitProvider";
import { cn } from "@/lib/utils";
import type { NetworkName } from "@/lib/client";

const NETWORKS: { name: NetworkName; label: string; color: string }[] = [
  { name: "mainnet", label: "Mainnet", color: "var(--color-brand-green)" },
  { name: "testnet", label: "Testnet", color: "var(--color-brand-orange)" },
  { name: "futurenet", label: "Futurenet", color: "var(--color-brand-purple)" },
  { name: "localnet", label: "Localnet", color: "var(--color-steel)" },
];

export function NetworkSwitcher() {
  const { network, switchNetwork } = useSorokit();

  const current = NETWORKS.find((n) => n.name === network?.name) ?? NETWORKS[1];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "inline-flex items-center gap-1.5 h-7 px-3 rounded-[var(--rounded-md)]",
            "text-[var(--font-size-caption)] font-medium text-[var(--color-charcoal)]",
            "bg-[var(--color-surface)] border border-[var(--color-hairline)]",
            "hover:bg-[var(--color-hairline-soft)] transition-colors cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
          )}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: current.color }}
          />
          {current.label}
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            className="opacity-50"
          >
            <path
              d="M2 3.5L5 6.5L8 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className={cn(
            "z-50 min-w-[160px] rounded-[var(--rounded-lg)] border border-[var(--color-hairline)]",
            "bg-[var(--color-canvas)] p-1",
            "shadow-[var(--shadow-modal)]",
            "animate-in fade-in-0 zoom-in-95",
          )}
        >
          {NETWORKS.map((net) => (
            <DropdownMenu.Item
              key={net.name}
              onSelect={() => switchNetwork(net.name)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-[var(--rounded-sm)]",
                "text-[var(--font-size-body-sm)] text-[var(--color-charcoal)] cursor-pointer",
                "hover:bg-[var(--color-surface)] outline-none transition-colors",
                network?.name === net.name &&
                  "bg-[var(--color-surface)] font-medium",
              )}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: net.color }}
              />
              {net.label}
              {network?.name === net.name && (
                <svg
                  className="ml-auto"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M2 6L5 9L10 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
