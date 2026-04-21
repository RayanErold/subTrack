-- Function to check subscription limit
create or replace function public.check_subscription_limit()
returns trigger as $$
declare
  subscription_count int;
  is_premium boolean;
begin
  -- Check if user has premium status (successful payment)
  select exists (
    select 1 from public.payments
    where user_id = auth.uid()
    and status = 'succeeded'
  ) into is_premium;

  -- If user is premium, allow anything
  if is_premium then
    return new;
  end if;

  -- Count existing subscriptions for this user
  select count(*) into subscription_count
  from public.subscriptions
  where user_id = auth.uid();

  -- If count >= 5, raise exception
  if subscription_count >= 5 then
    raise exception 'Subscription limit reached. Upgrade to Premium to add more.';
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- Trigger to enforce limit
drop trigger if exists enforce_subscription_limit on public.subscriptions;
create trigger enforce_subscription_limit
before insert on public.subscriptions
for each row
execute function public.check_subscription_limit();
