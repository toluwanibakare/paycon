"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { type ReactNode, useState } from "react";
import { State, WagmiProvider } from "wagmi";
import { wagmiConfig, projectId } from "@/lib/web3modal";

createWeb3Modal({
  wagmiConfig,
  projectId,
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#FBCC5C",
    "--w3m-color-mix": "#0A0B1A",
    "--w3m-color-mix-strength": 20,
    "--w3m-border-radius-master": "12px",
  },
  defaultChain: wagmiConfig.chains[0],
  featuredWalletIds: [
    "fd20dc426fb37566d8042051f2aa4c3e9d0c04091787446404b0b96f1b26ff1a",
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba50a6e0e0e8c1c8c",
    "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
  ],
});

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000 } },
});

export function Web3ModalProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  const [qc] = useState(queryClient);

  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
