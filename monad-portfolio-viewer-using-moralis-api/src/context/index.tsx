"use client";

import { wagmiAdapter, projectId } from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { monad } from "@reown/appkit/networks";
import React, { type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { NetworkProvider } from "./NetworkContext";

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("NEXT_PUBLIC_PROJECT_ID is not set");
}

// Set up metadata
const metadata = {
  name: "Portfolio Viewer",
  description: "View your crypto portfolio on Monad blockchain",
  url: "your-app-url",
  icons: ["your-app-icon"],
};

// Create and initialize the AppKit modal
// Note: The modal variable is intentionally unused - creating it initializes AppKit globally
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [monad],
  defaultNetwork: monad,
  metadata: metadata,
  features: {
    analytics: true,
  },
});

export function ContextProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <NetworkProvider>{children}</NetworkProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
