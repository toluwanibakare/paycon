"use client";

import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { useAuth } from "@/context/auth-context";
import { useState, useEffect } from "react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

interface GroupData {
  id: string;
  name: string;
  savingType: string;
  contributionAmount: string;
  poolBalance: string;
  status: string;
}

interface ContributionData {
  id: string;
  groupId: string;
  amount: string;
  status: string;
  createdAt: string;
}

export default function DashboardOverview() {
  const { address } = useAccount();
  const { user } = useAuth();
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [recentContributions, setRecentContributions] = useState<ContributionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch("/api/groups?my=true").then((r) => r.json()),
      fetch("/api/groups?my=true&limit=5").then((r) => r.json()),
    ])
      .then(([groupsData]) => {
        setGroups(groupsData.groups ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const activeCount = groups.filter((g) => g.status === "active").length;
  const totalSaved = groups.reduce((sum, g) => sum + Number.parseFloat(g.poolBalance || "0"), 0);
  const contributionCount = recentContributions.length;

  const statCards = [
    { label: "Active Groups", value: String(activeCount), change: `${groups.length} total`, gradient: "from-celo-gold/20 to-amber-500/10" },
    { label: "Total Saved", value: `$${totalSaved.toFixed(2)}`, change: "Across all groups", gradient: "from-ng-green/20 to-emerald-500/10" },
    { label: "Wallet", value: address ? `${address.slice(0, 6)}...` : "---", change: "Connected", gradient: "from-celo-purple/20 to-indigo-500/10" },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item}>
        <h2 className="text-xl font-bold tracking-tight text-white">
          Welcome back
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Here&apos;s your savings overview.
        </p>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="group relative overflow-hidden rounded-2xl border border-border-glass bg-surface-glass transition-all duration-300 hover:border-border-glass-strong hover:bg-surface-glass-hover"
          >
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
            />
            <div className="relative px-5 py-5">
              <p className="text-xs font-medium uppercase tracking-widest text-text-secondary">
                {card.label}
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white">
                {card.value}
              </p>
              <p className="mt-1 text-xs text-ng-green">{card.change}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid gap-8 xl:grid-cols-2">
        <motion.div variants={item} className="rounded-2xl border border-border-glass bg-surface-glass">
          <div className="border-b border-border-glass px-6 py-4">
            <h3 className="text-sm font-semibold text-white">My Groups</h3>
          </div>
          <div className="divide-y divide-border-glass">
            {loading ? (
              <p className="px-6 py-8 text-center text-sm text-text-secondary">Loading...</p>
            ) : groups.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-text-secondary">
                No groups yet. Join or create a group to get started.
              </p>
            ) : (
              groups.map((g) => (
                <a
                  key={g.id}
                  href={`/dashboard/groups/${g.id}`}
                  className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-surface-glass-hover"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-celo-gold/20 text-xs font-bold text-celo-gold">
                    {g.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{g.name}</p>
                    <p className="text-xs text-text-secondary">
                      {g.savingType} &middot; ${g.contributionAmount}/cycle
                    </p>
                  </div>
                  <div
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                      g.status === "active"
                        ? "bg-ng-green/10 text-ng-green"
                        : "bg-text-secondary/10 text-text-secondary"
                    }`}
                  >
                    {g.status}
                  </div>
                </a>
              ))
            )}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-2xl border border-border-glass bg-surface-glass">
          <div className="border-b border-border-glass px-6 py-4">
            <h3 className="text-sm font-semibold text-white">Quick Actions</h3>
          </div>
          <div className="space-y-3 p-6">
            {[
              {
                label: "Create a Group",
                desc: "Start a new savings circle",
                icon: "C",
                gradient: "from-celo-gold to-ng-green",
                href: "/dashboard/groups",
              },
              {
                label: "Join a Group",
                desc: "Find public groups or use an invite code",
                icon: "J",
                gradient: "from-ng-green to-celo-purple",
                href: "/dashboard/explore",
              },
              {
                label: "Open Telegram Bot",
                desc: "Manage savings on the go",
                icon: "T",
                gradient: "from-celo-purple to-celo-gold",
                href: "https://t.me/PayconAgentBot",
              },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                target={action.href.startsWith("http") ? "_blank" : undefined}
                className="group flex items-center gap-4 rounded-xl border border-border-glass bg-surface-glass px-5 py-4 transition-all duration-300 hover:border-border-glass-strong hover:bg-surface-glass-hover"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} text-sm font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-105`}
                >
                  {action.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white transition-colors group-hover:text-celo-gold">
                    {action.label}
                  </p>
                  <p className="text-xs text-text-secondary">{action.desc}</p>
                </div>
                <svg className="h-4 w-4 text-text-secondary transition-colors group-hover:text-celo-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
