"use client";

import { useAppKit, useAppKitAccount, useDisconnect } from "@reown/appkit/react";
import { Button } from "@/components/ui/Button";
import { ConnectIcon } from "@/components/ui/ConnectIcon";

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function ConnectButton() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="inline-flex rounded-md shadow-sm">
        <a
          href={`https://monadvision.com/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-8 h-10 bg-primary text-primary-foreground rounded-l-md font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          {formatAddress(address)}
        </a>
        <Button
          onClick={() => disconnect()}
          size="icon"
          className="h-10 w-10 rounded-l-none border-l border-primary-foreground/20"
        >
          <ConnectIcon size={16} />
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => open()}
      size="lg"
      className="font-semibold shadow-sm gap-2"
    >
      <ConnectIcon size={20} />
      Connect Wallet
    </Button>
  );
}
