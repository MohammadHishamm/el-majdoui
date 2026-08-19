-- ============================================================================
-- 0012_jobs.sql — careers / job postings. Bilingual title+summary; Arabic meta.
-- ============================================================================

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_ar text not null default '',
  title_en text not null default '',
  summary_ar text not null default '',
  summary_en text not null default '',
  department text,
  location text,
  type text,
  experience text,
  education text,
  deadline text,
  posted text,
  responsibilities text[] not null default '{}',
  qualifications text[] not null default '{}',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists jobs_set_updated_at on public.jobs;
create trigger jobs_set_updated_at
  before update on public.jobs
  for each row execute function public.set_updated_at();

alter table public.jobs enable row level security;

drop policy if exists "jobs public read" on public.jobs;
create policy "jobs public read"
  on public.jobs for select
  using (published or public.is_staff());

drop policy if exists "jobs staff write" on public.jobs;
create policy "jobs staff write"
  on public.jobs for all
  using (public.is_content_staff())
  with check (public.is_content_staff());
