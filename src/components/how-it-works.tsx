"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { IconUsers, IconSend, IconCheck, IconGoal } from "./icons";

const steps = [
  {
    number: "01",
    title: "Create a Group",
    description:
      "Pick your saving style, set the rules, and the agent creates an on-chain pool wallet for your group.",
    icon: IconGoal,
    gradient: "from-celo-gold/20 to-celo-gold/5",
    border: "border-celo-gold/20",
    textColor: "text-celo-gold",
  },
  {
    number: "02",
    title: "Invite Members",
    description:
      "Share an invite code or link. Members join via Telegram or the web app. No wallet required to start.",
    icon: IconUsers,
    gradient: "from-ng-green/20 to-ng-green/5",
    border: "border-ng-green/20",
    textColor: "text-ng-green",
  },
  {
    number: "03",
    title: "Contribute Automatically",
    description:
      "The agent reminds members when contributions are due. Funds settle on Celo in seconds with near-zero fees.",
    icon: IconSend,
    gradient: "from-celo-purple/20 to-celo-purple/5",
    border: "border-celo-purple/20",
    textColor: "text-celo-purple",
  },
  {
    number: "04",
    title: "Receive Payouts",
    description:
      "When the cycle completes or the goal is met, the agent distributes the pool automatically on-chain.",
    icon: IconCheck,
    gradient: "from-white/10 to-white/5",
    border: "border-white/10",
    textColor: "text-white",
  },
];

const itemVariants = (dir: "down" | "up", i: number) => {
  const delay = dir === "down" ? i * 0.12 : (3 - i) * 0.12;
  return {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
    },
  };
};

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollDir, setScrollDir] = useState<"down" | "up">("down");
  const lastY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastY.current + 5) setScrollDir("down");
      else if (current < lastY.current - 5) setScrollDir("up");
      lastY.current = current;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative px-6 py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-deep-navy via-navy-light to-deep-navy" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(0, 135, 81, 0.15) 1px, transparent 0)
          `,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border-glass bg-surface-glass px-4 py-1 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-ng-green" />
            <span className="text-xs tracking-widest text-text-secondary uppercase">How It Works</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Start in{" "}
            <span className="bg-gradient-to-r from-ng-green to-celo-gold bg-clip-text text-transparent">
              four steps
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-secondary">
            From group creation to payout, every step is managed by your agent.
          </p>
        </motion.div>

        <div className="relative">
          <div
            className="pointer-events-none absolute left-8 top-0 bottom-0 w-px md:left-1/2 md:-translate-x-px"
            style={{
              background: `linear-gradient(to bottom, 
                rgba(251, 204, 92, 0.3), 
                rgba(0, 135, 81, 0.3), 
                rgba(42, 60, 176, 0.3), 
                rgba(255, 255, 255, 0.1))`,
            }}
          />

          <div className="space-y-16">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const dir = scrollDir;

              return (
                <motion.div
                  key={step.number}
                  variants={itemVariants(dir, i)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: "-60px" }}
                  className={`relative flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-16 ${
                    i % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className={`flex-1 ${i % 2 === 1 ? "md:text-right" : ""}`}>
                    <span className={`text-xs tracking-widest uppercase ${step.textColor}`}>
                      Step {step.number}
                    </span>
                    <h3 className="mt-2 text-2xl font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                      {step.description}
                    </p>
                  </div>

                  <div className="relative flex-shrink-0">
                    <motion.div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${step.border} bg-gradient-to-br ${step.gradient} ${step.textColor} backdrop-blur-xl`}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <Icon className="h-7 w-7" />
                    </motion.div>
                  </div>

                  <div className="flex-1" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </section>
  );
}
