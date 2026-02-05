"use client";

import { ConnectButton } from "../wallet/ConnectButton";
import { NetworkToggle } from "../ui/NetworkToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="w-container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-foreground">
            Portfolio App
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <NetworkToggle />
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
