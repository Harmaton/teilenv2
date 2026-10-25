create table if not exists public.minor_profiles (
  id uuid primary key default gen_random_uuid(),
  guardian_profile_id uuid not null references public.profiles(id) on delete cascade,
  full_name text not null,
  birth_year integer not null check (birth_year between 1900 and 2100),
  school_name text,
  relationship text not null,
  avatar_path text,
  authorization_confirmed_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists minor_profiles_guardian_created_idx
  on public.minor_profiles (guardian_profile_id, created_at);

alter table public.minor_profiles enable row level security;
grant select, insert, update, delete on table public.minor_profiles to authenticated;

drop policy if exists "minor_profiles_select_guardian" on public.minor_profiles;
drop policy if exists "minor_profiles_insert_guardian" on public.minor_profiles;
drop policy if exists "minor_profiles_update_guardian" on public.minor_profiles;
drop policy if exists "minor_profiles_delete_guardian" on public.minor_profiles;

create policy "minor_profiles_select_guardian"
on public.minor_profiles for select to authenticated
using (guardian_profile_id = (select auth.uid()));

create policy "minor_profiles_insert_guardian"
on public.minor_profiles for insert to authenticated
with check (guardian_profile_id = (select auth.uid()));

create policy "minor_profiles_update_guardian"
on public.minor_profiles for update to authenticated
using (guardian_profile_id = (select auth.uid()))
with check (guardian_profile_id = (select auth.uid()));

create policy "minor_profiles_delete_guardian"
on public.minor_profiles for delete to authenticated
using (guardian_profile_id = (select auth.uid()));

alter table public.test_attempts
  add column if not exists minor_profile_id uuid references public.minor_profiles(id) on delete set null,
  add column if not exists subject_snapshot jsonb;

alter table public.reports
  add column if not exists minor_profile_id uuid references public.minor_profiles(id) on delete set null,
  add column if not exists subject_snapshot jsonb;

insert into storage.buckets (id, name, public)
values ('minor_images', 'minor_images', false)
on conflict (id) do update set public = false;

drop policy if exists "minor_images_select_guardian" on storage.objects;
drop policy if exists "minor_images_insert_guardian" on storage.objects;
drop policy if exists "minor_images_update_guardian" on storage.objects;
drop policy if exists "minor_images_delete_guardian" on storage.objects;

create policy "minor_images_select_guardian"
on storage.objects for select to authenticated
using (
  bucket_id = 'minor_images'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "minor_images_insert_guardian"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'minor_images'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "minor_images_update_guardian"
on storage.objects for update to authenticated
using (
  bucket_id = 'minor_images'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
)
with check (
  bucket_id = 'minor_images'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "minor_images_delete_guardian"
on storage.objects for delete to authenticated
using (
  bucket_id = 'minor_images'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);
