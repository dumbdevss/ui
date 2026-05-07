import { SorobanPanel } from "@/components/SorobanPanel";

export function SorobanScreen() {
  return (
    <div className="space-y-[var(--spacing-xl)]">
      <div>
        <h2 className="text-[var(--font-size-heading-4)] font-semibold text-[var(--color-ink)] leading-[var(--line-height-heading-4)]">
          Soroban
        </h2>
        <p className="text-[var(--font-size-body-sm)] text-[var(--color-steel)] mt-1">
          Invoke smart contracts on the Stellar network
        </p>
      </div>
      <SorobanPanel />
    </div>
  );
}
