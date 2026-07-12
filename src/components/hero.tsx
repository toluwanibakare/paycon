"use client";

import { motion } from "framer-motion";
import HeroIllustration from "./hero-illustration";

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
        className="pointer-events-none absolute -top-60 -left-60 h-[600px] w-[600px] animate-blob rounded-full opacity-30 blur-[150px]"
        style={{ background: "radial-gradient(circle, #FBCC5C 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -right-60 top-0 h-[500px] w-[500px] animate-blob rounded-full opacity-20 blur-[150px]"
        style={{ background: "radial-gradient(circle, #2A3CB0 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-1/4 h-[400px] w-[400px] animate-blob rounded-full opacity-15 blur-[120px]"
        style={{ background: "radial-gradient(circle, #008751 0%, transparent 70%)" }}
      />

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
            <a
              href="#cta"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3 text-sm font-semibold text-deep-navy transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-celo-gold/30"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-celo-gold via-celo-gold-dark to-ng-green" />
              <span className="absolute inset-0 bg-gradient-to-r from-ng-green to-celo-purple opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="relative z-10 flex items-center gap-2">
                Launch App
                <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </a>

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
