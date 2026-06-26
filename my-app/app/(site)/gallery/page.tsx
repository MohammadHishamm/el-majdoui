import type { Metadata } from "next";
import { FadeInUp } from "@/components/ui/fade-in-up";
import { GalleryExplorer } from "@/components/gallery/GalleryExplorer";
import { getGalleryItems } from "@/lib/cms/fetchers";

export const metadata: Metadata = {
  title: "معرض الصور والفيديو | مؤسسة المجدوعي الخيرية",
  description: "ألبومات صور ومكتبة فيديو فعاليات ومبادرات مؤسسة المجدوعي الخيرية.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const items = await getGalleryItems();
  return (
    <main dir="rtl" className="bg-white" data-nav-surface="light">
      {/* Header (negative margin keeps the sticky navbar solid on load) */}
      <section className="-mt-28 bg-white pt-40 md:pt-44">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <p className="text-right text-[14px] font-medium leading-none text-text-muted">
              المركز الإعلامي
            </p>
            <h1 className="mt-4 text-right text-[36px] font-medium leading-[40px] text-[#005761] md:text-[40px]">
              معرض الصور والفيديو
            </h1>
            <div className="mt-8 h-px w-full bg-gray-200" />
          </FadeInUp>
        </div>
      </section>

      {/* Filters + gallery */}
      <section className="bg-white pb-20 pt-8 md:pb-28" aria-label="معرض الصور والفيديو">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <GalleryExplorer data={items} />
        </div>
      </section>
    </main>
  );
}
