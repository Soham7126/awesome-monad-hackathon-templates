'use client';

import {
  ThirdwebProvider,
  coinbaseWallet,
  embeddedWallet,
  localWallet,
  metamaskWallet,
  phantomWallet,
  rainbowWallet,
  trustWallet,
  walletConnect,
  zerionWallet,
} from '@thirdweb-dev/react';

export default function Providers({ children }) {
  return (
    <ThirdwebProvider
      activeChain='ethereum'
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      supportedWallets={[
        embeddedWallet(),
        metamaskWallet(),
        coinbaseWallet(),
        walletConnect(),
        rainbowWallet(),
        zerionWallet(),
        trustWallet(),
        phantomWallet(),
        localWallet(),
      ]}
    >
      {children}
    </ThirdwebProvider>
  );
}
