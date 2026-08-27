/**
 * The four publishable news categories, fixed by the content guide (§7.1).
 * Nothing outside this list may be assigned to an article.
 */
export type NewsCategoryId = "news" | "announcement" | "report" | "event";

const CATEGORY_LABEL: Record<NewsCategoryId, string> = {
  news: "خبر",
  announcement: "إعلان",
  report: "تقرير",
  event: "فعالية",
};

export const newsFilters: { id: "all" | NewsCategoryId; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "news", label: CATEGORY_LABEL.news },
  { id: "announcement", label: CATEGORY_LABEL.announcement },
  { id: "report", label: CATEGORY_LABEL.report },
  { id: "event", label: CATEGORY_LABEL.event },
];

export function newsCategoryLabel(c: NewsCategoryId): string {
  return CATEGORY_LABEL[c] ?? "";
}

export type NewsItem = {
  slug: string;
  category: NewsCategoryId;
  /** Short category label shown on the detail meta row (e.g. "إعلان رسمي"). */
  kicker?: string;
  date: string;
  /** ISO publish timestamp (for SEO/Article structured data). */
  publishedAt?: string;
  source: string;
  readTime: string;
  title: string;
  excerpt: string;
  /** Lead paragraph on the detail page. */
  lead: string;
  image: string;
  /** Featured image caption on the detail page. */
  caption: string;
  body: string[];
  axes?: { heading: string; items: string[] };
  quote?: string;
  /** Paragraph shown directly under the quote block. */
  afterQuote?: string;
  tags: string[];
  /** Whether to surface on the homepage hero slider. */
  featured?: boolean;
  related: string[];
};

export const mostReadSlugs = ["takreem-mutatawieen", "ittifaqiyat-tamkeen", "bayan-ifsah"];
