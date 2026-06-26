import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsDetails from "@/components/news/news-details";
import { mostReadSlugs, type NewsItem } from "@/lib/news";
import { getAllNews, getNewsBySlug } from "@/lib/cms/fetchers";

type Props = { params: Promise<{ slug: string }> };

// CMS-driven content is rendered dynamically (cookies/RLS at request time).
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) return { title: "خبر غير موجود" };
  return { title: `${item.title} | مؤسسة المجدوعي الخيرية`, description: item.excerpt };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) notFound();

  const all = await getAllNews();
  const bySlug = new Map(all.map((n) => [n.slug, n]));
  const related = item.related
    .map((s) => bySlug.get(s))
    .filter((n): n is NewsItem => Boolean(n))
    .slice(0, 3);
  const mostRead = mostReadSlugs
    .map((s) => bySlug.get(s))
    .filter((n): n is NewsItem => Boolean(n))
    .slice(0, 3);

  return <NewsDetails item={item} related={related} mostRead={mostRead} />;
}
