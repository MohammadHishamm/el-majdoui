import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { FadeInUp } from "@/components/ui/fade-in-up";

export const metadata: Metadata = {
  title: "الرؤية والرسالة والقيم | مؤسسة المجدوعي الخيرية",
  description:
    "رؤية ورسالة وقيم مؤسسة المجدوعي الخيرية: عطاءٌ بإحسان يُسعد ويُمكّن المحتاج اقتصادياً.",
};

const VALUES = [
  {
    id: "ihsan",
    title: "الإحسان",
    description:
      "بذل الوسع في إتقان العمل على أكمل وجه ابتغاء الأجر والتماشياً للكمال في الأنشطة والأعمال.",
    icon: "/images/vision/Icon-1.svg",
  },
  {
    id: "rahma",
    title: "الرحمة",
    description:
      "رقة في القلوب تلامسها المواساة والسلوان عند وجود العوز والحاجة.",
    icon: "/images/vision/Icon-2.svg",
  },
  {
    id: "itqan",
    title: "الإتقان",
    description:
      "الحرص على أداء العمل بأعلى قدر من الجودة والتحسين المستمر لذلك.",
    icon: "/images/vision/Icon-3.svg",
  },
];

const DISPLAY_FEATURES = "'ss01' on, 'ss04' on";

function SectionHeading({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <h2
      className={`text-right font-medium text-[#005761] ${className}`}
      style={{
        fontFeatureSettings: DISPLAY_FEATURES,
        fontSize: 64,
        fontWeight: 500,
        lineHeight: "100px",
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

function ValueCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <article className="rounded-[16px] border-[1.18px] border-[#005761] bg-white p-6 shadow-[0_1px_1.5px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.03)]">
      {/* Icon tile — RTL start (physical right) */}
      <div className="flex">
        <div className="flex size-12 items-center justify-center rounded-[12px] bg-[#e8f1f2]">
          <Image src={icon} alt="" width={24} height={24} aria-hidden />
        </div>
      </div>
      <h3 className="mt-4 text-right text-[20px] font-bold leading-[30px] text-[#005761]">
        {title}
      </h3>
      <p className="mt-3 text-right text-[16px] leading-[27px] text-black">
        {description}
      </p>
    </article>
  );
}

export default function VisionMissionPage() {
  return (
    <main dir="rtl">
      {/* ── Hero ── */}
      <section
        className="relative -mt-28 h-[427px] w-full overflow-hidden border-b-4 border-[#00B5C2]"
        data-nav-surface="dark"
      >
        <Image
          src="/images/vision/theVision-hero.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/55 via-black/20 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 pt-[150px] text-right sm:px-6 lg:px-8">
          <nav
            aria-label="مسار التنقل"
            className="mb-5 flex w-full items-center justify-start gap-2 text-[14px] font-normal leading-none text-light-blue"
          >
            <Link href="/" className="transition-colors hover:text-white">
              الرئيسية
            </Link>
            <span aria-hidden>←</span>
            <Link href="/about" className="transition-colors hover:text-white">
              عن المؤسسة
            </Link>
          </nav>

          <h1
            className="w-full max-w-[1280px] text-right text-white"
            style={{
              fontFeatureSettings: DISPLAY_FEATURES,
              fontSize: 64,
              fontWeight: 500,
              lineHeight: "40px",
            }}
          >
            الرؤية والرسالة والقيم
          </h1>
        </div>
      </section>

      {/* ── Vision & Mission ── */}
      <FadeInUp>
        <section className="bg-white py-12 md:py-20">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col overflow-visible rounded-[24px] bg-bg-light lg:flex-row">
              {/* Text — RTL start (physical right) */}
              <div className="flex flex-1 flex-col justify-center px-6 py-10 text-right sm:px-10 lg:px-14 lg:py-12">
                <SectionHeading>رؤيتنا</SectionHeading>
                <div
                  className="mt-4 max-w-[380px] text-right text-black"
                  style={{ fontSize: 22, fontWeight: 700, lineHeight: "37.4px" }}
                >
                  &quot;عطاءٌ بإحسان يُسعد ويُمكّن المحتاج اقتصادياً&quot;
                </div>

                <div className="my-7 h-px w-full bg-gray-200" />

                <SectionHeading>رسالتنا</SectionHeading>
                <div
                  className="mt-4 max-w-[564px] text-right text-black"
                  style={{ fontSize: 22, fontWeight: 700, lineHeight: "37.4px" }}
                >
                  مؤسسة مانحة تُسهم في تحسين جودة الحياة الاقتصادية للمحتاج، والعناية
                  بمساجد المجدوعي؛ بحلول مبتكرة وشراكات فاعلة ومنح مُيسَّر.
                </div>
              </div>

              {/* Image card — RTL end (physical left); corners flipped on this panel only */}
              <div className="relative order-first min-h-[260px] w-full overflow-hidden rounded-t-[24px] sm:min-h-[340px] lg:order-none lg:min-h-[455px] lg:w-[54%] lg:rounded-t-none lg:rounded-br-[80px] lg:rounded-tr-[24px]">
                <Image
                  src="/images/vision/section-1.png"
                  alt="علم المملكة العربية السعودية"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 54vw"
                />
              </div>
            </div>
          </div>
        </section>
      </FadeInUp>

      {/* ── Institutional Values ── */}
      <FadeInUp>
        <section className="bg-white pb-16 md:pb-24" aria-labelledby="values-heading">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="relative flex min-h-[560px] flex-col overflow-hidden rounded-[24px] px-6 py-12 lg:min-h-[643px] lg:px-16 lg:py-14">
              <Image
                src="/images/vision/section-2.png"
                alt=""
                fill
                aria-hidden
                className="object-cover object-center"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/30" />

              <div className="relative z-10 mt-auto w-full lg:pl-[108px]">
                <h2
                  id="values-heading"
                  className="mb-8 w-full max-w-[702px] text-right text-white"
                  style={{
                    fontFeatureSettings: DISPLAY_FEATURES,
                    fontSize: 64,
                    fontWeight: 500,
                    lineHeight: "100px",
                    textShadow: "0 4px 4px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  قيمنا المؤسسية
                </h2>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
                  {VALUES.map((value) => (
                    <ValueCard key={value.id} {...value} />
                  ))}
                </div>
              </div>

              {/* Decorative carousel control (matches Figma) */}
              <div
                aria-hidden
                className="absolute bottom-1/4 left-8 hidden size-[60px] items-center justify-center rounded-full bg-white/20 text-white lg:flex"
              >
                <ChevronLeft className="size-7" strokeWidth={2} />
              </div>
            </div>
          </div>
        </section>
      </FadeInUp>
    </main>
  );
}
