import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsDetails from "@/components/news/news-details";
import { mostReadSlugs, type NewsItem } from "@/lib/news";
import { getAllNews, getNewsBySlug } from "@/lib/cms/fetchers";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site/config";
import { absoluteUrl, breadcrumbJsonLd, ogImage, SITE_URL } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

// CMS-driven content is rendered dynamically (cookies/RLS at request time).
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) return { title: "خبر غير موجود", robots: { index: false, follow: true } };
  const url = `/news/${slug}`;
  return {
    title: item.title,
    description: item.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: item.title,
      description: item.excerpt,
      images: [{ url: ogImage(item.image), alt: item.title }],
      ...(item.publishedAt ? { publishedTime: item.publishedAt } : {}),
    },
    twitter: { card: "summary_large_image", title: item.title, description: item.excerpt, images: [ogImage(item.image)] },
  };
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

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: item.excerpt,
    image: [absoluteUrl(ogImage(item.image))],
    inLanguage: "ar",
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/news/${item.slug}`) },
    ...(item.publishedAt ? { datePublished: item.publishedAt, dateModified: item.publishedAt } : {}),
    author: { "@type": "Organization", name: siteConfig.fullName, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: siteConfig.fullName,
      logo: { "@type": "ImageObject", url: absoluteUrl("/images/logo.png") },
    },
  };
  const breadcrumb = breadcrumbJsonLd([
    { name: "الرئيسية", path: "/" },
    { name: "الأخبار", path: "/news" },
    { name: item.title, path: `/news/${item.slug}` },
  ]);

  return (
    <>
      <JsonLd data={[articleLd, breadcrumb]} />
      <NewsDetails item={item} related={related} mostRead={mostRead} />
    </>
  );
}
