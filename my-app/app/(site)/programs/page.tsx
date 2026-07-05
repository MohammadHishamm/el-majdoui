import type { Metadata } from "next";
import { FadeInUp } from "@/components/ui/fade-in-up";
import { T } from "@/components/ui/T";
import { ProgramsList } from "@/components/programs/ProgramsList";
import { getAllPrograms } from "@/lib/cms/fetchers";

export const metadata: Metadata = {
  alternates: { canonical: "/programs" },
  title: "البرامج والمبادرات | مؤسسة المجدوعي الخيرية",
  description:
    "استكشف برامج ومبادرات مؤسسة المجدوعي الخيرية التنموية وأهداف الأثر المستدام لكل مبادرة.",
};

export const dynamic = "force-dynamic";

export default async function ProgramsPage() {
  const items = await getAllPrograms();
  return (
    <main dir="rtl" className="bg-surface">
      {/* Header (negative margin keeps the sticky navbar solid on load) */}
      <section className="-mt-28 bg-surface pt-40 md:pt-44" data-nav-surface="light">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <h1 className="text-right text-[36px] font-medium leading-[1.15] text-heading md:text-[44px]">
              <T ar="البرامج والمبادرات" en="Programs & Initiatives" />
            </h1>
            <p className="mt-4 max-w-3xl text-right text-[18px] leading-[32px] text-body-2">
              <T
                ar="استكشف برامجنا ومبادراتنا التنموية، وتعرف على سياقات العمل وأهداف الأثر المستدام لكل مبادرة."
                en="Explore our development programs and initiatives, and learn about the context and sustainable-impact goals of each."
              />
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Filters + grid */}
      <section className="bg-surface pb-20 pt-10 md:pb-28" aria-label="قائمة المبادرات">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <ProgramsList items={items} />
        </div>
      </section>
    </main>
  );
}
