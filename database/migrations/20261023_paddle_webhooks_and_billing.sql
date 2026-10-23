-- Durable, idempotent inbox for every verified Paddle notification.
create table if not exists public.paddle_webhook_events (
  event_id text primary key,
  event_type text not null,
  occurred_at timestamptz not null,
  payload jsonb not null,
  processing_status text not null default 'received'
    check (processing_status in ('received', 'processing', 'processed', 'failed')),
  last_error text,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists paddle_webhook_events_type_occurred_idx
  on public.paddle_webhook_events (event_type, occurred_at desc);

create table if not exists public.paddle_customers (
  customer_id text primary key,
  profile_id uuid references public.profiles(id) on delete set null,
  email text,
  name text,
  status text,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists paddle_customers_profile_idx
  on public.paddle_customers (profile_id);

create table if not exists public.paddle_subscriptions (
  subscription_id text primary key,
  profile_id uuid references public.profiles(id) on delete set null,
  customer_id text,
  status text not null,
  price_id text,
  product_id text,
  currency_code text,
  next_billed_at timestamptz,
  canceled_at timestamptz,
  scheduled_change jsonb,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists paddle_subscriptions_profile_status_idx
  on public.paddle_subscriptions (profile_id, status);

create table if not exists public.paddle_transactions (
  transaction_id text primary key,
  profile_id uuid references public.profiles(id) on delete set null,
  customer_id text,
  subscription_id text,
  status text,
  currency_code text,
  total_amount numeric,
  payment_method_type text,
  card_last4 text,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists paddle_transactions_profile_created_idx
  on public.paddle_transactions (profile_id, created_at desc);

create table if not exists public.paddle_products (
  product_id text primary key,
  name text,
  description text,
  status text,
  image_url text,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.paddle_prices (
  price_id text primary key,
  product_id text,
  name text,
  description text,
  status text,
  currency_code text,
  unit_amount numeric,
  billing_cycle jsonb,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists paddle_prices_product_idx
  on public.paddle_prices (product_id);

create table if not exists public.paddle_adjustments (
  adjustment_id text primary key,
  transaction_id text,
  action text,
  status text,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep this migration usable even if the original Paddle purchases migration
-- has not yet been applied to the target Supabase project.
create table if not exists public.paddle_purchases (
  id uuid primary key default gen_random_uuid(),
  transaction_id text not null unique,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  report_id uuid not null references public.reports(id) on delete cascade,
  purchase_type text not null check (purchase_type in ('report', 'salomon')),
  buyer_email text,
  status text not null check (status in ('completed', 'refunded')),
  amount numeric,
  currency_code text,
  raw_payload jsonb not null default '{}'::jsonb,
  paddle_customer_id text,
  payment_method_type text,
  card_last4 text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists paddle_purchases_profile_created_idx
  on public.paddle_purchases (profile_id, created_at desc);

-- Billing data and webhook payloads are server-owned; no client API policies are added.
alter table public.paddle_webhook_events enable row level security;
alter table public.paddle_customers enable row level security;
alter table public.paddle_subscriptions enable row level security;
alter table public.paddle_transactions enable row level security;
alter table public.paddle_products enable row level security;
alter table public.paddle_prices enable row level security;
alter table public.paddle_adjustments enable row level security;
alter table public.paddle_purchases enable row level security;

alter table public.paddle_purchases
  add column if not exists paddle_customer_id text,
  add column if not exists payment_method_type text,
  add column if not exists card_last4 text;

-- Reports are initially paywalled; successful payment/code/admin flows grant access.
alter table public.reports alter column access_type set default 'locked';
