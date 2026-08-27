import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FadeInUp } from "@/components/ui/fade-in-up";
import { ValuesCarousel, type ValueCardData } from "@/components/about/ValuesCarousel";
import { getPageContent } from "@/lib/cms/fetchers";

export const metadata: Metadata = {
  alternates: { canonical: "/about/vision-mission" },
  title: "الرؤية والرسالة والقيم",
  description:
    "عطاء بإحسان يُسعد ويُمكّن المحتاج اقتصاديًا — رؤية المؤسسة ورسالتها وقيمها المؤسسية الخمس.",
};

export const dynamic = "force-dynamic";

const FALLBACK = {
  hero_image: "/images/vision/theVision-hero.png",
  title: "الرؤية والرسالة والقيم",
  vision_heading: "الرؤية",
  vision_text: "عطاء بإحسان يُسعد ويُمكّن المحتاج اقتصاديًا.",
  mission_heading: "الرسالة",
  mission_text:
    "مؤسسة مانحة تسهم في تحسين جودة الحياة الاقتصادية للمحتاج، والعناية بمساجد المجدوعي، بحلول مبتكرة، وشراكات فاعلة، ومنح ميسّرة.",
  vision_image: "/images/vision/section-1.png",
  values_bg_image: "/images/vision/section-2.png",
  values_heading: "القيم المؤسسية",
  values_intro:
    "تستحضر المؤسسة هذه القيم في جميع تعاملاتها، ويلتزم بها العاملون فيها على مختلف مستوياتهم — من أمناء وأعضاء لجان وموظفين وشركاء تنفيذ، كلٌّ بحسب عمله.",
  // Five values in the guide's order. الالتزام and الشراكة have no icon in the
  // asset package yet, so their tiles render without the icon box.
  values: [
    { title: "الإحسان", description: "بذل الوسع في إتقان العمل على أكمل وجه، ابتغاء الأجر والتماسًا للكمال في الأنشطة والأعمال.", icon: "/images/vision/Icon-1.svg" },
    { title: "الالتزام", description: "الحرص على الانضباط بالقواعد واللوائح الرسمية العامة والخاصة، والوفاء بواجبات المؤسسة في حينها تجاه الموظفين والمستفيدين، وتحقيق المستهدفات المعتمدة.", icon: "" },
    { title: "الإتقان", description: "الحرص على أداء العمل بأعلى قدر من الجودة، والتحسين المستمر لذلك.", icon: "/images/vision/Icon-3.svg" },
    { title: "الرحمة", description: "رقّة في القلوب تلامسها المواساة والسلوان عند وجود العوز والحاجة.", icon: "/images/vision/Icon-2.svg" },
    { title: "الشراكة", description: "تقديم قيمة مضافة للشركاء، وتحقيق الأهداف المشتركة من خلال الاستفادة من القدرات والمهارات المتنوعة.", icon: "" },
  ] as ValueCardData[],
};

const DISPLAY_FEATURES = "'ss01' on, 'ss04' on";

function SectionHeading({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <h2
      className={`text-right font-medium text-heading ${className}`}
      style={{ fontFeatureSettings: DISPLAY_FEATURES, fontSize: 64, fontWeight: 500, lineHeight: "100px", ...style }}
    >
      {children}
    </h2>
  );
}

export default async function VisionMissionPage() {
  const raw = await getPageContent("vision-mission");
  const s = (k: keyof typeof FALLBACK) => (typeof raw[k] === "string" && raw[k] ? (raw[k] as string) : (FALLBACK[k] as string));
  const values = Array.isArray(raw.values) && raw.values.length ? (raw.values as ValueCardData[]) : FALLBACK.values;

  return (
    <main dir="rtl">
      {/* ── Hero ── */}
      <section className="relative -mt-28 min-h-[360px] w-full overflow-hidden border-b-4 border-[#00B5C2] lg:h-[427px]" data-nav-surface="dark">
        <Image src={s("hero_image")} alt="" fill priority className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-black/15 lg:from-black/55 lg:via-black/20 lg:to-transparent" />
        <div className="relative z-10 mx-auto flex min-h-[360px] w-full max-w-[1280px] flex-col justify-end px-4 pb-10 pt-32 text-right sm:px-6 sm:pt-36 lg:min-h-0 lg:justify-start lg:pb-0 lg:pt-[150px] lg:px-8">
          <nav aria-label="مسار التنقل" className="mb-3 flex w-full items-center justify-start gap-2 text-[13px] font-normal leading-none text-light-blue sm:text-[14px] lg:mb-5">
            <Link href="/" className="transition-colors hover:text-white">الرئيسية</Link>
            <span aria-hidden>←</span>
            <Link href="/about" className="transition-colors hover:text-white">عن المؤسسة</Link>
          </nav>
          <h1
            className="me-auto w-full max-w-[72%] !text-[24px] !leading-[1.4] text-white sm:max-w-[65%] sm:!text-[34px] md:max-w-none md:!text-[48px] lg:max-w-[1280px] lg:!text-[70px] lg:!leading-[56px]"
            style={{ fontFeatureSettings: DISPLAY_FEATURES }}
          >
            {s("title")}
          </h1>
        </div>
      </section>

      {/* ── Vision & Mission ── */}
      <FadeInUp>
        <section className="bg-surface py-12 md:py-20">
          <div className="mx-auto w-full max-w-[1338px] px-4 sm:px-6 lg:px-0">
            <div className="flex w-full max-w-[1338px] flex-col overflow-hidden rounded-[24px] bg-surface-alt lg:h-[455px] lg:flex-row">
              <div className="flex flex-1 flex-col justify-center px-6 py-10 text-right sm:px-10 lg:h-full lg:px-14 lg:py-10">
                <SectionHeading style={{ fontSize: 48, lineHeight: "64px" }}>{s("vision_heading")}</SectionHeading>
                <div className="mt-3 max-w-[380px] text-right text-body-1" style={{ fontSize: 22, fontWeight: 700, lineHeight: "37.4px" }}>
                  &quot;{s("vision_text")}&quot;
                </div>
                <div className="my-5 h-px w-full bg-panel-border" />
                <SectionHeading style={{ fontSize: 48, lineHeight: "64px" }}>{s("mission_heading")}</SectionHeading>
                <div className="mt-3 max-w-[564px] text-right text-body-1" style={{ fontSize: 22, fontWeight: 700, lineHeight: "37.4px" }}>
                  {s("mission_text")}
                </div>
              </div>
              <div className="relative order-first h-[260px] w-full overflow-hidden rounded-t-[24px] sm:h-[340px] lg:order-none lg:h-full lg:min-h-0 lg:w-[54%] lg:rounded-t-none lg:rounded-br-[80px] lg:rounded-tr-[24px]">
                <Image src={s("vision_image")} alt="" fill className="object-cover object-center" sizes="(max-width: 1024px) 100vw, 722px" />
              </div>
            </div>
          </div>
        </section>
      </FadeInUp>

      {/* ── Institutional Values ── */}
      <FadeInUp>
        <section className="bg-surface pb-16 md:pb-24" aria-labelledby="values-heading">
          <div className="mx-auto w-full max-w-[1338px] px-4 sm:px-6 lg:px-0">
            <div className="relative flex min-h-[560px] w-full max-w-[1338px] flex-col overflow-hidden rounded-[24px] px-6 py-12 lg:h-[643px] lg:px-16 lg:py-14">
              <Image src={s("values_bg_image")} alt="" fill aria-hidden className="object-cover object-center" sizes="(max-width: 1338px) 100vw, 1338px" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/30" />
              <div className="relative z-10 mt-auto w-full lg:pl-[108px]">
                <h2 id="values-heading" className="mb-8 w-full max-w-[702px] text-right text-white" style={{ fontFeatureSettings: DISPLAY_FEATURES, fontSize: 64, fontWeight: 500, lineHeight: "100px", textShadow: "0 4px 4px rgba(0, 0, 0, 0.25)" }}>
                  {s("values_heading")}
                </h2>
                <p className="mb-8 max-w-[860px] text-right text-[16px] leading-[28px] text-white/85">
                  {s("values_intro")}
                </p>
                <ValuesCarousel values={values} />
              </div>
            </div>
          </div>
        </section>
      </FadeInUp>
    </main>
  );
}
