# DeFAI Group Savings Agent — Project Blueprint

> **Agentic Payments and DeFAI Hackathon** (Jul 7–20, 2026)  
> **Track:** Most Revenue Generated / Askbots  
> **Team:** Toluwani Bakare (Backend + AI) | [Teammate Name] (n8n + Telegram Bot)

---

## 1. What We're Building

An **AI agent** that runs group savings circles (Ajo/Esusu) on Celo. Users form savings groups, contribute USDm regularly, and the agent manages everything — invites, reminders, contributions, and payouts.

**Why this wins:**
- No mature Ajo/Esusu product on Celo — we're first
- Real demand: millions use Ajo in Nigeria/West Africa daily
- AI agent is essential (not a gimmick) — it chases payments, auto-distributes, manages invites
- Every contribution and payout = on-chain volume tracked on the leaderboard
- No capital needed from us — users fund their own pools
- Korapay handles naira on/off ramp

---

## 2. Saving Styles (Products)

There are 4 saving styles we offer:

### 2a. Ajo (Rotating Savings)
- N members, same contribution amount
- Each cycle round, ONE member gets the full pool
- Rotates until everyone has received the lump sum
- Agent tracks whose turn it is, sends payout, reminds next

**Example:**
```
10 people × $50 monthly for 10 months
→ Month 1: Member A gets $500
→ Month 2: Member B gets $500
→ ... until all 10 members have collected
```

### 2b. Goal Pool
- Members contribute toward a shared financial target
- When target is reached → funds go to the group's goal wallet
- Agent tracks progress, shows % completion

**Example:**
```
5 friends save for ₦500K equipment
Each contributes ₦10K weekly
Agent shows: "You're at 60% — ₦300K of ₦500K"
When target hits: funds released to goal wallet
```

### 2c. Emergency Fund
- Members pool into a shared emergency wallet
- Any member can request a withdrawal
- Group votes (via agent) to approve/reject
- Agent handles voting: collects yes/no, tally, executes

### 2d. Flex Savings
- No fixed schedule, no fixed amount
- Members contribute anytime toward a shared goal
- Agent tracks individual balances in the pool
- Can withdraw their portion anytime (no penalty)

---

## 3. Group Types

| Type | Visibility | Join Method | Admin Controls |
|---|---|---|---|
| **Public** | Visible in `/explore` | Anyone can join | Anyone can start |
| **Private** | Hidden from `/explore` | Invite code or link only | Admin approves members |
| **Invite-Only** | Hidden | Only via admin's invite link | Admin controls all access |

Private groups need an **invite code** or **invite link** created by the group admin. When a user joins via code, the admin gets a notification to approve.

---

## 4. Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        Celo Mainnet                              │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  USDm (Mento stablecoin) — all contributions/payouts in    │ │
│  │  USDm                                                      │ │
│  └─────────────────────────────────────────────────────────────┘ │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────┴─────────────────────────────────────┐
│                     Paycon Backend (Next.js)                     │
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │ Group API   │  │ Savings      │  │ Reminder Scheduler     │  │
│  │ (CRUD ops)  │  │ Agent Tools  │  │ (cron + agent checks) │  │
│  └─────────────┘  └──────────────┘  └────────────────────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Supabase / PostgreSQL DB                                  │  │
│  │  users | groups | members | contributions | cycles | logs  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Wallet System (Viem)                                     │  │
│  │  - Create group wallet on group creation                   │  │
│  │  - Execute USDm transfers for contributions                │  │
│  │  - Execute USDm transfers for payouts                      │  │
│  │  - Tag every tx with attribution tag                       │  │
│  └────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────┴───────┐  ┌────────┴────────┐  ┌────────┴────────┐
│  Web Dashboard│  │ Telegram Bot    │  │ WhatsApp Bot    │
│  (Next.js)    │  │ (n8n + TWA API) │  │ (Meta API)      │
│               │  │                 │  │ (Phase 2)       │
│ - Auth        │  │ - Create group  │  │                 │
│ - Dashboard   │  │ - Join group    │  │                 │
│ - Explore     │  │ - Contribute    │  │                 │
│ - Group view  │  │ - Check status  │  │                 │
│ - Profile     │  │ - Get reminders │  │                 │
└───────────────┘  └─────────────────┘  └─────────────────┘
        │                    │
        └────────┬───────────┘
                 │
        ┌────────┴────────┐
        │  Korapay API    │
        │ (Naira → USDm)  │
        │ (USDm → Naira)  │
        └─────────────────┘
```

---

## 5. Database Schema (Supabase)

### `groups`
| Column | Type | Description |
|---|---|---|
| `id` | UUID PK | Auto-generated |
| `name` | TEXT | Group name |
| `description` | TEXT | What the group is for |
| `saving_type` | TEXT | `ajo` / `goal-pool` / `emergency` / `flex` |
| `visibility` | TEXT | `public` / `private` / `invite-only` |
| `invite_code` | TEXT | Unique code for joining |
| `contribution_amount` | DECIMAL | How much per contribution |
| `contribution_frequency` | TEXT | `daily` / `weekly` / `biweekly` / `monthly` |
| `max_members` | INT | Maximum members allowed |
| `target_amount` | DECIMAL | Goal pool target (null for Ajo) |
| `duration_cycles` | INT | Total number of cycles |
| `current_cycle` | INT | Which cycle we're on |
| `total_cycles` | INT | How many cycles total |
| `pool_balance` | DECIMAL | Current USDm in pool |
| `status` | TEXT | `active` / `completed` / `cancelled` |
| `admin_user_id` | UUID | Group creator |
| `created_at` | TIMESTAMP | |
| `ends_at` | TIMESTAMP | When group finishes |

### `members`
| Column | Type | Description |
|---|---|---|
| `id` | UUID PK | |
| `group_id` | UUID FK | References groups |
| `user_id` | UUID FK | References users |
| `position` | INT | Position in rotation (for Ajo) |
| `total_contributed` | DECIMAL | Lifetime contributions |
| `next_payout_position` | INT | When they get paid (for Ajo) |
| `status` | TEXT | `active` / `left` / `removed` |
| `joined_at` | TIMESTAMP | |

### `contributions`
| Column | Type | Description |
|---|---|---|
| `id` | UUID PK | |
| `group_id` | UUID FK | |
| `member_id` | UUID FK | |
| `amount` | DECIMAL | Amount contributed |
| `token` | TEXT | `USDm` |
| `tx_hash` | TEXT | Celo transaction hash |
| `cycle_number` | INT | Which cycle this contributed to |
| `status` | TEXT | `confirmed` / `pending` / `failed` |
| `created_at` | TIMESTAMP | |

### `cycles`
| Column | Type | Description |
|---|---|---|
| `id` | UUID PK | |
| `group_id` | UUID FK | |
| `cycle_number` | INT | Cycle # |
| `payout_member_id` | UUID FK | Who gets the pool this cycle (Ajo) |
| `payout_amount` | DECIMAL | Amount paid out |
| `payout_tx_hash` | TEXT | Celo tx hash |
| `status` | TEXT | `open` / `closed` |
| `start_at` | TIMESTAMP | |
| `end_at` | TIMESTAMP | |

### `group_invites`
| Column | Type | Description |
|---|---|---|
| `id` | UUID PK | |
| `group_id` | UUID FK | |
| `invite_code` | TEXT | Unique code |
| `created_by` | UUID FK | Admin who created it |
| `max_uses` | INT | Null = unlimited |
| `used_count` | INT | How many times used |
| `expires_at` | TIMESTAMP | Optional expiry |
| `is_active` | BOOLEAN | |

---

## 6. API Endpoints

### Group Management
| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/groups` | Create a group |
| `GET` | `/api/groups` | List groups (with filters) |
| `GET` | `/api/groups/:id` | Get group details |
| `PUT` | `/api/groups/:id` | Update group settings (admin) |
| `DELETE` | `/api/groups/:id` | Cancel group (admin) |

### Membership
| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/groups/:id/join` | Join a group (by code or directly) |
| `POST` | `/api/groups/:id/leave` | Leave a group |
| `GET` | `/api/groups/:id/members` | List members |
| `PUT` | `/api/groups/:id/members/:userId/approve` | Admin approves member (private) |
| `DELETE` | `/api/groups/:id/members/:userId` | Admin removes member |

### Contributions
| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/groups/:id/contribute` | Make a contribution (on-chain) |
| `GET` | `/api/groups/:id/contributions` | List contributions |
| `GET` | `/api/groups/:id/my-contributions` | User's contributions to this group |

### Invites
| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/groups/:id/invites` | Create invite code/link |
| `GET` | `/api/groups/:id/invites` | List invite codes |
| `DELETE` | `/api/groups/:id/invites/:code` | Revoke invite code |

### Agent / Bot Webhooks
| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/bot/telegram` | Telegram webhook receiver |
| `POST` | `/api/bot/whatsapp` | WhatsApp webhook receiver (Phase 2) |

### Korapay
| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/korapay/deposit` | Generate virtual account for deposit |
| `POST` | `/api/korapay/webhook` | Handle deposit confirmation |
| `POST` | `/api/korapay/payout` | Send naira payout to users |

---

## 7. User Flows (with Agent Interaction)

### Flow 1: Create a Group (via Telegram)

User sends `/create` to the Telegram bot

n8n workflow receives the command, starts a conversation:

```
Bot: "Let's create your savings group! What type?"
User: "Ajo"
Bot: "How many members?"
User: "10"
Bot: "How much per contribution?"
User: "$50"
Bot: "How often?"
User: "Monthly"
Bot: "Duration (months)?"
User: "10 months"
Bot: "Public or private?"
User: "Public"

Bot: "✅ Group 'Savings Circle' created!
     👥 10 members | $50/month | 10 cycles
     📋 Code: SAVE-ABC123
     🔗 t.me/PayconBot?start=join_SAVE-ABC123
     Invite your friends!"
```

n8n calls `POST /api/groups` with the collected data. Backend:
1. Creates group in DB
2. Generates invite code
3. Creates the admin as first member
4. Returns group details

### Flow 2: Join a Group (via Telegram)

User sends `/join SAVE-ABC123` or clicks invite link

n8n workflow:
1. Calls `GET /api/groups?invite_code=SAVE-ABC123` to validate
2. If private group, sends notification to admin for approval
3. If public, calls `POST /api/groups/:id/join` to add member
4. Responds to user with group details and next steps

```
Bot: "✅ You joined 'Savings Circle'!
     👥 10 members | $50/month | 10 cycles
     📅 Your first contribution: $50 by Jul 14
     💳 Your position: #3 in rotation
     You'll receive the pool on cycle #3
     
     Reply PAY to fund your wallet and contribute"
```

### Flow 3: Contribute (via Telegram)

Bot sends reminder (scheduled in n8n):

```
🤖 Paycon: "Your $50 contribution for 'Savings Circle' is due July 14.
Reply PAY to contribute from your wallet."

User replies: "PAY"
```

n8n workflow:
1. Calls `POST /api/groups/:id/contribute` with user ID
2. Backend initiates on-chain USDm transfer from user's wallet → group pool wallet
3. Backend records contribution in DB
4. Backend returns tx hash
5. Bot replies with confirmation

```
Bot: "✅ Paid! $50 contributed to 'Savings Circle'
     📍 Tx: 0xabc...123
     📊 Pool: $200 / $500
     🎯 Next contribution: Aug 14"
```

### Flow 4: Explore Groups (via Telegram)

User sends `/explore`

n8n workflow:
1. Calls `GET /api/groups?visibility=public&status=active`
2. Formats the response

```
Bot: "📋 Open Savings Groups:

1️⃣ 🏆 Office Fund
   👥 3/10 members | $10/week | Goal: $1,000
   🎯 Est. share: $100
   📋 Code: OFFICE10

2️⃣ 🏠 Rent Pool
   👥 6/8 members | $25/biweekly
   💰 Target: 8 months

3️⃣ 🚀 Side Hustle Fund
   👥 2/5 members | $20/month
   🆕 Just started!

Reply /join CODE to join any group"
```

### Flow 5: Check Group Status (via Telegram)

User sends `/status SAVE-ABC123`

```
Bot: "📊 Savings Circle
     ─────────────────
     🎯 Type: Ajo
     👥 Members: 10
     💰 $50/month × 10 cycles
     
     📍 You: Position #3
     ✅ Paid: 2/10 ($100)
     ⏳ Next payout: Cycle #3
     💵 Est. payout: $500
     
     🔄 Cycle: 2/10
     🏆 Current winner: Member B
     💰 Pool: $1,000 collected
     
     📅 Next contribution: Aug 14"
```

---

## 8. n8n Workflow Blueprint (For Your Teammate)

This section explains what the n8n teammate needs to build.

### Overview

Your teammate will build the **Telegram Bot** layer using **n8n workflows**. The bot handles user interactions and calls our backend API to execute actions.

### High-Level Setup

```
[User on Telegram]
       │
       ▼
[Telegram Bot API] ← → [n8n Webhook]
                           │
                           ▼
              [Our Backend API at paycon.vercel.app]
                           │
                           ▼
                    [Celo Blockchain]
```

### n8n Workflows to Build

#### Workflow 1: `/start` — Welcome & Menu
- **Trigger:** Telegram webhook, command `/start`
- **Actions:**
  1. Extract `chatId`, `userId`
  2. Check if user exists (call `GET /api/users/me?telegram=chatId`)
  3. If new user, register them
  4. Send welcome message with inline keyboard: [Create Group] [Join Group] [Explore] [My Groups]

#### Workflow 2: `/create` — Group Creation Wizard
- **Trigger:** Telegram webhook, command `/create`
- **Actions:**
  1. Present inline keyboard for saving type: Ajo | Goal Pool | Emergency | Flex
  2. Collect answers step by step (use n8n conversation/wait node)
  3. After all answers collected, call `POST /api/groups` with data
  4. Send confirmation with invite code and link

#### Workflow 3: `/join CODE` — Join Group
- **Trigger:** Telegram webhook, command `/join` or deep link `t.me/PayconBot?start=join_CODE`
- **Actions:**
  1. Extract invite code
  2. Call `POST /api/groups/:id/join` (need to resolve code → group ID via `GET /api/groups?invite_code=CODE`)
  3. If private group, notify admin for approval (send message to admin's chat)
  4. Send confirmation to user

#### Workflow 4: `/explore` — Browse Open Groups
- **Trigger:** Telegram webhook, command `/explore`
- **Actions:**
  1. Call `GET /api/groups?visibility=public&status=active&limit=10`
  2. Format response as a clean list
  3. Send to user with inline buttons to join

#### Workflow 5: `/status [CODE]` — Group Status
- **Trigger:** Telegram webhook, command `/status`
- **Actions:**
  1. Extract group code from message
  2. Call `GET /api/groups?invite_code=CODE` to get group ID
  3. Call `GET /api/groups/:id` + `GET /api/groups/:id/members` + `GET /api/groups/:id/my-contributions`
  4. Format nicely and send

#### Workflow 6: `/mygroups` — User's Groups
- **Trigger:** Telegram webhook, command `/mygroups`
- **Actions:**
  1. Extract user's ID
  2. Call `GET /api/groups?member_id=USER_ID`
  3. Send list with status buttons

#### Workflow 7: Reminder Scheduler (CRITICAL)
- **Trigger:** Cron (runs daily at 9:00 AM WAT)
- **Actions:**
  1. Call `GET /api/scheduler/due-contributions` — returns all contributions due today
  2. For each due contribution:
     a. Send reminder message to user's Telegram chat
     b. Include inline button: [💰 Pay Now] [⏰ Remind Later]

#### Workflow 8: Payment Handler
- **Trigger:** Inline button callback from reminder
- **Actions:**
  1. Extract group ID, user ID, amount from callback data
  2. Call `POST /api/groups/:id/contribute`
  3. Wait for confirmation
  4. Send success/failure message to user

#### Workflow 9: Admin Notification (Private Groups)
- **Trigger:** Webhook called by backend when someone requests to join a private group
- **Actions:**
  1. Send admin a message with user info
  2. Inline buttons: [✅ Approve] [❌ Reject]
  3. On callback, call `PUT /api/groups/:id/members/:userId/approve`

### n8n Setup Notes for Teammate

1. **Telegram Bot Token**: Create a bot via `@BotFather` on Telegram, get the token
2. **Webhook URL**: Set Telegram webhook to `https://your-n8n-instance.com/webhook/telegram`
3. **Environment Variables in n8n**:
   - `TELEGRAM_BOT_TOKEN` — your bot token
   - `API_BASE_URL` — `https://paycon.vercel.app/api` (our backend)
   - `ATTRIBUTION_TAG` — `celo_...` (from registration)
4. **Conversation State**: Use n8n's **Wait** node to handle multi-step conversations (group creation wizard)
5. **Error Handling**: Send a friendly error message if the API call fails

### Telegram Bot Interface (Design for Teammate)

```
Main Menu (after /start):
┌─────────────────────────┐
│  💰 Paycon Savings      │
│  Your group savings      │
│  agent on Celo           │
│                         │
│  [🏠 Create Group]      │
│  [🔍 Join Group]        │
│  [📋 Explore Groups]   │
│  [📁 My Groups]         │
│  [ℹ️ Help]              │
└─────────────────────────┘

Inline buttons when someone owes:
[💰 Pay Now] — triggers contribution
[⏰ Remind Later] — snoozes 24 hours
[📊 Status] — shows group progress
```

---

## 9. Smart Contracts

### GroupVault.sol (Minimal — deploy on Celo mainnet)

```solidity
contract GroupVault {
    // Each group gets its own vault
    // Contributions are sent here
    // Payouts are sent from here
    
    address public groupOwner;    // Group admin
    address public agentWallet;   // Our backend wallet
    
    mapping(address => uint) public balances;
    uint public totalBalance;
    
    function deposit() external payable { }
    function withdraw(address to, uint amount) external onlyOwner { }
    function getBalance() view returns (uint) { }
}
```

**Important:** The contract is minimal because MOST logic lives in our backend. The contract is just a secure pool. Our backend signs and executes the transactions.

---

## 10. Team Responsibility Split

| Area | Owner |
|---|---|
| Backend APIs (Next.js routes) | **You (Toluwani)** |
| Database schema & Supabase | **You** |
| On-chain wallet & transaction system | **You** |
| AI Agent tools (Vercel AI SDK / n8n tools) | **You (core logic)** + **Teammate (integration)** |
| Telegram Bot (n8n workflows) | **Teammate** |
| WhatsApp Bot (Phase 2) | **Teammate** |
| Korapay integration | **You** |
| Web Dashboard UI | **You** |
| Celo contract deployment | **You** |
| Registration + attribution tag | **You** |

### How You Two Collaborate

1. **You build the API endpoints** — these are the "source of truth"
2. **Teammate builds n8n workflows** — these call YOUR APIs
3. All n8n does is: receive user message → call API → format response → send back
4. Every on-chain action (contribute, payout, create wallet) happens in YOUR backend, NOT n8n

**API Contract Between You and Teammate:**
- You share the full API spec (endpoints, request/response shapes)
- Teammate builds n8n workflows against that spec
- All auth is via `X-API-Key` header (you generate a key for n8n)

---

## 11. Sprint Plan (13 Days)

| Day | Work |
|---|---|
| **Day 1** | Set up project + DB schema + Korapay account + Telegram bot via BotFather |
| **Day 2** | Build Group API (`POST/GET/DELETE`) + invite code generation |
| **Day 3** | Build Membership API (join, leave, approve) |
| **Day 4** | Build Contribution API + on-chain USDm transfer (Celo mainnet) |
| **Day 5** | Build Scheduler API (due contributions, reminders list) |
| **Day 6** | n8n: Basic setup + `/start` + `/create` wizard workflows |
| **Day 7** | n8n: `/join` + `/explore` + `/status` workflows |
| **Day 8** | n8n: Reminder scheduler + payment handler workflows |
| **Day 9** | Web Dashboard: group browser + group detail page |
| **Day 10** | Web Dashboard: my groups + contribution flow |
| **Day 11** | Korapay integration: virtual accounts + deposit webhook |
| **Day 12** | Testing + bug fixes + attribution tag setup on all txns |
| **Day 13** | Launch on Celo mainnet + register + social post |

---

## 12. Registration + Attribution Tag

Once we're happy:

1. I register us via the Celo Builder skill:
   - `POST /auth/google/start` → Google sign-in link
   - `POST /auth/google/claim` with the short code
   - `PUT /submissions/me` with project name + GitHub + Telegram → we get our `attributionTag`

2. Every transaction Paycon makes on Celo mainnet MUST include this tag:
   ```ts
   import { toDataSuffix } from '@celo/attribution-tags'
   const tx = await wallet.sendTransaction({
     to,
     value,
     data: toDataSuffix('<attributionTag>')
   })
   ```

3. Leaderboard at `https://dune.com/celo/agentic-payments-defai-hackathon` tracks our tagged volume live.

---

## 13. Korapay Integration (Summary)

### Naira → USDm (Deposit)
1. User requests deposit → we call Korapay API to generate a **virtual account number**
2. User sends naira to that account
3. Korapay sends webhook → we credit user's USDm balance in our system
4. User now has USDm to contribute to groups

### USDm → Naira (Withdrawal/Payout)
1. User requests withdrawal → we receive USDm from user's wallet
2. We call Korapay payout API → user gets naira in their bank
3. Both legs (USDm sent + Korapay payout) complete the cycle

---

## 14. Key Differentiators (What Makes Us Win)

1. **First Ajo/Esusu on Celo** — no competitor in this hackathon or on Celo
2. **AI agent is essential** — the agent chases payments, auto-distributes, manages invites. Without it, the product doesn't work.
3. **Multi-channel** — Telegram + Web, adding WhatsApp. Most submissions are web-only.
4. **Real on-chain volume** — every contribution is a USDm transfer tagged with attribution tag. Leaderboard visibility.
5. **Naira on/off ramp** — Korapay makes it usable for real Nigerian users, not just crypto natives.
6. **Social proof** — group savings is deeply cultural in Nigeria. Judges will see real-world impact.
