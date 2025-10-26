-- Create children table
-- This table stores information about children and their associated Gmail labels/filters

create table if not exists children (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  name            text not null,
  label_name      text not null,
  label_id        text,
  expected_senders text[] default '{}',
  keywords        text[] default '{}',
  filter_id       text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Create index on user_id for faster queries
create index if not exists idx_children_user_id on children(user_id);

-- Create index on created_at for sorting
create index if not exists idx_children_created_at on children(created_at);

-- Enable Row Level Security (RLS)
alter table children enable row level security;

-- Create policy: Users can only see their own children
create policy "Users can view their own children"
  on children for select
  using (auth.uid() = user_id);

-- Create policy: Users can insert their own children
create policy "Users can insert their own children"
  on children for insert
  with check (auth.uid() = user_id);

-- Create policy: Users can update their own children
create policy "Users can update their own children"
  on children for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create policy: Users can delete their own children
create policy "Users can delete their own children"
  on children for delete
  using (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at on row update
create trigger update_children_updated_at
  before update on children
  for each row
  execute function update_updated_at_column();
