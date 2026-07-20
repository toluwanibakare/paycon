"use client";

import { motion } from "framer-motion";
import { ConnectButton } from "./connect-button";
import HeroIllustration from "./hero-illustration";

const floatingShapes = [
  { className: "top-1/4 left-[15%] w-4 h-4 bg-celo-gold/40 rotate-45", delay: 0 },
  { className: "top-1/3 right-[20%] w-3 h-3 bg-ng-green/40 rotate-12", delay: 1.5 },
  { className: "bottom-1/3 left-[10%] w-5 h-5 border border-celo-purple/30 rotate-[30deg]", delay: 3 },
  { className: "top-2/3 right-[15%] w-3 h-3 bg-white/20", delay: 2 },
  { className: "bottom-1/4 right-[30%] w-4 h-4 border border-celo-gold/20 rounded-full", delay: 4 },
  { className: "top-[20%] left-[40%] w-2 h-2 bg-celo-gold/60 rounded-full", delay: 0.8 },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #0A0B1A 0%, #0D1320 20%, #1A0D20 45%, #0A1A15 70%, #0A0B1A 100%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(251, 204, 92, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251, 204, 92, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "16px 16px",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 40%, rgba(251, 204, 92, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(0, 135, 81, 0.2) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(42, 60, 176, 0.2) 0%, transparent 50%)`,
        }}
      />

      <div className="pointer-events-none absolute -top-60 -left-60 h-[700px] w-[700px] animate-blob rounded-full opacity-40 blur-[180px]"
        style={{ background: "radial-gradient(circle, #FBCC5C 0%, transparent 70%)" }}
      />
      <div className="pointer-events-none absolute -right-60 top-0 h-[600px] w-[600px] animate-blob rounded-full opacity-25 blur-[180px]"
        style={{ background: "radial-gradient(circle, #2A3CB0 0%, transparent 70%)" }}
      />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-[500px] w-[500px] animate-blob rounded-full opacity-20 blur-[150px]"
        style={{ background: "radial-gradient(circle, #008751 0%, transparent 70%)" }}
      />

      {floatingShapes.map((shape, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [0, -30, -30, -60],
          }}
          transition={{
            duration: 6,
            delay: shape.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`pointer-events-none absolute ${shape.className}`}
        />
      ))}

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center pt-24 lg:flex-row lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 text-center lg:text-left"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Group Savings
            <br />
            <span className="bg-gradient-to-r from-celo-gold via-[#00A865] to-celo-purple bg-clip-text text-transparent">
              Reimagined For Web3
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-lg text-base leading-relaxed text-text-secondary sm:text-lg lg:max-w-md"
          >
            AI-powered Ajo savings circles on the Celo blockchain. Create groups,
            invite members, contribute automatically, and receive payouts
            without manual tracking.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
          >
            <ConnectButton onConnect={() => window.location.href = "/dashboard"} />

            <a
              href="#telegram"
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:shadow-xl"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 17l10 5 10-5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 12l10 5 10-5" />
              </svg>
              Telegram Bot
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-12 flex items-center gap-6 text-xs text-text-secondary lg:justify-start"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                <div className="h-6 w-6 rounded-full border-2 border-deep-navy bg-celo-gold" />
                <div className="h-6 w-6 rounded-full border-2 border-deep-navy bg-ng-green" />
                <div className="h-6 w-6 rounded-full border-2 border-deep-navy bg-celo-purple" />
              </div>
              <span>Live on Celo</span>
            </div>
            <div className="h-3 w-px bg-border-glass" />
            <span>Zero gas fees</span>
            <div className="hidden h-3 w-px bg-border-glass sm:block" />
            <span className="hidden sm:inline">Agent-managed</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1"
        >
          <HeroIllustration />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-celo-gold/30 via-ng-green/30 via-celo-purple/30 to-transparent" />
    </section>
  );
}
