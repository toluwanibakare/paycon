import { createConfig, http } from "wagmi";
import { celo } from "wagmi/chains";
import { walletConnect, injected } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";

export const wagmiConfig = createConfig({
  chains: [celo],
  connectors: [
    injected({ shimDisconnect: true }),
    walletConnect({ projectId }),
  ],
  transports: {
    [celo.id]: http("https://forno.celo.org"),
  },
});

export { projectId };
