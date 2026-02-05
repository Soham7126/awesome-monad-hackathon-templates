"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Network = "mainnet" | "testnet";

interface NetworkContextType {
  network: Network;
  setNetwork: (network: Network) => void;
  chainId: string;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [network, setNetworkState] = useState<Network>("testnet");

  // Load network preference from localStorage
  useEffect(() => {
    const savedNetwork = localStorage.getItem("monad-network") as Network | null;
    if (savedNetwork === "mainnet" || savedNetwork === "testnet") {
      setNetworkState(savedNetwork);
    }
  }, []);

  // Save network preference to localStorage
  const setNetwork = (newNetwork: Network) => {
    setNetworkState(newNetwork);
    localStorage.setItem("monad-network", newNetwork);
  };

  // Chain IDs for Moralis API:
  // Testnet: "143" (0x8f in hex) - Monad Testnet
  // Mainnet: "monad" - Monad Mainnet (Moralis uses chain name for mainnet)
  const chainId = network === "mainnet" ? "monad" : "143";

  return (
    <NetworkContext.Provider value={{ network, setNetwork, chainId }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
}
