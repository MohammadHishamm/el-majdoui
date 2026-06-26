-- ============================================================================
-- 0003_hero_slides.sql — home hero carousel slides. Bilingual.
-- ============================================================================

create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  title_ar text not null default '',
  title_en text not null default '',
  excerpt_ar text not null default '',
  excerpt_en text not null default '',
  image text not null default '',
  category text,
  href text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists hero_slides_set_updated_at on public.hero_slides;
create trigger hero_slides_set_updated_at
  before update on public.hero_slides
  for each row execute function public.set_updated_at();

alter table public.hero_slides enable row level security;

drop policy if exists "hero_slides public read" on public.hero_slides;
create policy "hero_slides public read"
  on public.hero_slides for select
  using (published or public.is_staff());

drop policy if exists "hero_slides staff write" on public.hero_slides;
create policy "hero_slides staff write"
  on public.hero_slides for all
  using (public.is_content_staff())
  with check (public.is_content_staff());
