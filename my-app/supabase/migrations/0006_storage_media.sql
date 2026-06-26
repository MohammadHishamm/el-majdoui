-- ============================================================================
-- 0006_storage_media.sql — public 'media' bucket for admin image uploads.
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Public read of media objects.
drop policy if exists "media public read" on storage.objects;
create policy "media public read"
  on storage.objects for select
  using (bucket_id = 'media');

-- Any signed-in staff member can upload/update/delete media.
drop policy if exists "media staff insert" on storage.objects;
create policy "media staff insert"
  on storage.objects for insert
  with check (bucket_id = 'media' and public.is_staff());

drop policy if exists "media staff update" on storage.objects;
create policy "media staff update"
  on storage.objects for update
  using (bucket_id = 'media' and public.is_staff())
  with check (bucket_id = 'media' and public.is_staff());

drop policy if exists "media staff delete" on storage.objects;
create policy "media staff delete"
  on storage.objects for delete
  using (bucket_id = 'media' and public.is_staff());
