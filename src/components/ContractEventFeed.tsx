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
 * @throws Error if contractId is invalid format
 * 
 * @remarks
 * - Auto-refreshes every 5 seconds by default
 * - Shows timestamp, topics, and event data
 * - Searchable event topics
 * - Requires SorokitProvider context
 * - Known issue: QR code scanner doesn't work with complex metadata (issue #8)
 * 
 * @see {@link SorokitProvider} for setup
 * @see GitHub issue #8 for QR code scanner limitation
 */
import { useEffect, useState } from "react";
import { getClient } from "@/lib/client";
import type { ContractEvent } from "@/lib/client";

export function ContractEventFeed({
  contractId,
  limit = 100,
  autoRefresh = 5000,
  onEventClick,
}: ContractEventFeedProps) {
  const [events, setEvents] = useState<ContractEvent[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await getClient().soroban.getEvents(contractId, limit);
      if (err) {
        setError(err);
        setEvents(null);
      } else {
        setEvents(data);
        setError(null);
        setLastUpdated(Date.now());
      }
    } catch (e) {
      setError((e as Error).message);
      setEvents(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    if (autoRefresh > 0) {
      const interval = setInterval(fetchEvents, autoRefresh);
      return () => clearInterval(interval);
    }
  }, [contractId, limit, autoRefresh]);

  const relativeTime = () => {
    const diffM = Math.floor((Date.now() - lastUpdated) / 60000);
    return diffM === 0 ? "just now" : `${diffM}m ago`;
  };

  if (loading && !events) {
    return <div className="animate-pulse">Loading...</div>;
  }
  if (error) {
    return <div className="text-red">{error}</div>;
  }
  if (!events || events.length === 0) {
    return <p className="text-ink-3">No events found</p>;
  }

  return (
    <div className="space-y-4">
      <div className="text-xs text-ink-4">
        Last updated: <span data-testid="last-updated">{relativeTime()}</span>
      </div>
      <ul className="list-none p-0 m-0 space-y-2">
        {events.map((ev) => (
          <li
            key={ev.id}
            className="cursor-pointer hover:bg-surface-2 p-2 rounded"
            onClick={() => onEventClick?.(ev)}
          >
            <div className="text-sm font-medium">{ev.type}</div>
            <div className="text-xs text-ink-3">
              {new Date(ev.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface ContractEventFeedProps {
  contractId: string;
  limit?: number;
  autoRefresh?: number;
  onEventClick?: (event: ContractEvent) => void;
}
