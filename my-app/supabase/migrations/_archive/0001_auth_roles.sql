-- ============================================================================
-- 0001_auth_roles.sql — roles, profiles, RLS helper functions
-- ============================================================================

-- Roles available in the admin dashboard.
do $$ begin
  create type public.app_role as enum ('super_admin', 'content_editor', 'news_manager');
exception when duplicate_object then null;
end $$;

-- Shared updated_at trigger function.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- One profile per auth user, carrying the staff role.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role public.app_role not null default 'content_editor',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile row when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- RLS helper functions (SECURITY DEFINER so they bypass RLS on profiles and
-- never recurse into a policy that calls them).
-- ---------------------------------------------------------------------------
create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_super_admin()
returns boolean
language sql stable security definer set search_path = public
as $$ select public.current_app_role() = 'super_admin'; $$;

-- Can manage general site content (everything except user management).
create or replace function public.is_content_staff()
returns boolean
language sql stable security definer set search_path = public
as $$ select public.current_app_role() in ('super_admin', 'content_editor'); $$;

-- Can manage news.
create or replace function public.is_news_staff()
returns boolean
language sql stable security definer set search_path = public
as $$ select public.current_app_role() in ('super_admin', 'news_manager'); $$;

-- Any signed-in staff member (used to let the admin see unpublished rows).
create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public
as $$ select public.current_app_role() is not null; $$;

-- ---------------------------------------------------------------------------
-- RLS on profiles
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "profiles self or super admin can read" on public.profiles;
create policy "profiles self or super admin can read"
  on public.profiles for select
  using (id = auth.uid() or public.is_super_admin());

drop policy if exists "super admin manages profiles" on public.profiles;
create policy "super admin manages profiles"
  on public.profiles for all
  using (public.is_super_admin())
  with check (public.is_super_admin());

drop policy if exists "users update own profile name" on public.profiles;
create policy "users update own profile name"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- ---------------------------------------------------------------------------
-- Bootstrap: after creating the first auth user (via Supabase dashboard or the
-- service-role script), promote them to super_admin, e.g.:
--   update public.profiles set role = 'super_admin' where email = 'you@example.com';
-- ---------------------------------------------------------------------------
