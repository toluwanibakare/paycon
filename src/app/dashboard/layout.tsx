"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: "O" },
  { label: "My Groups", href: "/dashboard/groups", icon: "G" },
  { label: "Explore", href: "/dashboard/explore", icon: "E" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { address } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-deep-navy">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-celo-gold border-t-transparent" />
          <p className="text-sm text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const displayAddress = address ?? user.address;
  const shortAddress = `${displayAddress.slice(0, 6)}...${displayAddress.slice(-4)}`;

  const pageTitle =
    pathname === "/dashboard"
      ? "Overview"
      : pathname === "/dashboard/groups"
        ? "My Groups"
        : pathname === "/dashboard/explore"
          ? "Explore"
          : pathname.startsWith("/dashboard/groups/")
            ? "Group Details"
            : "";

  const handleDisconnect = async () => {
    await fetch("/api/auth/me", { method: "DELETE" });
    wagmiDisconnect();
    router.push("/");
  };

  return (
    <div className="flex min-h-dvh bg-deep-navy">
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-border-glass bg-navy-light transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-border-glass px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-celo-gold via-ng-green to-celo-purple shadow-lg shadow-celo-gold/20">
            <span className="text-sm font-bold text-white">P</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Paycon</p>
            <p className="text-[10px] text-text-secondary">Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6">
          {navItems.map((item) => {
            const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
            return (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-celo-gold/10 to-celo-purple/10 text-white shadow-sm shadow-celo-gold/5"
                    : "text-text-secondary hover:bg-surface-glass hover:text-white"
                }`}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                    active
                      ? "bg-gradient-to-br from-celo-gold to-ng-green text-deep-navy"
                      : "bg-surface-glass text-text-secondary"
                  }`}
                >
                  {item.icon}
                </div>
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="border-t border-border-glass px-4 py-4">
          <div className="flex items-center gap-3 rounded-xl bg-surface-glass px-4 py-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-celo-gold/20 to-celo-purple/20">
              <div className="h-2 w-2 rounded-full bg-celo-gold" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-xs font-medium text-white">{shortAddress}</p>
            </div>
            <button
              onClick={handleDisconnect}
              className="text-xs text-text-secondary transition-colors hover:text-red-400"
            >
              Exit
            </button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border-glass bg-deep-navy/80 px-6 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-glass text-text-secondary hover:text-white md:hidden"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <motion.h1
              key={pageTitle}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg font-semibold tracking-tight text-white"
            >
              {pageTitle}
            </motion.h1>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="rounded-xl border border-border-glass px-4 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-border-glass-strong hover:text-white"
            >
              Home
            </a>
            <div className="hidden items-center gap-2 rounded-xl bg-surface-glass px-3 py-2 sm:flex">
              <div className="h-2 w-2 rounded-full bg-celo-gold" />
              <span className="text-xs text-text-secondary">{shortAddress}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
