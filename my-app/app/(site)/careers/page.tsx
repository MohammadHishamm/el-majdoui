import type { Metadata } from "next";
import { FadeInUp } from "@/components/ui/fade-in-up";
import { CareersExplorer } from "@/components/careers/CareersExplorer";

export const metadata: Metadata = {
  title: "التوظيف | مؤسسة المجدوعي الخيرية",
  description: "انضم إلى فريق مؤسسة المجدوعي الخيرية واستعرض الفرص الوظيفية المتاحة.",
};

export default function CareersPage() {
  return (
    <main dir="rtl" className="bg-white" data-nav-surface="light">
      <section className="-mt-28 bg-white pt-40 md:pt-44">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <h1 className="text-right text-[36px] font-medium leading-[1.15] text-[#005761] md:text-[40px]">
              انضم إلى فريقنا
            </h1>
            <p className="mt-4 max-w-3xl text-right text-[18px] leading-[32px] text-text-medium">
              في مؤسسة المجدوعي الخيرية، نؤمن بأن الإنسان هو أساس التنمية. ابدأ رحلتك معنا وساهم
              في بناء مجتمع حيوي ومستدام.
            </p>
            <div className="mt-8 h-px w-full bg-gray-200" />
          </FadeInUp>
        </div>
      </section>

      <section className="bg-white pb-20 pt-12 md:pb-28" aria-label="الفرص الوظيفية">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <CareersExplorer />
        </div>
      </section>
    </main>
  );
}
