"use client";

import { useNetwork } from "@/context/NetworkContext";
import { Button } from "./Button";

export function NetworkToggle() {
  const { network, setNetwork } = useNetwork();

  return (
    <div className="inline-flex rounded-md border border-border bg-card p-1">
      <Button
        onClick={() => setNetwork("testnet")}
        variant={network === "testnet" ? "default" : "ghost"}
        size="sm"
        className="text-xs"
      >
        Testnet
      </Button>
      <Button
        onClick={() => setNetwork("mainnet")}
        variant={network === "mainnet" ? "default" : "ghost"}
        size="sm"
        className="text-xs"
      >
        Mainnet
      </Button>
    </div>
  );
}
