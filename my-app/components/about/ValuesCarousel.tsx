"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";

export type ValueCardData = { title: string; description: string; icon: string };

function ValueCard({ title, description, icon }: ValueCardData) {
  return (
    <article className="h-full rounded-[16px] border-[1.18px] border-heading bg-panel p-6 shadow-[0_1px_1.5px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.03)]">
      {icon && (
        <div className="mb-4 flex">
          <div className="flex size-12 items-center justify-center rounded-[12px] bg-icon-box">
            <Image src={icon} alt="" width={24} height={24} aria-hidden />
          </div>
        </div>
      )}
      <h3 className="text-right text-[20px] font-bold leading-[30px] text-heading">{title}</h3>
      <p className="mt-3 text-right text-[16px] leading-[27px] text-body-1">{description}</p>
    </article>
  );
}

/**
 * A real horizontal scroller rather than a transformed track, matching the
 * pattern already used by FocusAreaTiles: the arrow calls scrollBy, so the
 * browser does the smooth scrolling, scroll snapping lines the cards up, and
 * touch/trackpad swiping works without any extra code.
 */
export function ValuesCarousel({ values }: { values: ValueCardData[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [atEnd, setAtEnd] = useState(false);
  const [overflows, setOverflows] = useState(false);

  const measure = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    // In RTL the browser reports scrollLeft as 0 at the start and increasingly
    // negative towards the end, so compare on distance travelled.
    setOverflows(maxScroll > 1);
    setAtEnd(maxScroll <= 1 || Math.abs(el.scrollLeft) >= maxScroll - 1);
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

  if (values.length === 0) return null;

  const advance = () => {
    const el = scrollerRef.current;
    if (!el) return;
    if (atEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    // RTL: moving towards the end of the list means scrolling left (negative).
    el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        dir="rtl"
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 scrollbar-none lg:gap-6"
      >
        {values.map((value, i) => (
          <div
            key={i}
            className="shrink-0 snap-start basis-full sm:basis-[calc(50%-10px)] lg:basis-[calc(33.333%-16px)]"
          >
            <ValueCard title={value.title} description={value.description} icon={value.icon} />
          </div>
        ))}
      </div>

      {overflows && (
        <button
          type="button"
          onClick={advance}
          aria-label={atEnd ? "عرض القيم السابقة" : "عرض المزيد من القيم"}
          className="absolute -left-[76px] top-1/2 z-20 hidden size-[60px] -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30 lg:flex"
        >
          {/* At the end the only move left is back to the start, so the chevron
              turns round rather than pointing somewhere it will not go. */}
          <ChevronLeft
            className={`size-7 transition-transform duration-300 motion-reduce:transition-none ${
              atEnd ? "rotate-180" : ""
            }`}
            strokeWidth={2}
          />
        </button>
      )}
    </div>
  );
}
