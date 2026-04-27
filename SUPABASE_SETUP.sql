-- Supabase mein yeh SQL run karo (SQL Editor mein paste karo)
-- Table: license_keys

CREATE TABLE IF NOT EXISTS license_keys (
  id         BIGSERIAL PRIMARY KEY,
  key        TEXT UNIQUE NOT NULL,
  active     BOOLEAN DEFAULT TRUE,
  plan       TEXT DEFAULT 'monthly',   -- monthly / yearly / lifetime
  expiry     TIMESTAMPTZ,
  note       TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_license_keys_key ON license_keys(key);

-- Row Level Security OFF (service role key use ho raha hai)
ALTER TABLE license_keys DISABLE ROW LEVEL SECURITY;

-- Master key insert karo (agar chahte ho)
INSERT INTO license_keys (key, active, plan, expiry, note)
VALUES (
  'KWT-MASTER-000000-000000',
  TRUE,
  'lifetime',
  '2099-12-31 00:00:00+00',
  'Master key'
) ON CONFLICT (key) DO NOTHING;1
