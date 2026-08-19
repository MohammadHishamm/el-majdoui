# Frontend Handover — Almajdouie Foundation Website

**Repo:** `el-majdoui/` · **App root:** `my-app/` · **Stack:** Next.js 16.2.9 (App Router, Turbopack), React 19.2, TypeScript 5 (strict), Tailwind CSS v4, shadcn/ui (`base-nova` style) on Base UI primitives.

Everything in this document was verified against the code on 2026-08-19 (commit `b715bf0`). Where something is a trap or an inconsistency, it is called out inline as **⚠ Gotcha**.

---

## 1. Getting the app running

```bash
cd my-app
pnpm install     # runs the postinstall MapLibre asset copy — do not skip
pnpm dev         # http://localhost:3000
pnpm build       # production build (passes clean today)
pnpm start       # serve the production build
pnpm lint        # see §11 — currently noisy, not a gate
```

**Package manager is pnpm (10.32.1), not npm.** `vercel.json` pins `installCommand: pnpm install`. Node 20.20 is what the project is developed against.

`pnpm install` runs `scripts/copy-maplibre-assets.mjs`, which copies MapLibre's web worker, its shared module, and the Arabic RTL text shaper out of `node_modules` into `public/maplibre/`. This is not optional: under Turbopack, MapLibre v6 resolves its worker from `import.meta.url`, which is not an `http(s)` URL, so the worker never starts and the mosque map renders an empty background. The script serves the worker ourselves and the map points at it with `setWorkerUrl`. If you ever upgrade `maplibre-gl`, re-run install so the worker and the main bundle stay in lockstep.

### Environment variables

`.env` at `my-app/.env` (gitignored, never committed). Required:

| Variable | Used by | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | all Supabase clients, `next.config.ts` image allowlist | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | browser/server/anon clients | Public, RLS-protected |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabase/admin.ts` only | **Server-only secret. Bypasses RLS.** |
| `NEXT_PUBLIC_SITE_URL` | `lib/site/config.ts`, SEO, sitemap, robots | Falls back to `https://almajdouie.org` |
| `NEXT_PUBLIC_MAPTILER_KEY` | mosque map tiles | Public, but rate-limited per key |
| `NEXT_PUBLIC_GRANT_PORTAL_URL` | "بوابة المنح" nav CTA | Optional, falls back to `#` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | — | Present in `.env` but **not referenced anywhere in code**. Legacy; safe to drop. |

---

## 2. Top-level folder map

```
el-majdoui/
├── almajdouei-figma-style.css     # Original Figma CSS export. Reference only — not imported.
├── docs/                          # These handover documents
└── my-app/                        # The Next.js application (everything below is relative to here)
    ├── app/                       # App Router — routes, layouts, server actions
    │   ├── (site)/                # Public bilingual website (route group, no URL segment)
    │   ├── admin/                 # Login + CMS dashboard
    │   ├── globals.css            # Tailwind v4 entry + the ENTIRE design token system
    │   ├── layout.tsx             # Root: fonts, metadata, theme + locale providers
    │   ├── not-found.tsx, robots.ts, sitemap.ts, icon.png, favicon.ico
    ├── components/                # 129 files — see §5
    ├── hooks/                     # use-in-view (IntersectionObserver), use-mobile (breakpoint)
    ├── lib/                       # Data layer, i18n, SEO, config — see §4
    ├── fonts/                     # ITF Rayat .otf (5 weights) — self-hosted brand Arabic face
    ├── public/                    # 396 files, 66 MB of images + vendored maplibre/pdf worker
    ├── supabase/                  # DB bootstrap — see supabase/SETUP.md
    │   ├── SETUP.md              #   how to stand up a fresh project (15 min)
    │   ├── migrations/           #   00000000000000_baseline.sql = whole schema
    │   │   └── _archive/         #   18 superseded files, kept for rationale only
    │   ├── seed.sql              #   109 content rows, generated, no personal data
    │   └── config.toml           #   `npx supabase start` for a local stack
    ├── .env.example               # Every env var, documented
    ├── scripts/copy-maplibre-assets.mjs
    ├── scripts/dump-seed.mjs      # Regenerates supabase/seed.sql from any DB
    ├── map-locations/*.xlsx       # Source spreadsheet for mosque coordinates. Reference only.
    ├── middleware.ts              # Auth session refresh + /admin guard
    ├── next.config.ts             # Only config: remote image patterns for Supabase Storage
    ├── components.json            # shadcn CLI config
    └── AGENTS.md / CLAUDE.md      # AI-assistant rules (CLAUDE.md just imports AGENTS.md)
```

---

## 3. Routing and rendering

### 3.1 Route groups

`app/(site)/` is a **route group** — the parentheses mean it contributes no URL segment. Its purpose is to give the public site its own layout (Header + Footer) separate from `/admin`, which has a completely different chrome, theme, and direction handling.

### 3.2 Public routes

| Route | File | Render mode | Data source |
|---|---|---|---|
| `/` | `(site)/page.tsx` | dynamic | 7 parallel fetchers |
| `/about` | `(site)/about/page.tsx` | **static** | hardcoded link hub |
| `/about/who-we-are` | | dynamic | `page_content` |
| `/about/vision-mission` | | dynamic | `page_content` |
| `/about/strategy` | | dynamic | `page_content` |
| `/about/board` | | dynamic | `team_members`, `board_committees`, `page_content:ceo-office` |
| `/about/board/[id]` | | dynamic | member detail |
| `/about/leadership` | | **static** | `redirect()` → `/about/board#leadership` |
| `/about/org-structure` | | dynamic ✅ | `org_levels` — was static, fixed |
| `/about/policies` | | dynamic | `policies` |
| `/focus-areas` | | dynamic | `focus_areas` |
| `/focus-areas/[slug]` | | dynamic + `generateStaticParams` | `focus_areas`, `mosques` |
| `/programs`, `/programs/[slug]` | | dynamic | `programs` |
| `/news`, `/news/[slug]` | | dynamic | `news` |
| `/gallery`, `/gallery/[slug]` | | dynamic | `gallery_items` |
| `/reports` | | dynamic | `reports` |
| `/careers`, `/careers/[id]` | | dynamic | `jobs` + `page_content:careers` |
| `/contact` | | **static** | pure static form shell |
| `/brand-identity` | | dynamic | `page_content:brand-identity` |
| `/privacy-policy` | | dynamic | `page_content:privacy-policy` |
| `/media-center` | | **static** | `redirect()` → `/news` |
| `/videos` | | **static** | `PagePlaceholder` — **unimplemented stub** |
| `/sitemap` | | **static** | human-readable sitemap page |
| `/sitemap.xml`, `/robots.txt` | `app/sitemap.ts`, `app/robots.ts` | ISR 1h / static | fetchers |

> **✅ FIXED — `/about/org-structure` was statically prerendered while reading the CMS.**
> It was the only CMS-backed page missing `export const dynamic = "force-dynamic"`, so Next baked `getOrgLevels()` into the build output and admin edits never appeared without a redeploy. The directive has been added and the page now builds as `ƒ`. Every other page was audited the same way. `/about/leadership`, `/media-center`, `/videos`, `/about`, `/contact` and `/sitemap` are correctly static — they read no CMS data.

> **⚠ Gotcha — `/careers/[id]` is named `[id]` but carries a slug.** The handler does `getJobBySlug(id)`. Cosmetic, but confusing; `[slug]` would be the honest name. Note also that `rowToJob()` in `lib/cms/fetchers.ts` sets `Job.id = row.slug`, so "id" means slug throughout the careers feature.

> **⚠ Gotcha — `generateStaticParams` on a `force-dynamic` route.** `focus-areas/[slug]` exports both. `force-dynamic` wins, so the static params only serve as a build-time link hint. Harmless but dead weight.

### 3.3 Rendering strategy, in one sentence

Everything CMS-backed is **server-rendered on every request** (`force-dynamic`), reading Supabase directly from the server component. There is no ISR, no `revalidate` on pages, and no client-side data fetching for content. The only ISR in the app is `app/sitemap.ts` (`revalidate = 3600`).

This is simple and always-fresh, but it means **every page view is a live round-trip to Supabase**. See the Production doc §4 for the caching work this implies at real traffic.

### 3.4 Admin routes

`/admin` is the login page. `/admin/dashboard/**` is the CMS. Nearly every content type follows an identical four-file shape:

```
app/admin/dashboard/<entity>/
├── page.tsx          # list: table, publish toggle, reorder arrows, delete
├── new/page.tsx      # create form
├── [id]/page.tsx     # edit form (prefilled)
└── actions.ts        # "use server" — create / update / delete / togglePublish
```

Entities on this pattern: `hero-slides`, `focus-areas`, `programs`, `news`, `careers`, `gallery`, `reports`, `kpis`, `policies`, `team`, `team/committees`, `mosques`, `org-structure`.

Deviations:
- `panels`, `pages/[slug]`, `site-settings`, `strategic-alignment`, `about-leadership` are **singleton editors** — one form, no list/new/[id].
- `applications`, `complaints`, `messages` are **read-only inboxes** (mark read / delete only).
- `users` is Super Admin only and uses the service-role client.
- `focus-areas/[id]/detail` is a second, larger editor for the focus-area detail page sections (carousel / stats / programs).

---

## 4. `lib/` — the data and configuration layer

### 4.1 `lib/supabase/` — four clients, four jobs

This is the single most important thing to understand before touching anything.

| File | Export | Key | Cookies | Where it may be used |
|---|---|---|---|---|
| `anon.ts` | `supabaseAnon` (module singleton) | anon | no | **Public site reads.** Safe during static rendering. RLS shows only published rows. |
| `server.ts` | `createClient()` (async) | anon | yes, request-bound | Server Components, Server Actions, Route Handlers in `/admin`. RLS runs as the signed-in staff user. |
| `client.ts` | `createClient()` | anon | browser | Client components. Currently used only for direct Storage uploads from admin forms. |
| `admin.ts` | `createAdminClient()` | **service role** | no | **Server-only. Bypasses all RLS.** User management, and the two public form actions. |

**Rule: never import `lib/supabase/admin.ts` into anything that could reach the browser.** There is no build-time guard enforcing this — it is a convention held by the file's doc comment. Adding `import "server-only"` to that file would make it enforced (see Production doc).

### 4.2 `lib/cms/fetchers.ts` — 747 lines, the whole read path

Every public page's data comes from here. The shape is consistent:

```ts
export async function getX(): Promise<X[]> {
  try {
    const { data } = await supabaseAnon.from("table").select("*")
      .eq("published", true).order("sort_order");
    return (data ?? []).map(rowToX);
  } catch {
    return [];        // ← never throws; a DB outage renders an empty section
  }
}
```

Three things follow from that shape:

1. **Row → view-model mapping happens here, not in components.** `rowToJob`, `rowToNews`, etc. convert snake_case DB columns to camelCase domain types and pick the Arabic column where a page renders Arabic only. Components never see raw rows.
2. **Failures are silent.** Every fetcher swallows errors and returns `[]` or `null`. Pages then fall back to hardcoded defaults (`items.length ? items : undefined`). Great for resilience, terrible for debugging — a broken query looks identical to "no content yet". When something is missing on the site, check the Supabase logs, not the console.
3. **Bilingual values are `Bi = { ar: string; en: string }`** for anything the UI switches at runtime; single Arabic strings for content that only ever renders Arabic (news bodies, program details).

Notable non-generic fetchers:
- `getPageContent(slug)` — reads a free-form `jsonb` blob out of the `page_content` table. Nine slugs in use: `vision-mission`, `who-we-are`, `strategy`, `board`, `ceo-office`, `careers`, `brand-identity`, `privacy-policy`, `mosques-map` (plus `strategic-alignment` via its own typed fetcher). **These blobs are untyped at the boundary** — `Record<string, unknown>` — and each consuming page casts as it reads.
- `getMosquesMapContent()` — merges `page_content:mosques-map` copy with the `mosques` rows and substitutes `MOSQUE_COUNT_TOKEN` (`{count}`) into the heading.
- `getFocusAreaDetail(slug)` — assembles the three jsonb sub-sections (`carousel`, `stats`, `detail_programs`) of a focus area.

### 4.3 `lib/cms/search.ts` — the header search

`"use server"` module exporting `searchSite(query, limit)`. Runs ~7 parallel `ilike` queries across published `news`, `programs`, `focus_areas`, `jobs`, `reports`, `gallery_items` plus `page_content` and a hardcoded static-page title list, then merges and ranks (title matches first). Strips `,()*` from the term because PostgREST's `.or()` treats those as syntax.

Deliberately low-complexity: no full-text index, no ranking beyond title-first. Fine at current content volume; see Production doc if the catalogue grows.

### 4.4 `lib/i18n/` — public-site bilingual system

**The public site is Arabic-first with a client-side English toggle. There are no `/en` routes.**

- `lib/i18n/context.tsx` — `LocaleProvider` + `useLocale()`. Locale lives in React state, persisted to `localStorage`, and imperatively sets `document.documentElement.lang` and `dir`.
- `components/ui/T.tsx` — `<T ar="..." en="..." />`, a tiny client leaf so bilingual labels can be dropped inside server components without making the whole tree client-side. **This is the idiom for every static UI string.** For string contexts (`alt`, `aria-label`, `title`) call `useLocale()` in a client component instead.
- `lib/i18n/translations.ts` — 186 lines of shared dictionary for longer blocks.

Implications you must know:
- The root layout hardcodes `lang="ar" dir="rtl"`; English is applied **after hydration**, so an English visitor sees a brief RTL Arabic flash. Accepted trade-off of the no-routes approach.
- **SEO is Arabic-only.** All `metadata` is Arabic, there are no `hreflang` alternates, and crawlers never see the English content. If English SEO matters, this needs real i18n routing (Production doc §7).
- CMS content carries `*_ar` / `*_en` column pairs, but several features (news bodies, program details, policies) are Arabic-only by design — the `_en` columns exist and are simply unused there.

### 4.5 `lib/admin-i18n.ts` + `lib/admin-locale.ts` — admin bilingual system

Completely separate from the public one, and it works differently: **cookie-based, read on the server**.

- `lib/admin-i18n.ts` (523 lines) — `adminDict: Record<"ar"|"en", AdminDict>`, plus cookie name constants and normalizers. Client-safe.
- `lib/admin-locale.ts` — **server-only** helpers `getAdminLocale()`, `getAdminTheme()`, `getAdminT()`, reading `next/headers` cookies.
- `app/admin/layout.tsx` reads both cookies server-side and stamps `dir`/`lang`/`.dark` on the admin wrapper, so the admin has **no flash** and no hydration mismatch.

The admin sidebar physically flips side (`right` in Arabic, `left` in English) via the layout reordering `{sidebar}` and `{inset}`.

### 4.6 The rest of `lib/`

| File | Purpose |
|---|---|
| `site/config.ts` | `siteConfig` (org name, contact, social) and `mainNavigation` — the full nav tree with Arabic + English labels. **Nav order is RTL-first: item one is rightmost.** |
| `site/org-levels.ts` | `OrgLevel` type + `normalizePeople()` for the `leaders`/`members` jsonb |
| `site/board-committees.ts` | `BoardCommittee` type + `normalizeMembers()`/`normalizeDuties()` |
| `site/contact-channel.ts` | Types + validation constants for the complaints form |
| `site/job-application.ts` | `CV_MAX_BYTES`, `cvMimeFor()`, form state types |
| `seo.ts` | `SITE_URL`, `absoluteUrl()`, `ogImage()`, `organizationJsonLd()`, `websiteJsonLd()`, `breadcrumbJsonLd()` |
| `seo/metadata.ts` | Shared metadata builders |
| `roles.ts` | `AppRole` union + `ROLE_LABELS`. **Client-safe** (no server imports) — this is why it exists separately from `auth.ts` |
| `auth.ts` | **Server-only.** `getCurrentProfile()` → `{ id, email, full_name, role }` |
| `news.ts` / `programs.ts` / `gallery.ts` / `reports.ts` / `careers.ts` | Domain types + hardcoded fallback content used when the DB returns nothing |
| `map/brand-style.ts` | Recolors the MapTiler vector style to brand palette |
| `brand-colors.ts` | Brand hex constants for the brand-identity page |
| `utils.ts` | `cn()` — clsx + tailwind-merge |
| `cms/types.ts` | **⚠ Dead code.** 155 lines of an earlier content model (`News`, `Initiative`, `Leader`…) with Arabic-literal union types. Nothing imports it. Delete it — it actively misleads. |

---

## 5. `components/` — organization and conventions

129 files. Grouped by **feature area, not by type**, with one shared `ui/` bucket.

| Folder | Files | What lives here |
|---|---|---|
| `ui/` | 22 | shadcn primitives (`button`, `card`, `sheet`, `sidebar`, `dropdown-menu`…) plus project-specific `Container`, `PageHeader`, `PagePlaceholder`, `T`, `fade-in`, `fade-in-up`, `expand-fade` |
| `layout/` | 6 | `Header`, `Footer`, `MobileNav`, `LanguageSwitcher`, `header-icons`, `use-header-surface` |
| `home/` | 12 | One component per homepage section, in render order: `HeroSlider` → `AboutBlock` → `LeadershipSpotlight` → `FocusAreaTiles` → `ProgramsExplorer` → `StrategicAlignment` → `ImpactKPIs` → `LatestNews` → `ContactSection` |
| `admin/` | 38 | All CMS form widgets. See §5.3 |
| `about/`, `news/`, `programs/`, `gallery/`, `careers/`, `contact/`, `reports/`, `brand/`, `privacy/`, `focus-area/` | ~35 | Feature-specific rendering |
| `theme/` | 2 | `ThemeProvider`, `InlineScript` |
| `seo/` | 1 | `JsonLd` |
| root of `components/` | 8 | `app-sidebar`, `nav-main`, `nav-user`, `nav-projects`, `team-switcher`, `login-form`, `AlMajdouieLoader` |

### 5.1 Server vs client components

Default is server. `"use client"` appears only where genuinely needed: interactivity, browser APIs, or context consumption. The pattern throughout is **fetch in the server page → pass plain props down → a small client leaf handles the interaction.** `<T>` is the extreme case of this — a 4-line client component so that everything above it can stay on the server.

### 5.2 Two orphaned file-type conventions

- `components/focus-area/detail/*.js` — four **plain `.js`** components (`CarouselSection`, `IntroSection`, `ProgramsSection`, `StatsSection`) in an otherwise 100% TypeScript codebase. They typecheck only because `allowJs: true`. Convert them when you next touch that page.
- `components/focus-area/economic/*.module.css` — four CSS Modules with **no accompanying component**. Leftovers from a removed implementation. Same for `MosquesMapSection.module.css`, which *is* used.

Otherwise styling is Tailwind utilities; the handful of `.css` files (`programs-panel.css`, `header-search.css`, `focus-accent.css`, `fade-in-up.css`, `expand-fade.css`) exist for keyframes and selectors Tailwind can't express.

### 5.3 The admin form kit

`components/admin/` is the reusable widget layer that keeps 13 CRUD screens consistent:

| Component | Job |
|---|---|
| `fields.tsx` | Text / textarea / select / bilingual-pair field primitives |
| `image-field.tsx` | Uploads to the public `media` bucket **directly from the browser**, stores the resulting public URL in a hidden input so it posts with the surrounding `<form>`. Also accepts a pasted URL. |
| `inline-upload.tsx` | Same idea for nested/repeatable editors; enforces `maxBytes` (3 MB default) and `maxDimension` (3000 px) client-side and shows the designer's recommended pixel size |
| `file-field.tsx`, `video-field.tsx` | PDF and video URL equivalents |
| `array-reorder.tsx` | Add/remove/reorder rows inside a `jsonb` array (objectives, leaders, duties, initiatives) |
| `reorder-buttons.tsx` | ↑/↓ on list screens, calls `moveRow()` |
| `publish-checkbox.tsx` | Optimistic publish toggle, calls `setPublished()` |
| `delete-button.tsx` | Confirm-then-delete |
| `toast.tsx` | `ToastProvider` mounted in `app/admin/layout.tsx` |
| `i18n.tsx` | `AdminI18nProvider`, `useAdminT()`, `LanguageToggle`, `ThemeToggle` |
| `pages/kit.tsx` | Shared scaffolding for the `page_content` JSON editors |

**The forms are uncontrolled and post `FormData` to server actions.** There is no React Hook Form, no Zod, no client-side schema. Validation is whatever the server action does plus HTML `required`.

**Image uploads bypass the server action entirely** — the browser talks to Supabase Storage with the anon key, and only the resulting URL string is submitted. This is why the `media` bucket's RLS insert policy is `bucket_id = 'media' and public.is_staff()`.

---

## 6. Styling and the design token system

### 6.1 Tailwind v4, configured entirely in CSS

There is **no `tailwind.config.js`**. `app/globals.css` (481 lines) is the whole configuration, via Tailwind v4's CSS-first API:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@custom-variant dark (&:is(.dark *));
```

### 6.2 Three parallel token sets — know which one you're in

**Set A — public-site semantic tokens** (defined on `:root`, flipped under `.dark`). These come from the designer's "Dark Mode UI Specification — Color Mapping Table" and are the ones you should use on the public site:

```
--surface, --surface-alt, --surface-focus      → bg-surface, bg-surface-alt
--panel, --panel-border                        → bg-panel, border-panel-border
--icon-box, --icon                             → bg-icon-box, text-icon
--heading                                      → text-heading
--body-1 … --body-4                            → text-body-1 … text-body-4
--btn-primary, --btn-primary-text
--btn-2-bg, --btn-2-stroke, --btn-2-text
--brand-blue, --brand-cyan, --brand-teal
--mosque-accent, --focus-mosques-accent
```

They are exposed as utilities through an `@theme inline { --color-*: var(--*) }` block.

> **Rule from the codebase, stated in a comment at the top of the file: "edit the pairs here, never inline."** A hardcoded hex on the public site is a dark-mode bug waiting to happen.

**Set B — shadcn tokens** (`--background`, `--foreground`, `--card`, `--primary`, `--muted`, `--border`, `--ring`, `--sidebar-*`, `--radius`). Mostly oklch. Used by the `ui/` primitives.

**Set C — admin theme**, scoped to `.admin-theme` and `.admin-theme.dark`, which **overrides Set B with brand colors** without touching the public site. This is why the admin looks teal and the shadcn defaults never leak out.

### 6.3 Dark mode mechanics

- The root layout injects a synchronous `InlineScript` in `<head>` that reads `localStorage.theme` and adds `.dark` before first paint — no flash.
- `ThemeProvider` mirrors that state, persists changes, and adds `.theme-ready` on the next animation frame. The 0.35s color transition is gated behind `.theme-ready` so the very first paint isn't animated.
- **Icon inversion is done in CSS, by heuristic.** `globals.css` contains a long `:is(.dark) :not(.admin-theme) img[aria-hidden]:where(...)` selector that matches small decorative images by `width` attribute and by ~25 `src` substrings (`-icon`, `arrow`, `policies/`, `tawzeef/`, `who-we-are/`, …) and applies `filter: brightness(0) invert(1)`. Logos, photos, and `.icon-on-light` are excluded.

> **⚠ Gotcha — this is the most fragile thing in the CSS.** Adding an icon in a new folder means adding that path to the allow-list, or it stays dark-on-dark. Renaming an image folder silently breaks inversion. A `data-invert-on-dark` attribute on the images would be the durable replacement. Inline SVGs are handled separately and more robustly (`svg[aria-hidden]` → `color: #fff`).

### 6.4 Typography

`ITF Rayat` is self-hosted from `fonts/` via `next/font/local` at five weights, exposed as `--font-itf-rayat` and applied to `html, body, button, input, textarea, select`. `Geist` is loaded from Google Fonts as `--font-sans`, but ITF Rayat wins the cascade on essentially everything. A fixed Figma type scale (`h1: 52px`, etc.) is set in `globals.css`.

### 6.5 RTL

The root layout is `dir="rtl"`. **Use logical properties everywhere** — `ms-`/`me-`/`ps-`/`pe-`/`start-`/`end-`, never `ml-`/`mr-`/`left-`/`right-`. The existing code follows this; the admin layout is the one place that deliberately manipulates `dir` per-subtree.

---

## 7. How a public page is built, end to end

Using the homepage as the reference:

```
app/(site)/layout.tsx
  └─ getSiteSettings()  → <Header /> {children} <Footer contact social />

app/(site)/page.tsx        ("force-dynamic")
  ├─ Promise.all([ getSiteSettings, getFocusAreas, getHeroSlides, getKPIs,
  │                getNewsCarousel, getProgramPanels, getStrategicAlignment ])
  ├─ maps rows → component props
  ├─ <JsonLd data={[organizationJsonLd(...), websiteJsonLd()]} />
  └─ <FadeInUp><SectionComponent items={rows.length ? rows : undefined} /></FadeInUp>
```

Two conventions worth internalizing:

1. **`Promise.all` for every page's fetches.** Sequential awaits would serialize round-trips. Every multi-fetch page in this codebase does this — keep it up.
2. **`items={rows.length ? rows : undefined}`.** Every section component has a hardcoded default dataset baked in (from `lib/news.ts`, `lib/programs.ts`, etc.). Passing `undefined` makes it render that fallback. This is why the site never looks broken with an empty database — **and why you can be looking at hardcoded content while believing you're looking at the CMS.** When debugging "my edit didn't show up", check whether the section fell back.

### Scroll animation

`<FadeInUp>` wraps most sections. It's a client component using `hooks/use-in-view.ts` (IntersectionObserver, fires once) plus `fade-in-up.css`. Props: `delay`, `duration`, `threshold`.

### Header behavior

`components/layout/use-header-surface.ts` implements a transparent-over-hero header: on scroll it calls `document.elementsFromPoint()` at the header's center, reads the background color of whatever is behind it, computes luminance, and switches the header to solid when it's over a light surface. Sections can override this declaratively with `data-nav-surface="light" | "solid" | "dark"` — which is why you'll see `data-nav-surface="light"` on page wrappers throughout `(site)/`.

---

## 8. Forms and mutations

**Everything is a Server Action. There are zero API route handlers in this app.**

### 8.1 Admin CRUD (the common case)

```ts
"use server";
export async function updateNews(id: string, form: FormData) {
  const supabase = await createClient();          // cookie-bound, RLS as the staff user
  const row = rowFromForm(form);                  // FormData → DB row
  const { error } = await supabase.from("news").update(row).eq("id", id);
  if (error) redirect(`/admin/dashboard/news/${id}?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/dashboard/news");
  revalidatePath("/news");                        // bust the public pages too
  revalidatePath("/");
  redirect("/admin/dashboard/news");
}
```

Notes on this pattern:
- **Authorization is enforced by RLS, not by the action.** The action doesn't check roles; Postgres policies reject the write if the user's role isn't allowed. The one exception is `users/actions.ts`, which calls `requireSuperAdmin()` explicitly because it uses the service-role client and RLS therefore does not apply.
- **Errors surface as `?error=` query params**, read by the form page and shown inline. There are no thrown errors reaching an error boundary.
- **`revalidatePath` calls are hand-maintained.** Every action must remember which public routes its table feeds. Miss one and stale content sticks. (Mostly moot today because pages are `force-dynamic`, but it matters the moment caching is introduced — see Production doc.)
- Small parsers `str()`, `lines()`, `csv()` are **duplicated in nearly every `actions.ts`**. Worth extracting.

### 8.2 Shared list controls — `_actions/reorder.ts`

One generic module powers ↑/↓ and publish-toggle for 10 tables, driven by a `TABLES` registry that maps table name → the paths to revalidate (+ an optional grouping column, used by `team_members` so board and leadership reorder independently).

- `moveRow(table, id, dir)` swaps two rows then **renumbers the whole list 1..N**, so `sort_order` stays clean even if rows started with duplicates or zeros.
- `setPublished(table, id, published)` returns `{ ok: boolean }` so the client toast can be truthful — a comment in the file makes the point that a "saved" toast after a failed write is worse than no toast.
- `nextSortOrder(table, group?)` appends new rows to the end.

**To add reordering to a new table, add one entry to `TABLES`.** That's it.

### 8.3 Public forms — the two service-role exceptions

`app/(site)/contact/actions.ts` and `app/(site)/careers/actions.ts` are the only public-facing writes, and both use `createAdminClient()` (service role). This is deliberate and documented in the migrations: the `contact_requests` and `job_applications` tables have **no anon INSERT policy at all**, so the server action is the only way in and its validation cannot be skipped by POSTing at the PostgREST endpoint with the publicly-shipped anon key.

`submitJobApplication` is worth reading in full as the reference implementation:
1. Validate all fields; reject on missing / no consent / bad file.
2. **Resolve the job from its slug server-side** and check `published` — never trust the job id from the form, so a crafted POST can't file against an unpublished or nonexistent job.
3. Insert the row **first**, so an upload failure can't strand a file under a nonexistent application.
4. Upload the CV to the private `job-applications` bucket under a key derived from the generated `application_no` (never from the user's filename).
5. If the upload fails, **delete the row** — a candidate name with no résumé is worse than a clean retry.
6. Patch the `cv` jsonb onto the row and return `{ ok, applicationNo }`.

Both forms use `useActionState` with a typed state object rather than redirect-based error reporting, because they need to render a success screen with the ticket / application number.

### 8.4 Reading private attachments back

`app/admin/dashboard/complaints/page.tsx` and `applications/page.tsx` call `storage.createSignedUrls(paths, SIGNED_URL_TTL)` on the server to mint short-lived links. The buckets are private; there is no public URL for a CV or a complaint attachment, ever. Deleting a record also deletes its objects (`deleteRequest`, `deleteApplication`).

---

## 9. Authentication in the frontend

```
middleware.ts  (matcher: ["/admin/:path*"] — public site pays zero auth cost)
  └─ lib/supabase/middleware.ts :: updateSession()
       ├─ createServerClient with cookie get/setAll wiring
       ├─ await supabase.auth.getUser()      ← refreshes the session
       ├─ /admin/** && !/admin && no user  → redirect /admin
       └─ /admin && user                   → redirect /admin/dashboard
```

Then `app/admin/dashboard/layout.tsx` re-checks with `getCurrentProfile()` and redirects if null — defense in depth, since middleware alone should never be the only gate.

Role gating in the UI is `components/app-sidebar.tsx`: a `NAV` array where each group and leaf carries an optional `roles: AppRole[]`, filtered by `navForRole()`. **This is cosmetic only.** The real enforcement is RLS. A `news_manager` who types `/admin/dashboard/programs` into the URL will see the page and the form; their write will simply be rejected by Postgres. See the Production doc — this is a UX problem worth fixing, not a security hole.

> **⚠ Note on `getCurrentProfile()`:** if the `profiles` row is missing it returns a synthetic least-privilege profile with `role: "news_manager"`. That means a user with no profile row gets a working dashboard scoped to news. Intentional fallback, but surprising.

---

## 10. Notable feature implementations

**Mosque map** (`components/focus-area/mosques/MosquesMapSection.tsx`) — MapLibre GL v6 + MapTiler tiles, restyled to brand palette by `lib/map/brand-style.ts`. Pins within 46 screen-pixels are merged into clusters, recomputed on every `moveend` (screen-space, not geographic, because what matters is visual overlap at the current zoom). Filter pills are derived from distinct `region_ar` values, so adding a region needs no code change. Popups render through `createPortal`. Falls back to a message if the worker or key is missing.

**PDF viewer** (`components/reports/PdfViewer.tsx`) — `pdfjs-dist` v6 rendering to `<canvas>`, with page nav, an 8-step zoom scale, print and download. Worker served from `public/pdf.worker.min.mjs`.

**Loader** (`components/AlMajdouieLoader.tsx`) — GSAP-driven brand splash, mounted in the root layout above the providers.

**Gallery** — `gallery_items` holds both albums and videos discriminated by `type`. `images` and `videos` are jsonb arrays; `AlbumViewer` is a lightbox, `VideoViewer` an embed player.

---

## 11. Code health as handed over

| Check | Result |
|---|---|
| `pnpm build` | ✅ passes — compiles in ~10s, 51 static pages generated |
| `npx tsc --noEmit` | ✅ clean, zero errors, `strict: true` |
| `pnpm lint` | ❌ exits 1 — **2692 problems (12 errors, 2680 warnings)** |
| Tests | **None.** No test runner, no test files, no CI. |

### The lint situation, precisely

`eslint.config.mjs` calls `globalIgnores([...])` with only `.next/**`, `out/**`, `build/**`, `next-env.d.ts`. That **replaces** `eslint-config-next`'s defaults, so `public/` is no longer ignored — and ESLint is linting two vendored bundles: `public/pdf.worker.min.mjs` and `public/maplibre/mapbox-gl-rtl-text.js`. Those two files account for essentially all 2680 warnings and 7 of the 12 errors.

Add `"public/**"` to `globalIgnores` and the noise disappears. What remains is **5 real errors, all the same rule** — "Calling setState synchronously within an effect can trigger cascading renders":

- `components/AlMajdouieLoader.tsx:32`
- `components/theme/ThemeProvider.tsx:28`
- `components/ui/expand-fade.tsx:25`
- `hooks/use-mobile.ts:14`
- `lib/i18n/context.tsx:23`

All five are the same shape — reading `localStorage` / a DOM class / a media query in a mount effect and calling `setState`. They're the standard hydration-safe pattern and they work; React 19's lint rule wants them expressed differently (`useSyncExternalStore`, or lazy `useState` initializers). Low risk, worth cleaning.

### Build warning

```
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
```

Next 16 renamed the convention. `middleware.ts` still works; rename to `proxy.ts` (and `middleware()` → `proxy()`) when convenient.

---

## 12. Conventions to follow when extending

1. **Adding a public page:** create `app/(site)/<route>/page.tsx`, export `metadata` (Arabic), add `export const dynamic = "force-dynamic"` **if it reads the CMS**, fetch with `Promise.all` from `lib/cms/fetchers.ts`, wrap sections in `<FadeInUp>`, use `<T ar en>` for static labels, and add the route to `staticRoutes` in `app/sitemap.ts`.
2. **Adding a content type:** migration → fetcher in `lib/cms/fetchers.ts` → the four admin files → an entry in `_actions/reorder.ts` `TABLES` → a nav entry in `components/app-sidebar.tsx` → dictionary keys in `lib/admin-i18n.ts` (both locales) → `revalidatePath` calls in the actions.
3. **Colors:** semantic token from `globals.css`. No hex in components on the public site.
4. **Spacing/direction:** logical properties only.
5. **New icon images:** either add the path to the dark-mode inversion `:where()` list in `globals.css`, or use an inline SVG with `aria-hidden` (handled automatically).
6. **Never** import `lib/supabase/admin.ts` outside a `"use server"` file.
7. **Bilingual columns:** add both `*_ar` and `*_en` even if only Arabic renders today — that's the established shape and retrofitting is painful.

---

## 13. Known frontend debt, ranked

| # | Item | Impact | Effort |
|---|---|---|---|
| ~~1~~ | ~~`/about/org-structure` static but CMS-backed~~ | ✅ **Fixed** — now `force-dynamic`; all other pages audited | — |
| 2 | ESLint lints `public/` — real errors hidden in 2680 warnings | Medium | 1 line |
| 3 | 5 `setState`-in-effect errors | Low | ~1h |
| 4 | `lib/cms/types.ts` is dead code that contradicts the live model | Medium (confusion) | delete |
| 5 | 4 `.js` components in `focus-area/detail/` | Low | ~2h |
| 6 | 4 orphaned `.module.css` in `focus-area/economic/` | Low | delete |
| 7 | `/videos` is a `PagePlaceholder` stub but is linked from nav and sitemap | Medium | build or unlink |
| 8 | `str/lines/csv` duplicated across ~15 `actions.ts` | Low | extract |
| 9 | Role gating in admin is nav-only; wrong-role users see forms that will fail | Medium (UX) | ~3h |
| 10 | No `hreflang` / English SEO | Medium if EN matters | large |
| 11 | Public folder is 66 MB with 2 MB+ PNGs | High (LCP) | see Production doc |
| 12 | `middleware.ts` deprecated in Next 16 | Low | rename |
| 13 | Dark-mode icon inversion keyed on `src` substrings | Medium (fragile) | ~3h |
| 14 | No tests, no CI | High for a handover | see Production doc |
