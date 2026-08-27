import type { Metadata } from "next";
import { FadeInUp } from "@/components/ui/fade-in-up";
import { StrategyPerspectives, type Perspective } from "@/components/about/StrategyPerspectives";
import { getPageContent } from "@/lib/cms/fetchers";

export const metadata: Metadata = {
  alternates: { canonical: "/about/strategy" },
  title: "الخطة الاستراتيجية 2024–2027م",
  description:
    "اتجاهات المؤسسة الخمسة وأهدافها السبعة عشر ومنطق الأثر في خطتها الاستراتيجية 2024–2027م.",
};

export const dynamic = "force-dynamic";

type ImpactOutcome = { title: string; description: string };

const FALLBACK = {
  eyebrow: "عن المؤسسة",
  title: "الخطة الاستراتيجية 2024–2027م",
  intro:
    "رسمت المؤسسة خطتها الاستراتيجية للأعوام 2024–2027م لتوحيد توجهات الموظفين والشركاء، بما يخدم تطلعات المؤسسين والرؤية الوطنية 2030، وتُترجم الخطة إلى اتجاهات وأهداف ومؤشرات تُقاس دوريًا، بحيث يصبح القرار التشغيلي مبنيًا على بيانات واضحة.",
  impact_logic_heading: "منطق الأثر — ثلاث نتائج نهائية مترابطة",
  how_built_heading: "كيف بُنيت الخطة",
  perspectives_heading: "الاتجاهات الاستراتيجية الخمسة و17 هدفًا",
  to_execution_heading: "من الاستراتيجية إلى التنفيذ",
  to_execution:
    "تعمل المؤسسة على مفهوم المبادرات، لتوثيق جميع أعمالها وقياسها وربطها مباشرة بالخطة الاستراتيجية. وتنقسم مبادرات المؤسسة إلى مبادرات استراتيجية تعمل على تحقيق الأثر في الفئات المستهدفة، ومبادرات تمكينية داخلية مساندة لها.",
  // Communications still owes the plan PDF; an empty path hides the button.
  plan_pdf: "",
};

export default async function StrategyPage() {
  const raw = await getPageContent("strategy");
  const s = (k: keyof typeof FALLBACK) => (typeof raw[k] === "string" && raw[k] ? (raw[k] as string) : FALLBACK[k]);
  const perspectives = Array.isArray(raw.perspectives) ? (raw.perspectives as Perspective[]) : undefined;
  const impactLogic = Array.isArray(raw.impact_logic) ? (raw.impact_logic as ImpactOutcome[]) : [];
  const howBuilt = Array.isArray(raw.how_built) ? (raw.how_built as string[]) : [];
  const planPdf = typeof raw.plan_pdf === "string" ? raw.plan_pdf : FALLBACK.plan_pdf;

  return (
    <main dir="rtl" className="bg-surface">
      <section className="-mt-28 bg-surface pt-40 md:pt-44" data-nav-surface="light">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <p className="text-right text-[14px] font-medium leading-none text-body-3">{s("eyebrow")}</p>
            <h1 className="mt-4 text-right text-[36px] font-medium leading-[40px] text-heading">{s("title")}</h1>
            <div className="mt-8 h-px w-full bg-panel-border" />
            <div className="mt-10 w-full max-w-[1126px] text-right text-[18px] font-normal leading-[32px] text-body-2">
              {s("intro")}
            </div>
          </FadeInUp>
        </div>
      </section>

      {impactLogic.length > 0 && (
        <FadeInUp>
          <section className="bg-surface py-14 md:py-20" aria-labelledby="impact-logic-heading">
            <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
              <h2 id="impact-logic-heading" className="mb-8 text-right text-[30px] font-medium leading-[40px] text-heading md:text-[36px]">
                {s("impact_logic_heading")}
              </h2>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {impactLogic.map((o, i) => (
                  <article key={i} className="rounded-[20px] border-2 border-heading bg-panel p-6 text-right">
                    <h3 className="text-[19px] font-bold leading-[30px] text-heading">{o.title}</h3>
                    <p className="mt-3 text-[16px] leading-[28px] text-body-4">{o.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </FadeInUp>
      )}

      {howBuilt.length > 0 && (
        <FadeInUp>
          <section className="bg-surface-alt py-14 md:py-20" aria-labelledby="how-built-heading">
            <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
              <h2 id="how-built-heading" className="mb-6 text-right text-[30px] font-medium leading-[40px] text-heading md:text-[36px]">
                {s("how_built_heading")}
              </h2>
              <div className="max-w-[1000px] space-y-5">
                {howBuilt.map((para, i) => (
                  <p key={i} className="text-right text-[18px] leading-[32.4px] text-body-2">{para}</p>
                ))}
              </div>
            </div>
          </section>
        </FadeInUp>
      )}

      <FadeInUp>
        <div className="mx-auto w-full max-w-[1280px] px-4 pt-14 sm:px-6 lg:px-8">
          <h2 className="text-right text-[30px] font-medium leading-[40px] text-heading md:text-[36px]">
            {s("perspectives_heading")}
          </h2>
        </div>
      </FadeInUp>

      <StrategyPerspectives perspectives={perspectives} />

      <FadeInUp>
        <section className="bg-surface pb-16 md:pb-24" aria-labelledby="to-execution-heading">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <h2 id="to-execution-heading" className="mb-5 text-right text-[30px] font-medium leading-[40px] text-heading md:text-[36px]">
              {s("to_execution_heading")}
            </h2>
            <p className="max-w-[1000px] text-right text-[18px] leading-[32.4px] text-body-2">
              {s("to_execution")}
            </p>
            {/* Hidden until Communications delivers the plan document. */}
            {planPdf && (
              <a
                href={planPdf}
                download
                className="mt-8 inline-block rounded-full bg-footer-bg px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent"
              >
                تحميل الخطة الاستراتيجية
              </a>
            )}
          </div>
        </section>
      </FadeInUp>
    </main>
  );
}
