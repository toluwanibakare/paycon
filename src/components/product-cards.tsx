"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";
import { IconAjo, IconGoal, IconEmergency, IconFlex, IconArrowRight, IconCheck } from "./icons";

const products = [
  {
    id: "ajo",
    name: "Ajo",
    tag: "Rotating Savings",
    description:
      "Members contribute a fixed amount each cycle. One member receives the full pool per round, rotating until everyone has collected.",
    stat: "$500 avg payout",
    statLabel: "per cycle",
    features: ["Fixed contributions", "Rotating payouts", "10 max members"],
    icon: IconAjo,
    color: "#FBCC5C",
    colorName: "celo-gold",
    gradientFrom: "from-celo-gold/15",
    gradientVia: "via-celo-gold/5",
    borderColor: "border-celo-gold/20",
    borderHover: "group-hover:border-celo-gold/40",
    shadow: "group-hover:shadow-celo-gold/15",
  },
  {
    id: "goal",
    name: "Goal Pool",
    tag: "Shared Target",
    description:
      "Everyone contributes toward a shared goal amount. When the target is reached, funds go to the group wallet automatically.",
    stat: "Shared wallet",
    statLabel: "on-chain vault",
    features: ["Goal tracking", "Auto-payout at target", "Transparent ledger"],
    icon: IconGoal,
    color: "#008751",
    colorName: "ng-green",
    gradientFrom: "from-ng-green/15",
    gradientVia: "via-ng-green/5",
    borderColor: "border-ng-green/20",
    borderHover: "group-hover:border-ng-green/40",
    shadow: "group-hover:shadow-ng-green/15",
  },
  {
    id: "emergency",
    name: "Emergency Fund",
    tag: "Collective Safety Net",
    description:
      "A pooled emergency wallet. Members can request withdrawals with group approval through the agent.",
    stat: "Vote-based",
    statLabel: "approval system",
    features: ["Group voting", "Emergency requests", "Agent-managed"],
    icon: IconEmergency,
    color: "#2A3CB0",
    colorName: "celo-purple",
    gradientFrom: "from-celo-purple/15",
    gradientVia: "via-celo-purple/5",
    borderColor: "border-celo-purple/20",
    borderHover: "group-hover:border-celo-purple/40",
    shadow: "group-hover:shadow-celo-purple/15",
  },
  {
    id: "flex",
    name: "Flex",
    tag: "No Commitment Required",
    description:
      "No fixed schedule or amount. Members contribute anytime toward a shared goal and can withdraw their portion freely.",
    stat: "Zero lock-in",
    statLabel: "withdraw anytime",
    features: ["Flexible amounts", "No penalties", "Free withdrawals"],
    icon: IconFlex,
    color: "#8E8E96",
    colorName: "white",
    gradientFrom: "from-white/10",
    gradientVia: "via-white/5",
    borderColor: "border-white/10",
    borderHover: "group-hover:border-white/25",
    shadow: "group-hover:shadow-white/5",
  },
];

function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(springY, [0, 1], [8, -8]);
  const rotateY = useTransform(springX, [0, 1], [-8, 8]);

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }

  function handleLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <motion.div
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FeatureList({ features, color }: { features: string[]; color: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {features.map((f) => (
        <span
          key={f}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-text-secondary"
        >
          <IconCheck className="h-3 w-3" style={{ color }} />
          {f}
        </span>
      ))}
    </div>
  );
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function ProductCards() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="products" className="relative overflow-hidden px-6 py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-deep-navy via-navy-light/30 to-deep-navy" />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(251, 204, 92, 0.08) 1px, transparent 0),
            radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.04) 1px, transparent 0)
          `,
          backgroundSize: "24px 24px, 12px 12px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border-glass bg-surface-glass px-4 py-1 backdrop-blur-md">
            <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-celo-gold" />
            <span className="text-xs tracking-widest text-text-secondary uppercase">Products</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Four ways to{" "}
            <span className="bg-gradient-to-r from-celo-gold via-ng-green to-celo-purple bg-clip-text text-transparent">
              save together
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-secondary">
            Pick the style that fits your group. Your agent handles the rest.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-6 md:grid-cols-2"
        >
          {products.map((product, i) => {
            const Icon = product.icon;
            const isActive = activeIndex === i;

            return (
              <motion.div
                key={product.id}
                variants={item}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <TiltCard
                  className={`group relative cursor-default overflow-hidden rounded-3xl border ${product.borderColor} bg-gradient-to-br ${product.gradientFrom} ${product.gradientVia} to-transparent transition-all duration-500 ${product.borderHover} ${product.shadow} hover:shadow-2xl`}
                >
                  <div
                    className={`absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                    style={{
                      background: `linear-gradient(135deg, ${product.color}22, transparent 50%, ${product.color}11)`,
                    }}
                  />

                  <div className="relative p-8">
                    <div className="flex items-start justify-between">
                      <div
                        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${product.gradientFrom} ${product.gradientVia} to-transparent backdrop-blur-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
                        style={{ color: product.color }}
                      >
                        <Icon className="h-7 w-7" />
                      </div>

                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs"
                        >
                          <span className="tabular-nums font-medium text-white" style={{ color: product.color }}>
                            {product.stat}
                          </span>
                          <span className="text-text-secondary">{product.statLabel}</span>
                        </motion.div>
                      )}
                    </div>

                    <div className="mt-1">
                      <h3 className="text-2xl font-semibold text-white">{product.name}</h3>
                      <span className="mt-1 inline-block text-sm text-text-secondary">{product.tag}</span>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-text-secondary">{product.description}</p>

                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: isActive ? "auto" : 0,
                        opacity: isActive ? 1 : 0,
                      }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-5">
                        <FeatureList features={product.features} color={product.color} />
                      </div>
                    </motion.div>

                    <div className="mt-6 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-white/20 transition-all duration-300 group-hover:text-white/50">
                      <span>Explore {product.name}</span>
                      <IconArrowRight className="h-3.5 w-3.5 transition-all duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </section>
  );
}
