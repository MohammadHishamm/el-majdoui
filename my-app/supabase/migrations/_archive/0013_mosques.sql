-- ============================================================================
-- 0013_mosques.sql — mosque map for the "mosques" focus area.
--
-- Feeds the map + list panel rendered under the stats section on
-- /focus-areas/mosques. Filter pills are derived from the distinct
-- region_ar values (in sort_order), so adding a region needs no code change.
--
-- coords_verified marks whether lat/lng were confirmed against the real
-- location. Seeded rows carry district-level approximations and are false;
-- flip them once exact coordinates are pasted in from Google Maps.
-- ============================================================================

create table if not exists public.mosques (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text not null default '',
  name_en text not null default '',
  district_ar text not null default '',
  district_en text not null default '',
  region_ar text not null default '',
  region_en text not null default '',
  lat double precision,
  lng double precision,
  coords_verified boolean not null default false,
  capacity int,
  area_sqm int,
  image text not null default '',
  maps_url text not null default '',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists mosques_set_updated_at on public.mosques;
create trigger mosques_set_updated_at
  before update on public.mosques
  for each row execute function public.set_updated_at();

alter table public.mosques enable row level security;

drop policy if exists "mosques public read" on public.mosques;
create policy "mosques public read"
  on public.mosques for select
  using (published or public.is_staff());

drop policy if exists "mosques staff write" on public.mosques;
create policy "mosques staff write"
  on public.mosques for all
  using (public.is_content_staff())
  with check (public.is_content_staff());

-- ---------------------------------------------------------------------------
-- Seed — the four central mosques plus the Eastern Province restoration.
-- Coordinates are district-level approximations pending verification.
-- ---------------------------------------------------------------------------
insert into public.mosques
  (slug, name_ar, district_ar, region_ar, region_en, lat, lng, capacity, area_sqm, sort_order)
values
  ('ali-al-majdouie-makkah', 'جامع الشيخ علي المجدوعي النموذجي',
   'مخطط الزايدي، مكة المكرمة', 'مكة المكرمة', 'Makkah', 21.4450, 39.8300, 2300, 5600, 1),
  ('ali-bin-ibrahim-dammam', 'جامع الشيخ علي بن إبراهيم المجدوعي',
   'حي البادية، الدمام', 'المنطقة الشرقية', 'Eastern Province', 26.3970, 50.1250, null, null, 2),
  ('umm-abdullah-dammam', 'جامع أم عبد الله المجدوعي',
   'حي النزهة، الدمام', 'المنطقة الشرقية', 'Eastern Province', 26.4030, 50.0790, null, null, 3),
  ('fikra-bint-saeed', 'جامع فكرة بنت سعيد المجدوعي',
   'المنطقة الشرقية', 'المنطقة الشرقية', 'Eastern Province', 26.4207, 50.0888, null, null, 4),
  ('waldat-majdou-baljurashi', 'مسجد والدة مجدوع المجدوعي',
   'بلجرشي، الباحة', 'الباحة', 'Al Baha', 19.8597, 41.5680, null, null, 5)
on conflict (slug) do nothing;
