# Database Setup — starting a fresh Supabase project

This gets you from an empty Supabase account to a fully working site with all
its content, in about 15 minutes.

**Everything here has been tested end to end.** The baseline was rebuilt on a
clean database and its schema checksum compared against the production project
column-by-column — 303 columns, identical, defaults included.

---

## What's in this folder

| File | What it is |
|---|---|
| `migrations/00000000000000_baseline.sql` | The complete schema: 20 tables, RLS policies, functions, triggers, 3 storage buckets. Run this first. |
| `seed.sql` | All 109 rows of site content. Generated, no personal data. Run this second. |
| `config.toml` | Supabase CLI config, so `npx supabase start` gives you a local stack. |
| `migrations/_archive/` | The 18 original migration files. **Do not run these** — they are superseded and incomplete. Kept because their comments explain *why* the schema looks the way it does, which is genuinely worth reading. |

> **Why one baseline instead of a migration chain?** The old folder and the live
> database had drifted badly: ten migrations existed only on the server, one
> only in the repo, seven local files reused version numbers that already meant
> something else, and `0003_hero_slides.sql` declared three columns the live
> table didn't have. Running that folder on a fresh project produced a database
> missing six tables. The baseline is reconstructed from the live schema, so it
> is correct by construction.

---

## Option A — your own hosted Supabase project (what you want for production)

### 1. Create the project

[database.new](https://database.new) → new project. Pick a region close to your
users (Bahrain / UAE / Frankfurt for a Saudi audience). **Save the database
password** — you'll want it later and it can't be read back.

### 2. Run the schema

Dashboard → **SQL Editor** → New query → paste all of
`migrations/00000000000000_baseline.sql` → **Run**.

Expect `Success. No rows returned` and about 5 seconds. It's idempotent, so
re-running it is harmless.

### 3. Run the content

Same editor, paste all of `seed.sql` → **Run**. Loads 109 rows.

Every statement is `on conflict do nothing`, so this is also safe to re-run —
it tops up missing rows without overwriting anything an editor has changed.

### 4. Verify

```sql
select
  (select count(*) from mosques)       as mosques,       -- 36
  (select count(*) from page_content)  as page_content,  -- 10
  (select count(*) from team_members)  as team,          -- 10
  (select count(*) from news)          as news,          --  7
  (select count(*) from programs)      as programs;      --  7
```

### 5. Create your admin login

The first Super Admin can't be made in the app — you need a Super Admin to
create users, so someone has to be seeded by hand.

1. Dashboard → **Authentication → Users → Add user**. Use "Auto Confirm User",
   or you'll be locked out waiting for an email that isn't configured.
2. A `profiles` row appears automatically (the `on_auth_user_created` trigger).
   It defaults to `content_editor` — promote it:

```sql
update public.profiles set role = 'super_admin' where email = 'you@example.com';
```

You can now sign in at `/admin` and create everyone else from
`/admin/dashboard/users`.

### 6. Re-upload the images

**This is the step people forget.** `seed.sql` carries image *URLs* pointing at
the old project's Storage. They'll 404 against your project.

The `media` bucket is created empty by the baseline. Two ways to fill it:

- **Quickest** — sign in to `/admin` and re-upload through the CMS forms. Every
  image field has an upload button that writes to `media` and rewrites the URL.
- **Bulk** — download the old bucket, upload it to yours (dashboard → Storage →
  media → Upload), then rewrite the host in one statement per table:

```sql
update public.news
set image = replace(image, 'https://OLD-REF.supabase.co', 'https://NEW-REF.supabase.co')
where image like 'https://OLD-REF.supabase.co%';
-- repeat for: hero_slides.image, programs.image, team_members.image,
-- gallery_items.thumb/cover, reports.file, policies.file, mosques.image,
-- site_settings.leadership_photo, focus_areas.icon/watermark,
-- and the jsonb blobs in page_content / focus_areas / board_committees.
```

Images referenced as site-relative paths (`/images/...`) come from
`my-app/public/` and need nothing.

### 7. Point the app at it

```bash
cd my-app
cp .env.example .env
```

Fill in from Dashboard → **Project Settings → API**:

| Variable | Where |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` / `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` key — **secret**, server-only |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` locally |
| `NEXT_PUBLIC_MAPTILER_KEY` | free key from [maptiler.com](https://cloud.maptiler.com/account/keys/) |

```bash
pnpm install
pnpm dev
```

`next.config.ts` reads `NEXT_PUBLIC_SUPABASE_URL` to allowlist your Storage host
for `next/image`, so images work with no extra config.

### 8. Turn on leaked-password protection

Dashboard → Authentication → Policies → enable **leaked password protection**
(checks new passwords against HaveIBeenPwned). One toggle; the linter flags it
otherwise.

---

## Option B — a local stack for development

Needs Docker running.

```bash
cd my-app
npx supabase start      # first run pulls ~10 images, give it a few minutes
```

The CLI applies `migrations/` and then `seed.sql` automatically. It prints your
local `API URL`, `anon key` and `service_role key` — put those in `.env`.

```bash
npx supabase db reset   # wipe and rebuild from baseline + seed
npx supabase stop       # shut down
npx supabase status     # print the keys again
```

`db reset` is the fastest way to get back to a known-good database, and it's
also how you check that a change to the baseline still applies cleanly.

---

## Keeping the seed current

`seed.sql` is generated. After making content changes you want to preserve:

```bash
node scripts/dump-seed.mjs
```

It reads `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` from `.env`
and rewrites `supabase/seed.sql`. The service-role key is required on purpose —
it captures unpublished drafts too, which the anon key would silently skip.

`profiles`, `contact_messages`, `contact_requests` and `job_applications` are
**never** dumped. They hold names, phone numbers, CVs and grievances belonging
to real people, and that data has no business travelling with the codebase.

---

## Making schema changes from here on

The drift that made this rebuild necessary happened because changes were applied
straight to the server without the SQL landing in the repo. Don't repeat it:

```bash
npx supabase migration new add_whatever      # creates a timestamped file
# write your SQL in the new file
npx supabase db reset                        # verify it applies from scratch
npx supabase db push                         # apply to the linked project
```

One rule, and the repo stays truthful: **every schema change is a file in
`migrations/`.** Never the dashboard SQL editor alone.

To link the CLI to your project once:
```bash
npx supabase link --project-ref <your-ref>
```

---

## Troubleshooting

**`permission denied for table news`** — section 10 of the baseline (role grants)
didn't run. Postgres checks table privileges *before* RLS, so without it the API
roles are refused and the policies never even execute. Re-run the baseline; it's
idempotent.

**Site loads but every section shows different content than the CMS** — you're
seeing the hardcoded fallbacks. Every section component does
`items={rows.length ? rows : undefined}` and renders a built-in default dataset
when the query returns nothing. So an empty table and a *failing* query look
identical. Check the table actually has rows, then check the Supabase logs.

**Admin edits don't show on the public site** — the page is probably missing
`export const dynamic = "force-dynamic"`. Compare against a working page; the
build output marks static routes `○` and dynamic ones `ƒ`.

**Images 404** — step 6. The seeded URLs point at the old project.

**Can't sign in** — confirm the auth user exists *and* has a `profiles` row.
If the profile is missing, `getCurrentProfile()` falls back to a synthetic
`news_manager`, so you'll get a working dashboard scoped to news only, which is
a confusing symptom of the real problem.

**Map is blank** — `NEXT_PUBLIC_MAPTILER_KEY` missing, or the postinstall didn't
run. `pnpm install` copies MapLibre's worker into `public/maplibre/`; without it
the map renders an empty background.
