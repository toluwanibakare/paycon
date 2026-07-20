"use client";

import { motion } from "framer-motion";
import { use, useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

interface GroupData {
  id: string;
  name: string;
  description: string | null;
  savingType: string;
  contributionAmount: string;
  contributionFrequency: string;
  maxMembers: number;
  totalCycles: number;
  currentCycle: number;
  poolBalance: string;
  inviteCode: string;
  status: string;
  adminUserId: string;
  targetAmount: string | null;
}

interface MemberData {
  id: string;
  userId: string;
  position: number | null;
  totalContributed: string;
  status: string;
}

interface ContributionData {
  id: string;
  memberId: string;
  amount: string;
  cycleNumber: number;
  txHash: string | null;
  status: string;
  createdAt: string;
}

interface CycleData {
  id: string;
  cycleNumber: number;
  payoutMemberId: string | null;
  payoutAmount: string | null;
  status: string;
}

export default function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [group, setGroup] = useState<GroupData | null>(null);
  const [members, setMembers] = useState<MemberData[]>([]);
  const [contributions, setContributions] = useState<ContributionData[]>([]);
  const [cycles, setCycles] = useState<CycleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/groups/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setGroup(data.group);
        setMembers(data.members ?? []);
        setContributions(data.contributions ?? []);
        setCycles(data.cycles ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-celo-gold border-t-transparent" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="py-20 text-center">
        <p className="text-text-secondary">Group not found.</p>
        <a href="/dashboard/groups" className="mt-4 inline-block text-celo-gold hover:underline">
          Back to My Groups
        </a>
      </div>
    );
  }

  const isAdmin = group.adminUserId === user?.id;
  const activeCycle = cycles.find((c) => c.status === "open") ?? cycles[0];
  const poolAmount = Number.parseFloat(group.poolBalance);
  const totalCollected = poolAmount;
  const expectedForCycle = Number.parseFloat(group.contributionAmount) * members.length;
  const progress = expectedForCycle > 0 ? Math.min((totalCollected / expectedForCycle) * 100, 100) : 0;

  function shortAddr(addr: string) {
    if (addr.length <= 12) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

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
              <h2 className="text-xl font-bold tracking-tight text-white">{group.name}</h2>
              <p className="mt-0.5 text-sm text-text-secondary">
                {group.savingType} &middot; ${group.contributionAmount}/{group.contributionFrequency} &middot; {group.maxMembers} members &middot; {group.totalCycles} cycles
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-2 w-2 rounded-full bg-ng-green animate-glow-pulse" />
          <span className="text-xs font-medium text-ng-green">{group.status}</span>
          <span className="mx-2 text-text-secondary">|</span>
          <span className="rounded-lg bg-celo-gold/10 px-3 py-1.5 text-xs font-medium text-celo-gold">
            Code: {group.inviteCode}
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
                  Cycle {group.currentCycle} / {group.totalCycles}
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
                    {activeCycle?.payoutMemberId ? shortAddr(activeCycle.payoutMemberId) : "TBD"}
                  </p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    Payout: ${activeCycle?.payoutAmount ?? group.contributionAmount}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-wider text-text-secondary">Pool</p>
                    <p className="mt-1 text-2xl font-bold text-white">${poolAmount.toFixed(2)}</p>
                  </div>
                  <div className="h-10 w-px bg-border-glass" />
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-wider text-text-secondary">Status</p>
                    <p className="mt-1 text-sm font-medium text-ng-green">
                      {activeCycle?.status === "open" ? "Collecting" : activeCycle?.status ?? "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-xs text-text-secondary">
                  <span>Progress</span>
                  <span>${totalCollected.toFixed(2)} / ${expectedForCycle.toFixed(2)} collected</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-glass">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
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
                    <th className="px-6 py-3 text-[10px] font-medium uppercase tracking-wider text-text-secondary">Amount</th>
                    <th className="px-6 py-3 text-[10px] font-medium uppercase tracking-wider text-text-secondary">Cycle</th>
                    <th className="px-6 py-3 text-[10px] font-medium uppercase tracking-wider text-text-secondary">Tx</th>
                    <th className="px-6 py-3 text-[10px] font-medium uppercase tracking-wider text-text-secondary">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-glass">
                  {contributions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-sm text-text-secondary">
                        No contributions yet.
                      </td>
                    </tr>
                  )}
                  {contributions.map((c) => (
                    <tr key={c.id} className="transition-colors hover:bg-surface-glass-hover">
                      <td className="px-6 py-3 text-sm font-medium text-white">${c.amount}</td>
                      <td className="px-6 py-3 text-sm text-text-secondary">#{c.cycleNumber}</td>
                      <td className="px-6 py-3 text-sm text-text-secondary font-mono">
                        {c.txHash ? shortAddr(c.txHash) : "---"}
                      </td>
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
              {members.map((m) => (
                <div key={m.id} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-surface-glass-hover">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-celo-gold/20 to-celo-purple/20 text-[10px] font-bold text-celo-gold">
                    {m.position ?? "?"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-white">{shortAddr(m.userId)}</p>
                      {m.userId === group.adminUserId && (
                        <span className="rounded bg-celo-purple/10 px-1.5 py-0.5 text-[9px] font-medium text-celo-purple">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-text-secondary">
                      ${Number.parseFloat(m.totalContributed).toFixed(2)} contributed
                    </p>
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ng-green/10 text-ng-green">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
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
              {cycles.length === 0 && (
                <div className="px-5 py-4 text-center text-xs text-text-secondary">
                  No cycles scheduled yet.
                </div>
              )}
              {cycles.map((c) => (
                <div
                  key={c.id}
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
                      {c.cycleNumber}
                    </div>
                    <div>
                      <p className="text-sm text-white">
                        {c.payoutMemberId ? shortAddr(c.payoutMemberId) : "---"}
                      </p>
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
                      ${c.payoutAmount ?? "0.00"}
                    </p>
                    <p className="text-[10px] capitalize text-text-secondary">{c.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {isAdmin && (
            <motion.div variants={item}>
              <button
                onClick={() => navigator.clipboard.writeText(group.inviteCode)}
                className="w-full rounded-xl border border-border-glass bg-surface-glass px-5 py-3 text-sm text-text-secondary transition-colors hover:border-celo-gold/50 hover:text-celo-gold"
              >
                Copy Invite Code: {group.inviteCode}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
