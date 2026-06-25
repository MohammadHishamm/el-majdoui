import type { Metadata } from "next";
import { FadeInUp } from "@/components/ui/fade-in-up";
import { ReportsList } from "@/components/reports/ReportsList";

export const metadata: Metadata = {
  title: "التقارير والوثائق | مؤسسة المجدوعي الخيرية",
  description: "التقارير السنوية وتقارير الأثر والقوائم المالية ووثائق مؤسسة المجدوعي الخيرية.",
};

export default function ReportsPage() {
  return (
    <main dir="rtl" className="bg-white" data-nav-surface="light">
      {/* Header (negative margin keeps the sticky navbar solid on load) */}
      <section className="-mt-28 bg-white pt-40 md:pt-44">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <p className="text-right text-[14px] font-medium leading-none text-text-muted">
              المركز الإعلامي
            </p>
            <h1 className="mt-4 text-right text-[36px] font-medium leading-[40px] text-[#005761] md:text-[44px]">
              التقارير والوثائق
            </h1>
            <div className="mt-8 h-px w-full bg-gray-200" />
          </FadeInUp>
        </div>
      </section>

      {/* Reports list */}
      <section className="bg-white pb-20 pt-10 md:pb-28" aria-label="قائمة التقارير والوثائق">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <ReportsList />
        </div>
      </section>
    </main>
  );
}
