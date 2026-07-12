"use client";

import { createContext, useContext, useCallback, useEffect, useRef, useState } from "react";
import { useAccount, useSignMessage, useDisconnect } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useRouter } from "next/navigation";

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
  const [signingIn, setSigningIn] = useState(false);
  const [pendingConnect, setPendingConnect] = useState(false);
  const router = useRouter();
  const finished = useRef(false);

  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { open } = useWeb3Modal();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) throw new Error("not authenticated");
        return r.json();
      })
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          finished.current = true;
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isConnected || !address || user || signingIn || finished.current) return;
    setSigningIn(true);
    (async () => {
      try {
        const nonceRes = await fetch("/api/auth/nonce", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address }),
        });
        if (!nonceRes.ok) throw new Error("Failed to get nonce");
        const { nonce } = await nonceRes.json();

        const message = `Welcome to Paycon\n\nSign this message to verify your wallet and access your dashboard.\n\nAddress: ${address}\nNonce: ${nonce}\n\nThis request will not trigger a blockchain transaction or cost any gas fees.`;

        const signature = await signMessageAsync({ message });

        const verifyRes = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, signature, nonce }),
        });
        if (!verifyRes.ok) throw new Error("Verification failed");

        setUser({ id: address.toLowerCase(), address });
        finished.current = true;
        if (pendingConnect) {
          setPendingConnect(false);
          router.push("/dashboard");
        }
      } catch {
        wagmiDisconnect();
      } finally {
        setSigningIn(false);
      }
    })();
  }, [isConnected, address]);

  const connect = useCallback(async () => {
    setPendingConnect(true);
    open();
  }, [open]);

  const disconnect = useCallback(async () => {
    await fetch("/api/auth/me", { method: "DELETE" });
    wagmiDisconnect();
    setUser(null);
    finished.current = false;
  }, [wagmiDisconnect]);

  return (
    <AuthContext.Provider value={{ user, loading, connect, disconnect }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
