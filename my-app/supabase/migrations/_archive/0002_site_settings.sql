-- ============================================================================
-- 0002_site_settings.sql — single-row site settings (home About, leadership,
-- foundation facts). Bilingual (ar/en).
-- ============================================================================

create table if not exists public.site_settings (
  id boolean primary key default true,                -- enforces a single row
  about_title_ar text not null default '',
  about_title_en text not null default '',
  about_body_ar text not null default '',
  about_body_en text not null default '',
  leadership_quote_ar text not null default '',
  leadership_quote_en text not null default '',
  leadership_name_ar text not null default '',
  leadership_name_en text not null default '',
  leadership_position_ar text not null default '',
  leadership_position_en text not null default '',
  leadership_photo text,
  founded_year text,
  license_no text,
  contact_email text,
  contact_phone text,
  contact_address_ar text,
  contact_address_en text,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id)
);

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

-- Public can read the single settings row.
drop policy if exists "site_settings public read" on public.site_settings;
create policy "site_settings public read"
  on public.site_settings for select using (true);

-- Content staff manage it.
drop policy if exists "site_settings staff write" on public.site_settings;
create policy "site_settings staff write"
  on public.site_settings for all
  using (public.is_content_staff())
  with check (public.is_content_staff());

-- Ensure the row exists.
insert into public.site_settings (id) values (true) on conflict (id) do nothing;
