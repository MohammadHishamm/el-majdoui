"use server";

import { supabaseAnon } from "@/lib/supabase/anon";
import type { SearchResult } from "@/lib/cms/search-types";

// page_content slugs → their public route + Arabic title.
const PAGE_META: Record<string, { url: string; title: string }> = {
  "vision-mission": { url: "/about/vision-mission", title: "الرؤية والرسالة" },
  "who-we-are": { url: "/about/who-we-are", title: "من نحن" },
  strategy: { url: "/about/strategy", title: "الاستراتيجية" },
  "brand-identity": { url: "/about/brand-identity", title: "الهوية البصرية" },
  board: { url: "/about/board", title: "المجلس والقيادة" },
  careers: { url: "/careers", title: "التوظيف" },
  "strategic-alignment": { url: "/", title: "التوافق الاستراتيجي" },
};

// Section hubs / static routes with no DB row, matched by their title.
const STATIC_PAGES: { title: string; url: string }[] = [
  { title: "عن المؤسسة", url: "/about" },
  { title: "المركز الإعلامي", url: "/media-center" },
  { title: "الأخبار", url: "/news" },
  { title: "البرامج والمبادرات", url: "/programs" },
  { title: "مجالات التركيز", url: "/focus-areas" },
  { title: "معرض الصور والفيديو", url: "/gallery" },
  { title: "التقارير", url: "/reports" },
  { title: "اتصل بنا", url: "/contact" },
];

/** Build a PostgREST `.or()` ilike filter across several columns. */
function orIlike(cols: string[], term: string): string {
  return cols.map((c) => `${c}.ilike.%${term}%`).join(",");
}

async function run<T>(builder: PromiseLike<{ data: T[] | null }>): Promise<T[]> {
  try {
    const { data } = await builder;
    return data ?? [];
  } catch {
    return [];
  }
}

/**
 * Low-complexity site search: a few parallel ilike queries across the published
 * content tables + the static page titles, merged and ranked (title matches first).
 * Runs on the server via the anon client, so only published rows are visible (RLS).
 */
export async function searchSite(query: string, limit = 8): Promise<SearchResult[]> {
  const raw = query.trim();
  if (raw.length < 2) return [];
  // PostgREST `.or()` treats commas/parens as syntax — strip them from the term.
  const term = raw.replace(/[,()*]/g, " ").trim();
  if (!term) return [];
  const lc = term.toLowerCase();
  const has = (s: unknown) => String(s ?? "").toLowerCase().includes(lc);

  const [news, programs, focus, jobs, reports, gallery, pages] = await Promise.all([
    run<{ slug: string; title_ar: string; excerpt_ar: string }>(
      supabaseAnon.from("news").select("slug,title_ar,excerpt_ar").eq("published", true).or(orIlike(["title_ar", "excerpt_ar"], term)).limit(6),
    ),
    run<{ slug: string; title_ar: string; short_desc_ar: string }>(
      supabaseAnon.from("programs").select("slug,title_ar,short_desc_ar").eq("published", true).or(orIlike(["title_ar", "short_desc_ar"], term)).limit(6),
    ),
    run<{ slug: string; name_ar: string; short_desc_ar: string }>(
      supabaseAnon.from("focus_areas").select("slug,name_ar,short_desc_ar").eq("published", true).or(orIlike(["name_ar", "short_desc_ar"], term)).limit(6),
    ),
    run<{ slug: string; title_ar: string; summary_ar: string }>(
      supabaseAnon.from("jobs").select("slug,title_ar,summary_ar").eq("published", true).or(orIlike(["title_ar", "summary_ar"], term)).limit(6),
    ),
    run<{ title_ar: string; period_ar: string }>(
      supabaseAnon.from("reports").select("title_ar,period_ar").eq("published", true).or(orIlike(["title_ar", "period_ar"], term)).limit(6),
    ),
    run<{ slug: string; title_ar: string; about_ar: string; meta_ar: string }>(
      supabaseAnon.from("gallery_items").select("slug,title_ar,about_ar,meta_ar").eq("published", true).or(orIlike(["title_ar", "about_ar", "meta_ar"], term)).limit(6),
    ),
    run<{ slug: string; content: unknown }>(
      supabaseAnon.from("page_content").select("slug,content"),
    ),
  ]);

  type Ranked = SearchResult & { rank: number };
  const rows: Ranked[] = [];
  const push = (r: SearchResult, titleMatch: boolean) => rows.push({ ...r, rank: titleMatch ? 0 : 1 });

  for (const n of news) push({ typeKey: "news", title: n.title_ar, url: `/news/${n.slug}`, snippet: n.excerpt_ar }, has(n.title_ar));
  for (const p of programs) push({ typeKey: "program", title: p.title_ar, url: `/programs/${p.slug}`, snippet: p.short_desc_ar }, has(p.title_ar));
  for (const fa of focus) push({ typeKey: "focus", title: fa.name_ar, url: `/focus-areas/${fa.slug}`, snippet: fa.short_desc_ar }, has(fa.name_ar));
  for (const j of jobs) push({ typeKey: "job", title: j.title_ar, url: `/careers/${j.slug}`, snippet: j.summary_ar }, has(j.title_ar));
  for (const r of reports) push({ typeKey: "report", title: r.title_ar, url: `/reports`, snippet: r.period_ar }, has(r.title_ar));
  for (const g of gallery) push({ typeKey: "gallery", title: g.title_ar, url: `/gallery/${g.slug}`, snippet: g.meta_ar }, has(g.title_ar));

  // Pages: page_content rows whose slug/content match, mapped to their route.
  for (const pg of pages) {
    const meta = PAGE_META[pg.slug];
    if (!meta) continue;
    const titleHit = has(meta.title);
    if (titleHit || has(pg.slug) || has(JSON.stringify(pg.content))) {
      push({ typeKey: "page", title: meta.title, url: meta.url }, titleHit);
    }
  }
  for (const sp of STATIC_PAGES) {
    if (has(sp.title)) push({ typeKey: "page", title: sp.title, url: sp.url }, true);
  }

  // Dedupe by url (keep the best rank), then title-matches first.
  const byUrl = new Map<string, Ranked>();
  for (const r of rows) {
    const existing = byUrl.get(r.url);
    if (!existing || r.rank < existing.rank) byUrl.set(r.url, r);
  }
  return [...byUrl.values()]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit)
    .map((r): SearchResult => ({ typeKey: r.typeKey, title: r.title, url: r.url, snippet: r.snippet }));
}
