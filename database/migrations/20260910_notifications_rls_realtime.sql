alter table public.notifications enable row level security;

create index if not exists notifications_profile_created_idx
  on public.notifications (profile_id, created_at desc);

drop policy if exists "notifications_select_own" on public.notifications;
drop policy if exists "notifications_update_own" on public.notifications;
drop policy if exists "notifications_insert_own" on public.notifications;

create policy "notifications_select_own"
on public.notifications
for select
to authenticated
using (profile_id = (select auth.uid()));

create policy "notifications_update_own"
on public.notifications
for update
to authenticated
using (profile_id = (select auth.uid()))
with check (profile_id = (select auth.uid()));

create policy "notifications_insert_own"
on public.notifications
for insert
to authenticated
with check (profile_id = (select auth.uid()));

alter table public.notifications replica identity full;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'notifications'
  ) then
    alter publication supabase_realtime add table public.notifications;
  end if;
end
$$;
