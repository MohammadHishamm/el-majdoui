import type { Metadata } from "next";
import { NewsHero } from "@/components/news/NewsHero";
import { NewsExplorer } from "@/components/news/NewsExplorer";
import { getAllNews } from "@/lib/cms/fetchers";

export const metadata: Metadata = {
  title: "الأخبار والإعلانات | مؤسسة المجدوعي الخيرية",
  description: "آخر أخبار وإعلانات وفعاليات وشراكات مؤسسة المجدوعي الخيرية.",
};

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const items = await getAllNews();
  return (
    <main dir="rtl" className="bg-white">
      <NewsHero items={items} />
      <section className="bg-white py-12 md:py-16" aria-label="قائمة الأخبار">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <NewsExplorer items={items} />
        </div>
      </section>
    </main>
  );
}
