# Backend Handover — Almajdouie Foundation

**Project ref:** `ibcnfufiyrnkfgxjkanr` · **Region host:** `ibcnfufiyrnkfgxjkanr.supabase.co`
Verified against the live database on 2026-08-19.

---

## 0. First, a correction to the brief

> **The backend is Supabase (Postgres), not Firebase.**

There is no Firebase in this project — no `firebase` dependency, no `firebase.json`, no Firestore, no Cloud Functions. The brief's mention of Firebase does not match the code. What exists is:

- **Supabase Postgres** — 20 application tables, all with Row Level Security
- **Supabase Auth** — email/password, staff-only, three roles
- **Supabase Storage** — 3 buckets (1 public, 2 private)
- **No Edge Functions, no database webhooks, no cron/pg_cron jobs, no realtime subscriptions**

Consequently, **"the backend" is not a separate service.** There is no API server. The application talks to Postgres directly:

- **Reads** go through PostgREST via `@supabase/supabase-js`, called from Next.js Server Components.
- **Writes** go through Next.js **Server Actions**, also calling PostgREST.
- **Authorization is Postgres RLS**, not application middleware.

The rest of this document describes that system. Everything about how the frontend consumes it is in `FRONTEND-HANDOVER.md`.

---

## 1. Architecture in one diagram

```
                     Browser
                        │
        ┌───────────────┼────────────────────────────┐
        │               │                            │
   page render     Server Action              direct Storage upload
   (RSC, server)   (form POST, server)        (admin image fields, browser)
        │               │                            │
        ▼               ▼                            ▼
  supabaseAnon    createClient()              createClient() [browser]
  (anon key,      (anon key + user cookie)    (anon key + user cookie)
   no cookies)          │                            │
        │               │                            │
        └───────────────┴────────────┬───────────────┘
                                     ▼
                        ╔════════════════════════╗
                        ║  Supabase / PostgREST  ║
                        ║  ── RLS enforced ──    ║
                        ╚════════════════════════╝
                                     ▲
                                     │  (bypasses RLS)
                        createAdminClient() [service role]
                        used by: users CRUD,
                                 public contact form,
                                 public job-application form,
                                 signed-URL minting, object deletion
```

**The security model in one sentence:** the anon key is public and shipped to browsers, so *every* table's protection is its RLS policies — and anything that must not be reachable with the anon key has **no anon policy at all** and is written exclusively through a server action holding the service-role key.

---

## 2. The four clients (recap, because it governs everything)

| Client | File | Key | RLS | Use |
|---|---|---|---|---|
| `supabaseAnon` | `lib/supabase/anon.ts` | anon | ✅ enforced, unauthenticated | Public page reads |
| `createClient()` server | `lib/supabase/server.ts` | anon + user cookie | ✅ enforced as that user | Admin reads & writes |
| `createClient()` browser | `lib/supabase/client.ts` | anon + user cookie | ✅ enforced as that user | Direct Storage uploads from admin forms |
| `createAdminClient()` | `lib/supabase/admin.ts` | **service role** | ❌ **bypassed** | User management, public form intake, signed URLs, object deletion |

`SUPABASE_SERVICE_ROLE_KEY` grants unrestricted database access. It must never appear in a client bundle, a `NEXT_PUBLIC_*` variable, a log line, or an error message.

---

## 3. Authentication

### 3.1 Provider and flow

Supabase Auth with **email + password only**. No OAuth, no magic links, no SMS. Sessions are cookie-based, refreshed by `middleware.ts` → `lib/supabase/middleware.ts::updateSession()` on every `/admin/**` request.

There is **no public user registration**. `/admin` is a login form only. Accounts are created by a Super Admin inside the dashboard, using `admin.auth.admin.createUser({ email_confirm: true })` — so new staff are pre-confirmed and never receive a verification email. Password minimum enforced in the action: **8 characters**.

### 3.2 `profiles` and the role enum

```sql
create type public.app_role as enum ('super_admin', 'content_editor', 'news_manager');

create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  full_name  text,
  role       public.app_role not null default 'content_editor',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

A trigger on `auth.users` keeps them in sync:

```sql
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
```

`handle_new_user()` is `SECURITY DEFINER` and inserts a profile row with `full_name` from `raw_user_meta_data`, falling back to the email. Deleting the auth user cascades the profile away.

> **Bootstrap:** the first Super Admin cannot be created from the UI (you need a Super Admin to create users). Create the auth user in the Supabase dashboard, then run:
> ```sql
> update public.profiles set role = 'super_admin' where email = 'you@example.com';
> ```
> This is documented at the bottom of `0001_auth_roles.sql`.

### 3.3 The RLS helper functions

Five `SECURITY DEFINER STABLE` SQL functions with `search_path = public`. They are `SECURITY DEFINER` specifically so they can read `profiles` without recursing into the policy that calls them — a classic RLS deadlock this design avoids deliberately.

| Function | Returns true for |
|---|---|
| `current_app_role()` | the caller's role, or null when signed out |
| `is_super_admin()` | `super_admin` |
| `is_content_staff()` | `super_admin`, `content_editor` |
| `is_news_staff()` | `super_admin`, `news_manager` |
| `is_staff()` | any signed-in user with a profile row |

These five are the entire vocabulary of the authorization system. Every policy in the database is expressed in them.

### 3.4 What each role can actually do

| Domain | Tables | Gate | super_admin | content_editor | news_manager |
|---|---|---|---|---|---|
| Site content | `site_settings`, `hero_slides`, `focus_areas`, `programs`, `program_panels`, `jobs`, `kpis`, `policies`, `team_members`, `mosques`, `org_levels`, `board_committees`, `page_content` | `is_content_staff()` | ✅ | ✅ | ❌ |
| News & media | `news`, `gallery_items`, `reports` | `is_news_staff()` | ✅ | ❌ | ✅ |
| Inboxes | `contact_requests`, `job_applications` | `is_staff()` | ✅ | ✅ | ✅ |
| Legacy inbox | `contact_messages` | `is_content_staff()` | ✅ | ✅ | ❌ |
| Media bucket | `storage.objects` (`media`) | `is_staff()` | ✅ | ✅ | ✅ |
| Users & roles | `profiles` | `is_super_admin()` | ✅ | ❌ | ❌ |

> **Note the asymmetry:** `reports` and `gallery_items` are gated by `is_news_staff()`, not `is_content_staff()` — a `content_editor` **cannot** manage reports or the gallery, because those live in the public Media Center alongside news. This was a deliberate call (documented in `0011_reports.sql`) and it surprises people. The admin sidebar reflects it correctly.

---

## 4. Database schema — 20 tables

All tables have RLS **enabled**. `id uuid primary key default gen_random_uuid()` and `created_at/updated_at timestamptz` unless noted. Every content table carries a `before update` trigger calling `public.set_updated_at()`.

### 4.1 Standard content tables

These all share the same policy pair:

```sql
-- read
using (published or public.is_staff())     -- staff see drafts, public sees published only
-- write (FOR ALL)
using (<gate>()) with check (<gate>())
```

| Table | Key columns | Write gate | Feeds |
|---|---|---|---|
| **`hero_slides`** | `title_ar/en`, `image`, `href`, `sort_order`, `published` | `is_content_staff` | Home hero carousel |
| **`focus_areas`** | `slug` ᵁ, `name_*`, `short_desc_*`, `bg_color`, `btn_text_color`, `icon`, `watermark`, + detail fields `detail_title_*`, `detail_intro_*`, `carousel` jsonb, `stats` jsonb, `detail_programs` jsonb | `is_content_staff` | `/focus-areas`, `/focus-areas/[slug]`, home tiles |
| **`programs`** | `slug` ᵁ, `category` ∈ {empowerment, mosques, partners}, `title_*`, `short_desc_*`, `hero_desc`, `about`, `objectives` text[], `stages` jsonb, `target_groups` text[], `quote` jsonb, `partners` text[], `info` jsonb, `related` text[] | `is_content_staff` | `/programs`, `/programs/[slug]` |
| **`program_panels`** | `slug` ᵁ, `name_*`, `desc_*`, `bg_color`, `initiatives` jsonb | `is_content_staff` | Home "Programs Explorer" |
| **`news`** | `slug` ᵁ, `category` ∈ {institution, announcements, partnerships}, `title_*`, `excerpt_*`, `kicker`, `date` (display string), `published_at` (sort key), `source`, `read_time`, `image`, `caption`, `lead`, `body` text[], `axes` jsonb, `quote`, `after_quote`, `tags` text[], `related` text[] (slugs), `featured`, `home_featured` | **`is_news_staff`** | `/news`, `/news/[slug]`, home |
| **`gallery_items`** | `type` ∈ {album, video}, `slug`, `title_*`, `meta_*`, `thumb`, `cover`, `video_url`, `date_*`, `location_*`, `photographer_*`, `section_*`, `about_*`, `images` jsonb, `videos` jsonb | **`is_news_staff`** | `/gallery`, `/gallery/[slug]` |
| **`reports`** | `title_*`, `period_*`, `file` (PDF URL) | **`is_news_staff`** | `/reports` |
| **`jobs`** | `slug` ᵁ, `title_*`, `summary_*`, `department`, `location`, `type`, `experience`, `education`, `deadline`, `posted`, `responsibilities` text[], `qualifications` text[] | `is_content_staff` | `/careers`, `/careers/[id]` |
| **`kpis`** | `value` int, `suffix`, `label_*`, `year`, `icon` | `is_content_staff` | Home impact counters |
| **`policies`** | `title_*`, `version`, `category` ∈ {basics, governance, guides}, `file` | `is_content_staff` | `/about/policies` |
| **`team_members`** | `type` ∈ {board, leadership}, `name_*`, `role_*`, `image` | `is_content_staff` | `/about/board` |
| **`mosques`** | `slug` ᵁ, `name_*`, `district_*`, `region_*`, `lat`, `lng`, `coords_verified`, `capacity`, `area_sqm`, `image`, `maps_url` | `is_content_staff` | Mosque map |
| **`org_levels`** | `level_no` int ᵁ (also the sort key), `title_*`, `subtitle_*`, `description_*`, `icon` (lucide name), `bg_color`, `leaders` jsonb, `members_label_*`, `members` jsonb | `is_content_staff` | `/about/org-structure` |
| **`board_committees`** | `slug` ᵁ, `title_*`, `description_*`, `members` jsonb, `duties` jsonb | `is_content_staff` | `/about/board` sections 1–2 |

ᵁ = unique.

### 4.2 Singleton and key-value tables

**`site_settings`** — enforced single row via `id boolean primary key default true` + `check (id)`. Holds the home About block, the leadership quote card, foundation facts (`founded_year`, `license_no`), contact details, and 6 social URLs each paired with a `*_show` boolean. Read policy is `using (true)` — no `published` column.

**`page_content`** — `slug text primary key`, `content jsonb`, `updated_at`. A **schemaless escape hatch** for page copy that doesn't justify its own table. Read policy is `using (true)`.

Slugs in use:

| Slug | Edited at | Rendered at |
|---|---|---|
| `vision-mission` | `/admin/dashboard/pages/vision-mission` | `/about/vision-mission` |
| `who-we-are` | `/admin/dashboard/pages/who-we-are` | `/about/who-we-are` |
| `strategy` | `/admin/dashboard/pages/strategy` | `/about/strategy` |
| `brand-identity` | `/admin/dashboard/pages/brand-identity` | `/brand-identity` |
| `privacy-policy` | `/admin/dashboard/pages/privacy-policy` | `/privacy-policy` |
| `board` | `/admin/dashboard/team` | `/about/board` |
| `ceo-office` | `/admin/dashboard/team` | `/about/board` §3 |
| `careers` | `/admin/dashboard/careers` | `/careers` |
| `mosques-map` | `/admin/dashboard/mosques` | `/focus-areas/mosques` |
| `strategic-alignment` | `/admin/dashboard/strategic-alignment` | `/` |

> **⚠ The `content` blob has no schema, no validation, and no versioning.** `updatePageContent` does `JSON.parse` and **silently substitutes `{}` on a parse error** — a malformed paste wipes the page's copy with no warning and no undo. Read `app/admin/dashboard/pages/actions.ts:16-22`. This is the highest-value backend fix in the codebase.

### 4.3 Intake tables (personal data)

These are structurally different: no `published`, no `updated_at`, **no anon policy of any kind**, and a private storage bucket alongside.

**`contact_requests`** — قناة الشكاوى والمقترحات (three-step complaints/suggestions channel).

```sql
ticket_id text unique default public.next_contact_ticket_id()   -- 'REQ-2026-000042'
type text check (type in ('suggestion','complaint','inquiry'))
reference_no  -- complaint-only in the UI; the action nulls it for other types
full_name, phone, email, category, addressed_to, subject, body
attachments jsonb default '[]'   -- [{ path, name, size, mime }] — path is a private bucket key
consent boolean, is_read boolean, created_at
index: contact_requests_created_at_idx (created_at desc)
```

`next_contact_ticket_id()` reads `public.contact_request_ticket_seq` and formats `REQ-{YYYY}-{000000}`. Generated in the database, not the app, so the ticket exists even if a row is inserted out-of-band.

**`job_applications`** — التقديمات.

```sql
application_no text unique default public.next_job_application_no()  -- 'APP-2026-000042'
job_id uuid references public.jobs(id) on delete set null
job_slug, job_title      -- snapshot: survives the posting being renamed or deleted
first_name, last_name, email, phone, city, experience, cover_letter, linkedin
cv jsonb                 -- { path, name, size, mime } in the private bucket
consent boolean, is_read boolean, created_at
indexes: job_applications_created_at_idx (created_at desc), job_applications_job_id_idx
```

The triple storage of the job (`job_id` + `job_slug` + `job_title`) is deliberate and documented in the migration: the FK nulls out when a posting is deleted, but the snapshot stays, because a CV with no idea which role it was for is useless.

Policies for both: `staff read` / `staff update` / `staff delete`, all `using (public.is_staff())`. **No INSERT policy.** Writes come only from the server action on the service-role client.

**`contact_messages`** — the short name/email/phone/message form on the home page. Predates `contact_requests` and was deliberately kept separate (documented in `0015`): sharing a table would have meant most columns null for whichever form didn't use them.

```sql
name, email, phone, message, is_read, created_at
```

> **⚠ Security gap — this is the one table that breaks the pattern.**
> ```
> policy "contact insert public"  FOR INSERT  with check (true)
> ```
> Anyone holding the anon key — which is shipped in every page — can POST unlimited rows straight at `/rest/v1/contact_messages`, bypassing the form entirely. The write path (`components/home/contact-actions.ts`) uses `supabaseAnon`, not the service-role client, unlike its two younger siblings. There is no rate limiting, no CAPTCHA, and no honeypot. **This is a spam-flood vector.** See the Production doc for the fix.

### 4.4 Sequences and functions inventory

| Object | Kind | Notes |
|---|---|---|
| `set_updated_at()` | trigger fn | shared by every content table |
| `handle_new_user()` | trigger fn | `SECURITY DEFINER`, on `auth.users` insert |
| `current_app_role()`, `is_super_admin()`, `is_content_staff()`, `is_news_staff()`, `is_staff()` | RLS helpers | `SECURITY DEFINER STABLE`, `search_path = public` |
| `next_contact_ticket_id()` | default value | ⚠ **no `search_path` set** — flagged by the linter |
| `next_job_application_no()` | default value | ⚠ **no `search_path` set** — flagged by the linter |
| `contact_request_ticket_seq`, `job_application_no_seq` | sequences | back the two ID generators |

---

## 5. Storage

| Bucket | Public | Size limit | Allowed MIME | Contents |
|---|---|---|---|---|
| `media` | ✅ **public** | none | none | All CMS images and PDFs |
| `contact-attachments` | 🔒 private | 10 MB | `application/pdf`, `image/png`, `image/jpeg` | Complaint attachments |
| `job-applications` | 🔒 private | 5 MB | `application/pdf`, `.doc`, `.docx` | Candidate CVs |

### `media` policies

```sql
select  using (bucket_id = 'media')                          -- anyone
insert  with check (bucket_id = 'media' and is_staff())
update  using/with check (bucket_id = 'media' and is_staff())
delete  using (bucket_id = 'media' and is_staff())
```

Uploads happen **directly from the admin browser** with the anon key + staff session; the resulting public URL is what gets stored in the content row. `next.config.ts` allowlists `${SUPABASE_HOST}/storage/v1/object/public/**` for `next/image`.

> **⚠ `media` has no size limit and no MIME allowlist at the bucket level.** The only constraints are client-side, in `components/admin/inline-upload.tsx` (3 MB / 3000 px) — trivially bypassed by any signed-in staff member using the API directly. Set bucket-level limits.

> **⚠ Orphaned objects are never cleaned up.** Deleting a news article does not delete its image; replacing an image leaves the old one. Only `contact-attachments` and `job-applications` have paired deletion (in `complaints/actions.ts` and `applications/actions.ts`). The `media` bucket grows monotonically.

### Private buckets

No anon policy. Read/delete require `is_staff()`. The admin never links to an object directly — it mints short-lived links server-side:

```ts
supabase.storage.from(BUCKET).createSignedUrls(paths, SIGNED_URL_TTL)
```

Object keys are derived from the generated ticket/application number and a timestamp, **never from the user's filename** — so a malicious filename can't traverse or collide.

---

## 6. Migrations — and the drift you need to know about

### 6.1 Two sources of truth that disagree

`my-app/supabase/migrations/` holds 19 `.sql` files. The **live database has 27 applied migrations**, and the two sets only partially overlap.

**Applied to the remote DB but absent from the repo (10):**

| Version | Name | What it did (inferred from live schema) |
|---|---|---|
| `20260626194742` | `0008_security_hardening` | Unknown. Also appears to have dropped `hero_slides.excerpt_ar/en` and `.category` |
| `20260626223250` | `0011b_reports_news_staff` | Moved `reports` write gate to `is_news_staff` |
| `20260626224313` | `0013_kpis_policies_team` | Created `kpis`, `policies`, `team_members` |
| `20260627151502` | `0014_home_sections_contact` | Created `program_panels`, `contact_messages`, added `news.home_featured` |
| `20260627153952` | `0015_focus_area_detail` | Added `focus_areas.detail_*`, `carousel`, `stats`, `detail_programs` |
| `20260627164902` | `0016_page_content` | Created `page_content` |
| `20260627190042` | `0017_site_settings_social` | Added 6 `social_*` columns |
| `20260628180518` | `0018_site_settings_social_youtube_show` | Added the 6 `social_*_show` booleans |
| `20260628201229` | `0019_gallery_album_detail` | Added the gallery album detail columns |
| `20260701201430` | `gallery_videos_array` | Added `gallery_items.videos` jsonb |

**In the repo but never applied remotely (1):** `0007_seed_content.sql`.

**Number collisions:** the repo's `0013_mosques`, `0014_mosques_full_roster`, `0015_contact_requests`, `0016_org_levels`, `0017_org_levels_content`, `0018_board_committees`, `0019_job_applications` reuse numbers that already mean something different in the remote history. Sequential ordering of the local folder no longer reflects reality.

**Known schema divergence:** `supabase/migrations/0003_hero_slides.sql` declares `excerpt_ar`, `excerpt_en` and `category`. The live `hero_slides` table has none of them.

### 6.2 ✅ RESOLVED — the folder has been rebaselined

The drift described above is **fixed**. `supabase/migrations/` now contains a single
`00000000000000_baseline.sql`, reconstructed directly from the live schema, and the
18 superseded files have moved to `migrations/_archive/` (kept for their design
rationale, not executable).

**Verified, not assumed:** the baseline was applied to a clean database via
`supabase db reset`, and its schema checksum compared against production —
**303 columns, identical, including every default expression**
(`md5 = 999d08aa304565e18d3000705d560701` on both sides). RLS behaviour was then
tested against the rebuilt database:

| Test | Result |
|---|---|
| anon reads published content | ✅ 7 news, 36 mosques, 10 page_content |
| anon sees drafts | ✅ blocked — 6 of 7 after unpublishing one |
| anon inserts content | ✅ blocked — RLS violation |
| anon reads CVs / complaints | ✅ blocked — 0 rows |
| `on_auth_user_created` trigger | ✅ profile auto-created as `content_editor` |
| content_editor writes mosques | ✅ allowed |
| content_editor writes news | ✅ blocked — news_staff only |

One real bug was found and fixed by that testing: the first draft of the baseline
omitted the **table-level grants** to `anon`/`authenticated`. Postgres checks
privileges *before* RLS, so a rebuild failed with `permission denied for table news`
and the policies never ran at all. Supabase applies those grants through its own
default privileges, which is why the original migrations never had to state them —
and why a rebuild elsewhere breaks without them. Section 10 of the baseline now
does it explicitly.

See `my-app/supabase/SETUP.md` for the rebuild procedure.

### 6.3 How schema changes have actually been made

Via the Supabase MCP server (`.mcp.json` points at `mcp.supabase.com` for project `ibcnfufiyrnkfgxjkanr`), applying migrations **directly to the remote project**, with the `.sql` file sometimes — not always — also written into the repo. There is no local Supabase stack, no `supabase/config.toml`, and no `supabase link`.

---

## 7. Data access patterns

### 7.1 Reads

Always `supabaseAnon`, always `.select("*")`, always filtered `.eq("published", true)`, always ordered by `sort_order` (or `published_at desc` for news). Wrapped in `try/catch` returning `[]`.

Two consequences worth stating plainly:

- **`select("*")` everywhere.** News rows carry full article bodies (`body text[]`, `axes` jsonb) and the listing page pulls all of it to render cards. Fine at current volume; the fix is column projection when it stops being fine.
- **RLS does the filtering anyway.** The `.eq("published", true)` is belt-and-braces — the policy `using (published or is_staff())` already hides drafts from anon. Both are correct; neither is redundant enough to remove.

### 7.2 Writes

`FormData` → server action → `.insert()` / `.update()` / `.delete()`. No transactions, no stored procedures, no optimistic concurrency. Last write wins; two editors on the same row silently overwrite each other.

### 7.3 Reordering

`app/admin/dashboard/_actions/reorder.ts` renumbers a whole list 1..N with `Promise.all` of N individual `UPDATE`s. Not atomic — a partial failure leaves a half-renumbered list. Acceptable at current list sizes (<50 rows); a single `UPDATE ... FROM (VALUES ...)` would be both atomic and one round-trip.

---

## 8. Live health check (2026-08-19)

### 8.1 Row counts

The database is populated. Real counts (`select count(*)`, not estimates):

| Table | Rows | | Table | Rows |
|---|---:|---|---|---:|
| `mosques` | 36 | | `gallery_items` | 3 |
| `team_members` | 10 | | `hero_slides` | 3 |
| `page_content` | 10 | | `focus_areas` | 3 |
| `news` | 7 | | `program_panels` | 3 |
| `programs` | 7 | | `board_committees` | 2 |
| `policies` | 7 | | `jobs` | 2 |
| `kpis` | 6 | | `site_settings` | 1 |
| `reports` | 5 | | `profiles` | 1 |
| `org_levels` | 4 | | `contact_messages` | 0 |

Plus `contact_requests` (1) and `job_applications` (2) — real submissions, personal data.

> **Careful with `list_tables` / the dashboard's row counts.** They report `reltuples`, a planner estimate that stays 0 until autovacuum analyzes a table. Every content table here shows 0 that way while actually holding data. Always use `count(*)` when the answer matters.

### 8.2 Security advisors — 15 warnings, 0 errors

| Issue | Count | Severity | Action |
|---|---|---|---|
| `SECURITY DEFINER` helper functions executable by `anon` and `authenticated` via `/rest/v1/rpc/*` | 12 | Low–Medium | `revoke execute ... from anon, authenticated`. They only return booleans about the caller, so the leak is minor — but `handle_new_user()` being RPC-callable is worth closing properly. |
| `next_contact_ticket_id()` and `next_job_application_no()` have mutable `search_path` | 2 | Medium | Add `set search_path = public`. Without it, a caller-controlled `search_path` could shadow the sequence. |
| Leaked-password protection disabled | 1 | Medium | One toggle in Auth settings — checks passwords against HaveIBeenPwned. |

### 8.3 Performance advisors — 97 notices

| Issue | Count | Meaning |
|---|---|---|
| `multiple_permissive_policies` | 90 | Every content table has both a `public read` (SELECT) and a `staff write` (FOR ALL) policy. Because `FOR ALL` includes SELECT, Postgres evaluates **two** permissive policies on every read. Split the write policies into explicit `FOR INSERT / UPDATE / DELETE` and this drops to zero. |
| `auth_rls_initplan` | 2 | `profiles` policies call `auth.uid()` per-row instead of once. Wrap as `(select auth.uid())`. |
| `unused_index` | 5 | `news_published_at_idx`, `news_category_idx`, `programs_category_idx`, `job_applications_job_id_idx`, `contact_requests_created_at_idx` — unused only because the tables are empty. Keep them. |

None of these bite at zero rows. All of them are worth clearing before launch.

---

## 9. What does NOT exist (so you don't go looking)

- ❌ Edge Functions, Database Webhooks, `pg_cron`, Realtime subscriptions
- ❌ Any REST/GraphQL API server of our own — **no `app/api/` route handlers at all**
- ❌ Email sending. **Nobody is notified when a complaint or a job application arrives.** Staff must open the dashboard and look.
- ❌ Rate limiting, CAPTCHA, honeypots, or bot protection on any public form
- ❌ Audit logging. Nothing records who changed what content, or when.
- ❌ Soft deletes. Every delete is permanent, immediate, and unrecoverable.
- ❌ Backups beyond whatever the Supabase plan provides by default. **Verify the plan and PITR setting.**
- ❌ Staging / preview database. One project, one environment.
- ❌ Generated TypeScript types from the schema. Row types are hand-written in `lib/cms/fetchers.ts` and cast with `as`, so **a schema change will not produce a type error** — it will produce `undefined` at runtime.
- ❌ Tests of any kind, at any layer.

---

## 10. Runbook

### Add a Super Admin
Supabase dashboard → Authentication → Add user → then:
```sql
update public.profiles set role = 'super_admin' where email = '<email>';
```

### Add a normal staff member
`/admin/dashboard/users` as a Super Admin. Password ≥ 8 chars. They can sign in immediately (`email_confirm: true`).

### Change what a role can do
Edit the RLS policy's gate function in SQL — **not** the sidebar. `components/app-sidebar.tsx` only hides links.

### Add a new content table
1. Write the migration: table, `set_updated_at` trigger, `alter table ... enable row level security`, a `public read` policy `using (published or is_staff())`, and a write policy on the right gate.
2. **Save the `.sql` in `supabase/migrations/` — do not apply it only via MCP.**
3. Add a fetcher to `lib/cms/fetchers.ts`.
4. Add the four admin files, an entry in `_actions/reorder.ts` `TABLES`, a sidebar entry, and both-locale dictionary keys.

### Read a complaint attachment or a CV
Only through the admin dashboard, which mints a signed URL server-side. There is no public URL and there must never be one.

### Retrieve the site content after a bad paste into a `page_content` editor
There is no undo and no version history. Restore from a database backup. **This is why the JSON validation fix matters.**

---

## 11. Backend debt, ranked

| # | Item | Risk | Effort |
|---|---|---|---|
| ~~1~~ | ~~**Migration drift** — the repo cannot rebuild the database~~ | ✅ **Fixed** — rebaselined and verified (§6.2) | — |
| 2 | `contact_messages` has `insert with check (true)` — open to anon spam | High | 2h |
| 3 | `page_content` JSON parse failure silently writes `{}` — data loss, no undo | High | 3h |
| 4 | No email/notification on complaint or job-application intake | High (operational) | 1 day |
| 5 | No generated DB types — schema changes fail silently at runtime | Medium-High | 4h + refactor |
| 6 | `media` bucket has no size or MIME limit | Medium | 30 min |
| 7 | Orphaned `media` objects are never deleted | Medium | 1 day |
| 8 | 90 duplicate-permissive-policy warnings | Medium (perf) | 3h |
| 9 | Two functions with mutable `search_path` | Medium | 15 min |
| 10 | 12 `SECURITY DEFINER` helpers callable over RPC | Low-Medium | 30 min |
| 11 | Leaked-password protection off | Medium | 1 toggle |
| 12 | No audit trail on content changes | Medium | 1–2 days |
| 13 | No rate limiting on public forms | Medium | 1 day |
| 14 | Reorder is N non-atomic UPDATEs | Low | 2h |
| 15 | No staging environment | Medium | 4h |
