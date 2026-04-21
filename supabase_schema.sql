-- Create a table for storing payment records
create table public.payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  amount numeric not null,
  currency text not null default 'USD',
  status text not null check (status in ('pending', 'succeeded', 'failed', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.payments enable row level security;

-- Policy: Users can view their own payments
create policy "Users can view own payments"
  on public.payments for select
  using (auth.uid() = user_id);

-- Policy: Users can insert their own payments (for this mocked flow)
-- In a real production app, only the backend should insert 'succeeded' payments via webhooks.
create policy "Users can insert own payments"
  on public.payments for insert
  with check (auth.uid() = user_id);
