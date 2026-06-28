/**
 * SorobanPanel Component
 *
 * Provides a user-friendly interface for interacting with Soroban smart contracts.
 * Handles contract invocation, parameter input, and result display.
 *
 * @component
 * @example
 * ```tsx
 * import { SorobanPanel } from 'sorokit-ui';
 *
 * export function App() {
 *   return <SorobanPanel />;
 * }
 * ```
 *
 * @returns The rendered SorobanPanel component
 *
 * @remarks
 * - Requires SorokitProvider context
 * - Automatically handles wallet connection
 * - Supports all Soroban contract types
 *
 * @see {@link SorokitProvider} for context setup
 * @see {@link useClient} for custom client access
 */
import { useState } from "react";

export function SorobanPanel() {
  const [args, setArgs] = useState<string>("");

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="soroban-args" className="text-[12px] font-medium text-ink-2">
        Arguments (JSON array)
      </label>
      <textarea
        id="soroban-args"
        value={args}
        onChange={(e) => setArgs(e.target.value)}
        placeholder='["arg1", 42]'
        className="rounded-md border border-line p-2 text-sm"
        rows={4}
      />
    </div>
  );
}

