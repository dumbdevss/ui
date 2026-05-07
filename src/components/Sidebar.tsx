import { cn } from "@/lib/utils";
import { useSorokit } from "@/context/SorokitProvider";
import { AccountCardCompact } from "@/components/AccountCard";

export type NavSection =
  | "wallet"
  | "account"
  | "transactions"
  | "soroban"
  | "network";

const NAV_ITEMS: { id: NavSection; label: string; icon: React.ReactNode }[] = [
  {
    id: "wallet",
    label: "Wallet",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect
          x="1.5"
          y="4.5"
          width="13"
          height="9"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M1.5 7.5H14.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M4.5 2.5L11.5 2.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="11" cy="10" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "account",
    label: "Account",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle
          cx="8"
          cy="5.5"
          r="2.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M2.5 13.5C2.5 11.0147 5.01472 9 8 9C10.9853 9 13.5 11.0147 13.5 13.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "transactions",
    label: "Transactions",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M2 5.5H14M10.5 2.5L13.5 5.5L10.5 8.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 10.5H2M5.5 7.5L2.5 10.5L5.5 13.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "soroban",
    label: "Soroban",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M5 3L2 8L5 13"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 3L14 8L11 13"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 2.5L6.5 13.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "network",
    label: "Network",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M8 2.5C8 2.5 10.5 5 10.5 8C10.5 11 8 13.5 8 13.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M8 2.5C8 2.5 5.5 5 5.5 8C5.5 11 8 13.5 8 13.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M2.5 8H13.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

interface SidebarProps {
  active: NavSection;
  onNavigate: (section: NavSection) => void;
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
  const { isConnected } = useSorokit();

  return (
    <aside className="w-56 flex-shrink-0 h-full flex flex-col border-r border-[var(--color-hairline)] bg-[var(--color-surface-soft)]">
      {/* Logo */}
      <div className="h-14 flex items-center px-[var(--spacing-md)] border-b border-[var(--color-hairline)] flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[var(--rounded-sm)] bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 7C3 4.79086 4.79086 3 7 3C9.20914 3 11 4.79086 11 7C11 9.20914 9.20914 11 7 11"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M7 11C5.89543 11 5 10.1046 5 9C5 7.89543 5.89543 7 7 7"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="7" cy="7" r="1" fill="white" />
            </svg>
          </div>
          <span className="text-[var(--font-size-body-sm)] font-semibold text-[var(--color-ink)]">
            sorokit
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-[var(--spacing-sm)] px-[var(--spacing-xs)]">
        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-[var(--rounded-md)] text-left transition-colors cursor-pointer",
                "text-[var(--font-size-body-sm)] leading-[var(--line-height-body-sm)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
                active === item.id
                  ? "bg-[var(--color-canvas)] text-[var(--color-ink)] font-medium shadow-[var(--shadow-subtle)] border border-[var(--color-hairline)]"
                  : "text-[var(--color-steel)] hover:bg-[var(--color-hairline-soft)] hover:text-[var(--color-charcoal)]",
              )}
            >
              <span
                className={cn(
                  active === item.id ? "text-[var(--color-primary)]" : "",
                )}
              >
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Bottom — wallet compact */}
      {isConnected && (
        <div className="p-[var(--spacing-sm)] border-t border-[var(--color-hairline)] flex-shrink-0">
          <AccountCardCompact />
        </div>
      )}
    </aside>
  );
}
