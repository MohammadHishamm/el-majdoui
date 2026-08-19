-- ============================================================================
-- 0015_contact_requests.sql — the قناة الشكاوى والمقترحات channel on /contact.
--
-- Deliberately NOT an extension of contact_messages. That table backs the short
-- name/email/phone/message form on the landing page, which stays as it is; this
-- one backs a three-step form whose shape changes per message type. Sharing a
-- table would have meant most columns being null for whichever form didn't use
-- them, and would have coupled two forms that are free to diverge.
--
-- `type` drives the differences the design shows:
--   suggestion (مقترح)   — no reference number
--   complaint  (شكوى)    — adds reference_no (رقم المرجعية / المشروع المرتبط)
--   inquiry    (استفسار عام) — no reference number
--
-- ticket_id is the "رقم تتبع آلي (Ticket ID)" the page promises the submitter.
-- Generated in the DB so it exists even if a row is inserted outside the app,
-- and unique so it can be quoted back as the tracking reference.
-- ============================================================================

create sequence if not exists public.contact_request_ticket_seq;

/** Human-quotable tracking id, e.g. REQ-2026-000042. */
create or replace function public.next_contact_ticket_id()
returns text
language sql
volatile
as $$
  select 'REQ-' || to_char(now(), 'YYYY') || '-' ||
         lpad(nextval('public.contact_request_ticket_seq')::text, 6, '0');
$$;

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  ticket_id text not null unique default public.next_contact_ticket_id(),
  type text not null default 'suggestion'
    check (type in ('suggestion', 'complaint', 'inquiry')),
  -- Complaint-only in the UI; left null by the other two types.
  reference_no text,
  full_name text not null default '',
  phone text not null default '',
  email text not null default '',
  category text not null default '',
  -- "الموجه إليه" — optional on every type.
  addressed_to text,
  subject text not null default '',
  body text not null default '',
  -- [{ path, name, size, mime }] — `path` is a key in the private
  -- contact-attachments bucket, never a public URL. Admin reads it back
  -- through a short-lived signed URL.
  attachments jsonb not null default '[]'::jsonb,
  consent boolean not null default false,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists contact_requests_created_at_idx
  on public.contact_requests (created_at desc);

alter table public.contact_requests enable row level security;

-- No anon policy of any kind, deliberately. The form is public, but its writes
-- go through the server action on the service-role client (which it needs for
-- the attachment upload regardless). Granting anon INSERT would let anyone
-- holding the publicly-shipped anon key POST straight at the REST API and flood
-- the table, skipping every validation and file check the action performs.
drop policy if exists "contact_requests public insert" on public.contact_requests;

drop policy if exists "contact_requests staff read" on public.contact_requests;
create policy "contact_requests staff read"
  on public.contact_requests for select
  using (public.is_staff());

drop policy if exists "contact_requests staff update" on public.contact_requests;
create policy "contact_requests staff update"
  on public.contact_requests for update
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "contact_requests staff delete" on public.contact_requests;
create policy "contact_requests staff delete"
  on public.contact_requests for delete
  using (public.is_staff());

-- ---------------------------------------------------------------------------
-- Attachments bucket — PRIVATE, unlike the public 'media' bucket in 0006.
--
-- These are complaint attachments from members of the public, and the page
-- states "نضمن … بأعلى درجات الخصوصية والسرية". A public bucket would put them
-- on a permanently readable URL, so this one is private and carries no anon
-- policy at all: uploads go through the server action on the service-role
-- client, and the admin views them via short-lived signed URLs. The browser is
-- never given write access to storage.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'contact-attachments', 'contact-attachments', false, 10485760,
  array['application/pdf', 'image/png', 'image/jpeg']
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "contact attachments staff read" on storage.objects;
create policy "contact attachments staff read"
  on storage.objects for select
  using (bucket_id = 'contact-attachments' and public.is_staff());

drop policy if exists "contact attachments staff delete" on storage.objects;
create policy "contact attachments staff delete"
  on storage.objects for delete
  using (bucket_id = 'contact-attachments' and public.is_staff());
