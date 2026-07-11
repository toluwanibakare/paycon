import {
  boolean,
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  telegramChatId: text("telegram_chat_id").unique(),
  walletAddress: text("wallet_address"),
  walletPrivateKeyEncrypted: text("wallet_private_key_encrypted"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const groups = pgTable("groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  savingType: text("saving_type", {
    enum: ["ajo", "goal-pool", "emergency", "flex"],
  }).notNull(),
  visibility: text("visibility", {
    enum: ["public", "private", "invite-only"],
  }).notNull(),
  inviteCode: text("invite_code").notNull().unique(),
  contributionAmount: decimal("contribution_amount", {
    precision: 18,
    scale: 6,
  }).notNull(),
  contributionFrequency: text("contribution_frequency", {
    enum: ["daily", "weekly", "biweekly", "monthly"],
  }).notNull(),
  maxMembers: integer("max_members").notNull(),
  targetAmount: decimal("target_amount", { precision: 18, scale: 6 }),
  currentCycle: integer("current_cycle").default(1).notNull(),
  totalCycles: integer("total_cycles").notNull(),
  poolBalance: decimal("pool_balance", { precision: 18, scale: 6 })
    .default("0")
    .notNull(),
  poolWalletAddress: text("pool_wallet_address"),
  status: text("status", {
    enum: ["active", "completed", "cancelled"],
  })
    .default("active")
    .notNull(),
  adminUserId: uuid("admin_user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  endsAt: timestamp("ends_at"),
});

export const members = pgTable("members", {
  id: uuid("id").defaultRandom().primaryKey(),
  groupId: uuid("group_id")
    .references(() => groups.id)
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  position: integer("position"),
  totalContributed: decimal("total_contributed", {
    precision: 18,
    scale: 6,
  })
    .default("0")
    .notNull(),
  nextPayoutCycle: integer("next_payout_cycle"),
  status: text("status", { enum: ["active", "left", "removed"] })
    .default("active")
    .notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const contributions = pgTable("contributions", {
  id: uuid("id").defaultRandom().primaryKey(),
  groupId: uuid("group_id")
    .references(() => groups.id)
    .notNull(),
  memberId: uuid("member_id")
    .references(() => members.id)
    .notNull(),
  amount: decimal("amount", { precision: 18, scale: 6 }).notNull(),
  token: text("token").default("USDm").notNull(),
  txHash: text("tx_hash"),
  cycleNumber: integer("cycle_number").notNull(),
  status: text("status", { enum: ["confirmed", "pending", "failed"] })
    .default("pending")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cycles = pgTable("cycles", {
  id: uuid("id").defaultRandom().primaryKey(),
  groupId: uuid("group_id")
    .references(() => groups.id)
    .notNull(),
  cycleNumber: integer("cycle_number").notNull(),
  payoutMemberId: uuid("payout_member_id").references(() => members.id),
  payoutAmount: decimal("payout_amount", { precision: 18, scale: 6 }),
  payoutTxHash: text("payout_tx_hash"),
  status: text("status", { enum: ["open", "closed"] }).notNull(),
  startAt: timestamp("start_at").notNull(),
  endAt: timestamp("end_at"),
});

export const groupInvites = pgTable("group_invites", {
  id: uuid("id").defaultRandom().primaryKey(),
  groupId: uuid("group_id")
    .references(() => groups.id)
    .notNull(),
  inviteCode: text("invite_code").notNull(),
  createdBy: uuid("created_by")
    .references(() => users.id)
    .notNull(),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").default(0).notNull(),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
