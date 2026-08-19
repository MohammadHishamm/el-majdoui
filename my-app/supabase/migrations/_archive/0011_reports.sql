-- ============================================================================
-- 0011_reports.sql — reports & documents (PDF). Bilingual title/period.
-- ============================================================================

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  title_ar text not null default '',
  title_en text not null default '',
  period_ar text not null default '',
  period_en text not null default '',
  file text not null default '',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists reports_set_updated_at on public.reports;
create trigger reports_set_updated_at
  before update on public.reports
  for each row execute function public.set_updated_at();

alter table public.reports enable row level security;

drop policy if exists "reports public read" on public.reports;
create policy "reports public read"
  on public.reports for select
  using (published or public.is_staff());

-- Managed by media staff (super_admin + news_manager) — reports live in the
-- public Media Center alongside the gallery.
drop policy if exists "reports staff write" on public.reports;
create policy "reports staff write"
  on public.reports for all
  using (public.is_news_staff())
  with check (public.is_news_staff());
