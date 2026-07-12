"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const statCards = [
  { label: "Active Groups", value: "3", change: "+1 this week", gradient: "from-celo-gold/20 to-amber-500/10" },
  { label: "Total Saved", value: "$1,240", change: "+$340 this month", gradient: "from-ng-green/20 to-emerald-500/10" },
  { label: "Contributions", value: "24", change: "100% on time", gradient: "from-celo-purple/20 to-indigo-500/10" },
  { label: "Payouts Received", value: "$500", change: "Next: Cycle #3", gradient: "from-celo-gold/10 to-celo-purple/10" },
];

const activity = [
  { type: "contribution", group: "Office Fund", amount: "$20", time: "2 hours ago", status: "confirmed" },
  { type: "payout", group: "Rent Pool", amount: "$400", time: "3 days ago", status: "confirmed" },
  { type: "join", group: "Side Hustle Club", amount: "", time: "5 days ago", status: "confirmed" },
  { type: "reminder", group: "Office Fund", amount: "$20", time: "7 days ago", status: "pending" },
];

export default function DashboardOverview() {
  const { user } = useAuth();

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

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
            <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
          </div>
          <div className="divide-y divide-border-glass">
            {activity.length === 0 && (
              <p className="px-6 py-8 text-center text-sm text-text-secondary">
                No activity yet. Join or create a group to get started.
              </p>
            )}
            {activity.map((act, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-surface-glass-hover">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold ${
                    act.type === "contribution"
                      ? "bg-ng-green/20 text-ng-green"
                      : act.type === "payout"
                        ? "bg-celo-gold/20 text-celo-gold"
                        : act.type === "join"
                          ? "bg-celo-purple/20 text-celo-purple"
                          : "bg-surface-glass text-text-secondary"
                  }`}
                >
                  {act.type === "contribution" ? "C" : act.type === "payout" ? "P" : act.type === "join" ? "J" : "R"}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">
                    {act.type === "contribution" && `Contributed ${act.amount} to `}
                    {act.type === "payout" && `Received ${act.amount} from `}
                    {act.type === "join" && "Joined "}
                    {act.type === "reminder" && `${act.amount} contribution due for `}
                    <span className="font-medium text-celo-gold">{act.group}</span>
                  </p>
                  <p className="text-xs text-text-secondary">{act.time}</p>
                </div>
                <div
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                    act.status === "confirmed"
                      ? "bg-ng-green/10 text-ng-green"
                      : "bg-celo-gold/10 text-celo-gold"
                  }`}
                >
                  {act.status}
                </div>
              </div>
            ))}
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
                href: "https://t.me/PayconBot",
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
