import type { Metadata } from "next";
import { FadeInUp } from "@/components/ui/fade-in-up";
import { PoliciesList } from "@/components/about/PoliciesList";

export const metadata: Metadata = {
  title: "السياسات واللوائح | مؤسسة المجدوعي الخيرية",
  description:
    "لوائح وسياسات وأدلة عمل مؤسسة المجدوعي الخيرية متاحة للتحميل.",
};

export default function PoliciesPage() {
  return (
    <main dir="rtl" className="bg-white">
      {/* ── Header ── (negative margin keeps the sticky navbar solid on load) */}
      <section className="-mt-28 bg-white pt-40 md:pt-44" data-nav-surface="light">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <p className="text-right text-[14px] font-medium leading-none text-text-muted">
              عن المؤسسة
            </p>
            <h1 className="mt-4 text-right text-[36px] font-medium leading-[40px] text-[#005761]">
              السياسات واللوائح
            </h1>
            <div className="mt-8 h-px w-full bg-gray-200" />
          </FadeInUp>
        </div>
      </section>

      {/* ── Filters + downloadable list ── */}
      <FadeInUp>
        <section className="bg-white pb-20 pt-8 md:pb-28" aria-label="قائمة السياسات واللوائح">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <PoliciesList />
          </div>
        </section>
      </FadeInUp>
    </main>
  );
}
