/**
 * SorobanPanel Component
 *
 * Provides a user-friendly interface for interacting with Soroban smart contracts.
 * Handles contract invocation, parameter input, and result display.
 *
 * Features:
 * - Contract ID input with recent-contract suggestions (last 5, localStorage)
 * - Method input with per-contract recent-method suggestions (localStorage)
 * - Arguments input with JSON validation
 * - Invoke / Clear actions
 * - Result block with a "Copy result" button
 *
 * @component
 * @example
 * ```tsx
 * import { SorobanPanel } from 'sorokit-ui';
 *
 * export function App() {
 *   const [contractId, setContractId] = React.useState("");
 *   return <SorobanPanel contractId={contractId} onContractIdChange={setContractId} />;
 * }
 * ```
 *
 * @remarks
 * - Requires SorokitProvider context
 * - Automatically handles wallet connection state
 * - Supports all Soroban contract types
 *
 * @see {@link SorokitProvider} for context setup
 */

import { useRef, useState } from "react";
import { useSorokit } from "@/context/useSorokit";
import { getClient } from "@/lib/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn, friendlyError } from "@/lib/utils";

// ─── localStorage keys ────────────────────────────────────────────────────────

const LS_RECENT_CONTRACTS = "sorokit-recent-contracts";
const LS_RECENT_METHODS = "sorokit-recent-methods";
const MAX_RECENT_CONTRACTS = 5;
const MAX_RECENT_METHODS = 5;

// ─── localStorage helpers ────────────────────────────────────────────────────

function readRecentContracts(): string[] {
  try {
    const raw = localStorage.getItem(LS_RECENT_CONTRACTS);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveRecentContract(contractId: string): void {
  try {
    const existing = readRecentContracts().filter((id) => id !== contractId);
    const updated = [contractId, ...existing].slice(0, MAX_RECENT_CONTRACTS);
    localStorage.setItem(LS_RECENT_CONTRACTS, JSON.stringify(updated));
  } catch {
    // localStorage unavailable — silently ignore
  }
}

function readRecentMethods(contractId: string): string[] {
  try {
    const raw = localStorage.getItem(LS_RECENT_METHODS);
    const all: Record<string, string[]> = raw ? JSON.parse(raw) : {};
    return all[contractId] ?? [];
  } catch {
    return [];
  }
}

function saveRecentMethod(contractId: string, method: string): void {
  try {
    const raw = localStorage.getItem(LS_RECENT_METHODS);
    const all: Record<string, string[]> = raw ? JSON.parse(raw) : {};
    const existing = (all[contractId] ?? []).filter((m) => m !== method);
    all[contractId] = [method, ...existing].slice(0, MAX_RECENT_METHODS);
    localStorage.setItem(LS_RECENT_METHODS, JSON.stringify(all));
  } catch {
    // localStorage unavailable — silently ignore
  }
}

// ─── Types ───────────────────────────────────────────────────────────────────

type InvokeState = "idle" | "loading" | "success" | "error";

interface SorobanPanelProps {
  /** The current contract ID (controlled) */
  contractId: string;
  /** Called when the user edits the contract ID input */
  onContractIdChange: (id: string) => void;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function SorobanPanel({
  contractId,
  onContractIdChange,
  className,
}: SorobanPanelProps) {
  const { isConnected, address } = useSorokit();

  const [method, setMethod] = useState("");
  const [args, setArgs] = useState("");
  const [state, setState] = useState<InvokeState>("idle");
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [argsError, setArgsError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Recent suggestions — re-read from localStorage on each render so they stay
  // fresh after a successful invocation.
  const recentContracts = readRecentContracts();
  const recentMethods = readRecentMethods(contractId);

  const isInvokingRef = useRef(false);

  const canInvoke =
    isConnected &&
    contractId.trim() !== "" &&
    method.trim() !== "" &&
    state !== "loading";

  // ── Invoke ──────────────────────────────────────────────────────────────────

  async function handleInvoke() {
    if (!canInvoke || isInvokingRef.current) return;

    // Validate args JSON
    let parsedArgs: unknown[] = [];
    if (args.trim() !== "") {
      let parsed: unknown;
      try {
        parsed = JSON.parse(args);
      } catch {
        setArgsError("Invalid JSON in arguments");
        return;
      }
      if (!Array.isArray(parsed)) {
        setArgsError("Arguments must be a JSON array");
        return;
      }
      parsedArgs = parsed;
    }

    setArgsError(null);
    isInvokingRef.current = true;
    setState("loading");
    setResult(null);
    setError(null);

    try {
      const { data, error: err } = await getClient().soroban.invokeContract({
        contractId: contractId.trim(),
        method: method.trim(),
        args: parsedArgs,
        sourceAccount: address ?? undefined,
      });

      if (err) {
        setError(typeof err === "string" ? err : String(err));
        setState("error");
        return;
      }

      // Persist history on success
      saveRecentContract(contractId.trim());
      saveRecentMethod(contractId.trim(), method.trim());

      setResult(data);
      setState("success");
    } catch (e) {
      const rawMessage = e instanceof Error ? e.message : "Unknown error";
      setError(friendlyError(rawMessage));
      setState("error");
    } finally {
      isInvokingRef.current = false;
    }
  }

  // ── Clear ───────────────────────────────────────────────────────────────────

  function handleClear() {
    setMethod("");
    setArgs("");
    setState("idle");
    setResult(null);
    setError(null);
    setArgsError(null);
    setCopied(false);
  }

  // ── Copy result ─────────────────────────────────────────────────────────────

  async function handleCopy() {
    if (result === null) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — silently ignore
    }
  }

  const resultJson = result !== null ? JSON.stringify(result, null, 2) : "";

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Contract ID */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="soroban-contract-id"
          className="text-[12px] font-medium text-ink-2"
        >
          Contract ID
        </label>
        <input
          id="soroban-contract-id"
          type="text"
          list="soroban-recent-contracts"
          placeholder="C..."
          value={contractId}
          onChange={(e) => onContractIdChange(e.target.value)}
          className={cn(
            "h-9 w-full rounded-lg border bg-surface-2 px-3.5",
            "text-[13px] text-ink placeholder:text-ink-4",
            "outline-none transition-colors",
            "border-line focus:border-line-2 focus:ring-1 focus:ring-brand-dim",
          )}
        />
        {recentContracts.length > 0 && (
          <datalist id="soroban-recent-contracts">
            {recentContracts.map((id) => (
              <option key={id} value={id} />
            ))}
          </datalist>
        )}
      </div>

      {/* Method */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="soroban-method"
          className="text-[12px] font-medium text-ink-2"
        >
          Method
        </label>
        <input
          id="soroban-method"
          type="text"
          list="soroban-recent-methods"
          placeholder="transfer"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className={cn(
            "h-9 w-full rounded-lg border bg-surface-2 px-3.5",
            "text-[13px] text-ink placeholder:text-ink-4",
            "outline-none transition-colors",
            "border-line focus:border-line-2 focus:ring-1 focus:ring-brand-dim",
          )}
        />
        {recentMethods.length > 0 && (
          <datalist id="soroban-recent-methods">
            {recentMethods.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        )}
      </div>

      {/* Arguments */}
      <Input
        label="Arguments (JSON array)"
        id="soroban-args"
        placeholder='["arg1", 42]'
        value={args}
        onChange={(e) => setArgs(e.target.value)}
        error={argsError ?? undefined}
      />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          disabled={!canInvoke}
          loading={state === "loading"}
          onClick={handleInvoke}
          title={
            !isConnected
              ? "Connect wallet to invoke"
              : !contractId.trim() || !method.trim()
                ? "Enter a contract ID and method"
                : undefined
          }
        >
          {state === "loading" ? "Invoking…" : "Invoke"}
        </Button>

        <Button variant="ghost" size="sm" onClick={handleClear}>
          Clear
        </Button>
      </div>

      {/* Error from invocation */}
      {state === "error" && error && (
        <div className="rounded-lg bg-error-dim-muted border border-error-dim px-4 py-3">
          <p className="text-[11px] text-red">{error}</p>
        </div>
      )}

      {/* Result block */}
      {state === "success" && result !== null && (
        <div className="rounded-lg bg-success-dim-subtle border border-success-dim px-4 py-3">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-4">
              Result
            </p>
            <button
              type="button"
              aria-label="Copy result"
              onClick={handleCopy}
              className="text-[11px] text-ink-3 hover:text-ink-2 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="text-[11px] font-mono text-ink-2 whitespace-pre-wrap break-all">
            {resultJson}
          </pre>
        </div>
      )}

      {!isConnected && (
        <p className="text-[11px] text-ink-3">Connect wallet to invoke</p>
      )}
    </div>
  );
}
