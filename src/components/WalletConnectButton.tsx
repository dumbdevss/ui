import { useSorokit } from "@/context/SorokitProvider";
import { Button } from "@/components/ui/Button";
import { truncateAddress } from "@/lib/utils";

interface WalletConnectButtonProps {
  onOpenModal?: () => void;
}

export function WalletConnectButton({ onOpenModal }: WalletConnectButtonProps) {
  const { isConnected, isConnecting, address, connectWallet } = useSorokit();

  if (isConnected && address) {
    return (
      <Button variant="secondary" size="sm" onClick={onOpenModal}>
        <span className="w-2 h-2 rounded-full bg-[var(--color-brand-green)] flex-shrink-0" />
        <span
          data-address
          className="font-[var(--font-family-mono)] text-[var(--font-size-caption)]"
        >
          {truncateAddress(address)}
        </span>
      </Button>
    );
  }

  return (
    <Button
      variant="primary"
      size="sm"
      loading={isConnecting}
      onClick={connectWallet}
    >
      {isConnecting ? "Connecting…" : "Connect Wallet"}
    </Button>
  );
}
