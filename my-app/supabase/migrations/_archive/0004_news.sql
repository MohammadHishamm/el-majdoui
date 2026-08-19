-- ============================================================================
-- 0004_news.sql — news / announcements. Headline + summary are bilingual;
-- the structured detail body mirrors lib/news.ts (Arabic, as the news pages
-- render Arabic only).
-- ============================================================================

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null default 'institution'
    check (category in ('institution', 'announcements', 'partnerships')),

  -- bilingual headline + summary (cards, listings, hero)
  title_ar text not null default '',
  title_en text not null default '',
  excerpt_ar text not null default '',
  excerpt_en text not null default '',

  -- detail meta
  kicker text,
  date text not null default '',                 -- display string e.g. "08 يونيو 2026"
  published_at timestamptz not null default now(), -- sort key
  source text,
  read_time text,
  image text not null default '',
  caption text,

  -- structured Arabic body (mirrors NewsItem)
  lead text,
  body text[] not null default '{}',
  axes jsonb,                                    -- { heading, items[] }
  quote text,
  after_quote text,

  tags text[] not null default '{}',
  related text[] not null default '{}',          -- related slugs

  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists news_published_at_idx on public.news (published_at desc);
create index if not exists news_category_idx on public.news (category);

drop trigger if exists news_set_updated_at on public.news;
create trigger news_set_updated_at
  before update on public.news
  for each row execute function public.set_updated_at();

alter table public.news enable row level security;

drop policy if exists "news public read" on public.news;
create policy "news public read"
  on public.news for select
  using (published or public.is_staff());

drop policy if exists "news staff write" on public.news;
create policy "news staff write"
  on public.news for all
  using (public.is_news_staff())
  with check (public.is_news_staff());
