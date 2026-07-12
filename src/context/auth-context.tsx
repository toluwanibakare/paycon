"use client";

import { createContext, useContext, useCallback, useEffect, useState } from "react";

interface User {
  id: string;
  address: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  connect: async () => {},
  disconnect: async () => {},
});

async function switchToCelo() {
  const ethereum = (window as any).ethereum;
  if (!ethereum) return false;

  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xa4ec" }],
    });
    return true;
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: "0xa4ec",
            chainName: "Celo Mainnet",
            nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 },
            rpcUrls: ["https://forno.celo.org"],
            blockExplorerUrls: ["https://celoscan.io"],
          }],
        });
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) throw new Error("not authenticated");
        return r.json();
      })
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const connect = useCallback(async () => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) throw new Error("No wallet found");

    const accounts: string[] = await ethereum.request({
      method: "eth_requestAccounts",
    });

    if (!accounts?.length) throw new Error("No accounts found");

    const address = accounts[0].toLowerCase();

    const nonceRes = await fetch("/api/auth/nonce", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });
    if (!nonceRes.ok) throw new Error("Failed to get nonce");
    const { nonce } = await nonceRes.json();

    const message = `Welcome to Paycon\n\nSign this message to verify your wallet and access your dashboard.\n\nAddress: ${address}\nNonce: ${nonce}\n\nThis request will not trigger a blockchain transaction or cost any gas fees.`;

    const signature = await ethereum.request({
      method: "personal_sign",
      params: [message, address],
    });

    const verifyRes = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, signature, nonce }),
    });
    if (!verifyRes.ok) throw new Error("Verification failed");

    setUser({ id: address, address });
  }, []);

  const disconnect = useCallback(async () => {
    await fetch("/api/auth/me", { method: "DELETE" });
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, connect, disconnect }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
