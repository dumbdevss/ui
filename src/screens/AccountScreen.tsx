import { AccountCard } from "@/components/AccountCard";
import { BalanceList } from "@/components/BalanceList";
import { useSorokit } from "@/context/SorokitProvider";

export function AccountScreen() {
  const { isConnected } = useSorokit();

  return (
    <div className="space-y-[var(--spacing-xl)]">
      <div>
        <h2 className="text-[var(--font-size-heading-4)] font-semibold text-[var(--color-ink)] leading-[var(--line-height-heading-4)]">
          Account
        </h2>
        <p className="text-[var(--font-size-body-sm)] text-[var(--color-steel)] mt-1">
          Account details and asset balances
        </p>
      </div>

      {!isConnected ? (
        <div className="rounded-[var(--rounded-lg)] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-[var(--spacing-xxl)] text-center">
          <p className="text-[var(--font-size-body-sm)] text-[var(--color-steel)]">
            Connect your wallet to view account details
          </p>
        </div>
      ) : (
        <div className="grid gap-[var(--spacing-xl)]">
          <AccountCard />
          <BalanceList />
        </div>
      )}
    </div>
  );
}
