/** A single unified search hit shown in the header dropdown. */
export type SearchResult = {
  /** Stable category key — localized to a chip label on the client. */
  typeKey: "page" | "news" | "program" | "focus" | "job" | "report" | "gallery";
  title: string;
  url: string;
  snippet?: string;
};

/** Localized chip label per result category (shared by the desktop + mobile search UIs). */
export const TYPE_LABELS: Record<SearchResult["typeKey"], { ar: string; en: string }> = {
  page: { ar: "صفحة", en: "Page" },
  news: { ar: "خبر", en: "News" },
  program: { ar: "برنامج", en: "Program" },
  focus: { ar: "مجال تركيز", en: "Focus" },
  job: { ar: "وظيفة", en: "Job" },
  report: { ar: "تقرير", en: "Report" },
  gallery: { ar: "معرض", en: "Media" },
};
