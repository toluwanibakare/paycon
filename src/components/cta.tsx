"use client";

import { motion } from "framer-motion";

export default function Cta() {
  return (
    <section id="cta" className="relative px-6 py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, #FBCC5C 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, #008751 0%, transparent 60%), radial-gradient(ellipse at 50% 0%, #2A3CB0 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="gradient-border overflow-hidden rounded-3xl"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-glass via-surface-glass to-white/5 p-12 text-center backdrop-blur-xl sm:p-20">
            <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-celo-gold/10 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-ng-green/10 blur-[100px]" />

            <div className="relative z-10">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Start saving <span className="bg-gradient-to-r from-celo-gold to-ng-green bg-clip-text text-transparent">together</span>
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-text-secondary">
                Deploy your group on Celo mainnet. Your agent handles the rest.
              </p>

              <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <a
                  href="#"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-8 py-3.5 text-sm font-medium text-deep-navy transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-celo-gold/30"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-celo-gold via-celo-gold-dark to-ng-green" />
                  <span className="absolute inset-0 bg-gradient-to-r from-ng-green to-celo-purple opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="relative z-10 flex items-center gap-2">
                    Launch App
                    <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </a>

                <a
                  href="#telegram"
                  className="group inline-flex items-center gap-2 rounded-full border border-border-glass bg-surface-glass px-8 py-3.5 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-surface-glass-hover hover:shadow-xl"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 17l10 5 10-5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 12l10 5 10-5" />
                  </svg>
                  Join Telegram
                </a>
              </div>

              <div className="mt-10 flex items-center justify-center gap-3 text-xs text-text-secondary">
                <div className="h-px w-8 bg-border-glass" />
                <span>Powered by Celo</span>
                <div className="h-px w-8 bg-border-glass" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
