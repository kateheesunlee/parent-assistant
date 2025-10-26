-- Create settings table
-- This table stores user settings and preferences for the Parent Assistant

create table if not exists settings (
  user_id                uuid primary key references auth.users(id) on delete cascade,
  preferred_language     text default 'auto',
  automation_enabled     boolean default false,
  last_started_at        timestamptz,
  last_stopped_at        timestamptz,
  calendar_id            text,
  calendar_name          text default 'Parent Assistant',
  last_gmail_history_id  text,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table settings enable row level security;

-- Create policy: Users can only view their own settings
create policy "Users can view their own settings"
  on settings for select
  using (auth.uid() = user_id);

-- Create policy: Users can insert their own settings
create policy "Users can insert their own settings"
  on settings for insert
  with check (auth.uid() = user_id);

-- Create policy: Users can update their own settings
create policy "Users can update their own settings"
  on settings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create policy: Users can delete their own settings
create policy "Users can delete their own settings"
  on settings for delete
  using (auth.uid() = user_id);

-- Create trigger to automatically update updated_at on row update
create trigger update_settings_updated_at
  before update on settings
  for each row
  execute function update_updated_at_column();

