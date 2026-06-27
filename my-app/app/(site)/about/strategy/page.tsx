import type { Metadata } from "next";
import { FadeInUp } from "@/components/ui/fade-in-up";
import { StrategyPerspectives, type Perspective } from "@/components/about/StrategyPerspectives";
import { getPageContent } from "@/lib/cms/fetchers";

export const metadata: Metadata = {
  title: "استراتيجية المؤسسة | مؤسسة المجدوعي الخيرية",
  description:
    "تعتمد المؤسسة منهجية بطاقة الأداء المتوازن في أربعة أبعاد كبرى تضم عشرة أهداف استراتيجية تترجم رؤيتنا ورسالتنا إلى أثرٍ ملموس.",
};

export const dynamic = "force-dynamic";

const FALLBACK = {
  eyebrow: "عن المؤسسة",
  title: "استراتيجية المؤسسة",
  intro:
    "تعتمد المؤسسة منهجية بطاقة الأداء المتوازن (Balanced Scorecard)، فتنتظم أعمالها في أربعة أبعاد كبرى تضم عشرة أهداف استراتيجية، تترجم رؤيتنا ورسالتنا إلى أثرٍ ملموس على الأرض.",
};

export default async function StrategyPage() {
  const raw = await getPageContent("strategy");
  const s = (k: keyof typeof FALLBACK) => (typeof raw[k] === "string" && raw[k] ? (raw[k] as string) : FALLBACK[k]);
  const perspectives = Array.isArray(raw.perspectives) ? (raw.perspectives as Perspective[]) : undefined;

  return (
    <main dir="rtl" className="bg-white">
      <section className="-mt-28 bg-white pt-40 md:pt-44" data-nav-surface="light">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <p className="text-right text-[14px] font-medium leading-none text-text-muted">{s("eyebrow")}</p>
            <h1 className="mt-4 text-right text-[36px] font-medium leading-[40px] text-[#005761]">{s("title")}</h1>
            <div className="mt-8 h-px w-full bg-gray-200" />
            <div className="mt-10 w-full max-w-[1126px] text-right text-[#364153]" style={{ fontSize: 32, fontWeight: 400, lineHeight: "45px" }}>
              {s("intro")}
            </div>
          </FadeInUp>
        </div>
      </section>

      <StrategyPerspectives perspectives={perspectives} />
    </main>
  );
}
