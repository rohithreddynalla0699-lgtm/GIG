revoke all on table public.partner_accounts from public;
revoke all on table public.partner_accounts from anon;
revoke all on table public.partner_accounts from authenticated;

revoke all on table public.customer_accounts from public;
revoke all on table public.customer_accounts from anon;
revoke all on table public.customer_accounts from authenticated;

revoke all on table public.partner_stores from public;
revoke all on table public.partner_stores from anon;
revoke all on table public.partner_stores from authenticated;

revoke all on table public.rescue_bag_types from public;
revoke all on table public.rescue_bag_types from anon;
revoke all on table public.rescue_bag_types from authenticated;

revoke all on table public.daily_bag_availability from public;
revoke all on table public.daily_bag_availability from anon;
revoke all on table public.daily_bag_availability from authenticated;

revoke all on table public.orders from public;
revoke all on table public.orders from anon;
revoke all on table public.orders from authenticated;

grant select on table public.partner_accounts to authenticated;
grant select on table public.customer_accounts to authenticated;
grant select on table public.partner_stores to authenticated;
grant select on table public.rescue_bag_types to authenticated;
grant select on table public.daily_bag_availability to authenticated;
grant select on table public.orders to authenticated;

alter table public.partner_accounts enable row level security;
alter table public.customer_accounts enable row level security;
alter table public.partner_stores enable row level security;
alter table public.rescue_bag_types enable row level security;
alter table public.daily_bag_availability enable row level security;
alter table public.orders enable row level security;

create policy "partner_accounts_select_own"
on public.partner_accounts
for select
to authenticated
using (auth.uid() = auth_user_id);

create policy "customer_accounts_select_own"
on public.customer_accounts
for select
to authenticated
using (auth.uid() = auth_user_id);

create policy "partner_stores_select_own_store"
on public.partner_stores
for select
to authenticated
using (
  exists (
    select 1
    from public.partner_accounts
    where partner_accounts.id = partner_stores.partner_account_id
      and partner_accounts.auth_user_id = auth.uid()
  )
);

create policy "rescue_bag_types_select_own_store"
on public.rescue_bag_types
for select
to authenticated
using (
  exists (
    select 1
    from public.partner_stores
    join public.partner_accounts
      on partner_accounts.id = partner_stores.partner_account_id
    where partner_stores.id = rescue_bag_types.store_id
      and partner_accounts.auth_user_id = auth.uid()
  )
);

create policy "daily_bag_availability_select_own_store"
on public.daily_bag_availability
for select
to authenticated
using (
  exists (
    select 1
    from public.rescue_bag_types
    join public.partner_stores
      on partner_stores.id = rescue_bag_types.store_id
    join public.partner_accounts
      on partner_accounts.id = partner_stores.partner_account_id
    where rescue_bag_types.id = daily_bag_availability.rescue_bag_type_id
      and partner_accounts.auth_user_id = auth.uid()
  )
);

create policy "orders_select_own_customer_orders"
on public.orders
for select
to authenticated
using (
  exists (
    select 1
    from public.customer_accounts
    where customer_accounts.id = orders.customer_account_id
      and customer_accounts.auth_user_id = auth.uid()
  )
);

create policy "orders_select_own_store_orders"
on public.orders
for select
to authenticated
using (
  exists (
    select 1
    from public.partner_stores
    join public.partner_accounts
      on partner_accounts.id = partner_stores.partner_account_id
    where partner_stores.id = orders.store_id
      and partner_accounts.auth_user_id = auth.uid()
  )
);
