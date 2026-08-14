-- ============================================================================
-- 0018_board_committees.sql — the three new sections on /about/board.
--
-- Sections 1 and 2 (اللجنة التنفيذية، اللجنة الإشرافية ولجان المنح) share one
-- shape — title, description, a row of members, and a grid of duties — so they
-- are rows of one table rather than two bespoke ones. `duties.icon` holds a
-- lucide icon name; the design's four glyphs (file-text / check / bar-chart-2 /
-- users) are named as such in Figma and already bundled with the app.
--
-- Section 3 (مكتب المدير التنفيذي) is a singleton — one person, one set of
-- contact rows — so it lives in page_content beside the other single-record
-- page copy instead of a table that would only ever hold one row.
--
-- A member whose `image` is an .svg is rendered as a logo tile (contained on a
-- brand fill) rather than a cropped portrait; that is how the design shows the
-- "فريق ممثلي أمانة المنح" entry.
-- ============================================================================

create table if not exists public.board_committees (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_ar text not null default '',
  title_en text not null default '',
  description_ar text not null default '',
  description_en text not null default '',
  -- [{ name_ar, name_en, role_ar, role_en, image }]
  members jsonb not null default '[]'::jsonb,
  -- [{ text_ar, text_en, icon }] — icon is a lucide name
  duties jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists board_committees_set_updated_at on public.board_committees;
create trigger board_committees_set_updated_at
  before update on public.board_committees
  for each row execute function public.set_updated_at();

alter table public.board_committees enable row level security;

drop policy if exists "board_committees public read" on public.board_committees;
create policy "board_committees public read"
  on public.board_committees for select
  using (published or public.is_staff());

drop policy if exists "board_committees staff write" on public.board_committees;
create policy "board_committees staff write"
  on public.board_committees for all
  using (public.is_content_staff())
  with check (public.is_content_staff());

insert into public.board_committees
  (slug, title_ar, title_en, description_ar, description_en, members, duties, sort_order)
values
  ('executive-committee', 'اللجنة التنفيذية', '', 'لجنة قيادية منبثقة عن مجلس الأمناء تُعنى بالإشراف على سير العمليات والتأكد من مطابقتها للتوجهات الاستراتيجية.', '',
   '[{"image":"/images/leaders-group/ibrahim-almajdouie.png","name_ar":"الأستاذ / إبراهيم بن علي المجدوعي","name_en":"","role_ar":"رئيس اللجنة","role_en":""},{"image":"/images/leaders-group/mohammed-almajdouie.png","name_ar":"الأستاذ / محمد بن علي المجدوعي","name_en":"","role_ar":"عضو اللجنة","role_en":""},{"image":"/images/leaders-group/ali-alfowzan.png","name_ar":"د. علي بن سليمان الفوزان","name_en":"","role_ar":"المدير التنفيذي","role_en":""}]'::jsonb,
   '[{"icon":"file-text","text_ar":"دراسة الموازنة التنفيذية والخطط التشغيلية السنوية قبل رفعها لمجلس الأمناء.","text_en":""},{"icon":"check","text_ar":"متابعة سير أعمال المؤسسة والتحقق من مطابقتها للخطة الاستراتيجية المعتمدة.","text_en":""},{"icon":"bar-chart-2","text_ar":"الإشراف على الأداء المالي والتشغيلي العام للمؤسسة.","text_en":""},{"icon":"users","text_ar":"التحضير لاجتماعات مجلس الأمناء وصياغة التوصيات والقرارات الاستراتيجية.","text_en":""}]'::jsonb,
   1),

  ('grants-committee', 'اللجنة الإشرافية ولجان المنح', '', 'لجنة تخصصية معنية بإدارة وتنظيم آليات الدعم والمنح المالي والتمويل للمشاريع والأفراد', '',
   '[{"image":"/images/leaders-group/ibrahim-almajdouie.png","name_ar":"الأستاذ / إبراهيم بن علي المجدوعي","name_en":"","role_ar":"المشرف العام على لجان المنح والدعم","role_en":""},{"image":"/images/leaders-group/ali-alfowzan.png","name_ar":"د. علي بن سليمان الفوزان","name_en":"","role_ar":"عضو وممثل الإدارة التنفيذية","role_en":""},{"image":"/images/identity/logo-reversed.svg","name_ar":"فريق ممثلي أمانة المنح والتمكين المعتمدين لدى المؤسسة","name_en":"","role_ar":"","role_en":""}]'::jsonb,
   '[{"icon":"file-text","text_ar":"دراسة وتقييم طلبات الدعم المرفوعة من الأفراد عبر \"بوابة الجود\"","text_en":""},{"icon":"check","text_ar":"التحقق من استيفاء شروط ومعايير المنح والتمكين المعتمدة من مجلس الأمناء.","text_en":""},{"icon":"bar-chart-2","text_ar":"اعتماد ميزانيات المنح وتوجيه الدعم للمشاريع الأكثر أثراً واستدامة.","text_en":""}]'::jsonb,
   2)
on conflict (slug) do nothing;

insert into public.page_content (slug, content)
values ('ceo-office', '{"photo":"/images/leaders-group/ali-alfowzan-lg.jpg","bio_ar":"يتولى إدارة الأمانة العامة والإشراف المباشر على الأقسام التشغيلية والبرامج التنموية وعمارة المساجد.","bio_en":"","name_ar":"د. علي بن سليمان الفوزان","name_en":"","role_ar":"المدير التنفيذي لمؤسسة المجدوعي الخيرية","role_en":"","cta_href":"/contact","heading_ar":"مكتب المدير التنفيذي","heading_en":"Office of the Executive Director","email_value":"ceo@almajdouie.org.sa · a.alfowzan@almajdouie.org.sa","phone_value":"+966 11 234 5678 (تحويلة: 101)","cta_label_ar":"إرسال رسالة لمكتب المدير التنفيذي","cta_label_en":"","email_label_ar":"بريد مكتب المدير التنفيذي","email_label_en":"","hours_label_ar":"ساعات استقبال الاستفسارات الإدارية","hours_label_en":"","hours_value_ar":"الأحد - الخميس | 8:00 صباحاً - 4:00 مساءً","hours_value_en":"","phone_label_ar":"المكتب التنفيذي - الأمانة العامة","phone_label_en":""}'::jsonb)
on conflict (slug) do nothing;
