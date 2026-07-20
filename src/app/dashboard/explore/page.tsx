"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { useState, useEffect } from "react";

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
  savingType: string;
  contributionAmount: string;
  contributionFrequency: string;
  maxMembers: number;
  poolBalance: string;
  targetAmount: string | null;
  status: string;
  description: string | null;
}

const typeStyles: Record<string, { bg: string; text: string; dot: string }> = {
  ajo: { bg: "bg-celo-gold/10", text: "text-celo-gold", dot: "bg-celo-gold" },
  "goal-pool": { bg: "bg-ng-green/10", text: "text-ng-green", dot: "bg-ng-green" },
  emergency: { bg: "bg-celo-purple/10", text: "text-celo-purple", dot: "bg-celo-purple" },
  flex: { bg: "bg-text-secondary/10", text: "text-text-secondary", dot: "bg-text-secondary" },
};

const badgeMap: Record<string, string> = {
  ajo: "Ajo",
  "goal-pool": "Goal",
  emergency: "Emergency",
  flex: "Flex",
};

const gradientMap: Record<string, string> = {
  ajo: "from-celo-gold/20 to-amber-500/10",
  "goal-pool": "from-ng-green/20 to-emerald-500/10",
  emergency: "from-celo-purple/20 to-indigo-500/10",
  flex: "from-celo-gold/10 to-celo-purple/10",
};

export default function ExplorePage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) return;
    fetch("/api/groups?visibility=public")
      .then((r) => r.json())
      .then((data) => setGroups(data.groups ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const filtered = search
    ? groups.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))
    : groups;

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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border-glass bg-surface-glass py-2.5 pl-10 pr-4 text-sm text-white placeholder-text-secondary outline-none transition-all duration-200 focus:border-celo-gold/50 focus:bg-surface-glass-hover sm:w-64"
          />
        </div>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <p className="col-span-full text-center text-sm text-text-secondary py-12">Loading groups...</p>
        ) : filtered.length === 0 ? (
          <p className="col-span-full text-center text-sm text-text-secondary py-12">
            {search ? "No groups match your search." : "No public groups available yet."}
          </p>
        ) : (
          filtered.map((group) => {
            const style = typeStyles[group.savingType] ?? typeStyles.flex;
            const gradient = gradientMap[group.savingType] ?? gradientMap.flex;
            const badge = badgeMap[group.savingType] ?? group.savingType;

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
                    <div>
                      <h3 className="text-base font-semibold text-white transition-colors group-hover:text-celo-gold">
                        {group.name}
                      </h3>
                      <p className="mt-1 text-xs text-text-secondary">
                        ${group.contributionAmount}/{group.contributionFrequency}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${style.bg} ${style.text}`}
                    >
                      {badge}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                    <span className="text-xs text-text-secondary">
                      Pool: ${Number.parseFloat(group.poolBalance).toFixed(2)}
                      {group.targetAmount ? ` / $${Number.parseFloat(group.targetAmount).toFixed(2)}` : ""}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="rounded-lg bg-ng-green/10 px-2.5 py-1 text-[10px] font-medium text-ng-green">
                      Open
                    </span>
                    <span className="text-[10px] text-text-secondary">
                      Up to {group.maxMembers} members
                    </span>
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
