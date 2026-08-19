-- ============================================================================
-- 00000000000000_baseline.sql
--
-- Complete schema for the Almajdouie Foundation site: every table, index,
-- trigger, function, RLS policy and storage bucket, in dependency order.
--
-- WHY THIS FILE EXISTS
-- The migration folder and the live database had drifted apart: ten migrations
-- had been applied to the server without ever landing in the repo, one repo
-- file had never been applied, seven local files reused version numbers that
-- already meant something else remotely, and 0003_hero_slides.sql declared
-- three columns the live table did not have. Running the old folder against a
-- fresh project produced a database missing six tables. This file replaces all
-- of it and was reconstructed directly from the live schema on 2026-08-19, so
-- it is the schema, not an approximation of it. The originals are kept in
-- migrations/_archive/ — they carry the design rationale in their comments and
-- are worth reading, but they are no longer executable history.
--
-- Idempotent: safe to run twice. Every object is created if-not-exists and
-- every policy is dropped before being recreated.
--
-- HOW TO USE IT
--   Fresh project → run this file, then ../seed.sql. See ../SETUP.md.
--
-- THREE DELIBERATE DIFFERENCES FROM PRODUCTION-AS-OF-2026-08-19
-- All behaviour-preserving; each fixes something the Supabase linter flagged.
--   1. Write policies are split into FOR INSERT / UPDATE / DELETE instead of
--      one FOR ALL. FOR ALL includes SELECT, so every public read was
--      evaluating two permissive policies — 90 linter warnings from one
--      pattern. Identical permissions, one policy per read.
--   2. next_contact_ticket_id() and next_job_application_no() pin
--      search_path = public. Without it a caller-controlled search_path could
--      shadow the sequence they read.
--   3. EXECUTE on the RLS helper functions is revoked from anon and
--      authenticated. They were reachable as /rest/v1/rpc/<name>. Nothing in
--      the app calls them over RPC; policies still call them normally.
--
-- ONE KNOWN ISSUE LEFT IN PLACE ON PURPOSE
--   contact_messages keeps its open "insert public" policy, because removing
--   it breaks the home-page contact form until components/home/contact-actions.ts
--   is switched to the service-role client. Fixing both together is a code
--   change, not a schema change. See the note at that policy.
-- ============================================================================


-- ┌──────────────────────────────────────────────────────────────────────────┐
-- │ 1. Types and shared functions                                            │
-- └──────────────────────────────────────────────────────────────────────────┘

do $$ begin
  create type public.app_role as enum ('super_admin', 'content_editor', 'news_manager');
exception when duplicate_object then null;
end $$;

-- Shared updated_at trigger, used by every content table below.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ┌──────────────────────────────────────────────────────────────────────────┐
-- │ 2. Profiles — one row per auth user, carrying the staff role             │
-- └──────────────────────────────────────────────────────────────────────────┘

create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  full_name  text,
  role       public.app_role not null default 'content_editor',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile when a new auth user appears.
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


-- ┌──────────────────────────────────────────────────────────────────────────┐
-- │ 3. RLS helper functions                                                  │
-- │                                                                          │
-- │ SECURITY DEFINER so they can read profiles without recursing into the    │
-- │ policy that calls them — the classic RLS deadlock this design avoids.    │
-- │ These five are the entire vocabulary of the authorization system.        │
-- └──────────────────────────────────────────────────────────────────────────┘

create or replace function public.current_app_role()
returns public.app_role
language sql stable security definer set search_path = public
as $$ select role from public.profiles where id = auth.uid(); $$;

create or replace function public.is_super_admin()
returns boolean
language sql stable security definer set search_path = public
as $$ select public.current_app_role() = 'super_admin'; $$;

-- Manages general site content — everything except users and news/media.
create or replace function public.is_content_staff()
returns boolean
language sql stable security definer set search_path = public
as $$ select public.current_app_role() in ('super_admin', 'content_editor'); $$;

-- Manages news, gallery and reports (the public Media Center).
create or replace function public.is_news_staff()
returns boolean
language sql stable security definer set search_path = public
as $$ select public.current_app_role() in ('super_admin', 'news_manager'); $$;

-- Any signed-in staff member. Used to let the admin see unpublished rows.
create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public
as $$ select public.current_app_role() is not null; $$;

-- (EXECUTE on these is revoked from anon/authenticated in section 10, which
-- has to run after the blanket grants or it would just be undone.)


-- ┌──────────────────────────────────────────────────────────────────────────┐
-- │ 4. Profiles RLS                                                          │
-- └──────────────────────────────────────────────────────────────────────────┘

alter table public.profiles enable row level security;

-- auth.uid() is wrapped in a subselect so Postgres evaluates it once per
-- query rather than once per row.
drop policy if exists "profiles self or super admin can read" on public.profiles;
create policy "profiles self or super admin can read"
  on public.profiles for select
  using (id = (select auth.uid()) or public.is_super_admin());

drop policy if exists "super admin manages profiles" on public.profiles;
create policy "super admin manages profiles"
  on public.profiles for all
  using (public.is_super_admin())
  with check (public.is_super_admin());

drop policy if exists "users update own profile name" on public.profiles;
create policy "users update own profile name"
  on public.profiles for update
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));


-- ┌──────────────────────────────────────────────────────────────────────────┐
-- │ 5. Content tables                                                        │
-- │                                                                          │
-- │ Every one follows the same contract:                                     │
-- │   read   using (published or is_staff())   — staff see drafts            │
-- │   write  is_content_staff() or is_news_staff(), per table                │
-- │ and carries a set_updated_at trigger.                                    │
-- └──────────────────────────────────────────────────────────────────────────┘

-- ── site_settings — enforced single row (About block, leadership card,
--    foundation facts, contact details, six social links + visibility flags).
create table if not exists public.site_settings (
  id                     boolean primary key default true,
  about_title_ar         text not null default '',
  about_title_en         text not null default '',
  about_body_ar          text not null default '',
  about_body_en          text not null default '',
  leadership_quote_ar    text not null default '',
  leadership_quote_en    text not null default '',
  leadership_name_ar     text not null default '',
  leadership_name_en     text not null default '',
  leadership_position_ar text not null default '',
  leadership_position_en text not null default '',
  leadership_photo       text,
  founded_year           text,
  license_no             text,
  contact_email          text,
  contact_phone          text,
  contact_address_ar     text,
  contact_address_en     text,
  social_linkedin        text,
  social_instagram       text,
  social_twitter         text,
  social_facebook        text,
  social_snapchat        text,
  social_youtube         text,
  social_linkedin_show   boolean not null default true,
  social_instagram_show  boolean not null default true,
  social_twitter_show    boolean not null default true,
  social_facebook_show   boolean not null default true,
  social_snapchat_show   boolean not null default true,
  social_youtube_show    boolean not null default true,
  updated_at             timestamptz not null default now(),
  constraint site_settings_singleton check (id)
);

-- ── page_content — schemaless page copy, keyed by slug. Ten slugs in use:
--    vision-mission, who-we-are, strategy, board, ceo-office, careers,
--    brand-identity, privacy-policy, mosques-map, strategic-alignment.
create table if not exists public.page_content (
  slug       text primary key,
  content    jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ── hero_slides — home hero carousel.
create table if not exists public.hero_slides (
  id         uuid primary key default gen_random_uuid(),
  title_ar   text not null default '',
  title_en   text not null default '',
  image      text not null default '',
  href       text,
  sort_order int not null default 0,
  published  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── focus_areas — home tiles plus the whole detail page. The three jsonb
--    columns hold the detail page's sub-sections.
create table if not exists public.focus_areas (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  name_ar          text not null default '',
  name_en          text not null default '',
  short_desc_ar    text not null default '',
  short_desc_en    text not null default '',
  bg_color         text not null default '#005761',
  btn_text_color   text not null default '#005761',
  icon             text,
  watermark        text,
  detail_title_ar  text not null default '',
  detail_title_en  text not null default '',
  detail_intro_ar  text not null default '',
  detail_intro_en  text not null default '',
  carousel         jsonb not null default '{"slides": [], "heading": {"ar": "", "en": ""}}'::jsonb,
  stats            jsonb not null default '{"image": "", "items": []}'::jsonb,
  detail_programs  jsonb not null default '{"cards": [], "heading": {"ar": "", "en": ""}}'::jsonb,
  sort_order       int not null default 0,
  published        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ── program_panels — the home "Programs Explorer". `initiatives` is
--    [{ id, title, desc, paths: [{ id, title, desc, href }] }].
create table if not exists public.program_panels (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name_ar     text not null default '',
  name_en     text not null default '',
  desc_ar     text not null default '',
  desc_en     text not null default '',
  bg_color    text not null default '#005761',
  initiatives jsonb not null default '[]'::jsonb,
  sort_order  int not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── programs — headline/summary bilingual, rich Arabic detail body.
create table if not exists public.programs (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  category      text not null default 'empowerment'
                check (category in ('empowerment', 'mosques', 'partners')),
  title_ar      text not null default '',
  title_en      text not null default '',
  short_desc_ar text not null default '',
  short_desc_en text not null default '',
  hero_desc     text,
  image         text not null default '',
  about         text,
  objectives    text[] not null default '{}',
  stages        jsonb not null default '[]',   -- [{ title, desc }]
  target_groups text[] not null default '{}',
  quote         jsonb,                         -- { text, author }
  partners      text[] not null default '{}',
  info          jsonb,                         -- { launchYear, scope, beneficiaries, sector }
  related       text[] not null default '{}',  -- related slugs
  sort_order    int not null default 0,
  published     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists programs_category_idx on public.programs (category);

-- ── news — bilingual headline/summary; the structured detail body is Arabic,
--    because the news pages render Arabic only.
create table if not exists public.news (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  category      text not null default 'institution'
                check (category in ('institution', 'announcements', 'partnerships')),
  title_ar      text not null default '',
  title_en      text not null default '',
  excerpt_ar    text not null default '',
  excerpt_en    text not null default '',
  kicker        text,
  date          text not null default '',      -- display string, e.g. "08 يونيو 2026"
  published_at  timestamptz not null default now(),  -- sort key
  source        text,
  read_time     text,
  image         text not null default '',
  caption       text,
  lead          text,
  body          text[] not null default '{}',
  axes          jsonb,                          -- { heading, items[] }
  quote         text,
  after_quote   text,
  tags          text[] not null default '{}',
  related       text[] not null default '{}',   -- related slugs
  featured      boolean not null default false,
  home_featured boolean not null default false,
  published     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists news_published_at_idx on public.news (published_at desc);
create index if not exists news_category_idx     on public.news (category);

-- ── gallery_items — photo albums and videos in one table, split by `type`.
create table if not exists public.gallery_items (
  id              uuid primary key default gen_random_uuid(),
  type            text not null default 'album' check (type in ('album', 'video')),
  slug            text,
  title_ar        text not null default '',
  title_en        text not null default '',
  meta_ar         text not null default '',
  meta_en         text not null default '',
  thumb           text not null default '',
  cover           text not null default '',
  video_url       text,
  date_ar         text,
  date_en         text,
  location_ar     text,
  location_en     text,
  photographer_ar text,
  photographer_en text,
  section_ar      text,
  section_en      text,
  about_ar        text,
  about_en        text,
  images          jsonb not null default '[]'::jsonb,
  videos          jsonb not null default '[]'::jsonb,
  sort_order      int not null default 0,
  published       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── reports — PDF documents in the Media Center.
create table if not exists public.reports (
  id         uuid primary key default gen_random_uuid(),
  title_ar   text not null default '',
  title_en   text not null default '',
  period_ar  text not null default '',
  period_en  text not null default '',
  file       text not null default '',
  sort_order int not null default 0,
  published  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── policies — governance documents (/about/policies).
create table if not exists public.policies (
  id         uuid primary key default gen_random_uuid(),
  title_ar   text not null default '',
  title_en   text not null default '',
  version    text,
  category   text not null default 'basics'
             check (category in ('basics', 'governance', 'guides')),
  file       text not null default '#',
  sort_order int not null default 0,
  published  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── kpis — the animated impact counters on the home page.
create table if not exists public.kpis (
  id         uuid primary key default gen_random_uuid(),
  value      int not null default 0,
  suffix     text not null default '',
  label_ar   text not null default '',
  label_en   text not null default '',
  year       text,
  icon       text,
  sort_order int not null default 0,
  published  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── team_members — board of trustees and executive leadership.
create table if not exists public.team_members (
  id         uuid primary key default gen_random_uuid(),
  type       text not null default 'board' check (type in ('board', 'leadership')),
  name_ar    text not null default '',
  name_en    text not null default '',
  role_ar    text not null default '',
  role_en    text not null default '',
  image      text,
  sort_order int not null default 0,
  published  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── board_committees — the committee sections on /about/board.
--    members: [{ name_ar, name_en, role_ar, role_en, image }]
--    duties:  [{ text_ar, text_en, icon }] — icon is a lucide name.
--    A member whose image is an .svg renders as a logo tile, not a portrait.
create table if not exists public.board_committees (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title_ar       text not null default '',
  title_en       text not null default '',
  description_ar text not null default '',
  description_en text not null default '',
  members        jsonb not null default '[]'::jsonb,
  duties         jsonb not null default '[]'::jsonb,
  sort_order     int not null default 0,
  published      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ── org_levels — the four administrative levels (/about/org-structure).
--    level_no is both the badge number and the sort key, so there is no
--    separate sort_order to keep in sync. People live in jsonb because they
--    are only ever read as part of their level and carry no relationships.
--    icon holds a lucide name (landmark / users / briefcase / building-2).
create table if not exists public.org_levels (
  id               uuid primary key default gen_random_uuid(),
  level_no         int not null unique,
  title_ar         text not null default '',
  title_en         text not null default '',
  subtitle_ar      text not null default '',
  subtitle_en      text not null default '',
  description_ar   text not null default '',
  description_en   text not null default '',
  icon             text not null default 'landmark',
  bg_color         text not null default '#005761',
  leaders          jsonb not null default '[]'::jsonb,
  members_label_ar text not null default '',
  members_label_en text not null default '',
  members          jsonb not null default '[]'::jsonb,
  published        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ── mosques — the map on /focus-areas/mosques. Filter pills are derived from
--    the distinct region_ar values, so adding a region needs no code change.
--    coords_verified marks whether lat/lng were confirmed against the real
--    location; seeded rows carry district-level approximations and are false.
create table if not exists public.mosques (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  name_ar         text not null default '',
  name_en         text not null default '',
  district_ar     text not null default '',
  district_en     text not null default '',
  region_ar       text not null default '',
  region_en       text not null default '',
  lat             double precision,
  lng             double precision,
  coords_verified boolean not null default false,
  capacity        int,
  area_sqm        int,
  image           text not null default '',
  maps_url        text not null default '',
  sort_order      int not null default 0,
  published       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── jobs — careers postings.
create table if not exists public.jobs (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  title_ar         text not null default '',
  title_en         text not null default '',
  summary_ar       text not null default '',
  summary_en       text not null default '',
  department       text,
  location         text,
  type             text,
  experience       text,
  education        text,
  deadline         text,
  posted           text,
  responsibilities text[] not null default '{}',
  qualifications   text[] not null default '{}',
  sort_order       int not null default 0,
  published        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);


-- ┌──────────────────────────────────────────────────────────────────────────┐
-- │ 6. updated_at triggers for every content table                           │
-- └──────────────────────────────────────────────────────────────────────────┘

do $$
declare t text;
begin
  foreach t in array array[
    'site_settings', 'page_content', 'hero_slides', 'focus_areas',
    'program_panels', 'programs', 'news', 'gallery_items', 'reports',
    'policies', 'kpis', 'team_members', 'board_committees', 'org_levels',
    'mosques', 'jobs'
  ] loop
    execute format('drop trigger if exists %I on public.%I', t || '_set_updated_at', t);
    execute format(
      'create trigger %I before update on public.%I
         for each row execute function public.set_updated_at()',
      t || '_set_updated_at', t);
  end loop;
end $$;


-- ┌──────────────────────────────────────────────────────────────────────────┐
-- │ 7. Content RLS                                                           │
-- │                                                                          │
-- │ Generated in a loop so all sixteen tables provably get the same shape.   │
-- │ Difference #1 (see header): writes are three explicit policies rather    │
-- │ than one FOR ALL, so a public read evaluates exactly one policy.         │
-- └──────────────────────────────────────────────────────────────────────────┘

do $$
declare
  t text;
  gate text;
  -- Media staff own news, gallery and reports because those three surface
  -- together in the public Media Center. Everything else is content staff.
  news_tables text[] := array['news', 'gallery_items', 'reports'];
  -- These two have no `published` column, so their read policy is unconditional.
  always_public text[] := array['site_settings', 'page_content'];
begin
  foreach t in array array[
    'site_settings', 'page_content', 'hero_slides', 'focus_areas',
    'program_panels', 'programs', 'news', 'gallery_items', 'reports',
    'policies', 'kpis', 'team_members', 'board_committees', 'org_levels',
    'mosques', 'jobs'
  ] loop
    gate := case when t = any(news_tables)
                 then 'public.is_news_staff()'
                 else 'public.is_content_staff()' end;

    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists %I on public.%I', t || ' public read', t);
    execute format(
      'create policy %I on public.%I for select using (%s)',
      t || ' public read', t,
      case when t = any(always_public) then 'true'
           else '(published or public.is_staff())' end);

    execute format('drop policy if exists %I on public.%I', t || ' staff insert', t);
    execute format('create policy %I on public.%I for insert with check (%s)',
                   t || ' staff insert', t, gate);

    execute format('drop policy if exists %I on public.%I', t || ' staff update', t);
    execute format('create policy %I on public.%I for update using (%s) with check (%s)',
                   t || ' staff update', t, gate, gate);

    execute format('drop policy if exists %I on public.%I', t || ' staff delete', t);
    execute format('create policy %I on public.%I for delete using (%s)',
                   t || ' staff delete', t, gate);

    -- Clear the old FOR ALL policies if this is an upgrade rather than a
    -- fresh install; they are what produced the duplicate-policy warnings.
    execute format('drop policy if exists %I on public.%I', t || ' staff write', t);
  end loop;

  -- Two policies whose historical names don't follow the pattern.
  drop policy if exists "panels staff write"       on public.program_panels;
  drop policy if exists "panels public read"       on public.program_panels;
  drop policy if exists "team staff write"         on public.team_members;
  drop policy if exists "team public read"         on public.team_members;
  drop policy if exists "gallery media staff write" on public.gallery_items;
  drop policy if exists "gallery public read"      on public.gallery_items;
end $$;

-- The single settings row must exist before the admin can edit it.
insert into public.site_settings (id) values (true) on conflict (id) do nothing;


-- ┌──────────────────────────────────────────────────────────────────────────┐
-- │ 8. Intake tables — submissions from the public                           │
-- │                                                                          │
-- │ Structurally different from content: no `published`, no updated_at, and  │
-- │ deliberately NO anon policy. The forms are public but their writes go    │
-- │ through a server action on the service-role client, so the validation    │
-- │ there is the only way in. Granting anon INSERT would let anyone holding  │
-- │ the publicly-shipped anon key POST straight at the REST API and flood    │
-- │ the table, skipping every check the action performs.                     │
-- └──────────────────────────────────────────────────────────────────────────┘

create sequence if not exists public.contact_request_ticket_seq;
create sequence if not exists public.job_application_no_seq;

-- Human-quotable tracking id, e.g. REQ-2026-000042.
create or replace function public.next_contact_ticket_id()
returns text
language sql volatile set search_path = public
as $$
  select 'REQ-' || to_char(now(), 'YYYY') || '-' ||
         lpad(nextval('public.contact_request_ticket_seq')::text, 6, '0');
$$;

-- Human-quotable application id, e.g. APP-2026-000042.
create or replace function public.next_job_application_no()
returns text
language sql volatile set search_path = public
as $$
  select 'APP-' || to_char(now(), 'YYYY') || '-' ||
         lpad(nextval('public.job_application_no_seq')::text, 6, '0');
$$;

-- ── contact_requests — قناة الشكاوى والمقترحات, the three-step intake whose
--    shape changes per message type:
--      suggestion (مقترح)        — no reference number
--      complaint  (شكوى)         — adds reference_no
--      inquiry    (استفسار عام)  — no reference number
create table if not exists public.contact_requests (
  id           uuid primary key default gen_random_uuid(),
  ticket_id    text not null unique default public.next_contact_ticket_id(),
  type         text not null default 'suggestion'
               check (type in ('suggestion', 'complaint', 'inquiry')),
  reference_no text,                                  -- complaint-only in the UI
  full_name    text not null default '',
  phone        text not null default '',
  email        text not null default '',
  category     text not null default '',
  addressed_to text,                                  -- "الموجه إليه", optional
  subject      text not null default '',
  body         text not null default '',
  -- [{ path, name, size, mime }] — path is a key in the PRIVATE
  -- contact-attachments bucket, never a public URL.
  attachments  jsonb not null default '[]'::jsonb,
  consent      boolean not null default false,
  is_read      boolean not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists contact_requests_created_at_idx
  on public.contact_requests (created_at desc);

-- ── job_applications — التقديمات from /careers/[slug].
--    The job is stored three ways on purpose: job_id for the live relation,
--    job_slug + job_title as a snapshot so an application still reads
--    correctly after the posting is renamed or deleted (the FK nulls out, the
--    snapshot stays — a CV with no idea which role it was for is useless).
create table if not exists public.job_applications (
  id             uuid primary key default gen_random_uuid(),
  application_no text not null unique default public.next_job_application_no(),
  job_id         uuid references public.jobs (id) on delete set null,
  job_slug       text not null default '',
  job_title      text not null default '',
  first_name     text not null default '',
  last_name      text not null default '',
  email          text not null default '',
  phone          text not null default '',
  city           text,
  experience     text,
  cover_letter   text,
  linkedin       text,
  cv             jsonb,     -- { path, name, size, mime } in the PRIVATE bucket
  consent        boolean not null default false,
  is_read        boolean not null default false,
  created_at     timestamptz not null default now()
);

create index if not exists job_applications_created_at_idx
  on public.job_applications (created_at desc);
create index if not exists job_applications_job_id_idx
  on public.job_applications (job_id);

-- ── contact_messages — the short name/email/phone/message form on the home
--    page. Kept separate from contact_requests on purpose: sharing a table
--    would have meant most columns null for whichever form didn't use them.
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null default '',
  email      text not null default '',
  phone      text,
  message    text not null default '',
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

-- Intake RLS: staff read / update / delete, nobody inserts.
do $$
declare t text;
begin
  foreach t in array array['contact_requests', 'job_applications', 'contact_messages'] loop
    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists %I on public.%I', t || ' staff read', t);
    execute format('create policy %I on public.%I for select using (public.is_staff())',
                   t || ' staff read', t);

    execute format('drop policy if exists %I on public.%I', t || ' staff update', t);
    execute format('create policy %I on public.%I for update
                      using (public.is_staff()) with check (public.is_staff())',
                   t || ' staff update', t);

    execute format('drop policy if exists %I on public.%I', t || ' staff delete', t);
    execute format('create policy %I on public.%I for delete using (public.is_staff())',
                   t || ' staff delete', t);
  end loop;
end $$;

-- ⚠ KNOWN ISSUE, carried forward deliberately (see the header).
--
-- This lets anyone holding the anon key — which ships in every page — POST
-- unlimited rows at /rest/v1/contact_messages. It exists because
-- components/home/contact-actions.ts writes with supabaseAnon rather than the
-- service-role client its two younger siblings use.
--
-- TO FIX, do both together, or the home contact form breaks:
--   1. Change components/home/contact-actions.ts to createAdminClient().
--   2. Delete this policy:
--        drop policy "contact insert public" on public.contact_messages;
drop policy if exists "contact insert public" on public.contact_messages;
create policy "contact insert public"
  on public.contact_messages for insert
  with check (true);


-- ┌──────────────────────────────────────────────────────────────────────────┐
-- │ 9. Storage                                                               │
-- └──────────────────────────────────────────────────────────────────────────┘

-- ── media — PUBLIC. Every CMS image and PDF. Uploaded straight from the admin
--    browser with the anon key + a staff session; the resulting public URL is
--    what gets stored in the content row.
--
--    NOTE: production has no size or MIME limit on this bucket — the 3 MB /
--    3000 px checks live only in components/admin/inline-upload.tsx and any
--    signed-in staff member can bypass them via the API. Sensible limits are
--    set here; loosen them if they get in the way.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/svg+xml',
        'image/gif', 'application/pdf']
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media public read" on storage.objects;
create policy "media public read"
  on storage.objects for select using (bucket_id = 'media');

drop policy if exists "media staff insert" on storage.objects;
create policy "media staff insert"
  on storage.objects for insert
  with check (bucket_id = 'media' and public.is_staff());

drop policy if exists "media staff update" on storage.objects;
create policy "media staff update"
  on storage.objects for update
  using (bucket_id = 'media' and public.is_staff())
  with check (bucket_id = 'media' and public.is_staff());

drop policy if exists "media staff delete" on storage.objects;
create policy "media staff delete"
  on storage.objects for delete
  using (bucket_id = 'media' and public.is_staff());

-- ── contact-attachments — PRIVATE. Complaint attachments from members of the
--    public, on a page that promises "بأعلى درجات الخصوصية والسرية". A public
--    bucket would put them on a permanently readable URL. No anon policy at
--    all: uploads go through the server action on the service-role client, and
--    the admin views them via short-lived signed URLs.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'contact-attachments', 'contact-attachments', false, 10485760,
  array['application/pdf', 'image/png', 'image/jpeg']
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "contact attachments staff read" on storage.objects;
create policy "contact attachments staff read"
  on storage.objects for select
  using (bucket_id = 'contact-attachments' and public.is_staff());

drop policy if exists "contact attachments staff delete" on storage.objects;
create policy "contact attachments staff delete"
  on storage.objects for delete
  using (bucket_id = 'contact-attachments' and public.is_staff());

-- ── job-applications — PRIVATE. A résumé is personal data belonging to someone
--    who has not been hired; it must never sit on a permanently readable URL.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'job-applications', 'job-applications', false, 5242880,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "job applications staff read" on storage.objects;
create policy "job applications staff read"
  on storage.objects for select
  using (bucket_id = 'job-applications' and public.is_staff());

drop policy if exists "job applications staff delete" on storage.objects;
create policy "job applications staff delete"
  on storage.objects for delete
  using (bucket_id = 'job-applications' and public.is_staff());


-- ┌──────────────────────────────────────────────────────────────────────────┐
-- │ 10. Role grants                                                          │
-- │                                                                          │
-- │ MUST NOT BE SKIPPED. Postgres checks table privileges BEFORE it checks   │
-- │ RLS, so without these the API roles are refused with "permission denied  │
-- │ for table …" and the policies above never even run — the public site     │
-- │ would return nothing at all.                                             │
-- │                                                                          │
-- │ Supabase normally applies these through default privileges on the        │
-- │ project's own bootstrap, which is why the original migrations never had  │
-- │ to say it out loud. That only holds for tables created through the       │
-- │ dashboard/API connection; a fresh `supabase start` or a psql run creates │
-- │ them without the grants. Stating it explicitly makes the file work       │
-- │ everywhere. (Verified: without this block the local rebuild refused      │
-- │ `select from news` as anon.)                                             │
-- │                                                                          │
-- │ Granting ALL to anon looks alarming and is not — every table above has   │
-- │ RLS enabled with no permissive anon write policy, so the grant opens     │
-- │ nothing the policies don't. This mirrors production exactly.             │
-- └──────────────────────────────────────────────────────────────────────────┘

grant usage on schema public to anon, authenticated, service_role;

grant all on all tables    in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all functions in schema public to anon, authenticated, service_role;

-- Future tables/functions inherit the same, so adding a table doesn't silently
-- 403 the site until someone remembers to grant it.
alter default privileges in schema public
  grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on functions to anon, authenticated, service_role;

-- Difference #3 (see header). Runs last, after the blanket grant above, so it
-- is not undone. Policies call these internally as the definer; nothing in the
-- app calls them over /rest/v1/rpc/, so they need no public EXECUTE.
revoke execute on function
  public.current_app_role(),
  public.is_super_admin(),
  public.is_content_staff(),
  public.is_news_staff(),
  public.is_staff(),
  public.handle_new_user()
from anon, authenticated;


-- ============================================================================
-- Done. Next:
--   1. Run ../seed.sql to load the site content.
--   2. Create your first auth user in the Supabase dashboard, then:
--        update public.profiles set role = 'super_admin' where email = '<you>';
--   3. Fill in my-app/.env from .env.example.
-- See ../SETUP.md for the full walkthrough.
-- ============================================================================
