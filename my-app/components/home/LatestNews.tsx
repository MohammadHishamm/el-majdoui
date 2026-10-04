"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/lib/i18n/context";
import { translations } from "@/lib/i18n/translations";

type BilingualText = { ar: string; en: string };

type NewsItem = {
  id: string;
  slug: string;
  title: BilingualText;
  excerpt: BilingualText;
  date: BilingualText;
  image: string;
};

function NewsCard({ item, locale }: { item: NewsItem; locale: "ar" | "en" }) {
  return (
    <Link
      href={`/news/${item.slug}`}
      draggable={false}
      className="group flex w-[300px] shrink-0 flex-col overflow-hidden rounded-2xl bg-panel shadow-sm ring-1 ring-panel-border transition-all hover:-translate-y-1 hover:shadow-lg sm:w-[340px]"
    >
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={item.image}
          alt={item.title[locale]}
          fill
          draggable={false}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="340px"
        />
      </div>

      <div className="flex flex-1 flex-col p-5 text-right">
        <div className="mb-3 flex items-center gap-2 text-xs text-body-3">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          {item.date[locale]}
        </div>
        <h3 className="line-clamp-2 text-base font-bold leading-6 text-body-1 transition-colors group-hover:text-heading dark:text-heading">
          {item.title[locale]}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-body-4">{item.excerpt[locale]}</p>
      </div>
    </Link>
  );
}

export function LatestNews({ items: list }: { items: NewsItem[] }) {
  const { locale } = useLocale();
  const t = translations[locale].news;
  // ~4.5s of travel per card keeps the speed constant regardless of how many there are.
  const duration = Math.max(24, Math.round(list.length * 4.5));
  // The loop wraps scrollLeft by one group width, so the strip must scroll at
  // least one group past the viewport. Cards are ≥324px with their gap and the
  // viewport ≤1232px, so the copies after the first need ≥4 cards between them.
  const copies = 1 + Math.ceil(4 / list.length);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLUListElement>(null);

  // Auto-scroll by moving scrollLeft rather than a CSS transform, so the strip
  // stays a real scroll container: swipe, trackpad and mouse drag all work and
  // auto-scroll picks up from wherever the visitor left it. The group is
  // rendered several times (see copies); scrollLeft wraps by one group width for an endless loop.
  useEffect(() => {
    const el = scrollerRef.current;
    const group = groupRef.current;
    if (!el || !group) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const GAP = 24;
    const RESUME_MS = 2500;
    const loop = () => group.offsetWidth + GAP;
    let pos = el.scrollLeft;
    let hovering = false;
    let holding = false;
    let idleUntil = 0;
    let last = performance.now();
    let raf = 0;

    const wrap = () => {
      const w = loop();
      if (w <= GAP) return;
      if (pos >= w) pos -= w;
      else if (pos < 0) pos += w;
      el.scrollLeft = pos;
    };
    const nudge = () => {
      idleUntil = performance.now() + RESUME_MS;
    };

    const tick = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      if (!hovering && !holding && now >= idleUntil && !el.contains(document.activeElement)) {
        pos += (loop() / duration) * (dt / 1000);
        wrap();
      }
      raf = requestAnimationFrame(tick);
    };

    // A scroll we did not cause (swipe, trackpad, drag) becomes the new position.
    const onScroll = () => {
      if (Math.abs(el.scrollLeft - pos) > 1) {
        pos = el.scrollLeft;
        wrap();
        nudge();
      }
    };

    // Mouse drag; touch and pen keep the browser's native swipe.
    let dragStartX = 0;
    let dragStartPos = 0;
    let dragging = false;
    let dragged = false;
    const onPointerDown = (e: PointerEvent) => {
      // Hover already pauses for a mouse; a finger on the strip holds it still.
      if (e.pointerType !== "mouse") {
        holding = true;
        return;
      }
      if (e.button !== 0) return;
      dragging = true;
      dragged = false;
      dragStartX = e.clientX;
      dragStartPos = pos;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - dragStartX;
      if (!dragged && Math.abs(dx) > 5) {
        dragged = true;
        try {
          el.setPointerCapture(e.pointerId);
        } catch {}
        el.classList.add("is-dragging");
      }
      if (dragged) {
        pos = dragStartPos - dx;
        wrap();
      }
    };
    const onPointerUp = () => {
      holding = false;
      dragging = false;
      el.classList.remove("is-dragging");
      nudge();
    };
    // A drag must not also follow the card link it started on.
    const onClickCapture = (e: MouseEvent) => {
      if (dragged) {
        e.preventDefault();
        e.stopPropagation();
        dragged = false;
      }
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hovering = true;
    };
    const onLeave = () => {
      hovering = false;
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("wheel", nudge, { passive: true });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("click", onClickCapture, true);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", nudge);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, [duration, list.length]);

  return (
    <section
      className="bg-surface pt-9 pb-16 md:pt-12 md:pb-24"
      data-nav-surface="light"
      aria-labelledby="news-heading"
    >
      {/* Decorative divider — full page width */}
      <div
        className="mx-auto mb-12 h-11 w-full px-6 opacity-70"
        style={{
          backgroundImage: "url('/images/home/updated-svgs/horizontal-art.svg')",
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 100%",
          backgroundPosition: "center",
        }}
        aria-hidden
      />

      <div className="mx-auto w-full max-w-[1280px] px-6">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="text-right">
            <h2 id="news-heading" className="text-3xl font-bold text-body-1 dark:text-heading md:text-4xl">
              {t.heading}
            </h2>
            {t.subheading && <p className="mt-2 text-base text-body-4">{t.subheading}</p>}
          </div>
          <Link
            href="/news"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-btn-2-stroke px-6 py-2.5 text-sm font-semibold text-btn-2-text transition-colors hover:bg-btn-primary hover:text-btn-primary-text"
          >
            {t.allNewsCTA}
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 rtl:rotate-180">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        {/* Auto-scrolling carousel that is also scrollable by hand — pauses on
            hover and while being scrolled; no auto-scroll for reduced motion */}
        <div ref={scrollerRef} className="news-marquee">
          <div className="news-marquee__track">
            <ul ref={groupRef} className="news-marquee__group">
              {list.map((item) => (
                <li key={item.id}>
                  <NewsCard item={item} locale={locale} />
                </li>
              ))}
            </ul>
            {Array.from({ length: copies - 1 }, (_, c) => (
              <ul key={c} className="news-marquee__group" aria-hidden>
                {list.map((item) => (
                  <li key={`dup-${c}-${item.id}`}>
                    <NewsCard item={item} locale={locale} />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .news-marquee {
          overflow-x: auto;
          overscroll-behavior-x: contain;
          direction: ltr;
          cursor: grab;
          scrollbar-width: none;
          -webkit-mask-image: linear-gradient(to right, transparent, #000 4%, #000 96%, transparent);
          mask-image: linear-gradient(to right, transparent, #000 4%, #000 96%, transparent);
        }
        .news-marquee::-webkit-scrollbar { display: none; }
        .news-marquee.is-dragging { cursor: grabbing; user-select: none; }
        .news-marquee.is-dragging a { pointer-events: none; }
        .news-marquee__track {
          display: flex;
          gap: 24px;
          width: max-content;
          padding-block: 4px 16px;
        }
        .news-marquee__group {
          display: flex;
          gap: 24px;
          flex-shrink: 0;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .news-marquee {
            -webkit-mask-image: none;
            mask-image: none;
          }
          .news-marquee__group[aria-hidden] { display: none; }
        }
      `}</style>
    </section>
  );
}
