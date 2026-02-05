import Image from "next/image";
import type { Token } from "@/hooks/useTokenBalances";

export function TokenRow({ token }: { token: Token }) {
  return (
    <div className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
      {/* Token Info */}
      <div className="col-span-4 flex items-center gap-3">
        {token.logo ? (
          <Image
            src={token.logo}
            alt={token.name}
            width={40}
            height={40}
            className="rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
            {token.symbol.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold truncate">{token.symbol}</p>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {token.name}
          </p>
        </div>
      </div>

      {/* Price */}
      <div className="col-span-2 flex items-center justify-end">
        {token.usdPrice !== undefined && token.usdPrice > 0 ? (
          <p className="text-sm font-medium">
            ${formatCurrency(token.usdPrice, 4)}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">-</p>
        )}
      </div>

      {/* Amount */}
      <div className="col-span-3 flex items-center justify-end">
        <p className="font-medium">{formatCurrency(token.balanceFormatted, 2)}</p>
      </div>

      {/* USD Value */}
      <div className="col-span-3 flex items-center justify-end">
        {token.usdValue !== undefined && token.usdValue > 0 ? (
          <p className="font-semibold text-primary">
            {formatUSD(token.usdValue)}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">-</p>
        )}
      </div>
    </div>
  );
}

// Helper function to format values in the UI
function formatUSD(value: number): string {
  if (value === 0) return "$0.00";
  if (value < 0.01) return "< $0.01";
  if (value < 1) return `$${value.toFixed(4)}`;
  if (value < 1000) return `$${value.toFixed(2)}`;
  if (value < 1000000) return `$${(value / 1000).toFixed(2)}K`;
  return `$${(value / 1000000).toFixed(2)}M`;
}

function formatCurrency(value: number, decimals: number = 2): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
