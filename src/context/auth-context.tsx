"use client";

import { createContext, useContext, useCallback, useEffect, useState, useRef } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

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

function isMiniPay(): boolean {
  if (typeof window === "undefined") return false;
  return (window as { ethereum?: { isMiniPay?: boolean } }).ethereum?.isMiniPay === true;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const { connect: wagmiConnect } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const authAttemptedRef = useRef<string | null>(null);

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

  useEffect(() => {
    if (!isMiniPay() || isConnected || loading) return;
    wagmiConnect({ connector: injected() });
  }, [wagmiConnect, isConnected, loading]);

  useEffect(() => {
    if (!isConnected || !address || loading) return;
    if (user?.address === address) return;
    if (authAttemptedRef.current === address) return;

    authAttemptedRef.current = address;
    setAuthLoading(true);

    if (isMiniPay()) {
      fetch("/api/auth/minipay-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      })
        .then((r) => {
          if (!r.ok) throw new Error("auth failed");
          return r.json();
        })
        .then((data) => setUser({ id: data.userId ?? address, address }))
        .catch(() => {
          authAttemptedRef.current = null;
        })
        .finally(() => setAuthLoading(false));
    } else {
      fetch("/api/auth/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      })
        .then((r) => {
          if (!r.ok) throw new Error("failed to get nonce");
          return r.json();
        })
        .then(async ({ nonce }) => {
          const ethereum = (window as { ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> } }).ethereum;
          if (!ethereum) throw new Error("no wallet");

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
          if (!verifyRes.ok) throw new Error("verification failed");

          const data = await verifyRes.json();
          setUser({ id: data.userId ?? address, address });
        })
        .catch(() => {
          authAttemptedRef.current = null;
        })
        .finally(() => setAuthLoading(false));
    }
  }, [isConnected, address, user, loading]);

  const connect = useCallback(async () => {
    if (isMiniPay()) {
      wagmiConnect({ connector: injected() });
    } else {
      const ethereum = (window as { ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> } }).ethereum;
      if (!ethereum) throw new Error("No wallet found");
      const accounts: string[] = (await ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      if (!accounts?.length) throw new Error("No accounts found");
      wagmiConnect({ connector: injected() });
    }
  }, [wagmiConnect]);

  const disconnect = useCallback(async () => {
    await fetch("/api/auth/me", { method: "DELETE" });
    setUser(null);
    wagmiDisconnect();
  }, [wagmiDisconnect]);

  return (
    <AuthContext.Provider value={{ user, loading: loading || authLoading, connect, disconnect }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
