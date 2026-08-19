-- ============================================================================
-- 0016_org_levels.sql — الهيكل التنظيمي والمستويات الإدارية (/about/org-structure).
--
-- Four administrative levels, each a tile in the selector row and a detail
-- panel below it. `level_no` is the number printed in the tile badge and also
-- drives ordering, so there's no separate sort_order to keep in sync.
--
-- People are stored as jsonb rather than their own tables, matching how
-- program_panels holds `initiatives`: they are only ever read as part of their
-- level, are edited in the same admin form, and carry no relationships.
--   leaders — the bordered name/role cards (chair, vice-chair, …)
--   members — the plain name chips under `members_label`
-- Both are [{ name_ar, name_en, role_ar, role_en }]; `role_*` is unused by
-- members but keeping one shape means one editor component.
--
-- `icon` holds a lucide icon name. The design's four glyphs are all lucide
-- icons already bundled with the app (landmark / users / briefcase /
-- building-2), so nothing is stored as an image.
-- ============================================================================

create table if not exists public.org_levels (
  id uuid primary key default gen_random_uuid(),
  level_no int not null unique,
  title_ar text not null default '',
  title_en text not null default '',
  -- Doubles as the tile's second line and the detail panel's heading — the
  -- design shows the same string in both places.
  subtitle_ar text not null default '',
  subtitle_en text not null default '',
  description_ar text not null default '',
  description_en text not null default '',
  icon text not null default 'landmark',
  bg_color text not null default '#005761',
  leaders jsonb not null default '[]'::jsonb,
  members_label_ar text not null default '',
  members_label_en text not null default '',
  members jsonb not null default '[]'::jsonb,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists org_levels_set_updated_at on public.org_levels;
create trigger org_levels_set_updated_at
  before update on public.org_levels
  for each row execute function public.set_updated_at();

alter table public.org_levels enable row level security;

drop policy if exists "org_levels public read" on public.org_levels;
create policy "org_levels public read"
  on public.org_levels for select
  using (published or public.is_staff());

drop policy if exists "org_levels staff write" on public.org_levels;
create policy "org_levels staff write"
  on public.org_levels for all
  using (public.is_content_staff())
  with check (public.is_content_staff());

-- ---------------------------------------------------------------------------
-- Seed. The design only details level 1, so that one is complete; levels 2–4
-- carry their tile copy (which the design does show) and are left without a
-- description or people for staff to fill in through the admin.
-- ---------------------------------------------------------------------------
insert into public.org_levels
  (level_no, title_ar, title_en, subtitle_ar, subtitle_en, description_ar,
   icon, bg_color, leaders, members_label_ar, members_label_en, members)
values
  (1, 'المستوى الأول', 'Level One',
   'الحوكمة والرسم الاستراتيجي (مجلس الأمناء)', 'Governance & strategy (Board of Trustees)',
   'السلطة العليا بالمؤسسة المسؤولة عن اعتماد السياسات العامة والتوجهات الاستراتيجية والميزانيات.',
   'landmark', '#005761',
   '[{"name_ar":"الشيخ / علي بن إبراهيم المجدوعي","name_en":"","role_ar":"رئيس مجلس الأمناء","role_en":""},
     {"name_ar":"الأستاذ / عبد الله بن علي المجدوعي","name_en":"","role_ar":"نائب رئيس المجلس","role_en":""}]'::jsonb,
   'أعضاء المجلس', 'Board members',
   '[{"name_ar":"الأستاذ / إبراهيم بن علي المجدوعي","name_en":"","role_ar":"","role_en":""},
     {"name_ar":"الأستاذ / محمد بن علي المجدوعي","name_en":"","role_ar":"","role_en":""},
     {"name_ar":"الأستاذ / يوسف بن علي المجدوعي","name_en":"","role_ar":"","role_en":""},
     {"name_ar":"الأستاذ / عمر بن علي المجدوعي","name_en":"","role_ar":"","role_en":""}]'::jsonb),

  (2, 'المستوى الثاني', 'Level Two',
   'اللجان المنبثقة والدعم الاستشاري', 'Sub-committees & advisory support',
   '', 'users', '#00B5C2', '[]'::jsonb, '', '', '[]'::jsonb),

  (3, 'المستوى الثالث', 'Level Three',
   'الإدارة التنفيذية والتشغيل (الأمانة العامة)', 'Executive management & operations (General Secretariat)',
   '', 'briefcase', '#80A5E0', '[]'::jsonb, '', '', '[]'::jsonb),

  (4, 'المستوى الرابع', 'Level Four',
   'الإدارات والأقسام التشغيلية', 'Operational departments & units',
   '', 'building-2', '#0A1F2D', '[]'::jsonb, '', '', '[]'::jsonb)
on conflict (level_no) do nothing;
