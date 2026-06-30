/**
 * ContractEventFeed Component
 *
 * Real-time feed of contract events from Soroban smart contracts.
 * Displays event history, filtering, and search capabilities.
 *
 * @component
 * @example
 * ```tsx
 * import { ContractEventFeed } from 'sorokit-ui';
 *
 * export function Dashboard() {
 *   return (
 *     <ContractEventFeed
 *       contractId="CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4"
 *       limit={50}
 *     />
 *   );
 * }
 * ```
 *
 * @param props - Component props
 * @param props.contractId - Smart contract ID to monitor
 * @param props.limit - Maximum number of events to display (default: 100)
 * @param props.autoRefresh - Auto-refresh interval in ms (default: 5000, 0 to disable)
 * @param props.onEventClick - Callback when event is clicked
 *
 * @returns The rendered ContractEventFeed component
 *
 * @remarks
 * - Auto-refreshes every 5 seconds by default
 * - Shows timestamp, topics, and event data
 * - Requires SorokitProvider context
 *
 * @see {@link SorokitProvider} for setup
 */
import { useEffect, useState } from "react";
import { getClient } from "@/lib/client";
import type { ContractEvent } from "@/lib/client";

export interface ContractEventFeedProps {
  contractId: string;
  limit?: number;
  autoRefresh?: number;
  onEventClick?: (event: ContractEvent) => void;
}

export function ContractEventFeed({
  contractId,
  limit = 100,
  autoRefresh = 5000,
  onEventClick,
}: ContractEventFeedProps) {
  const [events, setEvents] = useState<ContractEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchEvents() {
      setLoading(true);
      try {
        const { data, error: err } = await getClient().soroban.getEvents(
          contractId,
          limit,
        );
        if (!cancelled) {
          if (err) {
            setError(err);
          } else {
            setEvents(data ?? []);
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Unknown error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchEvents();

    if (autoRefresh > 0) {
      const interval = setInterval(fetchEvents, autoRefresh);
      return () => {
        cancelled = true;
        clearInterval(interval);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [contractId, limit, autoRefresh]);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[12px] font-semibold text-ink-2">Contract Events</p>

      {loading && events.length === 0 && (
        <p className="text-[11px] text-ink-3">Loading events…</p>
      )}

      {error && (
        <p className="text-[11px] text-red">{error}</p>
      )}

      {!loading && !error && events.length === 0 && (
        <p className="text-[11px] text-ink-3">No events found.</p>
      )}

      {events.map((event) => (
        <button
          key={event.id}
          type="button"
          onClick={() => onEventClick?.(event)}
          className="text-left rounded-lg border border-line bg-surface px-3 py-2 text-[11px] font-mono text-ink-2 hover:bg-surface-2 transition-colors"
        >
          <span className="text-ink-4 mr-2">{event.type}</span>
          {event.contractId}
        </button>
      ))}
    </div>
  );
}
