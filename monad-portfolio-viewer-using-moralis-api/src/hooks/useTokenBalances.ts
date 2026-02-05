"use client";

import { useQuery } from "@tanstack/react-query";
import { useNetwork } from "@/context/NetworkContext";

type Token = {
  address: string;
  name: string;
  symbol: string;
  logo?: string;
  decimals: number;
  balance: string;
  balanceFormatted: number;
  usdPrice?: number;
  usdValue?: number;
  isNative: boolean;
  isSpam?: boolean;
  verified?: boolean;
};

async function fetchTokenBalances(address: string, chainId: string): Promise<Token[]> {
  const response = await fetch(
    `/api/wallet/balances?address=${address}&chain=${chainId}`
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to fetch token balances");
  }

  const data = await response.json();

  // Check if data exists
  if (!data) {
    return [];
  }

  // Handle both response formats: direct array or object with result property
  const tokens = Array.isArray(data) ? data : data.result;

  if (!tokens || !Array.isArray(tokens)) {
    return [];
  }

  // Transform Moralis data to our Token type
  return tokens.map((token: any) => {
    const balanceFormatted = parseFloat(
      formatTokenBalance(token.balance, token.decimals)
    );

    // Calculate USD value if we have price but not value
    const usdValue = token.usd_value !== undefined
      ? token.usd_value
      : token.usd_price !== undefined
        ? token.usd_price * balanceFormatted
        : undefined;

    return {
      address: token.token_address,
      name: token.name,
      symbol: token.symbol,
      logo: token.logo || token.thumbnail,
      decimals: token.decimals,
      balance: token.balance,
      balanceFormatted,
      usdPrice: token.usd_price,
      usdValue,
      isNative: token.native_token || false,
      isSpam: token.possible_spam,
      verified: token.verified_contract,
    };
  });
}

export function useTokenBalances(address?: string, enabled: boolean = true) {
  const { chainId } = useNetwork();
  
  return useQuery({
    queryKey: ["tokenBalances", address, chainId],
    queryFn: () => fetchTokenBalances(address!, chainId),
    enabled: enabled && !!address,
    staleTime: 30000, // 30 seconds
  });
}

function formatTokenBalance(
  balance: string | number,
  decimals: number = 18
): string {
  const balanceNum = typeof balance === "string" ? parseFloat(balance) : balance;
  const divisor = Math.pow(10, decimals);
  const formattedBalance = balanceNum / divisor;

  // Show more decimals for small amounts
  if (formattedBalance < 0.01) {
    return formattedBalance.toFixed(6);
  } else if (formattedBalance < 1) {
    return formattedBalance.toFixed(4);
  } else {
    return formattedBalance.toFixed(2);
  }
}

export type { Token };
