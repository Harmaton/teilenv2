-- Paddle webhook idempotency and entitlement records for report/chat purchases.
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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists paddle_purchases_profile_created_idx
  on public.paddle_purchases (profile_id, created_at desc);

alter table public.paddle_purchases enable row level security;

-- A locked report is the explicit unpaid state checked by the report UI and webhook.
alter table public.reports drop constraint if exists reports_access_type_check;
alter table public.reports
  add constraint reports_access_type_check
  check (access_type = any (array['locked'::text, 'paid'::text, 'free_code'::text, 'admin_granted'::text]));