-- Make the home contact card ("يسعدنا تواصلكم معنا") fully editable from
-- الإعدادات → محتوى الموقع. Phone, email and address were already columns;
-- the card's heading and working hours were hard-coded in the app.
--
-- Seeded with the values the card showed until now, so nothing changes on
-- the live site until an editor saves new ones.

alter table public.site_settings
  add column if not exists contact_heading_ar text,
  add column if not exists contact_heading_en text,
  add column if not exists contact_hours_ar   text,
  add column if not exists contact_hours_en   text;

update public.site_settings set
  contact_heading_ar = coalesce(contact_heading_ar, 'يسعدنا تواصلكم معنا'),
  contact_heading_en = coalesce(contact_heading_en, 'We''re Happy to Hear from You'),
  contact_hours_ar   = coalesce(contact_hours_ar, 'من الأحد إلى الخميس – من 8:00 ص حتى 4:00 م'),
  contact_hours_en   = coalesce(contact_hours_en, 'Sunday to Thursday – 8:00 AM to 4:00 PM')
where id;
