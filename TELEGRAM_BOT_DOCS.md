# Paycon Telegram Bot — Developer Documentation

**Bot:** [@PayconAgentBot](https://t.me/PayconAgentBot)
**Project:** Paycon — AI-powered group savings on Celo (Ajo/Esusu)

---

## Overview

The Paycon Telegram Bot allows users to manage their group savings circles entirely
from Telegram. It supports public and private groups, contribution tracking,
cycle management, and wallet-based payouts on Celo.

---

## Architecture

```
Telegram User
     |
     v
   [@PayconAgentBot] ---> Paycon API (Next.js)
                               |
                               v
                           Supabase DB
                               |
                               v
                        Celo Blockchain
                         (USDm transfers)
```

The bot communicates with the Paycon backend API. For n8n-based automation
(notifications, reminders), a shared secret key is used.

---

## Database Schema

All tables exist in the `public` schema of the Supabase project.

### `users`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID PK | Auto-generated |
| name | TEXT | Display name |
| email | TEXT | Unique, auto-generated from wallet |
| telegram_chat_id | TEXT UNIQUE | Telegram chat ID (link accounts) |
| wallet_address | TEXT | Linked Celo wallet |
| wallet_private_key_encrypted | TEXT | (Future) encrypted key for gasless tx |
| created_at | TIMESTAMPTZ | |

### `groups` (savings groups)

| Column | Type | Description |
|--------|------|-------------|
| id | UUID PK | |
| name | TEXT | Group name |
| description | TEXT | Optional description |
| saving_type | TEXT | `ajo`, `goal-pool`, `emergency`, `flex` |
| visibility | TEXT | `public`, `private`, `invite-only` |
| invite_code | TEXT UNIQUE | Code used to join group |
| contribution_amount | DECIMAL(18,6) | Amount per cycle |
| contribution_frequency | TEXT | `daily`, `weekly`, `biweekly`, `monthly` |
| max_members | INTEGER | |
| target_amount | DECIMAL(18,6) | For goal-pool type |
| current_cycle | INTEGER | Currently active cycle |
| total_cycles | INTEGER | Total number of cycles |
| pool_balance | DECIMAL(18,6) | Current pool balance |
| pool_wallet_address | TEXT | Group's pool wallet on Celo |
| status | TEXT | `active`, `completed`, `cancelled` |
| admin_user_id | UUID FK→users | Group creator/admin |
| created_at | TIMESTAMPTZ | |
| ends_at | TIMESTAMPTZ | |

### `members`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID PK | |
| group_id | UUID FK→groups | |
| user_id | UUID FK→users | |
| position | INTEGER | Position in cycle order |
| total_contributed | DECIMAL(18,6) | Lifetime contributed |
| next_payout_cycle | INTEGER | Cycle when user gets payout |
| status | TEXT | `active`, `left`, `removed` |
| joined_at | TIMESTAMPTZ | |

### `contributions`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID PK | |
| group_id | UUID FK→groups | |
| member_id | UUID FK→members | |
| amount | DECIMAL(18,6) | |
| token | TEXT | Default: `USDm` |
| tx_hash | TEXT | Celo transaction hash |
| cycle_number | INTEGER | |
| status | TEXT | `confirmed`, `pending`, `failed` |
| created_at | TIMESTAMPTZ | |

### `cycles`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID PK | |
| group_id | UUID FK→groups | |
| cycle_number | INTEGER | |
| payout_member_id | UUID FK→members | Who gets payout |
| payout_amount | DECIMAL(18,6) | |
| payout_tx_hash | TEXT | Celo tx for payout |
| status | TEXT | `open`, `closed` |
| start_at | TIMESTAMPTZ | |
| end_at | TIMESTAMPTZ | |

### `group_invites`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID PK | |
| group_id | UUID FK→groups | |
| invite_code | TEXT | |
| created_by | UUID FK→users | |
| max_uses | INTEGER | |
| used_count | INTEGER | |
| expires_at | TIMESTAMPTZ | |
| is_active | BOOLEAN | |
| created_at | TIMESTAMPTZ | |

---

## API Endpoints

Base URL: `https://paycon.vercel.app/api` (or your deployed URL)

### Authentication

For **user-facing requests**, the bot uses a session cookie. The flow:
1. User shares wallet address
2. Bot calls `POST /api/auth/nonce` to get a nonce
3. Bot requests user to sign the message `Welcome to Paycon\n\nSign this message to verify your wallet and access your dashboard.\n\nAddress: {address}\nNonce: {nonce}\n\nThis request will not trigger a blockchain transaction or cost any gas fees.`
4. Bot calls `POST /api/auth/verify` with `{ address, signature, nonce }`
5. Response includes `token` — store this and send as cookie for subsequent requests

For **n8n/scheduler requests**, use header `x-api-key: {N8N_API_KEY}`.

### Groups

#### `GET /api/groups`
Query params:
- `visibility` — filter by `public`, `private`, `invite-only`
- `status` — filter by `active`, `completed`, `cancelled`
- `my=true` — only groups the current user is a member of
- `limit` — max results (default 20)

Response: `{ groups: [...], total: number }`

#### `POST /api/groups`
Create a new savings group.
Body:
```json
{
  "name": "Office Fund",
  "description": "Weekly savings for office",
  "savingType": "ajo",
  "visibility": "public",
  "contributionAmount": "50",
  "contributionFrequency": "weekly",
  "maxMembers": 10,
  "totalCycles": 10,
  "targetAmount": "5000"
}
```

Response: `{ group: { id, name, savingType, inviteCode, status } }`

#### `GET /api/groups/:id`
Get full group details including members, contributions, and cycles.

Response: `{ group, members: [...], contributions: [...], cycles: [...] }`

#### `POST /api/groups/:id/join`
Join a group. Requires authentication.

Body: `{}` (user is inferred from session)

Response: `{ member: { id, groupId, userId, status } }`

#### `POST /api/groups/:id/contribute`
Record a contribution.

Body: `{ amount?: string, txHash?: string }`
- If `txHash` is provided, the contribution is marked as `confirmed`.
- If omitted, it's marked `pending`.

Response: `{ contribution: { id, amount, status } }`

#### `DELETE /api/groups/:id`
Cancel a group (admin only). Sets status to `cancelled`.

### Scheduler / Automation

#### `GET /api/scheduler/due-contributions`
Returns all contributions due today. Requires `x-api-key` header.

Response: `{ dueContributions: [...], total: number }`

---

## Bot Features & Workflows

### 1. User Onboarding (`/start`)

```
User: /start
Bot: Welcome to Paycon! 🎉
      I help you manage group savings on Celo.
      
      Use /connect to link your wallet.
      Use /create to start a savings group.
      Use /join <code> to join a group.
      Use /groups to view your groups.
      Use /help for all commands.
```

### 2. Connect Wallet (`/connect`)

Two methods:

**Method A — MiniPay (Celo mobile wallet)**
```
User: /connect
Bot: Detected MiniPay! Auto-connecting...

[Bot calls POST /api/auth/minipay-verify with wallet address]
```

**Method B — External wallet (MetaMask, etc.)**
```
User: /connect 0x1234...
Bot: Great! Sign this message to verify your wallet:

     "Welcome to Paycon
     
     Sign this message to verify your wallet...
     Address: 0x1234...
     Nonce: abc-123-def"

     Send me the signature.

User: 0xsig...
Bot: ✅ Wallet linked successfully! You're now connected.
```

### 3. Create Group (`/create`)

Step-by-step conversation:

```
User: /create
Bot: Let's create a savings group! What's the group name?

User: Office Fund
Bot: What type of savings?
     1. Ajo (rotating savings)
     2. Goal Pool (fixed target)
     3. Emergency Fund
     4. Flex (custom)

User: 1
Bot: How much per contribution? (in USD)

User: 50
Bot: How often?
     1. Daily
     2. Weekly
     3. Biweekly
     4. Monthly

User: 2
Bot: Maximum number of members?

User: 10
Bot: Total number of cycles?

User: 10
Bot: Should this group be public or private?

User: public
Bot: ✅ Group "Office Fund" created!
     Invite Code: SAVE-A1B2C3
     
     Share this code for others to join.
```

### 4. Join Group (`/join`)

```
User: /join SAVE-A1B2C3
Bot: Joining "Office Fund"...
     ✅ You're now a member!
     
     Next contribution: $50 (weekly)
     Your position in cycle: #3
```

### 5. View Groups (`/groups`)

```
User: /groups
Bot: Your Groups:
     
     1. 🏢 Office Fund — Ajo
        $50/week · Cycle 2/10 · $300 pooled
        → Status: ✅ Active
     
     2. 🏠 Rent Pool — Goal Pool
        $25/biweekly · 64% to target
        → Status: ✅ Active
```

### 6. View Group Details (`/group <id>`)

```
User: /group 1
Bot: 🏢 Office Fund
     Type: Ajo · $50/week
     Members: 4/10
     Pool: $300.00
     Cycle: 2/10
     
     Members:
     1. 🟢 @user1 — Admin
     2. 🟢 @user2
     3. ⏳ @user3 (pending)
     4. 🟢 @user4
     
     Recent Contributions:
     • @user1 — $50 ✅
     • @user2 — $50 ✅
     • @user3 — $50 ⏳
```

### 7. Contribute (`/contribute <group_id>`)

**Option A — In-App (bot generates payment link)**

```
User: /contribute 1
Bot: Send $50 to the group pool wallet:
     0xPoolWalletAddress
     
     Send me the transaction hash when done.

User: 0xtx...
Bot: ✅ Contribution of $50 recorded! 
     Pool is now at $300/$400 for this cycle.
```

**Option B — Via MiniPay direct integration**

```
User: /contribute 1
Bot: Initiating MiniPay contribution of $50...
     ✅ Transaction confirmed! 
     Tx: 0xtx...
```

### 8. Notifications (via n8n scheduler)

The scheduler endpoint `GET /api/scheduler/due-contributions` is called
periodically (e.g., every hour) by an n8n workflow using the API key.

When contributions are due, the bot sends a reminder:

```
Bot: ⏰ Reminder!
     Your $50 contribution to "Office Fund" is due.
     Pay with: /contribute 1
```

When a cycle closes and a payout is ready:

```
Bot: 🎉 Cycle 2 complete!
     @winner has received $200 payout.
     
     Cycle 3 is now open.
     Next contributions due in 7 days.
```

### 9. Admin Actions

Only the group admin can:

- **Cancel group**: `/cancel <group_id>`
- **Remove member**: `/remove <group_id> <user_id>`
- **Close cycle & trigger payout**: `/close-cycle <group_id>`
- **Generate invite code**: `/invite <group_id>`

---

## Public vs Private Groups

### Public Groups
- Visible in the Explore page and via `/explore` command
- Anyone can join without an invite code
- Listed in `GET /api/groups?visibility=public`

### Private Groups
- Hidden from Explore
- Join requires the invite code
- Invite code is generated on creation
- Admin can generate additional codes via `/invite`

### Invite-Only Groups
- Similar to private
- Admin must explicitly add members or share invite codes
- Invite codes can have usage limits and expiration

---

## Security

1. **Authentication**: All user API routes require a valid session (cookie-based)
2. **API Keys**: Scheduler/n8n routes require `x-api-key` header matching `N8N_API_KEY` env var
3. **Wallet Verification**: Signature verification uses `ecrecover` on Celo
4. **RLS**: All database tables have Row Level Security enabled
5. **Group Admin**: Only the group creator can delete/update the group

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Supabase PostgreSQL connection string |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID (for RainbowKit) |
| `N8N_API_KEY` | Shared secret for n8n/scheduler requests |
| `TELEGRAM_BOT_TOKEN` | Bot token from BotFather |
| `CELO_RPC_URL` | Celo RPC (default: https://forno.celo.org) |
| `KORAPAY_SECRET_KEY` | (Optional) for fiat on-ramp |
| `KORAPAY_PUBLIC_KEY` | (Optional) for fiat on-ramp |

---

## Example n8n Workflow: Contribution Reminders

```
1. Cron: Every 6 hours
2. HTTP Request: GET https://paycon.vercel.app/api/scheduler/due-contributions
   Headers: x-api-key: {{N8N_API_KEY}}
3. For each dueContribution:
   - Check user's telegram_chat_id from DB
   - Send Telegram message via bot API:
     https://api.telegram.org/bot{{TELEGRAM_BOT_TOKEN}}/sendMessage
     Body: { chat_id: "...", text: "⏰ Reminder! Your $50 contribution to 'Office Fund' is due." }
```

---

## Testing the Bot

1. Open Telegram and search for [@PayconAgentBot](https://t.me/PayconAgentBot)
2. Send `/start` to begin
3. Use `/help` to see all available commands
4. Create a test group with `/create`
5. Share the invite code with another Telegram user to test `/join`

---

## Development Setup

```bash
# 1. Clone and install
cd defai-group-savings
pnpm install

# 2. Set up .env.local (copy from .env.example)
#    Make sure DATABASE_URL points to Supabase

# 3. Run the dev server
pnpm dev

# 4. Set up Telegram bot webhook
#    Point your bot to: https://your-domain.vercel.app/api/bot/webhook
#    or use polling in development
```

---

## Contact

For questions about the API or database schema, refer to:
- `src/lib/db/schema.ts` — Drizzle schema definitions
- `src/app/api/` — All API route implementations
- `src/lib/api-auth.ts` — Authentication helpers
