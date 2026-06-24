import type { Metadata } from "next";
import { FadeInUp } from "@/components/ui/fade-in-up";
import { StrategyPerspectives } from "@/components/about/StrategyPerspectives";

export const metadata: Metadata = {
  title: "استراتيجية المؤسسة | مؤسسة المجدوعي الخيرية",
  description:
    "تعتمد المؤسسة منهجية بطاقة الأداء المتوازن في أربعة أبعاد كبرى تضم عشرة أهداف استراتيجية تترجم رؤيتنا ورسالتنا إلى أثرٍ ملموس.",
};

export default function StrategyPage() {
  return (
    <main dir="rtl" className="bg-white">
      {/* Pull white surface under sticky header so navbar stays solid on load */}
      <section
        className="-mt-28 bg-white pt-40 md:pt-44"
        data-nav-surface="light"
      >
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <p className="text-right text-[14px] font-medium leading-none text-text-muted">
              عن المؤسسة
            </p>
            <h1 className="mt-4 text-right text-[36px] font-medium leading-[40px] text-[#005761]">
              استراتيجية المؤسسة
            </h1>
            <div className="mt-8 h-px w-full bg-gray-200" />
            <div
              className="mt-10 w-full max-w-[1126px] text-right text-[#364153]"
              style={{
                fontSize: 32,
                fontWeight: 400,
                lineHeight: "45px",
              }}
            >
              تعتمد المؤسسة منهجية بطاقة الأداء المتوازن (Balanced Scorecard)، فتنتظم
              أعمالها في أربعة أبعاد كبرى تضم عشرة أهداف استراتيجية، تترجم رؤيتنا
              ورسالتنا إلى أثرٍ ملموس على الأرض.
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ── The four BSC perspectives (interactive cards) ── */}
      <StrategyPerspectives />
    </main>
  );
}
