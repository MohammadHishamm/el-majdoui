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
      ar: "تعمل المؤسسة على تفريج كرب المحتاجين عبر العطاء المباشر ونقلهم إلى دائرة التمكين الاقتصادي.",
      en: "The foundation works to relieve the hardships of those in need through direct giving and moving them toward economic empowerment.",
    },
    watermark: "/images/figma/sections/focus-1.svg",
    icon: "/images/figma/sections/focus1(2).svg",
  },
  {
    name: { ar: "مساجد المجدوعي", en: "Almajdouie Mosques" },
    slug: "mosques",
    bg: "#00B5C2",
    btnText: "#005761",
    desc: {
      ar: "تعتني المؤسسة بمساجد المجدوعي لتكون مُعمّرة ومستدامة ومهيأة لقاصديها ومنارة للعلم.",
      en: "The foundation cares for Almajdouie Mosques to ensure they are well-maintained, sustainable, prepared for worshippers, and beacons of knowledge.",
    },
    watermark: "/images/figma/sections/focus-2.svg",
    icon: "/images/figma/sections/focus-2(2).svg",
  },
  {
    name: { ar: "شركاء التنفيذ", en: "Implementation Partners" },
    slug: "partners-development",
    bg: "#005761",
    btnText: "#005761",
    desc: {
      ar: "تسعى المؤسسة لتطوير جاهزية الجمعيات والكيانات غير الربحية الشريكة لإحداث أثر تنموي مستدام.",
      en: "The foundation strives to develop the readiness of partner associations and non-profit entities to create sustainable development impact.",
    },
    watermark: "/images/figma/sections/focus-3.svg",
    icon: "/images/figma/sections/focus-3(2).svg",
  },
];

const WATERMARK_SIZE = 119;
const BADGE_SIZE = 80;
const BADGE_RADIUS = 20;
const BADGE_PADDING_X = 16.01;
const ICON_ROW_TOP = 24; // matches top-6 on left watermark
const BADGE_TOP = ICON_ROW_TOP + (WATERMARK_SIZE - BADGE_SIZE) / 2;

export function FocusAreaTiles() {
  const { locale } = useLocale();
  const t = translations[locale].focusAreas;

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
            className="text-3xl font-bold text-text-dark md:text-4xl"
          >
            {t.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-8 text-text-light">
            {t.subheading}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-5">
          {FOCUS_AREAS.map((area) => (
            <div
              key={area.slug}
              className="relative flex h-[377px] w-[390px] max-w-full flex-col overflow-hidden rounded-tr-[60px] border border-white/25 p-6 text-right text-white"
              style={{ backgroundColor: area.bg, borderWidth: "1.18px" }}
            >
              {/* Small icon badge — aligned with left watermark row */}
              <div
                className="absolute z-10 flex items-center justify-center bg-white shadow-sm"
                style={{
                  top: BADGE_TOP,
                  left: "283px",
                  width: BADGE_SIZE,
                  height: BADGE_SIZE,
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
                  className="h-12 w-12 object-contain"
                  aria-hidden
                />
              </div>

              {/* Large watermark — top-left in RTL */}
              <div
                className="pointer-events-none absolute end-6 top-6 z-0 select-none opacity-50"
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

              {/* Title + text below icons */}
              <div className="relative z-10 mt-[148px] flex flex-1 flex-col text-right">
                <h3 className="text-2xl font-bold leading-snug">{area.name[locale]}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-white/90">
                  {area.desc[locale]}
                </p>

                <Link
                  href={`/focus-areas/${area.slug}`}
                  className="mt-4 flex w-full items-center justify-center rounded-full bg-white py-3 text-sm font-semibold transition-opacity hover:opacity-90"
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
