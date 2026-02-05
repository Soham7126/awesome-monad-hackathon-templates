import { TokenRow } from "./tokens/TokenRow";
import type { Token } from "@/hooks/useTokenBalances";

export function TokenList({
  tokens,
  isLoading,
  error,
  showLowValueTokens = false,
}: {
  tokens: Token[];
  isLoading: boolean;
  error?: string;
  showLowValueTokens?: boolean;
}) {
  if (isLoading) {
    return (
      // Loading state
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">Loading token balances...</p>
      </div>
    );
  }

  if (error) {
    // Check if error is about unsupported chain
    const isUnsupportedChain = error.includes("valid enum value") || error.includes("not supported");
    
    return (
      // Error state
      <div className="flex flex-col items-center justify-center p-12 gap-2">
        <p className="text-destructive font-medium">Error loading tokens</p>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          {isUnsupportedChain 
            ? "This network may not be supported by Moralis API yet. Please try switching to Testnet."
            : error}
        </p>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      // Empty state
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">No tokens found</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {tokens.map((token) => (
        <TokenRow key={token.address} token={token} />
      ))}
    </div>
  );
}
