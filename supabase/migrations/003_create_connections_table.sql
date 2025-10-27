-- Create connections table for OAuth token storage
-- This table stores OAuth tokens for Google and other providers

CREATE TABLE IF NOT EXISTS connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- App's user.id
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Always "google" for now, but future-proof
  provider TEXT NOT NULL DEFAULT 'google',
  
  -- Google's "sub" ID (unique per Google account)
  provider_user_id TEXT NOT NULL,
  
  -- Access token (short-lived)
  access_token TEXT NOT NULL,
  
  -- Refresh token (long-lived, survives reboots)
  refresh_token TEXT NOT NULL,
  
  -- OAuth scope string exactly as provided
  scope TEXT NOT NULL,
  
  token_type TEXT NOT NULL DEFAULT 'Bearer',
  
  -- Expiration time
  expiry TIMESTAMPTZ NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one connection per user per provider
  UNIQUE(user_id, provider)
);

-- For fast lookup
CREATE INDEX IF NOT EXISTS idx_connections_user_provider ON connections(user_id, provider);

-- Enable Row Level Security (RLS)
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can view their own connections
CREATE POLICY "Users can view own connections"
  ON connections FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own connection
CREATE POLICY "Users can insert own connection"
  ON connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own connection
CREATE POLICY "Users can update own connection"
  ON connections FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own connection
CREATE POLICY "Users can delete own connection"
  ON connections FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger to automatically update updated_at on row update
CREATE TRIGGER update_connections_updated_at
  BEFORE UPDATE ON connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

