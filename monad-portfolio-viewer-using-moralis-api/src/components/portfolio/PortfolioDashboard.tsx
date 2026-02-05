"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { TokenList } from "./TokenList";
import { SearchBar } from "@/components/ui/SearchBar";
import { Wallet, Search } from "lucide-react";

export function PortfolioDashboard() {
  const { address: connectedAddress, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [searchAddress, setSearchAddress] = useState<string>("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use searched address if available, otherwise use connected wallet address
  const displayAddress = searchAddress || connectedAddress || "";
  const shouldFetch = !!displayAddress;

  const {
    data: tokens = [],
    isLoading,
    error,
  } = useTokenBalances(displayAddress, shouldFetch);

  // Prevent hydration mismatch - don't render until mounted
  if (!mounted) {
    return null;
  }

  return (
    <div className="w-container space-y-8 py-8">
      {/* Search Bar */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Portfolio Viewer</h2>
        </div>
        <SearchBar
          onSearch={(address) => setSearchAddress(address)}
          placeholder="Enter wallet address (0x...)"
        />
        {isConnected && !searchAddress && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wallet className="h-4 w-4" />
            <span>Viewing your connected wallet: {connectedAddress?.slice(0, 6)}...{connectedAddress?.slice(-4)}</span>
          </div>
        )}
        {searchAddress && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Search className="h-4 w-4" />
            <span>Viewing portfolio for: {searchAddress.slice(0, 6)}...{searchAddress.slice(-4)}</span>
            {isConnected && (
              <button
                onClick={() => setSearchAddress("")}
                className="text-primary hover:underline"
              >
                View my wallet instead
              </button>
            )}
          </div>
        )}
      </div>

      {/* Token List */}
      {!displayAddress ? (
        <div className="flex flex-col items-center justify-center p-12 gap-4">
          <Wallet className="h-12 w-12 text-muted-foreground" />
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">No Address Selected</h3>
            <p className="text-muted-foreground">
              {isConnected
                ? "Search for an address above or view your connected wallet"
                : "Connect your wallet or search for an address to view its portfolio"}
            </p>
          </div>
        </div>
      ) : (
        <TokenList
          tokens={tokens}
          isLoading={isLoading}
          error={error?.message}
          showLowValueTokens={false}
        />
      )}
    </div>
  );
}
