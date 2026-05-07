import { useState } from "react";
import { useSorokit } from "@/context/SorokitProvider";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { getClient } from "@/lib/client";
import type { TxResult } from "@/lib/client";

type TxState = "idle" | "loading" | "success" | "error";

export function TransactionPanel() {
  const { address, isConnected } = useSorokit();
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [txState, setTxState] = useState<TxState>("idle");
  const [result, setResult] = useState<TxResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    isConnected &&
    destination.trim() &&
    amount.trim() &&
    parseFloat(amount) > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setTxState("loading");
    setError(null);
    setResult(null);

    try {
      const client = getClient();
      const { data, error: txError } = await client.transaction.submit({
        source: address,
        destination: destination.trim(),
        amount: amount.trim(),
        memo: memo.trim() || undefined,
        asset: "XLM",
      });

      if (txError) {
        setError(txError);
        setTxState("error");
        return;
      }

      setResult(data);
      setTxState("success");
      setDestination("");
      setAmount("");
      setMemo("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setTxState("error");
    }
  }

  function reset() {
    setTxState("idle");
    setResult(null);
    setError(null);
  }

  if (!isConnected) {
    return (
      <Card>
        <CardContent>
          <p className="text-[var(--font-size-body-sm)] text-[var(--color-steel)] text-center py-8">
            Connect your wallet to send transactions
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Transaction</CardTitle>
        <CardDescription>
          Submit a payment on the Stellar network
        </CardDescription>
      </CardHeader>
      <CardContent>
        {txState === "success" && result ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--color-card-tint-mint)] flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8L6.5 11.5L13 4.5"
                    stroke="var(--color-brand-green)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[var(--font-size-body-sm)] font-medium text-[var(--color-charcoal)]">
                  Transaction submitted
                </p>
                <p className="text-[var(--font-size-caption)] text-[var(--color-steel)]">
                  Ledger #{result.ledger}
                </p>
              </div>
            </div>
            <div className="rounded-[var(--rounded-md)] bg-[var(--color-surface)] p-3 space-y-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-semibold uppercase tracking-[1px] text-[var(--color-stone)]">
                  Tx Hash
                </span>
                <span
                  data-txhash
                  className="text-[var(--font-size-caption)] text-[var(--color-slate)] break-all"
                >
                  {result.hash}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success" dot>
                  Successful
                </Badge>
              </div>
            </div>
          </div>
        ) : txState === "error" ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#fde8e8] flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 5V8M8 11H8.01"
                    stroke="var(--color-semantic-error)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="8"
                    cy="8"
                    r="6"
                    stroke="var(--color-semantic-error)"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[var(--font-size-body-sm)] font-medium text-[var(--color-charcoal)]">
                  Transaction failed
                </p>
                <p className="text-[var(--font-size-caption)] text-[var(--color-semantic-error)]">
                  {error}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Destination Address"
              placeholder="G..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              disabled={txState === "loading"}
            />
            <Input
              label="Amount (XLM)"
              type="number"
              placeholder="0.0000000"
              min="0.0000001"
              step="0.0000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={txState === "loading"}
            />
            <Input
              label="Memo (optional)"
              placeholder="Text memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              disabled={txState === "loading"}
            />
          </form>
        )}
      </CardContent>
      <CardFooter>
        {txState === "success" || txState === "error" ? (
          <Button variant="secondary" size="sm" onClick={reset}>
            New Transaction
          </Button>
        ) : (
          <Button
            size="md"
            loading={txState === "loading"}
            disabled={!canSubmit}
            onClick={handleSubmit as unknown as React.MouseEventHandler}
          >
            {txState === "loading" ? "Submitting…" : "Send"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
