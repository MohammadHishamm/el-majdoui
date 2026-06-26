"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/context";
import { translations } from "@/lib/i18n/translations";

type Slide = {
  id: string;
  image: string;
  title: { ar: string; en: string };
  href: string;
};

const DEFAULT_SLIDES: Slide[] = [
  {
    id: "3",
    image: "/images/slide-show03.png",
    title: {
      ar: "إطلاق برنامج كفالة الأيتام في المنطقة الشرقية",
      en: "Launching the Orphan Sponsorship Program in the Eastern Province",
    },
    href: "/programs",
  },
  {
    id: "1",
    image: "/images/hero-slide-1.png",
    title: {
      ar: "شراكة استراتيجية مع 15 جهة تنفيذية لتحقيق أثر مستدام",
      en: "Strategic Partnership with 15 Implementing Entities for Sustainable Impact",
    },
    href: "/programs",
  },
  {
    id: "2",
    image: "/images/hero-slide-2.png",
    title: {
      ar: "حفل تكريم الشركاء وداعمي مؤسسة المجدوعي الخيرية",
      en: "Almajdouie Foundation Partners & Supporters Appreciation Ceremony",
    },
    href: "/news",
  },
];

const AUTO_PLAY_MS = 5000;

function ArrowLeft() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="block h-4 w-4 shrink-0" aria-hidden>
      <path
        fillRule="evenodd"
        d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="block h-4 w-4 shrink-0" aria-hidden>
      <path
        fillRule="evenodd"
        d="M1 8a.5.5 0 0 1 .5-.5h11.793L10.146 4.854a.5.5 0 1 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function HeroSlider({ slides }: { slides?: Slide[] } = {}) {
  const SLIDES = slides && slides.length ? slides : DEFAULT_SLIDES;
  const [active, setActive] = useState(0);
  const [autoplayKey, setAutoplayKey] = useState(0);
  const { locale } = useLocale();
  const t = translations[locale].hero;
  const isArabic = locale === "ar";

  const goToSlide = useCallback((index: number) => {
    setActive(index);
    setAutoplayKey((key) => key + 1);
  }, []);

  const next = useCallback(() => {
    setActive((current) => (current + 1) % SLIDES.length);
    setAutoplayKey((key) => key + 1);
  }, [SLIDES.length]);

  const prev = useCallback(() => {
    setActive((current) => (current - 1 + SLIDES.length) % SLIDES.length);
    setAutoplayKey((key) => key + 1);
  }, [SLIDES.length]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % SLIDES.length);
    }, AUTO_PLAY_MS);

    return () => window.clearInterval(id);
  }, [autoplayKey, SLIDES.length]);

  return (
    <section
      className="relative -mt-28 -mb-px h-[652px] w-full overflow-hidden md:h-[752px]"
      data-nav-surface="dark"
      aria-label={t.sectionLabel}
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === active ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden={i !== active}
        >
          <Image
            src={slide.image}
            alt=""
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />

          {/*
           * Gradient: dark on the RIGHT where the Arabic text sits (RTL),
           * lighter toward the left — matches Figma hero overlays.
           */}
          <div
            className="absolute inset-0"
            style={{
              background: [
                "linear-gradient(to bottom, rgba(10,31,45,0.96) 0%, rgba(10,31,45,0.72) 20%, transparent 40%)",
                "linear-gradient(255deg, rgba(10,31,45,0.92) 0%, rgba(0,87,97,0.55) 55%, transparent 80%)",
                "linear-gradient(to top, rgba(10,31,45,0.85) 0%, transparent 12%)",
              ].join(", "),
            }}
          />
        </div>
      ))}

      {/* Content — right in Arabic, left in English (layout locked per locale) */}
      <div className="relative z-10 flex h-full items-center pt-28">
        <div className="mx-auto w-full max-w-[1280px] px-6">
          <div
            key={active}
            className={`animate-slide-up max-w-[580px] ${isArabic ? "ms-auto text-right" : "text-left"}`}
            dir={isArabic ? "rtl" : "ltr"}
          >
            <h1 className="text-[30px] font-bold leading-[1.45] text-white md:text-[42px] lg:text-[52px] lg:leading-[1.35]">
              {SLIDES[active].title[locale]}
            </h1>

            <Link
              href={SLIDES[active].href}
              className="mt-8 inline-flex items-center gap-2 rounded-[20px] bg-white px-8 py-3.5 text-[15px] font-medium leading-none text-[#0a1f2d] transition-all hover:bg-accent hover:text-white"
            >
              <span>{t.readMore}</span>
              {isArabic ? <ArrowLeft /> : <ArrowRight />}
            </Link>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={prev}
        className="absolute inset-e-4 top-1/2 z-20 hidden -translate-y-1/2 md:flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
        aria-label={t.prevSlide}
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </button>

      <button
        type="button"
        onClick={next}
        className="absolute inset-s-4 top-1/2 z-20 hidden -translate-y-1/2 md:flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
        aria-label={t.nextSlide}
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goToSlide(i)}
            aria-label={`${t.goToSlide} ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === active
                ? "h-[6px] w-9 bg-white"
                : "h-[6px] w-6 bg-white/35 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
