"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
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

/** Above this count the tiles switch from a static grid to a carousel. */
const CAROUSEL_THRESHOLD = 3;

type AreaTile = {
  slug: string;
  name: BilingualText;
  desc: BilingualText;
  bg: string;
  btnText: string;
  icon: string;
  watermark: string;
};

function Tile({
  area,
  locale,
  textAlign,
  isArabic,
  exploreCTA,
}: {
  area: AreaTile;
  locale: "ar" | "en";
  textAlign: string;
  isArabic: boolean;
  exploreCTA: string;
}) {
  return (
    <div
      dir="rtl"
      className={`relative flex h-[377px] w-full max-w-[390px] flex-col overflow-hidden rounded-tr-[60px] border border-white/25 bg-[var(--tile-bg)] p-6 text-white dark:border-[#2d9896]/25 dark:bg-[#10171e] ${textAlign}`}
      style={{ "--tile-bg": area.bg, borderWidth: "1.18px" } as React.CSSProperties}
    >
      {/* Icon row: badge (physical right) + watermark (physical left) */}
      <div className="relative z-10 flex shrink-0 items-center justify-between gap-3">
        <div
          className="flex shrink-0 items-center justify-center bg-white shadow-sm dark:bg-white/[0.04] dark:shadow-none dark:ring-1 dark:ring-inset dark:ring-[#2d9896]/40"
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
            className="h-10 w-10 object-contain sm:h-12 sm:w-12 dark:[filter:brightness(0)_invert(1)]"
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
        <h3 className="line-clamp-2 shrink-0 break-words text-[28px] font-medium leading-tight text-white dark:text-heading md:text-[34px]">
          {area.name[locale]}
        </h3>
        <p
          dir={isArabic ? "rtl" : "ltr"}
          className="mt-3 line-clamp-2 min-h-0 text-[16px] font-medium leading-[26px] text-white dark:text-[#b6b6b6]"
        >
          {area.desc[locale]}
        </p>

        <Link
          href={`/focus-areas/${area.slug}`}
          className="mt-auto flex w-full shrink-0 items-center justify-center rounded-full border border-transparent bg-white py-2.5 text-[14px] font-bold leading-none text-[var(--btn-text)] transition-opacity hover:opacity-90 dark:border-[#2d9896] dark:bg-transparent dark:text-[#2d9896] dark:hover:bg-[#2d9896]/10 dark:hover:opacity-100"
          style={{ "--btn-text": area.btnText } as React.CSSProperties}
        >
          {exploreCTA}
        </Link>
      </div>
    </div>
  );
}

function FocusAreaCarousel({
  list,
  locale,
  textAlign,
  isArabic,
  t,
}: {
  list: AreaTile[];
  locale: "ar" | "en";
  textAlign: string;
  isArabic: boolean;
  t: (typeof translations)[keyof typeof translations]["focusAreas"];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(0);

  const measure = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const total = el.scrollWidth;
    const view = el.clientWidth;
    const count = Math.max(1, Math.round(total / view));
    setPages(count);
    setPage(Math.round(Math.abs(el.scrollLeft) / view));
  }, []);

  useEffect(() => {
    measure();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const scrollByPage = (dir: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    // In RTL, "next" (visually towards the end) means scrolling left (negative).
    const sign = isArabic ? -1 : 1;
    const delta = el.clientWidth * (dir === "next" ? sign : -sign);
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  const goToPage = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const sign = isArabic ? -1 : 1;
    el.scrollTo({ left: sign * i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative md:px-16">
      <div
        ref={scrollerRef}
        dir="rtl"
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 scrollbar-none"
      >
        {list.map((area) => (
          <div
            key={area.slug}
            className="w-full max-w-[390px] shrink-0 snap-start basis-full sm:basis-[calc(50%-10px)] lg:basis-[calc(33.333%-14px)]"
          >
            <Tile
              area={area}
              locale={locale}
              textAlign={textAlign}
              isArabic={isArabic}
              exploreCTA={t.exploreCTA}
            />
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={() => scrollByPage("prev")}
        aria-label={t.prev}
        className="absolute inset-s-0 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-panel-border bg-surface text-heading shadow-sm transition-colors hover:bg-icon-box md:flex"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 rtl:rotate-180" aria-hidden>
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => scrollByPage("next")}
        aria-label={t.next}
        className="absolute inset-e-0 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-panel-border bg-surface text-heading shadow-sm transition-colors hover:bg-icon-box md:flex"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 rtl:rotate-180" aria-hidden>
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Dots */}
      {pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToPage(i)}
              aria-label={`${t.goTo} ${i + 1}`}
              aria-current={i === page}
              className={`h-[6px] rounded-full transition-all duration-300 ${
                i === page ? "w-9 bg-heading" : "w-6 bg-panel-border hover:bg-heading/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FocusAreaTiles({ areas }: { areas?: AreaTile[] }) {
  const { locale } = useLocale();
  const t = translations[locale].focusAreas;
  const isArabic = locale === "ar";
  const textAlign = isArabic ? "text-right" : "text-left";
  const list: AreaTile[] = areas && areas.length ? areas : FOCUS_AREAS;
  const useCarousel = list.length > CAROUSEL_THRESHOLD;

  return (
    <section
      className="bg-surface pt-6 pb-16 md:pt-8 md:pb-24"
      data-nav-surface="light"
      aria-labelledby="focus-heading"
    >
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <div className="mb-12 text-center">
          <h2
            id="focus-heading"
            className="text-[28px] font-medium text-body-1 dark:text-heading md:text-[36px]"
          >
            {t.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-7 text-body-4 md:text-[20px] md:leading-[28px]">
            {t.subheading}
          </p>
        </div>

        {useCarousel ? (
          <FocusAreaCarousel
            list={list}
            locale={locale}
            textAlign={textAlign}
            isArabic={isArabic}
            t={t}
          />
        ) : (
          /* dir=rtl so the first card (المحتاج) sits on the right, as in Figma */
          <div dir="rtl" className="flex flex-wrap justify-center gap-5">
            {list.map((area) => (
              <Tile
                key={area.slug}
                area={area}
                locale={locale}
                textAlign={textAlign}
                isArabic={isArabic}
                exploreCTA={t.exploreCTA}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
