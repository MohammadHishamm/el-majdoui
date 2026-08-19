-- ============================================================================
-- 0010_programs.sql — programs / initiatives (+detail). Headline + summary
-- bilingual; rich Arabic detail (mirrors lib/programs.ts). Content staff manage.
-- ============================================================================

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null default 'empowerment'
    check (category in ('empowerment', 'mosques', 'partners')),

  title_ar text not null default '',
  title_en text not null default '',
  short_desc_ar text not null default '',
  short_desc_en text not null default '',

  hero_desc text,
  image text not null default '',
  about text,
  objectives text[] not null default '{}',
  stages jsonb not null default '[]',          -- [{ title, desc }]
  target_groups text[] not null default '{}',
  quote jsonb,                                  -- { text, author }
  partners text[] not null default '{}',
  info jsonb,                                   -- { launchYear, scope, beneficiaries, sector }
  related text[] not null default '{}',

  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists programs_category_idx on public.programs (category);

drop trigger if exists programs_set_updated_at on public.programs;
create trigger programs_set_updated_at
  before update on public.programs
  for each row execute function public.set_updated_at();

alter table public.programs enable row level security;

drop policy if exists "programs public read" on public.programs;
create policy "programs public read"
  on public.programs for select
  using (published or public.is_staff());

drop policy if exists "programs staff write" on public.programs;
create policy "programs staff write"
  on public.programs for all
  using (public.is_content_staff())
  with check (public.is_content_staff());
