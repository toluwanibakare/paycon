"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";

const navLinks = [
  { label: "Products", href: "#products" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Telegram", href: "#telegram" },
];

export default function Header() {
  const { user, connect } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleConnect = () => {
    if (user) return;
    connect();
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-deep-navy/85 backdrop-blur-2xl border-b border-border-glass"
          : "bg-gradient-to-b from-deep-navy/50 to-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-celo-gold via-ng-green to-celo-purple">
            <span className="text-sm font-bold text-white">P</span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            Paycon
          </span>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative text-sm text-text-secondary transition-colors duration-300 hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gradient-to-r after:from-celo-gold after:to-ng-green after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {user ? (
          <a
            href="/dashboard"
            className="group relative overflow-hidden rounded-full px-6 py-2.5 text-sm font-medium text-deep-navy transition-all duration-300 hover:scale-105"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-celo-gold via-celo-gold-dark to-ng-green" />
            <span className="absolute inset-0 bg-gradient-to-r from-ng-green to-celo-purple opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="relative z-10 flex items-center gap-2">
              Dashboard
            </span>
          </a>
        ) : (
          <motion.button
            onClick={handleConnect}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative overflow-hidden rounded-full px-6 py-2.5 text-sm font-medium text-deep-navy transition-all duration-300"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-celo-gold via-celo-gold-dark to-ng-green" />
            <span className="absolute inset-0 bg-gradient-to-r from-ng-green to-celo-purple opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="relative z-10 flex items-center gap-2">
              Connect Wallet
            </span>
          </motion.button>
        )}
      </div>
    </motion.header>
  );
}
