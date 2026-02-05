import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { http } from "wagmi";
import { monad } from "@reown/appkit/networks";

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";

export const wagmiAdapter = new WagmiAdapter({
  networks: [monad],
  transports: {
    [monad.id]: http(),
  },
});
