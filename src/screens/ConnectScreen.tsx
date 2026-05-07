import { useSorokit } from "@/context/SorokitProvider";
import { Button } from "@/components/ui/Button";

export function ConnectScreen() {
  const { connectWallet, isConnecting, error, clearError } = useSorokit();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-canvas)]">
      <div className="w-full max-w-sm mx-auto px-6 flex flex-col items-center gap-8">
        {/* Logo mark */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-14 h-14 rounded-[var(--rounded-xl)] flex items-center justify-center"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M6 14C6 9.58172 9.58172 6 14 6C18.4183 6 22 9.58172 22 14C22 18.4183 18.4183 22 14 22"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M14 22C11.7909 22 10 20.2091 10 18C10 15.7909 11.7909 14 14 14"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="14" cy="14" r="2" fill="white" />
            </svg>
          </div>
          <div className="text-center">
            <h1 className="text-[var(--font-size-heading-4)] font-semibold text-[var(--color-ink)] leading-[var(--line-height-heading-4)]">
              sorokit
            </h1>
            <p className="text-[var(--font-size-body-sm)] text-[var(--color-steel)] mt-1">
              Stellar control dashboard
            </p>
          </div>
        </div>

        {/* Connect card */}
        <div className="w-full rounded-[var(--rounded-lg)] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-[var(--spacing-xxl)] flex flex-col gap-5 shadow-[var(--shadow-card)]">
          <div>
            <h2 className="text-[var(--font-size-heading-5)] font-semibold text-[var(--color-ink)]">
              Connect Wallet
            </h2>
            <p className="text-[var(--font-size-body-sm)] text-[var(--color-steel)] mt-1 leading-[var(--line-height-body-sm)]">
              Connect your Stellar wallet to access the dashboard
            </p>
          </div>

          {error && (
            <div className="rounded-[var(--rounded-md)] bg-[#fde8e8] border border-[var(--color-semantic-error)]/20 px-3 py-2.5 flex items-start justify-between gap-2">
              <p className="text-[var(--font-size-caption)] text-[var(--color-semantic-error)]">
                {error}
              </p>
              <button
                onClick={clearError}
                className="text-[var(--color-semantic-error)] opacity-60 hover:opacity-100 flex-shrink-0 mt-0.5"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 2L10 10M10 2L2 10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          )}

          <Button
            size="lg"
            loading={isConnecting}
            onClick={connectWallet}
            className="w-full"
          >
            {isConnecting ? "Connecting…" : "Connect Wallet"}
          </Button>

          <p className="text-[var(--font-size-caption)] text-[var(--color-stone)] text-center leading-[var(--line-height-caption)]">
            Powered by sorokit-core · Stellar network
          </p>
        </div>
      </div>
    </div>
  );
}
