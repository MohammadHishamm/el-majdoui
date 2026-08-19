-- ============================================================================
-- 0014_mosques_full_roster.sql — the real facility roster.
--
-- Replaces the five district-level approximations seeded in 0013 with the 36
-- facilities from the foundation's own register ("المرافق والمساجد" sheet):
-- 14 جامع, 11 مسجد, 7 مصلى, 3 مدرسة/روضة and 1 مكتب, in the sheet's own order.
--
-- Coordinates come from the Google Maps link recorded against each facility,
-- so coords_verified is true for every row that has them. The one exception is
-- جامع سعيد بن عبد الله المجدوعي ببلجرشي, which the sheet leaves blank — it is
-- inserted so staff can see it in the admin, and the map fetcher drops it until
-- someone fills the coordinates in.
--
-- Matched on slug so the five 0013 rows are updated in place: they keep their
-- id and, crucially, the photos already uploaded against them. `image` is
-- deliberately absent from the update list for the same reason.
--
-- Capacity and area totals of 0 in the sheet are SUM formulas over blank rows,
-- not facilities that seat nobody, so they land as null.
-- ============================================================================

insert into public.mosques
  (slug, name_ar, name_en, district_ar, district_en, region_ar, region_en,
   lat, lng, coords_verified, capacity, area_sqm, maps_url, sort_order)
values
  ('ali-bin-ibrahim-dammam', 'جامع الشيخ علي بن إبراهيم المجدوعي بالدمام', 'Sheikh Ali bin Ibrahim Almajdouie Grand Mosque – Dammam', 'البادية، الدمام', 'Dammam', 'المنطقة الشرقية', 'Eastern Province', 26.4259847, 50.0906402, true, 3560, 6500, 'https://maps.app.goo.gl/w3H1Y6Gj3zSb7cid7', 1),
  ('saleh-bin-abdullah-dammam', 'جامع الشيخ صالح بن عبد الله المجدوعي بالدمام', 'Sheikh Saleh bin Abdullah Almajdouie Grand Mosque – Dammam', 'الفيصلية، الدمام', 'Dammam', 'المنطقة الشرقية', 'Eastern Province', 26.4009130, 50.0522179, true, 830, 3200, 'https://maps.app.goo.gl/FJS3Envzf2MpbXbx6', 2),
  ('umm-abdullah-dammam', 'جامع أم عبد الله المجدوعي بالدمام', 'Umm Abdullah Almajdouie Grand Mosque – Dammam', 'هجر، الدمام', 'Dammam', 'المنطقة الشرقية', 'Eastern Province', 26.3696190, 50.0985910, true, 874, 2800, 'https://maps.app.goo.gl/nzdcukt2gqxozZMb8', 3),
  ('fikra-bint-saeed', 'جامع فكرة بنت سعيد المجدوعي بمكة المكرمة', 'Fikrah bint Saeed Almajdouie Grand Mosque – Makkah', 'بطحاء قريش، مكة المكرمة', 'Makkah', 'منطقة مكة المكرمة', 'Makkah Region', 21.3534580, 39.8379323, true, 2035, 6084, 'https://maps.app.goo.gl/XdS5PwrkE88fGkMF7', 4),
  ('waldat-ibrahim-khobar', 'مسجد والدة إبراهيم المجدوعي بالخبر', 'Mother of Ibrahim Almajdouie Mosque – Khobar', 'البستان، الخبر', 'Khobar', 'المنطقة الشرقية', 'Eastern Province', 26.3183402, 50.2114414, true, 584, 3850, 'https://maps.app.goo.gl/eHzCHL5YDiAHdHVw8', 5),
  ('umm-omar-dammam', 'مسجد أم عمر المجدوعي بالدمام', 'Umm Omar Almajdouie Mosque – Dammam', 'البادية، الدمام', 'Dammam', 'المنطقة الشرقية', 'Eastern Province', 26.4229245, 50.0906468, true, 182, 365, 'https://maps.app.goo.gl/BZqNeRqtzghnY4CE6', 6),
  ('albaqiyat-alsalihat-dammam', 'مسجد الباقيات الصالحات بالدمام', 'Albaqiyat Alsalihat Mosque – Dammam', 'مدينة العمال، الدمام', 'Dammam', 'المنطقة الشرقية', 'Eastern Province', 26.4278101, 50.1083151, true, 375, 2695, 'https://maps.app.goo.gl/GQbKT1esvV3KuqDP7', 7),
  ('waldat-majdou-baljurashi', 'مسجد والدة مجدوع المجدوعي ببلجرشي', 'Mother of Majdouie Almajdouie Mosque – Baljurashi', 'السلمية، بلجرشي', 'Baljurashi', 'منطقة الباحة', 'Al Baha Region', 19.8641092, 41.5679091, true, 450, 425, 'https://maps.app.goo.gl/7RLcoxhSM6agvAyn9', 8),
  ('saeed-bin-abdullah-dammam-compound', 'جامع سعيد بن عبد الله المجدوعي بالدمام (المجمع السكني)', 'Saeed bin Abdullah Almajdouie Grand Mosque – Dammam (Residential Compound)', 'الأنوار، الدمام', 'Dammam', 'المنطقة الشرقية', 'Eastern Province', 26.3656615, 50.0084821, true, 753, 1368, 'https://maps.app.goo.gl/pB2Aoe8bonsowb4u6', 9),
  ('majdouie-compound-dammam', 'مسجد مجمع المجدوعي السكني بالدمام', 'Almajdouie Residential Compound Mosque – Dammam', 'الأنوار، الدمام', 'Dammam', 'المنطقة الشرقية', 'Eastern Province', 26.3669780, 50.0105370, true, 70, 57, 'https://maps.app.goo.gl/q4y63STQigjb5nSYA', 10),
  ('majdouie-jubail-compound', 'جامع المجدوعي بالجبيل (المجمع السكني)', 'Almajdouie Grand Mosque – Jubail (Residential Compound)', 'الصناعية البلد، الجبيل', 'Jubail', 'المنطقة الشرقية', 'Eastern Province', 26.9619335, 49.6270833, true, 296, 222, 'https://goo.gl/maps/d2Twiv3MwhJgcLou7', 11),
  ('halimah-bint-saeed-jeddah', 'جامع حليمة بنت سعيد المجدوعي بجدة (المجمع السكني)', 'Halimah bint Saeed Almajdouie Grand Mosque – Jeddah (Residential Compound)', 'الخُمرة، جدة', 'Jeddah', 'منطقة مكة المكرمة', 'Makkah Region', 21.3057432, 39.1439382, true, 450, 6084, 'https://goo.gl/maps/WkEXQXXNq3jcVFAP6', 12),
  ('charity-foundation-office-dammam', 'مكتب مؤسسة المجدوعي الخيرية بالدمام', 'Almajdouie Charity Foundation Office – Dammam', 'الفيصلية، الدمام', 'Dammam', 'المنطقة الشرقية', 'Eastern Province', 26.4010668, 50.0528616, true, null, null, 'https://goo.gl/maps/dJrxskXYSPmfEFmb9', 13),
  ('majdouie-compound-yanbu', 'مصلى مجمع المجدوعي السكني بينبع', 'Almajdouie Residential Compound Prayer Room – Yanbu', 'الصناعية، ينبع', 'Yanbu', 'منطقة المدينة المنورة', 'Madinah Region', 23.9982489, 38.2876181, true, 200, 170, 'https://goo.gl/maps/7xpu6L1NSiFUnvcX9', 14),
  ('majdouie-commercial-dammam', 'مسجد مجمع المجدوعي التجاري بالدمام', 'Almajdouie Commercial Compound Mosque – Dammam', 'القادسية، الدمام', 'Dammam', 'المنطقة الشرقية', 'Eastern Province', 26.4152208, 50.0760048, true, 264, 150, 'https://goo.gl/maps/MsBCfdQBEf4msFs29', 15),
  ('saleh-bin-abdullah-jazan', 'جامع الشيخ صالح بن عبد الله المجدوعي بجازان', 'Sheikh Saleh bin Abdullah Almajdouie Grand Mosque – Jazan', 'الرين خطوة العين، الريث', 'Al Rayth', 'منطقة جازان', 'Jazan Region', 17.5858789, 42.9360166, true, 210, 220, 'https://maps.app.goo.gl/d8Evn8xeJAJNLVeX8', 16),
  ('abdullah-bin-ali-jazan', 'جامع عبد الله بن علي المجدوعي بجازان', 'Abdullah bin Ali Almajdouie Grand Mosque – Jazan', 'اللحِجة، الريث', 'Al Rayth', 'منطقة جازان', 'Jazan Region', 17.7643054, 42.7938318, true, 210, 225, 'https://maps.app.goo.gl/i2yc4iw3LnPiv5dj8?g_st=aw', 17),
  ('ali-farm-salasil', 'مسجد مزرعة الشيخ علي المجدوعي بصلاصل', 'Sheikh Ali Almajdouie Farm Mosque – Salasil', 'طريق الرياض، صلاصل', 'Salasil', 'المنطقة الشرقية', 'Eastern Province', 26.2206855, 49.4393611, true, 140, 150, 'https://goo.gl/maps/hSCKSjG38hEdnQT86', 18),
  ('umm-abdullah-school-dammam', 'مدرسة أم عبد الله المجدوعي النسائية بالدمام', 'Umm Abdullah Almajdouie Women''s Quran School – Dammam', 'هجر، الدمام', 'Dammam', 'المنطقة الشرقية', 'Eastern Province', 26.3697928, 50.0986313, true, null, null, 'https://maps.app.goo.gl/9QaYPg2Bbqc6Qtz77', 19),
  ('umm-abdullah-kindergarten-dammam', 'روضة أم عبد الله المجدوعي التعليمية بالدمام', 'Umm Abdullah Almajdouie Kindergarten – Dammam', 'هجر، الدمام', 'Dammam', 'المنطقة الشرقية', 'Eastern Province', 26.3697952, 50.0986407, true, null, null, 'https://maps.app.goo.gl/4CXAHH8L5Ts3fyMa7', 20),
  ('fikra-bint-saeed-school-makkah', 'مدرسة فكرة بنت سعيد المجدوعي بمكة المكرمة', 'Fikrah bint Saeed Almajdouie School – Makkah', 'بطحاء قريش، مكة المكرمة', 'Makkah', 'منطقة مكة المكرمة', 'Makkah Region', 21.3536821, 39.8398193, true, null, null, 'https://goo.gl/maps/Awn8DGjFsMfpGtQE7', 21),
  ('fatimah-bint-ali-dammam', 'مسجد فاطمة بنت علي المجدوعي بالدمام', 'Fatimah bint Ali Almajdouie Mosque – Dammam', 'المدينة الصناعية الثانية (طريق بقيق)، الدمام', 'Dammam', 'المنطقة الشرقية', 'Eastern Province', 26.2485342, 50.0076545, true, 110, 48, 'https://maps.app.goo.gl/bW3bGn721dbPQis2A', 22),
  ('majdouie-steel-dammam', 'جامع مجمع المجدوعي للصناعات الحديدية', 'Almajdouie Steel Industries Grand Mosque – Dammam', 'المدينة الصناعية الثانية (طريق بقيق)، الدمام', 'Dammam', 'المنطقة الشرقية', 'Eastern Province', 26.2588728, 49.9511863, true, 448, 660, 'https://maps.app.goo.gl/JudoaxkYJdvaVbNC7', 23),
  ('ibrahim-eifa-dammam', 'مسجد إبراهيم المجدوعي بالدمام (جمعية إيفاء)', 'Ibrahim Almajdouie Mosque (EIFA Association) – Dammam', 'البساتين، الدمام', 'Dammam', 'المنطقة الشرقية', 'Eastern Province', 26.3957217, 50.1232651, true, 216, 156, 'https://maps.app.goo.gl/xG4HdA14uDbKUvgH7', 24),
  ('hyundai-showroom-dammam', 'مصلى معرض هيونداي الرئيسي بالدمام', 'Hyundai Main Showroom Prayer Room – Dammam', 'الفيصلية، الدمام', 'Dammam', 'المنطقة الشرقية', 'Eastern Province', 26.4005275, 50.0502266, true, 176, 140, 'https://goo.gl/maps/sTumewzEs6nS5YGx7', 25),
  ('majdouie-tower-dammam', 'مصلى برج المجدوعي بالدمام', 'Almajdouie Tower Prayer Room – Dammam', 'الفيصلية، الدمام', 'Dammam', 'المنطقة الشرقية', 'Eastern Province', 26.4008998, 50.0514242, true, 224, 192, 'https://goo.gl/maps/euMxm5NdcUob8ERr8', 26),
  ('majd-business-tower-khobar', 'مصلى برج مجد للأعمال بالخبر', 'Majd Business Tower Prayer Room – Khobar', 'البستان، الخبر', 'Khobar', 'المنطقة الشرقية', 'Eastern Province', 26.3184380, 50.2158650, true, 192, 180, 'https://maps.app.goo.gl/ByUy5p16bnudkFNK7', 27),
  ('majd-square-tower-jubail', 'مصلى برج مجد سكوير بالجبيل', 'Majd Square Tower Prayer Room – Jubail', 'طيبة، الجبيل', 'Jubail', 'المنطقة الشرقية', 'Eastern Province', 26.9810702, 49.6480836, true, 303, 240, 'https://goo.gl/maps/U62hy95ihTSQSCRY6', 28),
  ('majdouie-plaza-jubail', 'مسجد ساحة المجدوعي بالجبيل', 'Almajdouie Plaza Mosque – Jubail', 'طيبة، الجبيل', 'Jubail', 'المنطقة الشرقية', 'Eastern Province', 26.9694565, 49.6260669, true, 42, 45, 'https://goo.gl/maps/QfvQtsnkq8e5Bf3t8', 29),
  ('ali-farm-albayda', 'مسجد مزرعة الشيخ علي المجدوعي بالبيضاء (خاص)', 'Sheikh Ali Almajdouie Farm Mosque – Al-Bayda (Private)', 'طريق أبو حدرية، البيضاء', 'Al Bayda', 'المنطقة الشرقية', 'Eastern Province', 26.4822854, 49.9615395, true, 272, 450, 'https://goo.gl/maps/7EmcwvX3cZKNVuE87', 30),
  ('majdouie-holding-jeddah', 'مصلى فرع شركة المجدوعي القابضة بجدة', 'Almajdouie Holding Branch Prayer Room – Jeddah', 'البغدادية الغربية، جدة', 'Jeddah', 'منطقة مكة المكرمة', 'Makkah Region', 21.5078906, 39.1796439, true, 80, 42, 'https://goo.gl/maps/CNmMgj3ZUkxdSHD1A', 31),
  ('fikra-bint-saeed-baljurashi', 'جامع فكرة بنت سعيد المجدوعي ببلجرشي (منتجع إكرام المسنين)', 'Fikrah bint Saeed Almajdouie Grand Mosque – Baljurashi (Elderly Care Resort)', 'الشطِيبة، بلجرشي', 'Baljurashi', 'منطقة الباحة', 'Al Baha Region', 19.8479985, 41.5934606, true, 700, 300, 'https://maps.app.goo.gl/trfN7yjrTvZUeu6m9', 32),
  ('saeed-bin-abdullah-baljurashi', 'جامع سعيد بن عبد الله المجدوعي ببلجرشي', 'Saeed bin Abdullah Almajdouie Grand Mosque – Baljurashi', 'الرحيق، بلجرشي', 'Baljurashi', 'منطقة الباحة', 'Al Baha Region', null, null, false, null, null, '', 33),
  ('ali-al-majdouie-makkah', 'جامع الشيخ علي بن إبراهيم المجدوعي بمكة المكرمة', 'Sheikh Ali bin Ibrahim Almajdouie Grand Mosque – Makkah', 'مخطط الزايدي، مكة المكرمة', 'Makkah', 'منطقة مكة المكرمة', 'Makkah Region', 21.3990670, 39.7103720, true, 3680, 5600, 'https://goo.gl/maps/TwtRyF99AQ5CC49J6', 34),
  ('ibrahim-bin-saleh-makkah', 'جامع إبراهيم بن صالح المجدوعي بمكة المكرمة', 'Ibrahim bin Saleh Almajdouie Grand Mosque – Makkah', 'الشرائع، مكة المكرمة', 'Makkah', 'منطقة مكة المكرمة', 'Makkah Region', 21.4701644, 39.9413813, true, null, null, 'https://maps.app.goo.gl/952e1mGrhATxbs1d8', 35),
  ('umm-abdullah-makkah', 'جامع أم عبد الله المجدوعي بمكة المكرمة', 'Umm Abdullah Almajdouie Grand Mosque – Makkah', 'مكة المكرمة', 'Makkah', 'منطقة مكة المكرمة', 'Makkah Region', 21.4401002, 39.7810383, true, null, null, 'https://maps.app.goo.gl/9DqbfzA9HYTnNEgK7', 36)
on conflict (slug) do update set
  name_ar         = excluded.name_ar,
  name_en         = excluded.name_en,
  district_ar     = excluded.district_ar,
  district_en     = excluded.district_en,
  region_ar       = excluded.region_ar,
  region_en       = excluded.region_en,
  lat             = excluded.lat,
  lng             = excluded.lng,
  coords_verified = excluded.coords_verified,
  capacity        = excluded.capacity,
  area_sqm        = excluded.area_sqm,
  maps_url        = excluded.maps_url,
  sort_order      = excluded.sort_order;
