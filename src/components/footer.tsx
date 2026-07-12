"use client";

import { motion } from "framer-motion";

const links = [
  { label: "Products", href: "#products" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Telegram Bot", href: "#telegram" },
  { label: "GitHub", href: "https://github.com/toluwanibakare/paycon" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-deep-navy via-navy-light/50 to-deep-navy" />

      <div className="relative">
        <svg
          className="w-full"
          viewBox="0 0 1440 120"
          fill="none"
          preserveAspectRatio="none"
          style={{ marginBottom: -2 }}
        >
          <path
            d="M0 40C240 120 480 0 720 60C960 120 1200 0 1440 40V120H0V40Z"
            fill="url(#footerWave)"
          />
          <defs>
            <linearGradient id="footerWave" x1="0" y1="0" x2="1440" y2="0">
              <stop offset="0%" stopColor="#FBCC5C" stopOpacity="0.08" />
              <stop offset="33%" stopColor="#008751" stopOpacity="0.06" />
              <stop offset="66%" stopColor="#2A3CB0" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#FBCC5C" stopOpacity="0.04" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative px-6 pb-16 pt-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-10 md:flex-row md:items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center md:text-left"
            >
              <div className="mb-4 flex items-center justify-center gap-3 md:justify-start">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-celo-gold via-ng-green to-celo-purple shadow-lg shadow-celo-gold/20">
                  <span className="text-sm font-bold text-white">P</span>
                </div>
                <div>
                  <span className="text-lg font-semibold tracking-tight text-white">
                    Paycon
                  </span>
                  <span className="ml-2 text-xs text-text-secondary">/</span>
                  <span className="ml-2 text-xs text-text-secondary">
                    AI group savings on Celo
                  </span>
                </div>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-text-secondary">
                AI-powered Ajo savings circles on the Celo blockchain. Save together, earn together.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap justify-center gap-x-10 gap-y-3 md:justify-end"
            >
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="relative text-sm text-text-secondary transition-colors duration-300 hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gradient-to-r after:from-celo-gold after:to-ng-green after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.label}
                </a>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border-glass pt-8 md:flex-row"
          >
            <div className="flex items-center gap-4 text-xs text-text-secondary">
              <span>&copy; {new Date().getFullYear()} Paycon Labs</span>
              <span className="h-3 w-px bg-border-glass" />
              <span>MIT License</span>
              <span className="h-3 w-px bg-border-glass" />
              <span>Built on Celo</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-celo-gold animate-glow-pulse" />
              <span className="text-xs text-text-secondary">Live on Celo Mainnet</span>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
