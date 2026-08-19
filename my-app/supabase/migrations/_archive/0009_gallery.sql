-- ============================================================================
-- 0009_gallery.sql — media gallery (photo albums + videos). Bilingual titles.
-- Managed by media staff (super_admin + news_manager).
-- ============================================================================

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'album' check (type in ('album', 'video')),
  title_ar text not null default '',
  title_en text not null default '',
  meta_ar text not null default '',
  meta_en text not null default '',
  thumb text not null default '',
  cover text not null default '',
  video_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists gallery_items_set_updated_at on public.gallery_items;
create trigger gallery_items_set_updated_at
  before update on public.gallery_items
  for each row execute function public.set_updated_at();

alter table public.gallery_items enable row level security;

drop policy if exists "gallery public read" on public.gallery_items;
create policy "gallery public read"
  on public.gallery_items for select
  using (published or public.is_staff());

drop policy if exists "gallery media staff write" on public.gallery_items;
create policy "gallery media staff write"
  on public.gallery_items for all
  using (public.is_news_staff())
  with check (public.is_news_staff());
