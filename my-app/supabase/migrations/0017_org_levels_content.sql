-- ============================================================================
-- 0017_org_levels_content.sql — fills in levels 2–4.
--
-- 0016 seeded these with tile copy only, because the design node for the new
-- page details level 1 alone. The remaining content comes from the earlier
-- stacked version of the page, where each of these levels is a list of
-- title + description pairs and — unlike level 1 — carries no separate
-- introductory paragraph and no plain-name member chips.
--
-- That shape is exactly `leaders` (name + role), so this is content only: no
-- schema change, and the page renders them through the existing cards.
-- ============================================================================

update public.org_levels set leaders = '[
  {"name_ar":"اللجنة التنفيذية","name_en":"",
   "role_ar":"برئاسة الأستاذ / إبراهيم المجدوعي، لمتابعة الخطة الاستراتيجية ودراسة الموازنات وإعداد توصيات المجلس.","role_en":""},
  {"name_ar":"اللجنة الإشرافية ولجان المنح","name_en":"",
   "role_ar":"لدراسة وتقييم طلبات الدعم المقدمة من الأفراد (بوابة الجود) والجهات الخيرية، والتحقق من شروط المنح والتمكين.","role_en":""}
]'::jsonb
where level_no = 2;

update public.org_levels set leaders = '[
  {"name_ar":"د. علي بن سليمان الفوزان","name_en":"",
   "role_ar":"المدير التنفيذي — يقود الأمانة العامة والإشراف المباشر على القطاعات التشغيلية.","role_en":""}
]'::jsonb
where level_no = 3;

update public.org_levels set leaders = '[
  {"name_ar":"إدارة البرامج والمبادرات والتطوير التنموي","name_en":"",
   "role_ar":"التخطيط وإدارة مشاريع المنح والتمكين المستدام.","role_en":""},
  {"name_ar":"إدارة عمارة المساجد (مساجد المجدوعي)","name_en":"",
   "role_ar":"التخطيط والصيانة والإشراف التشغيلي على مساجد وجوامع المؤسسة.","role_en":""},
  {"name_ar":"إدارة الاتصال المالي والإداري","name_en":"",
   "role_ar":"الشؤون المالية والموارد البشرية والمشتريات وتقنية المعلومات.","role_en":""},
  {"name_ar":"إدارة الإعلام والتسويق المؤسسي","name_en":"",
   "role_ar":"الهوية البصرية والمركز الإعلامي والعلاقات العامة.","role_en":""},
  {"name_ar":"إدارة الجودة والمراجعة الداخلية","name_en":"",
   "role_ar":"الحوكمة وإدارة المخاطر والامتثال للسياسات واللوائح.","role_en":""}
]'::jsonb
where level_no = 4;
