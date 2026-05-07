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

export function AccountCard() {
  const { address, account, isLoadingAccount } = useSorokit();

  if (!address) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Account</CardTitle>
          <Badge variant="success" dot>
            Active
          </Badge>
        </div>
        <CardDescription>Stellar account details</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingAccount ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-4 rounded bg-[var(--color-surface)] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <Row label="Address">
              <span
                data-address
                className="text-[var(--font-size-caption)] text-[var(--color-slate)] break-all"
              >
                {address}
              </span>
            </Row>
            {account && (
              <>
                <Row label="Sequence">
                  <span className="font-mono text-[var(--font-size-caption)] text-[var(--color-charcoal)]">
                    {account.sequence}
                  </span>
                </Row>
                <Row label="Subentries">
                  <span className="text-[var(--font-size-body-sm)] text-[var(--color-charcoal)]">
                    {account.subentryCount}
                  </span>
                </Row>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-micro-uppercase text-[var(--color-stone)] text-[11px] font-semibold tracking-[1px] uppercase">
        {label}
      </span>
      {children}
    </div>
  );
}

export function AccountCardCompact() {
  const { address } = useSorokit();
  if (!address) return null;
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-[var(--rounded-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)]">
      <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
        {address.slice(0, 2)}
      </div>
      <span
        data-address
        className="text-[var(--font-size-caption)] text-[var(--color-charcoal)]"
      >
        {truncateAddress(address)}
      </span>
    </div>
  );
}
