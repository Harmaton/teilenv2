alter table public.test_attempts
  add column if not exists quadrant_scores jsonb not null default '{}'::jsonb;