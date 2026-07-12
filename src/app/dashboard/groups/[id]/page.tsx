"use client";

import { motion } from "framer-motion";
import { use } from "react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const members = [
  { name: "0x1a2b...3c4d", role: "Admin", status: "paid", position: 1, contributed: "$150" },
  { name: "0x5e6f...7g8h", role: "Member", status: "paid", position: 2, contributed: "$100" },
  { name: "0x9i0j...1k2l", role: "Member", status: "pending", position: 3, contributed: "$50" },
  { name: "0x3m4n...5o6p", role: "Member", status: "paid", position: 4, contributed: "$100" },
];

const contributions = [
  { member: "0x1a2b...3c4d", amount: "$50", cycle: 1, date: "Jul 7", tx: "0xabc...123", status: "confirmed" },
  { member: "0x5e6f...7g8h", amount: "$50", cycle: 1, date: "Jul 7", tx: "0xdef...456", status: "confirmed" },
  { member: "0x9i0j...1k2l", amount: "$50", cycle: 1, date: "Jul 8", tx: "0xghi...789", status: "confirmed" },
  { member: "0x3m4n...5o6p", amount: "$50", cycle: 1, date: "Jul 7", tx: "0xjkl...012", status: "confirmed" },
  { member: "0x1a2b...3c4d", amount: "$50", cycle: 2, date: "Jul 14", tx: "0xmno...345", status: "confirmed" },
  { member: "0x3m4n...5o6p", amount: "$50", cycle: 2, date: "Jul 14", tx: "0xpqr...678", status: "confirmed" },
  { member: "0x9i0j...1k2l", amount: "$50", cycle: 2, date: "Jul 15", tx: null, status: "pending" },
];

const cycles = [
  { cycle: 1, winner: "0x1a2b...3c4d", payout: "$200", status: "closed", date: "Jul 1-7" },
  { cycle: 2, winner: "0x5e6f...7g8h", payout: "$200", status: "open", date: "Jul 8-14" },
  { cycle: 3, winner: "0x9i0j...1k2l", payout: "$200", status: "upcoming", date: "Jul 15-21" },
  { cycle: 4, winner: "0x3m4n...5o6p", payout: "$200", status: "upcoming", date: "Jul 22-28" },
];

export default function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolved = use(params);
  const activeCycle = cycles[1];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <a
              href="/dashboard/groups"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-glass text-text-secondary transition-colors hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </a>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">Office Fund</h2>
              <p className="mt-0.5 text-sm text-text-secondary">
                Ajo &middot; $50/week &middot; 10 members &middot; 10 cycles
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-2 w-2 rounded-full bg-ng-green animate-glow-pulse" />
          <span className="text-xs font-medium text-ng-green">Active</span>
          <span className="mx-2 text-text-secondary">|</span>
          <span className="rounded-lg bg-celo-gold/10 px-3 py-1.5 text-xs font-medium text-celo-gold">
            Code: SAVE-AJO
          </span>
        </div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <motion.div variants={item} className="rounded-2xl border border-border-glass bg-surface-glass">
            <div className="border-b border-border-glass px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Current Cycle</h3>
                <span className="text-xs text-text-secondary">
                  Cycle {activeCycle.cycle} / 10
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-text-secondary">
                    Current Winner
                  </p>
                  <p className="mt-1 text-lg font-bold text-celo-gold">
                    {activeCycle.winner}
                  </p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    Payout: {activeCycle.payout}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-wider text-text-secondary">Pool</p>
                    <p className="mt-1 text-2xl font-bold text-white">$400</p>
                  </div>
                  <div className="h-10 w-px bg-border-glass" />
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-wider text-text-secondary">Status</p>
                    <p className="mt-1 text-sm font-medium text-ng-green">Collecting</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-xs text-text-secondary">
                  <span>Progress</span>
                  <span>$300 / $400 collected</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-glass">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-celo-gold to-ng-green"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="rounded-2xl border border-border-glass bg-surface-glass">
            <div className="border-b border-border-glass px-6 py-4">
              <h3 className="text-sm font-semibold text-white">Recent Contributions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-glass text-left">
                    <th className="px-6 py-3 text-[10px] font-medium uppercase tracking-wider text-text-secondary">Member</th>
                    <th className="px-6 py-3 text-[10px] font-medium uppercase tracking-wider text-text-secondary">Amount</th>
                    <th className="px-6 py-3 text-[10px] font-medium uppercase tracking-wider text-text-secondary">Cycle</th>
                    <th className="px-6 py-3 text-[10px] font-medium uppercase tracking-wider text-text-secondary">Date</th>
                    <th className="px-6 py-3 text-[10px] font-medium uppercase tracking-wider text-text-secondary">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-glass">
                  {contributions.map((c, i) => (
                    <tr key={i} className="transition-colors hover:bg-surface-glass-hover">
                      <td className="px-6 py-3 text-sm text-white">{c.member}</td>
                      <td className="px-6 py-3 text-sm font-medium text-white">{c.amount}</td>
                      <td className="px-6 py-3 text-sm text-text-secondary">#{c.cycle}</td>
                      <td className="px-6 py-3 text-sm text-text-secondary">{c.date}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                            c.status === "confirmed"
                              ? "bg-ng-green/10 text-ng-green"
                              : "bg-celo-gold/10 text-celo-gold"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div variants={item} className="rounded-2xl border border-border-glass bg-surface-glass">
            <div className="border-b border-border-glass px-5 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Members</h3>
                <span className="rounded-full bg-surface-glass px-2 py-0.5 text-[10px] text-text-secondary">
                  {members.length}
                </span>
              </div>
            </div>
            <div className="divide-y divide-border-glass">
              {members.map((m, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-surface-glass-hover">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-celo-gold/20 to-celo-purple/20 text-[10px] font-bold text-celo-gold">
                    {m.position}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-white">{m.name}</p>
                      {m.role === "Admin" && (
                        <span className="rounded bg-celo-purple/10 px-1.5 py-0.5 text-[9px] font-medium text-celo-purple">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-text-secondary">{m.contributed} contributed</p>
                  </div>
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full ${
                      m.status === "paid"
                        ? "bg-ng-green/10 text-ng-green"
                        : "bg-celo-gold/10 text-celo-gold"
                    }`}
                  >
                    {m.status === "paid" ? (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={item} className="rounded-2xl border border-border-glass bg-surface-glass">
            <div className="border-b border-border-glass px-5 py-4">
              <h3 className="text-sm font-semibold text-white">Cycle Schedule</h3>
            </div>
            <div className="divide-y divide-border-glass">
              {cycles.map((c) => (
                <div
                  key={c.cycle}
                  className={`flex items-center justify-between px-5 py-3 ${
                    c.status === "open" ? "bg-celo-gold/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${
                        c.status === "closed"
                          ? "bg-ng-green/10 text-ng-green"
                          : c.status === "open"
                            ? "bg-celo-gold/10 text-celo-gold"
                            : "bg-surface-glass text-text-secondary"
                      }`}
                    >
                      {c.cycle}
                    </div>
                    <div>
                      <p className="text-sm text-white">{c.winner}</p>
                      <p className="text-[10px] text-text-secondary">{c.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-xs font-medium ${
                        c.status === "closed"
                          ? "text-ng-green"
                          : c.status === "open"
                            ? "text-celo-gold"
                            : "text-text-secondary"
                      }`}
                    >
                      {c.payout}
                    </p>
                    <p className="text-[10px] capitalize text-text-secondary">{c.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
