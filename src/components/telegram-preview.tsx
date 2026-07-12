"use client";

import { motion } from "framer-motion";
import { IconSend } from "./icons";

const messages = [
  {
    side: "bot",
    text: "Welcome to Paycon. I can help you create or join a savings group. What would you like to do?",
  },
  {
    side: "user",
    text: "Create a group called Office Fund. 10 people, 50 USDC weekly, 10 weeks.",
  },
  {
    side: "bot",
    text: "Group created. Your invite code is OFFICE10. Share this link with members.",
  },
  {
    side: "user",
    text: "/join OFFICE10",
  },
  {
    side: "bot",
    text: "You joined Office Fund. Position 4 of 10. Next contribution: 50 USDC due July 14.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.25, delayChildren: 0.5 },
  },
};

const msgItem = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function TelegramPreview() {
  return (
    <section id="telegram" className="relative px-6 py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-deep-navy via-navy-light/50 to-deep-navy" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border-glass bg-surface-glass px-4 py-1 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-celo-purple" />
            <span className="text-xs tracking-widest text-text-secondary uppercase">Multi-Channel</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Works where you <span className="bg-gradient-to-r from-celo-purple to-celo-gold bg-clip-text text-transparent">chat</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-secondary">
            Manage groups, contribute, and track progress directly from Telegram.
            No app download required.
          </p>
        </motion.div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-sm"
          >
            <div className="gradient-border overflow-hidden rounded-[2rem]">
              <div className="rounded-[2rem] bg-deep-navy p-0">
                <div className="flex items-center gap-3 border-b border-border-glass px-5 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-celo-gold to-ng-green text-sm font-bold text-deep-navy">
                    P
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">Paycon Bot</span>
                      <span className="h-2 w-2 rounded-full bg-ng-green" />
                    </div>
                    <div className="text-xs text-text-secondary">Online</div>
                  </div>
                  <div className="flex gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-text-secondary" />
                    <div className="h-1.5 w-1.5 rounded-full bg-text-secondary" />
                    <div className="h-1.5 w-1.5 rounded-full bg-text-secondary" />
                  </div>
                </div>

                <div className="bg-gradient-to-b from-[#0D0E1F] to-deep-navy p-5">
                  <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="space-y-3"
                  >
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        variants={msgItem}
                        className={`flex ${msg.side === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                            msg.side === "user"
                              ? "bg-gradient-to-r from-celo-gold to-celo-gold-dark text-deep-navy rounded-br-md"
                              : "bg-white/10 text-white rounded-bl-md"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  <div className="mt-4 flex items-center gap-2 border-t border-border-glass pt-4">
                    <div className="flex-1 rounded-full border border-border-glass bg-white/5 px-4 py-2.5 text-xs text-text-secondary">
                      Type a message...
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-celo-gold to-ng-green transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-celo-gold/30">
                      <IconSend className="h-4 w-4 text-deep-navy" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
