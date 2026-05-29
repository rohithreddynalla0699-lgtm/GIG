create extension if not exists pgcrypto;

create table public.partner_accounts (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique,
  email text not null unique,
  account_status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint partner_accounts_account_status_check
    check (account_status in ('active', 'inactive')),
  constraint partner_accounts_email_not_blank_check
    check (length(btrim(email)) > 0)
);

create table public.customer_accounts (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique,
  email text not null unique,
  name text not null,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customer_accounts_email_not_blank_check
    check (length(btrim(email)) > 0),
  constraint customer_accounts_name_not_blank_check
    check (length(btrim(name)) > 0)
);

create table public.partner_stores (
  id uuid primary key default gen_random_uuid(),
  partner_account_id uuid not null unique references public.partner_accounts(id) on delete cascade,
  name text not null,
  area text not null,
  city text not null,
  address_line_1 text not null,
  address_line_2 text,
  state_region text,
  postal_code text,
  country_code text not null default 'IN',
  pickup_instructions text,
  store_image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint partner_stores_name_not_blank_check
    check (length(btrim(name)) > 0),
  constraint partner_stores_area_not_blank_check
    check (length(btrim(area)) > 0),
  constraint partner_stores_city_not_blank_check
    check (length(btrim(city)) > 0),
  constraint partner_stores_address_line_1_not_blank_check
    check (length(btrim(address_line_1)) > 0),
  constraint partner_stores_country_code_not_blank_check
    check (length(btrim(country_code)) > 0)
);

create index partner_stores_city_area_idx on public.partner_stores (city, area);

create table public.rescue_bag_types (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.partner_stores(id) on delete cascade,
  title text not null,
  listing_type text not null,
  category text not null,
  original_price_amount integer not null,
  rescue_price_amount integer not null,
  veg_type text not null,
  dietary_tags text[] not null default '{}',
  allergen_note text not null,
  collection_instructions text not null,
  short_description text,
  default_pickup_start_time time not null,
  default_pickup_end_time time not null,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint rescue_bag_types_title_not_blank_check
    check (length(btrim(title)) > 0),
  constraint rescue_bag_types_category_not_blank_check
    check (length(btrim(category)) > 0),
  constraint rescue_bag_types_listing_type_check
    check (listing_type in ('surprise_bag', 'fixed_meal_box')),
  constraint rescue_bag_types_veg_type_check
    check (veg_type in ('veg', 'non_veg', 'mixed', 'egg')),
  constraint rescue_bag_types_status_check
    check (status in ('draft', 'live', 'archived')),
  constraint rescue_bag_types_price_positive_check
    check (original_price_amount > 0 and rescue_price_amount > 0),
  constraint rescue_bag_types_price_order_check
    check (original_price_amount >= rescue_price_amount),
  constraint rescue_bag_types_pickup_window_check
    check (default_pickup_end_time > default_pickup_start_time)
);

create index rescue_bag_types_store_id_idx on public.rescue_bag_types (store_id);
create index rescue_bag_types_store_status_idx on public.rescue_bag_types (store_id, status);

create table public.daily_bag_availability (
  id uuid primary key default gen_random_uuid(),
  rescue_bag_type_id uuid not null references public.rescue_bag_types(id) on delete cascade,
  service_date date not null,
  daily_quantity integer not null,
  quantity_left integer not null,
  pickup_start_time time not null,
  pickup_end_time time not null,
  is_archived_for_day boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint daily_bag_availability_quantity_positive_check
    check (daily_quantity > 0),
  constraint daily_bag_availability_quantity_left_check
    check (quantity_left >= 0 and quantity_left <= daily_quantity),
  constraint daily_bag_availability_pickup_window_check
    check (pickup_end_time > pickup_start_time),
  constraint daily_bag_availability_unique_type_date
    unique (rescue_bag_type_id, service_date)
);

create index daily_bag_availability_service_date_quantity_left_idx
  on public.daily_bag_availability (service_date, quantity_left);
create index daily_bag_availability_service_date_archived_idx
  on public.daily_bag_availability (service_date, is_archived_for_day);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_account_id uuid not null references public.customer_accounts(id) on delete restrict,
  store_id uuid not null references public.partner_stores(id) on delete restrict,
  rescue_bag_type_id uuid not null references public.rescue_bag_types(id) on delete restrict,
  daily_bag_availability_id uuid not null references public.daily_bag_availability(id) on delete restrict,
  quantity integer not null default 1,
  status text not null default 'new_reserved',
  pickup_code text not null,
  ordered_at timestamptz not null default now(),
  pickup_date date not null,
  pickup_start_time time not null,
  pickup_end_time time not null,
  customer_name_snapshot text not null,
  customer_phone_masked_snapshot text not null,
  store_name_snapshot text not null,
  store_area_snapshot text not null,
  store_city_snapshot text not null,
  listing_title_snapshot text not null,
  rescue_price_amount_snapshot integer not null,
  collection_instructions_snapshot text not null,
  support_note text,
  issue_note text,
  support_follow_up_status text,
  support_follow_up_note text,
  support_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_quantity_phase_1_check
    check (quantity = 1),
  constraint orders_status_check
    check (status in ('new_reserved', 'ready_for_pickup', 'collected', 'no_show', 'cancelled', 'issue_reported')),
  constraint orders_pickup_window_check
    check (pickup_end_time > pickup_start_time),
  constraint orders_pickup_code_not_blank_check
    check (length(btrim(pickup_code)) > 0),
  constraint orders_customer_name_snapshot_not_blank_check
    check (length(btrim(customer_name_snapshot)) > 0),
  constraint orders_customer_phone_masked_snapshot_not_blank_check
    check (length(btrim(customer_phone_masked_snapshot)) > 0),
  constraint orders_store_name_snapshot_not_blank_check
    check (length(btrim(store_name_snapshot)) > 0),
  constraint orders_store_area_snapshot_not_blank_check
    check (length(btrim(store_area_snapshot)) > 0),
  constraint orders_store_city_snapshot_not_blank_check
    check (length(btrim(store_city_snapshot)) > 0),
  constraint orders_listing_title_snapshot_not_blank_check
    check (length(btrim(listing_title_snapshot)) > 0),
  constraint orders_collection_instructions_snapshot_not_blank_check
    check (length(btrim(collection_instructions_snapshot)) > 0),
  constraint orders_rescue_price_amount_snapshot_positive_check
    check (rescue_price_amount_snapshot > 0),
  constraint orders_support_follow_up_status_check
    check (
      support_follow_up_status is null
      or support_follow_up_status in ('needs_follow_up', 'reviewed')
    ),
  constraint orders_support_follow_up_requires_issue_reported_check
    check (
      support_follow_up_status is null
      or status = 'issue_reported'
    ),
  constraint orders_support_reviewed_at_requires_reviewed_status_check
    check (
      support_reviewed_at is null
      or support_follow_up_status = 'reviewed'
    ),
  constraint orders_pickup_code_unique_per_store_date
    unique (store_id, pickup_date, pickup_code)
);

create index orders_customer_account_id_idx on public.orders (customer_account_id);
create index orders_store_id_idx on public.orders (store_id);
create index orders_daily_bag_availability_id_idx on public.orders (daily_bag_availability_id);
create index orders_store_status_pickup_date_idx on public.orders (store_id, status, pickup_date);
create index orders_customer_ordered_at_desc_idx on public.orders (customer_account_id, ordered_at desc);
create index orders_status_ordered_at_desc_idx on public.orders (status, ordered_at desc);
