import { TransactionPanel } from "@/components/TransactionPanel";

export function TransactionsScreen() {
  return (
    <div className="space-y-[var(--spacing-xl)]">
      <div>
        <h2 className="text-[var(--font-size-heading-4)] font-semibold text-[var(--color-ink)] leading-[var(--line-height-heading-4)]">
          Transactions
        </h2>
        <p className="text-[var(--font-size-body-sm)] text-[var(--color-steel)] mt-1">
          Submit payments on the Stellar network
        </p>
      </div>
      <TransactionPanel />
    </div>
  );
}
