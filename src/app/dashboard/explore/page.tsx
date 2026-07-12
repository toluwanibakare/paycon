"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const mockGroups = [
  {
    id: "1",
    name: "Office Fund",
    type: "ajo",
    members: "3/10",
    contribution: "$50",
    frequency: "weekly",
    pool: "$150",
    gradient: "from-celo-gold/20 to-amber-500/10",
    badge: "Ajo",
  },
  {
    id: "2",
    name: "Rent Pool",
    type: "goal-pool",
    members: "6/8",
    contribution: "$25",
    frequency: "biweekly",
    pool: "$3,200 / $5,000",
    gradient: "from-ng-green/20 to-emerald-500/10",
    badge: "Goal",
  },
  {
    id: "3",
    name: "Emergency Fund",
    type: "emergency",
    members: "4/6",
    contribution: "$10",
    frequency: "weekly",
    pool: "$160",
    gradient: "from-celo-purple/20 to-indigo-500/10",
    badge: "Emergency",
  },
  {
    id: "4",
    name: "Side Hustle Club",
    type: "flex",
    members: "2/5",
    contribution: "$20",
    frequency: "monthly",
    pool: "$80",
    gradient: "from-celo-gold/10 to-celo-purple/10",
    badge: "Flex",
  },
  {
    id: "5",
    name: "Vacation Savings",
    type: "goal-pool",
    members: "4/10",
    contribution: "$30",
    frequency: "weekly",
    pool: "$480 / $2,400",
    gradient: "from-ng-green/15 to-sky-500/10",
    badge: "Goal",
  },
  {
    id: "6",
    name: "Monthly Dues",
    type: "ajo",
    members: "8/8",
    contribution: "$100",
    frequency: "monthly",
    pool: "$800",
    gradient: "from-celo-gold/20 to-rose-500/10",
    badge: "Ajo",
    full: true,
  },
];

const typeStyles: Record<string, { bg: string; text: string; dot: string }> = {
  ajo: { bg: "bg-celo-gold/10", text: "text-celo-gold", dot: "bg-celo-gold" },
  "goal-pool": { bg: "bg-ng-green/10", text: "text-ng-green", dot: "bg-ng-green" },
  emergency: { bg: "bg-celo-purple/10", text: "text-celo-purple", dot: "bg-celo-purple" },
  flex: { bg: "bg-text-secondary/10", text: "text-text-secondary", dot: "bg-text-secondary" },
};

export default function ExplorePage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Explore Groups</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Find public savings groups to join.
          </p>
        </div>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search groups..."
            className="w-full rounded-xl border border-border-glass bg-surface-glass py-2.5 pl-10 pr-4 text-sm text-white placeholder-text-secondary outline-none transition-all duration-200 focus:border-celo-gold/50 focus:bg-surface-glass-hover sm:w-64"
          />
        </div>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {mockGroups.map((group) => {
          const style = typeStyles[group.type] ?? typeStyles.flex;
          return (
            <a
              key={group.id}
              href={`/dashboard/groups/${group.id}`}
              className="group relative overflow-hidden rounded-2xl border border-border-glass bg-surface-glass transition-all duration-300 hover:border-border-glass-strong hover:bg-surface-glass-hover"
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${group.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />
              <div className="relative px-5 py-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white transition-colors group-hover:text-celo-gold">
                      {group.name}
                    </h3>
                    <p className="mt-1 text-xs text-text-secondary">
                      {group.members} members &middot; {group.contribution}/{group.frequency}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${style.bg} ${style.text}`}
                  >
                    {group.badge}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                  <span className="text-xs text-text-secondary">Pool: {group.pool}</span>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  {group.full ? (
                    <span className="rounded-lg bg-red-500/10 px-2.5 py-1 text-[10px] font-medium text-red-400">
                      Full
                    </span>
                  ) : (
                    <>
                      <span className="rounded-lg bg-ng-green/10 px-2.5 py-1 text-[10px] font-medium text-ng-green">
                        Open
                      </span>
                      <span className="text-[10px] text-text-secondary">Join with code</span>
                    </>
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
