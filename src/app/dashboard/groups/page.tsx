"use client";

import { motion } from "framer-motion";
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
  contributionFrequency: string;
  maxMembers: number;
  currentCycle: number;
  totalCycles: number;
  poolBalance: string;
  status: string;
  adminUserId: string;
  targetAmount: string | null;
  description: string | null;
}

export default function MyGroupsPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch("/api/groups?my=true")
      .then((r) => r.json())
      .then((data) => setGroups(data.groups ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">My Groups</h2>
          <p className="mt-1 text-sm text-text-secondary">
            {loading ? "Loading..." : `You are a member of ${groups.length} savings group${groups.length !== 1 ? "s" : ""}.`}
          </p>
        </div>
        <a
          href="/dashboard/explore"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-celo-gold to-ng-green px-5 py-2.5 text-sm font-semibold text-deep-navy shadow-lg shadow-celo-gold/20 transition-all duration-300 hover:shadow-xl hover:shadow-celo-gold/30"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Join New Group
        </a>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <p className="col-span-full text-center text-sm text-text-secondary py-12">Loading your groups...</p>
        ) : groups.length === 0 ? (
          <div className="col-span-full flex flex-col items-center gap-4 py-12">
            <p className="text-sm text-text-secondary">No groups yet.</p>
            <a
              href="/dashboard/explore"
              className="rounded-xl bg-gradient-to-r from-celo-gold to-ng-green px-5 py-2.5 text-sm font-semibold text-deep-navy"
            >
              Explore Groups
            </a>
          </div>
        ) : (
          groups.map((group) => {
            const cycleProgress = (group.currentCycle / group.totalCycles) * 100;
            const isAdmin = group.adminUserId === user?.id;
            const gradient = isAdmin
              ? "from-celo-gold/20 to-amber-500/10"
              : "from-ng-green/20 to-emerald-500/10";

            return (
              <a
                key={group.id}
                href={`/dashboard/groups/${group.id}`}
                className="group relative overflow-hidden rounded-2xl border border-border-glass bg-surface-glass transition-all duration-300 hover:border-border-glass-strong hover:bg-surface-glass-hover"
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />
                <div className="relative px-5 py-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-white transition-colors group-hover:text-celo-gold">
                        {group.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="rounded-full bg-celo-gold/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-celo-gold">
                          {group.savingType}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                            isAdmin
                              ? "bg-celo-purple/10 text-celo-purple"
                              : "bg-surface-glass text-text-secondary"
                          }`}
                        >
                          {isAdmin ? "Admin" : "Member"}
                        </span>
                      </div>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ng-green/10 text-ng-green">
                      <div className="h-2 w-2 rounded-full bg-ng-green animate-glow-pulse" />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-text-secondary">Members</p>
                      <p className="text-sm font-medium text-white">{group.maxMembers} max</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-text-secondary">Cycle</p>
                      <p className="text-sm font-medium text-white">
                        {group.currentCycle}/{group.totalCycles}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-text-secondary">Per cycle</p>
                      <p className="text-sm font-medium text-white">${group.contributionAmount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-text-secondary">Pool</p>
                      <p className="text-sm font-medium text-white">
                        ${Number.parseFloat(group.poolBalance).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[10px] text-text-secondary">Progress</span>
                      <span className="text-[10px] font-medium text-celo-gold">{Math.round(cycleProgress)}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-surface-glass">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cycleProgress}%` }}
                        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-celo-gold to-ng-green"
                      />
                    </div>
                  </div>
                </div>
              </a>
            );
          })
        )}
      </motion.div>
    </motion.div>
  );
}
