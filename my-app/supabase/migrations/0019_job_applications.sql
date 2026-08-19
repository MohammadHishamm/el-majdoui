-- ============================================================================
-- 0019_job_applications.sql — التقديمات: applications submitted from the public
-- job form at /careers/[slug].
--
-- Modelled on 0015_contact_requests: a private bucket for the uploaded CV, no
-- anon policy anywhere, and every write routed through the server action on the
-- service-role client so the validation there is the only way in.
--
-- The job is stored three ways on purpose: job_id for the live relation,
-- job_slug + job_title as a snapshot so an application still reads correctly
-- after the posting is renamed or deleted (the FK nulls out, the snapshot
-- stays — a CV with no idea which role it was for is useless).
-- ============================================================================

create sequence if not exists public.job_application_no_seq;

/** Human-quotable application id, e.g. APP-2026-000042. */
create or replace function public.next_job_application_no()
returns text
language sql
volatile
as $$
  select 'APP-' || to_char(now(), 'YYYY') || '-' ||
         lpad(nextval('public.job_application_no_seq')::text, 6, '0');
$$;

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  application_no text not null unique default public.next_job_application_no(),
  job_id uuid references public.jobs (id) on delete set null,
  job_slug text not null default '',
  job_title text not null default '',
  first_name text not null default '',
  last_name text not null default '',
  email text not null default '',
  phone text not null default '',
  city text,
  experience text,
  cover_letter text,
  linkedin text,
  -- { path, name, size, mime } — `path` is a key in the private
  -- job-applications bucket, never a public URL. Admin reads it back through
  -- a short-lived signed URL.
  cv jsonb,
  consent boolean not null default false,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists job_applications_created_at_idx
  on public.job_applications (created_at desc);

create index if not exists job_applications_job_id_idx
  on public.job_applications (job_id);

alter table public.job_applications enable row level security;

-- No anon policy, deliberately — see 0015. The form is public; its writes go
-- through the server action on the service-role client, which also needs that
-- client for the CV upload.
drop policy if exists "job_applications staff read" on public.job_applications;
create policy "job_applications staff read"
  on public.job_applications for select
  using (public.is_staff());

drop policy if exists "job_applications staff update" on public.job_applications;
create policy "job_applications staff update"
  on public.job_applications for update
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "job_applications staff delete" on public.job_applications;
create policy "job_applications staff delete"
  on public.job_applications for delete
  using (public.is_staff());

-- ---------------------------------------------------------------------------
-- CV bucket — PRIVATE. A résumé is personal data belonging to someone who has
-- not been hired; it must never sit on a permanently readable URL.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'job-applications', 'job-applications', false, 5242880,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "job applications staff read" on storage.objects;
create policy "job applications staff read"
  on storage.objects for select
  using (bucket_id = 'job-applications' and public.is_staff());

drop policy if exists "job applications staff delete" on storage.objects;
create policy "job applications staff delete"
  on storage.objects for delete
  using (bucket_id = 'job-applications' and public.is_staff());
