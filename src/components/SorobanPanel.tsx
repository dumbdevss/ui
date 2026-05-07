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

type InvokeState = "idle" | "loading" | "success" | "error";

export function SorobanPanel() {
  const { isConnected, address } = useSorokit();
  const [contractId, setContractId] = useState("");
  const [method, setMethod] = useState("");
  const [args, setArgs] = useState("");
  const [state, setState] = useState<InvokeState>("idle");
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  const canInvoke = isConnected && contractId.trim() && method.trim();

  async function handleInvoke(e: React.FormEvent) {
    e.preventDefault();
    if (!canInvoke) return;

    setState("loading");
    setError(null);
    setResult(null);

    try {
      const client = getClient();
      let parsedArgs: unknown[] = [];
      if (args.trim()) {
        try {
          parsedArgs = JSON.parse(args.trim());
        } catch {
          setError("Invalid JSON in arguments");
          setState("error");
          return;
        }
      }

      const { data, error: invokeError } = await client.soroban.invokeContract({
        contractId: contractId.trim(),
        method: method.trim(),
        args: parsedArgs,
        sourceAccount: address ?? undefined,
      });

      if (invokeError) {
        setError(invokeError);
        setState("error");
        return;
      }

      setResult(data);
      setState("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setState("error");
    }
  }

  function reset() {
    setState("idle");
    setResult(null);
    setError(null);
  }

  if (!isConnected) {
    return (
      <Card>
        <CardContent>
          <p className="text-[var(--font-size-body-sm)] text-[var(--color-steel)] text-center py-8">
            Connect your wallet to invoke Soroban contracts
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Soroban Contract</CardTitle>
          <Badge variant="teal">Smart Contract</Badge>
        </div>
        <CardDescription>Invoke a Soroban contract method</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleInvoke} className="space-y-4">
          <Input
            label="Contract ID"
            placeholder="C..."
            value={contractId}
            onChange={(e) => setContractId(e.target.value)}
            disabled={state === "loading"}
          />
          <Input
            label="Method"
            placeholder="e.g. transfer, balance, mint"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            disabled={state === "loading"}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-[var(--font-size-body-sm)] font-medium text-[var(--color-charcoal)]">
              Arguments (JSON array, optional)
            </label>
            <textarea
              placeholder='["arg1", "arg2"]'
              value={args}
              onChange={(e) => setArgs(e.target.value)}
              disabled={state === "loading"}
              rows={3}
              className="w-full rounded-[var(--rounded-md)] border border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-[var(--font-size-body-sm)] font-[var(--font-family-mono)] text-[var(--color-ink)] placeholder:text-[var(--color-muted)] outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors resize-none disabled:opacity-50"
            />
          </div>

          {state === "success" && result !== null && (
            <div className="rounded-[var(--rounded-md)] bg-[var(--color-card-tint-mint)] border border-[var(--color-brand-green)]/20 p-3 space-y-2">
              <div className="flex items-center gap-1.5">
                <Badge variant="success" dot>
                  Result
                </Badge>
              </div>
              <pre className="text-[var(--font-size-caption)] font-[var(--font-family-mono)] text-[var(--color-charcoal)] whitespace-pre-wrap break-all">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          {state === "error" && error && (
            <div className="rounded-[var(--rounded-md)] bg-[#fde8e8] border border-[var(--color-semantic-error)]/20 p-3">
              <p className="text-[var(--font-size-caption)] text-[var(--color-semantic-error)]">
                {error}
              </p>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter>
        {(state === "success" || state === "error") && (
          <Button variant="secondary" size="sm" onClick={reset}>
            Clear
          </Button>
        )}
        <Button
          size="md"
          loading={state === "loading"}
          disabled={!canInvoke}
          onClick={handleInvoke as unknown as React.MouseEventHandler}
        >
          {state === "loading" ? "Invoking…" : "Invoke Contract"}
        </Button>
      </CardFooter>
    </Card>
  );
}
