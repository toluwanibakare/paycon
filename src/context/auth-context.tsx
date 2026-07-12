"use client";

import { createContext, useContext, useCallback, useEffect, useState } from "react";
import { createWalletClient, custom } from "viem";
import { celo } from "viem/chains";

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
    try {
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("Please install a Celo-compatible wallet like MiniPay");
      }

      const [address] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const nonceRes = await fetch("/api/auth/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      if (!nonceRes.ok) throw new Error("Failed to get nonce");
      const { nonce } = await nonceRes.json();

      const walletClient = createWalletClient({
        chain: celo,
        transport: custom(window.ethereum),
      });

      const message = `Welcome to Paycon\n\nSign this message to verify your wallet and access your dashboard.\n\nAddress: ${address}\nNonce: ${nonce}\n\nThis request will not trigger a blockchain transaction or cost any gas fees.`;

      const signature = await walletClient.signMessage({
        account: address as `0x${string}`,
        message,
      });

      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, signature, nonce }),
      });
      if (!verifyRes.ok) throw new Error("Verification failed");
      const data = await verifyRes.json();

      setUser({ id: address.toLowerCase(), address });
    } catch (err: unknown) {
      throw err;
    }
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
