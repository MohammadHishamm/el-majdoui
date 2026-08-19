<div align="center">

# Almajdouie Foundation

**مؤسسة علي بن إبراهيم المجدوعي وعائلته الخيرية**

Bilingual (Arabic-first) website and content management system for a Saudi grant-making foundation — economic empowerment programmes and the stewardship of Almajdouie mosques.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3FCF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![pnpm](https://img.shields.io/badge/pnpm-10.32-F69220?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io)

</div>

---

## Overview

A public website plus a role-based admin dashboard, built on the Next.js App Router with Supabase as the entire backend. There is no separate API server: pages read Postgres directly from Server Components, writes go through Server Actions, and authorization is enforced by Postgres Row Level Security rather than application middleware.

| | |
|---|---|
| **Public site** | 25+ routes — home, focus areas, programmes, news, gallery, reports, careers, contact, and an interactive mosque map |
| **Admin CMS** | 20+ managed content types across 3 staff roles, fully bilingual UI |
| **Languages** | Arabic-first with RTL layout; client-side English toggle |
| **Theming** | Light/dark with a semantic design-token system, no flash on load |
| **Public forms** | Job applications and a tracked complaints channel, both with private file storage |

---

## Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| **Node.js** | 20.x or newer | Developed against 20.20 |
| **pnpm** | 10.x | `npm i -g pnpm` — **npm and yarn are not supported** |
| **Supabase project** | — | Free tier is fine ([database.new](https://database.new)) |
| **MapTiler key** | — | Free tier, for the mosque map ([maptiler.com](https://cloud.maptiler.com/account/keys/)) |
| **Docker** | optional | Only for running Supabase locally |

---

## Quick start

```bash
# 1 — Clone and install
git clone https://github.com/MohammadHishamm/el-majdoui.git
cd el-majdoui/my-app
pnpm install

# 2 — Configure
cp .env.example .env      # then fill in the values (see below)

# 3 — Run
pnpm dev                  # → http://localhost:3000
```

> **Do not skip `pnpm install`.** Its `postinstall` step copies MapLibre's web worker into `public/maplibre/`. Without it the mosque map renders a blank background — Turbopack cannot resolve the worker from `import.meta.url`.

The admin dashboard is at [localhost:3000/admin](http://localhost:3000/admin).

---

## Environment variables

Copy `.env.example` to `.env` and fill in. All values come from your Supabase dashboard under **Project Settings → API**.

| Variable | Required | Description |
|---|:---:|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Project URL, e.g. `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Public key. Safe in the browser — every table is protected by RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | **Secret.** Bypasses all RLS. Server-side only, never `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Canonical origin, no trailing slash. Use `http://localhost:3000` locally |
| `NEXT_PUBLIC_MAPTILER_KEY` | ✅ | Map tiles. Without it the map degrades to a fallback message |
| `NEXT_PUBLIC_GRANT_PORTAL_URL` | — | External grant portal link. Falls back to `#` |

`NEXT_PUBLIC_SITE_URL` drives `metadataBase`, every canonical tag, `sitemap.xml`, `robots.txt` and all JSON-LD identifiers — pick with-www or without-www, 301 the other, and keep this matching.

---

## Database setup

The schema and all site content ship with the repo, so a fresh project is two SQL files.

### Hosted Supabase

1. Create a project at [database.new](https://database.new)
2. **SQL Editor** → paste `my-app/supabase/migrations/00000000000000_baseline.sql` → **Run**
3. **SQL Editor** → paste `my-app/supabase/seed.sql` → **Run** *(109 content rows)*
4. **Authentication → Users → Add user** (enable *Auto Confirm*), then promote yourself:

```sql
update public.profiles set role = 'super_admin' where email = 'you@example.com';
```

Both files are idempotent — re-running them is safe.

### Local stack (Docker)

```bash
npx supabase start        # applies migrations + seed automatically
npx supabase status       # prints your local URL and keys for .env
npx supabase db reset     # wipe and rebuild from baseline + seed
npx supabase stop
```

> **Images are not included in the seed.** Content rows reference Storage URLs from the original project and will 404 against a new one. See [`supabase/SETUP.md`](my-app/supabase/SETUP.md) step 6 for the re-upload and URL-rewrite procedure.

**Full walkthrough, including troubleshooting → [`my-app/supabase/SETUP.md`](my-app/supabase/SETUP.md)**

---

## Scripts

Run from `my-app/`.

| Command | What it does |
|---|---|
| `pnpm dev` | Development server at `localhost:3000` |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `npx tsc --noEmit` | Type check |
| `node scripts/dump-seed.mjs` | Regenerate `supabase/seed.sql` from the current database |
| `npx supabase migration new <name>` | Create a new migration file |
| `npx supabase db push` | Apply migrations to the linked project |

---

## Project structure

```
el-majdoui/
├── docs/                          # Handover documentation — start here
│   ├── FRONTEND-HANDOVER.md
│   ├── BACKEND-HANDOVER.md
│   └── PRODUCTION-READINESS.md
└── my-app/
    ├── app/
    │   ├── (site)/                # Public website (route group — no URL segment)
    │   ├── admin/                 # Login + CMS dashboard
    │   ├── globals.css            # Tailwind v4 entry + the entire design-token system
    │   └── layout.tsx             # Fonts, metadata, theme + locale providers
    ├── components/
    │   ├── ui/                    # shadcn primitives + shared building blocks
    │   ├── admin/                 # CMS form widgets
    │   ├── home/ about/ news/ …   # Feature components
    │   └── layout/                # Header, Footer, navigation
    ├── lib/
    │   ├── supabase/              # Four clients — anon, server, browser, service-role
    │   ├── cms/fetchers.ts        # Every public data read
    │   ├── i18n/                  # Public bilingual system
    │   └── site/config.ts         # Org details + navigation tree
    ├── supabase/
    │   ├── SETUP.md               # Database setup guide
    │   ├── migrations/            # 00000000000000_baseline.sql = whole schema
    │   ├── seed.sql               # Generated content, no personal data
    │   └── config.toml            # Supabase CLI config
    ├── public/                    # Images, fonts, vendored map/PDF workers
    └── middleware.ts              # Auth session refresh + /admin guard
```

---

## Architecture

```
Browser
   │
   ├─ Server Component ──── supabaseAnon ─────────┐  (public reads, RLS as anon)
   ├─ Server Action ─────── cookie-bound client ──┤  (admin writes, RLS as the user)
   ├─ Server Action ─────── service-role client ──┤  (public form intake, user admin)
   └─ Admin form ────────── browser client ───────┘  (direct Storage upload)
                                                   ▼
                                     ┌───────────────────────────┐
                                     │  Supabase / PostgREST     │
                                     │  Row Level Security       │
                                     └───────────────────────────┘
```

**Roles.** Three, enforced entirely in Postgres policies:

| Role | Manages |
|---|---|
| `super_admin` | Everything, including users and roles |
| `content_editor` | Site content — pages, programmes, focus areas, careers, team, mosques |
| `news_manager` | News, gallery and reports (the public Media Center) |

**Storage.** Three buckets: `media` (public — CMS images and PDFs), plus `contact-attachments` and `job-applications` — both **private**, written only by server actions and read through short-lived signed URLs. A CV never sits on a publicly readable URL.

---

## Deployment

Deploys to Vercel with no extra configuration — `vercel.json` pins pnpm as the install command.

1. Import the repository into Vercel and set the root directory to `my-app`
2. Add every environment variable for **Production** and **Preview** separately
3. Confirm `SUPABASE_SERVICE_ROLE_KEY` is **not** exposed to the browser
4. Deploy

`next.config.ts` reads `NEXT_PUBLIC_SUPABASE_URL` to allowlist your Storage host for `next/image`, so uploaded images work with no further setup.

---

## Documentation

| Document | Contents |
|---|---|
| [**Frontend Handover**](docs/FRONTEND-HANDOVER.md) | Folder map, routing and rendering, data layer, design tokens, form patterns, conventions, ranked technical debt |
| [**Backend Handover**](docs/BACKEND-HANDOVER.md) | All 20 tables, the RLS role model, storage buckets, functions and triggers, live advisor findings, runbook |
| [**Production Readiness**](docs/PRODUCTION-READINESS.md) | Phased launch plan — remaining blockers, pre-launch fixes, smoke-test checklist, 90-day hardening |
| [**Database Setup**](my-app/supabase/SETUP.md) | Standing up a fresh project, keeping the seed current, troubleshooting |

---

## Conventions

A few rules worth knowing before the first pull request:

- **Colors** come from the semantic tokens in `app/globals.css` (`bg-surface`, `text-heading`, `text-body-2`, …). A hardcoded hex on the public site is a dark-mode bug waiting to happen.
- **Spacing and direction** use logical properties only — `ms-`/`me-`/`ps-`/`pe-`/`start-`/`end-`, never `ml-`/`mr-`/`left-`/`right-`. The site is RTL by default.
- **Static UI labels** use `<T ar="…" en="…" />`, a client leaf that works inside Server Components.
- **CMS-backed pages** must declare `export const dynamic = "force-dynamic"`, or admin edits will not publish until the next deploy.
- **Never** import `lib/supabase/admin.ts` outside a `"use server"` file — it holds the service-role key.
- **Every schema change** is a file in `supabase/migrations/`, applied with `supabase db push`. Never the dashboard SQL editor alone.

---

## Troubleshooting

<details>
<summary><b>Blank mosque map</b></summary>

`NEXT_PUBLIC_MAPTILER_KEY` is missing, or `postinstall` did not run. Re-run `pnpm install` — it copies MapLibre's worker into `public/maplibre/`.
</details>

<details>
<summary><b>"permission denied for table …"</b></summary>

The role grants in section 10 of the baseline did not run. Postgres checks table privileges *before* RLS, so the policies never execute. Re-run the baseline; it is idempotent.
</details>

<details>
<summary><b>Site shows different content than the CMS</b></summary>

You are seeing the hardcoded fallbacks. Every section component renders a built-in default when its query returns nothing, so an empty table and a *failing* query look identical. Confirm the table has rows, then check the Supabase logs.
</details>

<details>
<summary><b>Admin edits do not appear on the public site</b></summary>

The page is probably missing `export const dynamic = "force-dynamic"`. The build output marks static routes `○` and dynamic ones `ƒ`.
</details>

<details>
<summary><b>Images return 404 after moving projects</b></summary>

Seeded content references the previous project's Storage host. See [`supabase/SETUP.md`](my-app/supabase/SETUP.md) step 6.
</details>

<details>
<summary><b>Cannot sign in to /admin</b></summary>

Confirm the auth user exists **and** has a `profiles` row. If the profile is missing, the app falls back to a synthetic `news_manager` — a working but confusingly limited dashboard.
</details>

---

<div align="center">

Built with Next.js, Supabase and Tailwind CSS.

</div>
