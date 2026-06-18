"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Slide = {
  id: string;
  image: string;
  title: string;
  href: string;
  cta: string;
};

const SLIDES: Slide[] = [
  {
    id: "3",
    image: "/images/slide-show03.png",
    title: "إطلاق برنامج كفالة الأيتام في المنطقة الشرقية",
    href: "/programs",
    cta: "اقرأ المزيد",
  },
  {
    id: "1",
    image: "/images/hero-slide-1.png",
    title: "شراكة استراتيجية مع 15 جهة تنفيذية لتحقيق أثر مستدام",
    href: "/programs",
    cta: "اقرأ المزيد",
  },
  {
    id: "2",
    image: "/images/hero-slide-2.png",
    title: "حفل تكريم الشركاء وداعمي مؤسسة المجدوعي الخيرية",
    href: "/news",
    cta: "اقرأ المزيد",
  },
];

const AUTO_PLAY_MS = 5000;

function ArrowLeft() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path
        fillRule="evenodd"
        d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const [autoplayKey, setAutoplayKey] = useState(0);

  const goToSlide = useCallback((index: number) => {
    setActive(index);
    setAutoplayKey((key) => key + 1);
  }, []);

  const next = useCallback(() => {
    setActive((current) => (current + 1) % SLIDES.length);
    setAutoplayKey((key) => key + 1);
  }, []);

  const prev = useCallback(() => {
    setActive((current) => (current - 1 + SLIDES.length) % SLIDES.length);
    setAutoplayKey((key) => key + 1);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % SLIDES.length);
    }, AUTO_PLAY_MS);

    return () => window.clearInterval(id);
  }, [autoplayKey]);

  return (
    <section
      className="relative -mt-28 -mb-px h-[652px] w-full overflow-hidden md:h-[752px]"
      data-nav-surface="dark"
      aria-label="أبرز الأخبار والمبادرات"
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

      {/* Content — right side, natural RTL alignment (matches Figma) */}
      <div className="relative z-10 flex h-full items-center pt-28">
        <div className="mx-auto w-full max-w-[1280px] px-6">
          <div className="ms-auto max-w-[580px] text-right">
            <h1 className="text-[30px] font-bold leading-[1.45] text-white md:text-[42px] lg:text-[52px] lg:leading-[1.35]">
              {SLIDES[active].title}
            </h1>

            <Link
              href={SLIDES[active].href}
              className="mt-8 inline-flex items-center gap-2.5 rounded-[20px] bg-white px-8 py-3.5 text-[15px] font-medium text-[#0a1f2d] transition-all hover:bg-accent hover:text-white"
            >
              {SLIDES[active].cta}
              <ArrowLeft />
            </Link>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={prev}
        className="absolute inset-e-4 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
        aria-label="الشريحة السابقة"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </button>

      <button
        type="button"
        onClick={next}
        className="absolute inset-s-4 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
        aria-label="الشريحة التالية"
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
            aria-label={`الانتقال إلى الشريحة ${i + 1}`}
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
