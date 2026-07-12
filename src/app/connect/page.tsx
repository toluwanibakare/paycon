"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useState } from "react";
import Image from "next/image";

export default function ConnectPage() {
  const router = useRouter();
  const { connect, user } = useAuth();
  const [status, setStatus] = useState<"idle" | "connecting" | "error">("idle");
  const [error, setError] = useState("");

  const handleConnect = async () => {
    setStatus("connecting");
    setError("");
    try {
      await connect();
      router.push("/dashboard");
    } catch (err: unknown) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Connection failed");
    }
  };

  if (user) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-deep-navy">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-celo-gold/10 blur-[120px]" />
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-celo-purple/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-ng-green/10 blur-[80px]" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(251, 204, 92, 1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(251, 204, 92, 1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="glass-card relative overflow-hidden rounded-3xl p-10">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-celo-gold/5 via-transparent to-celo-purple/5" />

          <div className="relative mb-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-celo-gold via-ng-green to-celo-purple shadow-xl shadow-celo-gold/20"
            >
              <span className="text-2xl font-bold text-white">P</span>
            </motion.div>

            <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
              Welcome to Paycon
            </h1>
            <p className="text-sm leading-relaxed text-text-secondary">
              Connect your Celo wallet to manage group savings, track contributions, and receive payouts.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3"
              >
                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConnect}
            disabled={status === "connecting"}
            className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-celo-gold via-ng-green to-celo-purple px-6 py-4 font-semibold text-deep-navy shadow-lg shadow-celo-gold/20 transition-all duration-300 hover:shadow-xl hover:shadow-celo-gold/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <motion.div
              animate={status === "connecting" ? { x: ["-100%", "200%"] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
            <span className="relative">
              {status === "connecting" ? "Connecting..." : "Connect Wallet"}
            </span>
          </motion.button>

          <div className="mt-8 space-y-4">
            {[
              { label: "MiniPay", desc: "Celo's built-in mobile wallet" },
              { label: "MetaMask", desc: "With Celo network added" },
              { label: "Valora", desc: "Celo native wallet" },
            ].map((wallet, i) => (
              <motion.div
                key={wallet.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 rounded-xl border border-border-glass bg-surface-glass px-4 py-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-celo-gold/20 to-celo-purple/20">
                  <svg className="h-4 w-4 text-celo-gold" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{wallet.label}</p>
                  <p className="text-xs text-text-secondary">{wallet.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-text-secondary">
            By connecting, you agree to Paycon&apos;s terms of service.
          </p>
        </div>

        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          href="/"
          className="mt-6 block text-center text-sm text-text-secondary transition-colors hover:text-celo-gold"
        >
          Back to home
        </motion.a>
      </motion.div>
    </div>
  );
}
