"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { type NewsItem } from "@/lib/news";

export function NewsHero({ items }: { items: NewsItem[] }) {
  const SLIDES = items.filter((n) => n.featured).concat(items.filter((n) => !n.featured)).slice(0, 5);
  const [active, setActive] = useState(0);
  const count = SLIDES.length;
  const item = SLIDES[Math.min(active, count - 1)];
  const go = (dir: 1 | -1) => setActive((a) => (a + dir + count) % count);

  if (count === 0) return null;

  return (
    <section
      className="relative -mt-28 h-[560px] w-full overflow-hidden md:h-[680px]"
      data-nav-surface="dark"
      aria-label="آخر الأخبار"
    >
      {SLIDES.map((s, i) => (
        <Image
          key={s.slug}
          src={s.image}
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/50 to-black/30" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1280px] flex-col justify-center px-4 pt-28 text-right sm:px-6 lg:px-8">
        <div className="max-w-[640px]">
          <h1 className="text-[32px] font-bold leading-[1.25] text-white md:text-[48px]">
            {item.title}
          </h1>
          <Link
            href={`/news/${item.slug}`}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#005761] px-6 py-3 text-[15px] font-bold text-white transition-colors hover:bg-[#00444c]"
          >
            اقرأ المزيد
            <ArrowLeft className="size-4" />
          </Link>
        </div>
      </div>

      {/* Prev / next — desktop only */}
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="السابق"
        className="absolute right-4 top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25 md:flex md:size-14"
      >
        <ChevronRight className="size-6" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="التالي"
        className="absolute left-4 top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25 md:flex md:size-14"
      >
        <ChevronLeft className="size-6" />
      </button>

      {/* Dots */}
      <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.slug}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`الشريحة ${i + 1}`}
            className={`h-2 rounded-full transition-all ${i === active ? "w-8 bg-white" : "w-2 bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}
