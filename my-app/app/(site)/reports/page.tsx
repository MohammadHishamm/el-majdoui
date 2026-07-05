import type { Metadata } from "next";
import { FadeInUp } from "@/components/ui/fade-in-up";
import { T } from "@/components/ui/T";
import { ReportsList } from "@/components/reports/ReportsList";
import { getReports } from "@/lib/cms/fetchers";

export const metadata: Metadata = {
  alternates: { canonical: "/reports" },
  title: "التقارير والوثائق | مؤسسة المجدوعي الخيرية",
  description: "التقارير السنوية وتقارير الأثر والقوائم المالية ووثائق مؤسسة المجدوعي الخيرية.",
};

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const items = await getReports();
  return (
    <main dir="rtl" className="bg-surface" data-nav-surface="light">
      {/* Header (negative margin keeps the sticky navbar solid on load) */}
      <section className="-mt-28 bg-surface pt-40 md:pt-44">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <p className="text-right text-[14px] font-medium leading-none text-body-3">
              <T ar="المركز الإعلامي" en="Media Center" />
            </p>
            <h1 className="mt-4 text-right text-[36px] font-medium leading-[40px] text-heading md:text-[44px]">
              <T ar="التقارير والوثائق" en="Reports & Documents" />
            </h1>
            <div className="mt-8 h-px w-full bg-panel-border" />
          </FadeInUp>
        </div>
      </section>

      {/* Reports list */}
      <section className="bg-surface pb-20 pt-10 md:pb-28" aria-label="قائمة التقارير والوثائق">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <ReportsList items={items} />
        </div>
      </section>
    </main>
  );
}
