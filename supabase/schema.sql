create extension if not exists pgcrypto;

create table if not exists public.prep_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.prep_roadmaps (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  track text not null default 'Full-stack',
  level text not null default 'All levels',
  duration_days integer not null default 15 check (duration_days > 0),
  summary text not null default '',
  content jsonb not null default '{"days":[]}'::jsonb,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists prep_roadmaps_published_updated_idx
  on public.prep_roadmaps (updated_at desc)
  where published = true;

create or replace function public.is_prep_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.prep_admins
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_prep_admin() from public;
grant execute on function public.is_prep_admin() to anon, authenticated;

alter table public.prep_admins enable row level security;
alter table public.prep_roadmaps enable row level security;

drop policy if exists "admins can check own allowlist row" on public.prep_admins;
create policy "admins can check own allowlist row"
  on public.prep_admins for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "public can read published roadmaps" on public.prep_roadmaps;
create policy "public can read published roadmaps"
  on public.prep_roadmaps for select to anon, authenticated
  using (published = true);

drop policy if exists "admins can read all roadmaps" on public.prep_roadmaps;
create policy "admins can read all roadmaps"
  on public.prep_roadmaps for select to authenticated
  using ((select public.is_prep_admin()));

drop policy if exists "admins can insert roadmaps" on public.prep_roadmaps;
create policy "admins can insert roadmaps"
  on public.prep_roadmaps for insert to authenticated
  with check ((select public.is_prep_admin()));

drop policy if exists "admins can update roadmaps" on public.prep_roadmaps;
create policy "admins can update roadmaps"
  on public.prep_roadmaps for update to authenticated
  using ((select public.is_prep_admin()))
  with check ((select public.is_prep_admin()));

drop policy if exists "admins can delete roadmaps" on public.prep_roadmaps;
create policy "admins can delete roadmaps"
  on public.prep_roadmaps for delete to authenticated
  using ((select public.is_prep_admin()));

grant select on public.prep_roadmaps to anon, authenticated;
grant insert, update, delete on public.prep_roadmaps to authenticated;
grant select on public.prep_admins to authenticated;

-- After creating the admin with Supabase Authentication, allowlist that user's UUID:
-- insert into public.prep_admins (user_id) values ('YOUR-AUTH-USER-UUID');