"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/lib/i18n/context";
import { translations } from "@/lib/i18n/translations";

type BilingualText = { ar: string; en: string };

const FOCUS_AREAS: {
  name: BilingualText;
  slug: string;
  bg: string;
  btnText: string;
  desc: BilingualText;
  watermark: string;
  icon: string;
}[] = [
  {
    name: { ar: "المحتاج", en: "The Needy" },
    slug: "empowerment",
    bg: "#80A5E0",
    btnText: "#005761",
    desc: {
      ar: "تمكين اقتصادي وتفريج كربات من خلال برامج مستدامة تحقق الاكتفاء الذاتي للأسر المحتاجة.",
      en: "Economic empowerment and relief through sustainable programs that achieve self-sufficiency for needy families.",
    },
    watermark: "/images/figma/sections/focus-1.svg",
    icon: "/images/figma/sections/focus1(2).svg",
  },
  {
    name: { ar: "مساجد المجدوعي", en: "Almajdouie Mosques" },
    slug: "mosques",
    bg: "#00B5C2",
    btnText: "#00B5C2",
    desc: {
      ar: "عناية وتطوير ومنارة للعلم من خلال بناء وتجهيز مساجد نموذجية تخدم المجتمع.",
      en: "Care, development, and a beacon of knowledge through building and equipping model mosques that serve the community.",
    },
    watermark: "/images/figma/sections/focus-2.svg",
    icon: "/images/figma/sections/focus-2(2).svg",
  },
  {
    name: { ar: "شركاء التنفيذ", en: "Implementation Partners" },
    slug: "partners-development",
    bg: "#005761",
    btnText: "#80A5E0",
    desc: {
      ar: "تطوير جاهزية الجمعيات الشريكة ورفع كفاءتها التنظيمية والمالية لإحداث أثر تنموي مستدام.",
      en: "Developing the readiness of partner associations and raising their organizational and financial efficiency for sustainable impact.",
    },
    watermark: "/images/figma/sections/focus-3.svg",
    icon: "/images/figma/sections/focus-3(2).svg",
  },
];

const WATERMARK_SIZE = 119;
const BADGE_SIZE = 80;
const BADGE_RADIUS = 20;
const BADGE_PADDING_X = 16.01;

export function FocusAreaTiles() {
  const { locale } = useLocale();
  const t = translations[locale].focusAreas;
  const isArabic = locale === "ar";
  const textAlign = isArabic ? "text-right" : "text-left";

  return (
    <section
      className="bg-white pt-6 pb-16 md:pt-8 md:pb-24"
      data-nav-surface="light"
      aria-labelledby="focus-heading"
    >
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <div className="mb-12 text-center">
          <h2
            id="focus-heading"
            className="text-[28px] font-medium text-[#101828] md:text-[36px]"
          >
            {t.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-7 text-[#4a5565] md:text-[20px] md:leading-[28px]">
            {t.subheading}
          </p>
        </div>

        {/* dir=rtl so the first card (المحتاج) sits on the right, as in Figma */}
        <div dir="rtl" className="flex flex-wrap justify-center gap-5">
          {FOCUS_AREAS.map((area) => (
            <div
              key={area.slug}
              dir="rtl"
              className={`relative flex h-[377px] w-full max-w-[390px] flex-col overflow-hidden rounded-tr-[60px] border border-white/25 p-6 text-white ${textAlign}`}
              style={{ backgroundColor: area.bg, borderWidth: "1.18px" }}
            >
              {/* Icon row: badge (physical right) + watermark (physical left) */}
              <div className="relative z-10 flex shrink-0 items-center justify-between gap-3">
                <div
                  className="flex shrink-0 items-center justify-center bg-white shadow-sm"
                  style={{
                    width: BADGE_SIZE,
                    height: BADGE_SIZE,
                    minWidth: BADGE_SIZE,
                    paddingLeft: BADGE_PADDING_X,
                    paddingRight: BADGE_PADDING_X,
                    borderRadius: BADGE_RADIUS,
                  }}
                >
                  <Image
                    src={area.icon}
                    alt=""
                    width={48}
                    height={48}
                    className="h-10 w-10 object-contain sm:h-12 sm:w-12"
                    aria-hidden
                  />
                </div>

                <div
                  className="pointer-events-none relative shrink-0 select-none opacity-50"
                  style={{ width: WATERMARK_SIZE, height: WATERMARK_SIZE }}
                  aria-hidden
                >
                  <Image
                    src={area.watermark}
                    alt=""
                    fill
                    className="object-contain"
                    sizes={`${WATERMARK_SIZE}px`}
                  />
                </div>
              </div>

              {/* Title + text below icons */}
              <div className={`relative z-10 mt-6 flex min-h-0 flex-1 flex-col ${textAlign}`}>
                <h3 className="shrink-0 text-[28px] font-medium leading-tight md:text-[34px]">
                  {area.name[locale]}
                </h3>
                <p
                  dir={isArabic ? "rtl" : "ltr"}
                  className="mt-3 line-clamp-2 min-h-0 text-[16px] font-medium leading-[26px] text-white"
                >
                  {area.desc[locale]}
                </p>

                <Link
                  href={`/focus-areas/${area.slug}`}
                  className="mt-auto flex w-full shrink-0 items-center justify-center rounded-full bg-white py-2.5 text-[14px] font-bold leading-none transition-opacity hover:opacity-90"
                  style={{ color: area.btnText }}
                >
                  {t.exploreCTA}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
