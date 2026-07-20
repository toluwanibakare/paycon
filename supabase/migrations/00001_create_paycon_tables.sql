CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telegram_chat_id TEXT UNIQUE,
  wallet_address TEXT,
  wallet_private_key_encrypted TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  saving_type TEXT NOT NULL CHECK (saving_type IN ('ajo', 'goal-pool', 'emergency', 'flex')),
  visibility TEXT NOT NULL CHECK (visibility IN ('public', 'private', 'invite-only')),
  invite_code TEXT NOT NULL UNIQUE,
  contribution_amount DECIMAL(18,6) NOT NULL,
  contribution_frequency TEXT NOT NULL CHECK (contribution_frequency IN ('daily', 'weekly', 'biweekly', 'monthly')),
  max_members INTEGER NOT NULL,
  target_amount DECIMAL(18,6),
  current_cycle INTEGER DEFAULT 1 NOT NULL,
  total_cycles INTEGER NOT NULL,
  pool_balance DECIMAL(18,6) DEFAULT 0 NOT NULL,
  pool_wallet_address TEXT,
  status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'completed', 'cancelled')),
  admin_user_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  position INTEGER,
  total_contributed DECIMAL(18,6) DEFAULT 0 NOT NULL,
  next_payout_cycle INTEGER,
  status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'left', 'removed')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(group_id, user_id)
);

CREATE TABLE IF NOT EXISTS contributions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id),
  amount DECIMAL(18,6) NOT NULL,
  token TEXT DEFAULT 'USDm' NOT NULL,
  tx_hash TEXT,
  cycle_number INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('confirmed', 'pending', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS cycles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  cycle_number INTEGER NOT NULL,
  payout_member_id UUID REFERENCES members(id),
  payout_amount DECIMAL(18,6),
  payout_tx_hash TEXT,
  status TEXT NOT NULL CHECK (status IN ('open', 'closed')),
  start_at TIMESTAMP WITH TIME ZONE NOT NULL,
  end_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(group_id, cycle_number)
);

CREATE TABLE IF NOT EXISTS group_invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  invite_code TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0 NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view groups" ON groups
  FOR SELECT USING (true);

CREATE POLICY "Members can view members" ON members
  FOR SELECT USING (true);

CREATE POLICY "Members can view contributions" ON contributions
  FOR SELECT USING (true);

CREATE POLICY "Members can view cycles" ON cycles
  FOR SELECT USING (true);

CREATE POLICY "Members can view invites" ON group_invites
  FOR SELECT USING (true);
