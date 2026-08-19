-- ============================================================================
-- 0007_seed_content.sql — port current hardcoded content into the CMS so the
-- site keeps rendering after it is wired to Supabase. Idempotent (upserts).
-- (News is seeded separately via scripts/seed-news.ts which imports lib/news.ts.)
-- ============================================================================

-- ---- Site settings (single row) -------------------------------------------
update public.site_settings set
  about_title_ar = 'تمكين لأثر مستدام',
  about_title_en = 'Empowerment for Sustainable Impact',
  about_body_ar  = 'المجدوعي الخيرية مؤسسة مانحة تُسهم في تحسين جودة الحياة الاقتصادية للمحتاج والعناية بمساجد المجدوعي، من خلال حلول مبتكرة وشراكات فاعلة ومنح ميسّر.',
  about_body_en  = 'Almajdouie Charitable Foundation is a philanthropic foundation contributing to improving the economic quality of life for those in need and caring for Almajdouie Mosques, through innovative solutions, effective partnerships, and accessible grants.',
  leadership_quote_ar = 'نؤمن بأن الإحسان الحقيقي هو ذلك الذي يُمكّن المحتاج من الاعتماد على نفسه، ويبني مستقبلاً مستداماً له ولأسرته، ويُعمّر بيوت الله لتكون منارات للعلم والإيمان.',
  leadership_quote_en = 'We believe that true benevolence is that which empowers the needy to be self-reliant, builds a sustainable future for them and their families, and restores the houses of God to be beacons of knowledge and faith.',
  leadership_name_ar = 'الشيخ علي بن إبراهيم المجدوعي',
  leadership_name_en = 'Sheikh Ali bin Ibrahim Almajdouie',
  leadership_position_ar = 'رئيس مجلس الأمناء',
  leadership_position_en = 'Chairman of the Board of Trustees',
  leadership_photo = '/images/figma/sections/leadership.png'
where id = true;

-- ---- Focus areas (home tiles) ---------------------------------------------
insert into public.focus_areas
  (slug, name_ar, name_en, short_desc_ar, short_desc_en, bg_color, btn_text_color, icon, watermark, sort_order)
values
  ('empowerment', 'المحتاج', 'The Needy',
   'تمكين اقتصادي وتفريج كربات من خلال برامج مستدامة تحقق الاكتفاء الذاتي للأسر المحتاجة.',
   'Economic empowerment and relief through sustainable programs that achieve self-sufficiency for needy families.',
   '#80A5E0', '#005761',
   '/images/figma/sections/focus1(2).svg', '/images/figma/sections/focus-1.svg', 1),
  ('mosques', 'مساجد المجدوعي', 'Almajdouie Mosques',
   'عناية وتطوير ومنارة للعلم من خلال بناء وتجهيز مساجد نموذجية تخدم المجتمع.',
   'Care, development, and a beacon of knowledge through building and equipping model mosques that serve the community.',
   '#00B5C2', '#00B5C2',
   '/images/figma/sections/focus-2(2).svg', '/images/figma/sections/focus-2.svg', 2),
  ('partners-development', 'شركاء التنفيذ', 'Implementation Partners',
   'تطوير جاهزية الجمعيات الشريكة ورفع كفاءتها التنظيمية والمالية لإحداث أثر تنموي مستدام.',
   'Developing the readiness of partner associations and raising their organizational and financial efficiency for sustainable impact.',
   '#005761', '#80A5E0',
   '/images/figma/sections/focus-3(2).svg', '/images/figma/sections/focus-3.svg', 3)
on conflict (slug) do update set
  name_ar = excluded.name_ar, name_en = excluded.name_en,
  short_desc_ar = excluded.short_desc_ar, short_desc_en = excluded.short_desc_en,
  bg_color = excluded.bg_color, btn_text_color = excluded.btn_text_color,
  icon = excluded.icon, watermark = excluded.watermark, sort_order = excluded.sort_order;

-- ---- Hero slides -----------------------------------------------------------
insert into public.hero_slides (title_ar, title_en, image, href, sort_order) values
  ('إطلاق برنامج كفالة الأيتام في المنطقة الشرقية',
   'Launching the Orphan Sponsorship Program in the Eastern Province',
   '/images/slide-show03.png', '/programs', 1),
  ('شراكة استراتيجية مع 15 جهة تنفيذية لتحقيق أثر مستدام',
   'Strategic Partnership with 15 Implementing Entities for Sustainable Impact',
   '/images/hero-slide-1.png', '/programs', 2),
  ('حفل تكريم الشركاء وداعمي مؤسسة المجدوعي الخيرية',
   'Almajdouie Foundation Partners & Supporters Appreciation Ceremony',
   '/images/hero-slide-2.png', '/news', 3)
on conflict do nothing;
