-- ============================================================================
-- 0005_focus_areas.sql — home "Focus Areas" tiles. Bilingual.
-- (Focus-area DETAIL page sub-sections — carousel/stats/programs — are a later
-- phase.)
-- ============================================================================

create table if not exists public.focus_areas (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,                      -- empowerment | mosques | partners-development
  name_ar text not null default '',
  name_en text not null default '',
  short_desc_ar text not null default '',
  short_desc_en text not null default '',
  bg_color text not null default '#005761',
  btn_text_color text not null default '#005761',
  icon text,                                      -- badge icon path/url
  watermark text,                                 -- large decorative svg path/url
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists focus_areas_set_updated_at on public.focus_areas;
create trigger focus_areas_set_updated_at
  before update on public.focus_areas
  for each row execute function public.set_updated_at();

alter table public.focus_areas enable row level security;

drop policy if exists "focus_areas public read" on public.focus_areas;
create policy "focus_areas public read"
  on public.focus_areas for select
  using (published or public.is_staff());

drop policy if exists "focus_areas staff write" on public.focus_areas;
create policy "focus_areas staff write"
  on public.focus_areas for all
  using (public.is_content_staff())
  with check (public.is_content_staff());
