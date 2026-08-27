import type { Metadata } from "next";
import { NewsHero } from "@/components/news/NewsHero";
import { NewsExplorer } from "@/components/news/NewsExplorer";
import { PageHeader } from "@/components/ui/PageHeader";
import { getAllNews } from "@/lib/cms/fetchers";

export const metadata: Metadata = {
  alternates: { canonical: "/news" },
  title: "الأخبار والإعلانات",
  description:
    "أحدث أخبار مؤسسة المجدوعي الخيرية وإعلاناتها وأنشطة مبادراتها.",
};

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const items = await getAllNews();
  return (
    <main dir="rtl" className="bg-surface">
      {/* The hero shows the featured article as an h2 — the page's own h1 is the
          section title below it, per the content guide (§7.1). The hero renders
          nothing while no article is published. */}
      <NewsHero items={items} />
      <PageHeader
        title="الأخبار والإعلانات"
        description="أحدث أخبار المؤسسة وإعلاناتها وأنشطة مبادراتها."
      />
      <section className="bg-surface py-12 md:py-16" aria-label="قائمة الأخبار">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <NewsExplorer items={items} />
        </div>
      </section>
    </main>
  );
}
