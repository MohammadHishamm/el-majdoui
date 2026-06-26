import { supabaseAnon } from "@/lib/supabase/anon";
import type { NewsItem, NewsCategoryId } from "@/lib/news";
import type { GalleryItem, GalleryType } from "@/lib/gallery";
import type { Program, ProgramCategoryId } from "@/lib/programs";
import type { Report } from "@/lib/reports";
import type { Job } from "@/lib/careers";

function rowToJob(r: Record<string, unknown>): Job {
  return {
    id: r.slug as string,
    title: (r.title_ar as string) ?? "",
    summary: (r.summary_ar as string) ?? "",
    department: (r.department as string) ?? "",
    location: (r.location as string) ?? "",
    type: (r.type as string) ?? "",
    experience: (r.experience as string) ?? "",
    education: (r.education as string) ?? "",
    deadline: (r.deadline as string) ?? "",
    posted: (r.posted as string) ?? "",
    responsibilities: (r.responsibilities as string[]) ?? [],
    qualifications: (r.qualifications as string[]) ?? [],
  };
}

export async function getAllJobs(): Promise<Job[]> {
  try {
    const { data } = await supabaseAnon
      .from("jobs")
      .select("*")
      .eq("published", true)
      .order("sort_order");
    return (data ?? []).map(rowToJob);
  } catch {
    return [];
  }
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  try {
    const { data } = await supabaseAnon.from("jobs").select("*").eq("slug", slug).single();
    return data ? rowToJob(data) : null;
  } catch {
    return null;
  }
}

export type KpiData = { value: number; suffix: string; label: Bi; year: string; iconSrc: string };

export async function getKPIs(): Promise<KpiData[]> {
  try {
    const { data } = await supabaseAnon
      .from("kpis")
      .select("*")
      .eq("published", true)
      .order("sort_order");
    return (data ?? []).map((k) => ({
      value: Number(k.value) || 0,
      suffix: (k.suffix as string) ?? "",
      label: { ar: k.label_ar as string, en: k.label_en as string },
      year: (k.year as string) ?? "",
      iconSrc: (k.icon as string) ?? "",
    }));
  } catch {
    return [];
  }
}

export type PolicyData = { id: string; title: string; version: string; category: string; file: string };

export async function getPolicies(): Promise<PolicyData[]> {
  try {
    const { data } = await supabaseAnon
      .from("policies")
      .select("*")
      .eq("published", true)
      .order("sort_order");
    return (data ?? []).map((p) => ({
      id: p.id as string,
      title: (p.title_ar as string) ?? "",
      version: (p.version as string) ?? "",
      category: p.category as string,
      file: (p.file as string) ?? "#",
    }));
  } catch {
    return [];
  }
}

export type TeamMemberData = { id: string; name: string; role: string; image: string };

export async function getTeam(): Promise<{ board: TeamMemberData[]; leadership: TeamMemberData[] }> {
  try {
    const { data } = await supabaseAnon
      .from("team_members")
      .select("*")
      .eq("published", true)
      .order("sort_order");
    const map = (r: Record<string, unknown>): TeamMemberData => ({
      id: r.id as string,
      name: (r.name_ar as string) ?? "",
      role: (r.role_ar as string) ?? "",
      image: (r.image as string) ?? "",
    });
    const rows = data ?? [];
    return {
      board: rows.filter((r) => r.type === "board").map(map),
      leadership: rows.filter((r) => r.type === "leadership").map(map),
    };
  } catch {
    return { board: [], leadership: [] };
  }
}

export async function getReports(): Promise<Report[]> {
  try {
    const { data } = await supabaseAnon
      .from("reports")
      .select("*")
      .eq("published", true)
      .order("sort_order");
    return (data ?? []).map((r) => ({
      id: r.id as string,
      title: (r.title_ar as string) ?? "",
      period: (r.period_ar as string) ?? "",
      file: (r.file as string) ?? "",
    }));
  } catch {
    return [];
  }
}

function rowToProgram(r: Record<string, unknown>): Program {
  return {
    slug: r.slug as string,
    title: (r.title_ar as string) ?? "",
    category: r.category as ProgramCategoryId,
    shortDesc: (r.short_desc_ar as string) ?? "",
    heroDesc: (r.hero_desc as string) ?? "",
    image: (r.image as string) ?? "",
    about: (r.about as string) ?? "",
    objectives: (r.objectives as string[]) ?? [],
    stages: (r.stages as Program["stages"]) ?? [],
    targetGroups: (r.target_groups as string[]) ?? [],
    quote: (r.quote as Program["quote"]) ?? { text: "", author: "" },
    partners: (r.partners as string[]) ?? [],
    info: (r.info as Program["info"]) ?? { launchYear: "", scope: "", beneficiaries: "", sector: "" },
    related: (r.related as string[]) ?? [],
  };
}

export async function getAllPrograms(): Promise<Program[]> {
  try {
    const { data } = await supabaseAnon
      .from("programs")
      .select("*")
      .eq("published", true)
      .order("sort_order");
    return (data ?? []).map(rowToProgram);
  } catch {
    return [];
  }
}

export async function getProgramBySlug(slug: string): Promise<Program | null> {
  try {
    const { data } = await supabaseAnon.from("programs").select("*").eq("slug", slug).single();
    return data ? rowToProgram(data) : null;
  } catch {
    return null;
  }
}

export type Bi = { ar: string; en: string };

function rowToNewsItem(r: Record<string, unknown>): NewsItem {
  return {
    slug: r.slug as string,
    category: r.category as NewsCategoryId,
    kicker: (r.kicker as string) ?? undefined,
    date: (r.date as string) ?? "",
    source: (r.source as string) ?? "",
    readTime: (r.read_time as string) ?? "",
    title: (r.title_ar as string) ?? "",
    excerpt: (r.excerpt_ar as string) ?? "",
    lead: (r.lead as string) ?? "",
    image: (r.image as string) ?? "",
    caption: (r.caption as string) ?? "",
    body: (r.body as string[]) ?? [],
    axes: (r.axes as NewsItem["axes"]) ?? undefined,
    quote: (r.quote as string) ?? undefined,
    afterQuote: (r.after_quote as string) ?? undefined,
    tags: (r.tags as string[]) ?? [],
    featured: Boolean(r.featured),
    related: (r.related as string[]) ?? [],
  };
}

/** All published news, newest first (NewsItem shape). */
export async function getAllNews(): Promise<NewsItem[]> {
  try {
    const supabase = supabaseAnon;
    const { data } = await supabase
      .from("news")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });
    return (data ?? []).map(rowToNewsItem);
  } catch {
    return [];
  }
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  try {
    const supabase = supabaseAnon;
    const { data } = await supabase.from("news").select("*").eq("slug", slug).single();
    return data ? rowToNewsItem(data) : null;
  } catch {
    return null;
  }
}

/** Published gallery items (photo albums + videos) in display order. */
export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const supabase = supabaseAnon;
    const { data } = await supabase
      .from("gallery_items")
      .select("*")
      .eq("published", true)
      .order("sort_order");
    return (data ?? []).map((g) => ({
      id: g.id as string,
      type: g.type as GalleryType,
      title: (g.title_ar as string) ?? "",
      meta: (g.meta_ar as string) ?? "",
      thumb: (g.thumb as string) ?? "",
      cover: (g.cover as string) ?? "",
    }));
  } catch {
    return [];
  }
}

export type SiteSettingsData = {
  about: { title: Bi; body: Bi };
  leadership: { quote: Bi; name: Bi; position: Bi; photo: string | null };
};

export type FocusAreaData = {
  slug: string;
  name: Bi;
  desc: Bi;
  bg: string;
  btnText: string;
  icon: string | null;
  watermark: string | null;
};

export type HeroSlideData = {
  id: string;
  image: string;
  title: Bi;
  excerpt: Bi;
  href: string;
};

/** Single-row site settings (home About + leadership). null if unavailable. */
export async function getSiteSettings(): Promise<SiteSettingsData | null> {
  try {
    const supabase = supabaseAnon;
    const { data } = await supabase.from("site_settings").select("*").eq("id", true).single();
    if (!data) return null;
    return {
      about: {
        title: { ar: data.about_title_ar, en: data.about_title_en },
        body: { ar: data.about_body_ar, en: data.about_body_en },
      },
      leadership: {
        quote: { ar: data.leadership_quote_ar, en: data.leadership_quote_en },
        name: { ar: data.leadership_name_ar, en: data.leadership_name_en },
        position: { ar: data.leadership_position_ar, en: data.leadership_position_en },
        photo: data.leadership_photo,
      },
    };
  } catch {
    return null;
  }
}

export async function getFocusAreas(): Promise<FocusAreaData[]> {
  try {
    const supabase = supabaseAnon;
    const { data } = await supabase
      .from("focus_areas")
      .select("*")
      .eq("published", true)
      .order("sort_order");
    return (data ?? []).map((a) => ({
      slug: a.slug,
      name: { ar: a.name_ar, en: a.name_en },
      desc: { ar: a.short_desc_ar, en: a.short_desc_en },
      bg: a.bg_color,
      btnText: a.btn_text_color,
      icon: a.icon,
      watermark: a.watermark,
    }));
  } catch {
    return [];
  }
}

export async function getHeroSlides(): Promise<HeroSlideData[]> {
  try {
    const supabase = supabaseAnon;
    const { data } = await supabase
      .from("hero_slides")
      .select("*")
      .eq("published", true)
      .order("sort_order");
    return (data ?? []).map((s) => ({
      id: s.id,
      image: s.image,
      title: { ar: s.title_ar, en: s.title_en },
      excerpt: { ar: s.excerpt_ar, en: s.excerpt_en },
      href: s.href ?? "/news",
    }));
  } catch {
    return [];
  }
}
