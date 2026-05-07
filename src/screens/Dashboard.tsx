import { useState } from "react";
import { Sidebar, type NavSection } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { WalletScreen } from "@/screens/WalletScreen";
import { AccountScreen } from "@/screens/AccountScreen";
import { TransactionsScreen } from "@/screens/TransactionsScreen";
import { SorobanScreen } from "@/screens/SorobanScreen";
import { NetworkScreen } from "@/screens/NetworkScreen";

const SCREENS: Record<NavSection, React.ReactNode> = {
  wallet: <WalletScreen />,
  account: <AccountScreen />,
  transactions: <TransactionsScreen />,
  soroban: <SorobanScreen />,
  network: <NetworkScreen />,
};

export function Dashboard() {
  const [activeSection, setActiveSection] = useState<NavSection>("wallet");

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-canvas)]">
      <Sidebar active={activeSection} onNavigate={setActiveSection} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar activeSection={activeSection} />

        <main className="flex-1 overflow-y-auto p-[var(--spacing-xxl)]">
          <div className="max-w-2xl mx-auto">{SCREENS[activeSection]}</div>
        </main>
      </div>
    </div>
  );
}
