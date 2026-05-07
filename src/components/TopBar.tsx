import { WalletConnectButton } from "@/components/WalletConnectButton";
import { NetworkSwitcher } from "@/components/NetworkSwitcher";
import { useSorokit } from "@/context/SorokitProvider";
import type { NavSection } from "@/components/Sidebar";

const SECTION_LABELS: Record<NavSection, string> = {
  wallet: "Wallet",
  account: "Account",
  transactions: "Transactions",
  soroban: "Soroban",
  network: "Network",
};

interface TopBarProps {
  activeSection: NavSection;
}

export function TopBar({ activeSection }: TopBarProps) {
  const { error, clearError } = useSorokit();

  return (
    <div className="flex-shrink-0">
      {/* Error banner */}
      {error && (
        <div className="flex items-center justify-between gap-3 px-[var(--spacing-xl)] py-2.5 bg-[#fde8e8] border-b border-[var(--color-semantic-error)]/20">
          <p className="text-[var(--font-size-caption)] text-[var(--color-semantic-error)]">
            {error}
          </p>
          <button
            onClick={clearError}
            className="text-[var(--color-semantic-error)] opacity-60 hover:opacity-100 flex-shrink-0"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 2L10 10M10 2L2 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Main topbar */}
      <header className="h-14 flex items-center justify-between px-[var(--spacing-xl)] border-b border-[var(--color-hairline)] bg-[var(--color-canvas)]">
        <h1 className="text-[var(--font-size-body-md)] font-semibold text-[var(--color-ink)]">
          {SECTION_LABELS[activeSection]}
        </h1>
        <div className="flex items-center gap-2">
          <NetworkSwitcher />
          <WalletConnectButton />
        </div>
      </header>
    </div>
  );
}
