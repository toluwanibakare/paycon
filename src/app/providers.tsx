"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { celo } from "wagmi/chains";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { AuthProvider } from "@/context/auth-context";
import { useState } from "react";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";

const wagmiConfig = getDefaultConfig({
  appName: "Paycon | Group Savings on Celo",
  projectId,
  chains: [celo],
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AuthProvider>{children}</AuthProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
