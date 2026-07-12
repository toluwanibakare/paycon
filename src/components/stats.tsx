"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { IconAjo, IconNetwork, IconPlatform, IconAuto } from "./icons";

const stats = [
  { label: "Saving Styles", value: "4", desc: "Ajo to Flex", icon: IconAjo },
  { label: "Network", value: "Celo", desc: "Mainnet", icon: IconNetwork },
  { label: "Platforms", value: "3", desc: "Web, Telegram, WhatsApp", icon: IconPlatform },
  { label: "Payout Model", value: "Auto", desc: "Agent-managed", icon: IconAuto },
];

function AnimatedValue({ value }: { value: string }) {
  const [displayed, setDisplayed] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const num = Number(value);
          if (isNaN(num)) {
            setDisplayed(value);
            return;
          }
          const startTime = Date.now();
          const duration = 1500;
          const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayed(String(Math.floor(eased * num)));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {value === "Celo" || value === "Auto" ? value : displayed}
    </span>
  );
}

export default function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 1, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-6 py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-deep-navy via-navy-light to-deep-navy" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(251, 204, 92, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251, 204, 92, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-celo-gold/5 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-ng-green/5 blur-[120px]" />

      <motion.div style={{ opacity }} className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border-glass bg-surface-glass px-4 py-1 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-celo-gold" />
            <span className="text-xs tracking-widest text-text-secondary uppercase">Overview</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need in one place
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="group relative overflow-hidden rounded-2xl border border-border-glass bg-gradient-to-br from-surface-glass to-white/[0.02] p-6 transition-all duration-500 hover:border-white/15 hover:shadow-2xl hover:shadow-celo-gold/5"
              >
                <div className="pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full bg-gradient-to-br from-celo-gold/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-celo-gold/20 to-ng-green/10 text-celo-gold transition-all duration-500 group-hover:scale-110 group-hover:rotate-2 group-hover:from-celo-gold/30 group-hover:to-ng-green/20">
                  <Icon className="h-6 w-6" />
                </div>

                <div className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
                  <AnimatedValue value={stat.value} />
                </div>
                <div className="mt-1 text-sm font-medium text-white/70">
                  {stat.label}
                </div>
                <div className="mt-0.5 text-xs text-text-secondary">
                  {stat.desc}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </section>
  );
}
