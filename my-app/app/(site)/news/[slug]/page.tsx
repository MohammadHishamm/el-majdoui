import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsDetails from "@/components/news/news-details";
import { getNews, news } from "@/lib/news";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getNews(slug);
  if (!item) return { title: "خبر غير موجود" };
  return { title: `${item.title} | مؤسسة المجدوعي الخيرية`, description: item.excerpt };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getNews(slug);
  if (!item) notFound();
  return <NewsDetails item={item} />;
}
