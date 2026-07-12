"use client";

import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const myGroups = [
  {
    id: "1",
    name: "Office Fund",
    type: "Ajo",
    role: "Admin",
    members: "3/10",
    contribution: "$50",
    cycle: "2/10",
    nextDue: "Jul 14",
    pool: "$300",
    status: "active",
    gradient: "from-celo-gold/20 to-amber-500/10",
  },
  {
    id: "2",
    name: "Rent Pool",
    type: "Goal Pool",
    role: "Member",
    members: "6/8",
    contribution: "$25",
    progress: "64%",
    nextDue: "Jul 18",
    pool: "$3,200",
    status: "active",
    gradient: "from-ng-green/20 to-emerald-500/10",
  },
  {
    id: "5",
    name: "Vacation Savings",
    type: "Goal Pool",
    role: "Member",
    members: "4/10",
    contribution: "$30",
    progress: "20%",
    nextDue: "Jul 21",
    pool: "$480",
    status: "active",
    gradient: "from-celo-purple/20 to-sky-500/10",
  },
];

export default function MyGroupsPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">My Groups</h2>
          <p className="mt-1 text-sm text-text-secondary">
            You are a member of {myGroups.length} savings group{myGroups.length !== 1 ? "s" : ""}.
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
        {myGroups.map((group) => {
          const progressValue = group.progress ? parseInt(group.progress) : (parseInt(group.cycle?.split("/")[0] ?? "0") / parseInt(group.cycle?.split("/")[1] ?? "1")) * 100;

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
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white transition-colors group-hover:text-celo-gold">
                      {group.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-full bg-celo-gold/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-celo-gold">
                        {group.type}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                          group.role === "Admin"
                            ? "bg-celo-purple/10 text-celo-purple"
                            : "bg-surface-glass text-text-secondary"
                        }`}
                      >
                        {group.role}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      group.status === "active"
                        ? "bg-ng-green/10 text-ng-green"
                        : "bg-celo-gold/10 text-celo-gold"
                    }`}
                  >
                    <div className={`h-2 w-2 rounded-full ${group.status === "active" ? "bg-ng-green animate-glow-pulse" : "bg-celo-gold"}`} />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-text-secondary">Members</p>
                    <p className="text-sm font-medium text-white">{group.members}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-text-secondary">
                      {group.progress ? "Target" : "Cycle"}
                    </p>
                    <p className="text-sm font-medium text-white">
                      {group.progress || group.cycle}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-text-secondary">Per cycle</p>
                    <p className="text-sm font-medium text-white">{group.contribution}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-text-secondary">Pool</p>
                    <p className="text-sm font-medium text-white">{group.pool}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[10px] text-text-secondary">Progress</span>
                    <span className="text-[10px] font-medium text-celo-gold">{typeof progressValue === "number" ? Math.round(progressValue) : 0}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-glass">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressValue}%` }}
                      transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-celo-gold to-ng-green"
                    />
                  </div>
                </div>

                {group.nextDue && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-celo-gold/5 px-3 py-2">
                    <svg className="h-3.5 w-3.5 text-celo-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[11px] text-text-secondary">
                      Next contribution: <span className="font-medium text-white">{group.nextDue}</span>
                    </span>
                  </div>
                )}
              </div>
            </a>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
