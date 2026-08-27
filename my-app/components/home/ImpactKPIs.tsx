"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n/context";
import { translations } from "@/lib/i18n/translations";

type BilingualText = { ar: string; en: string };

type KPI = {
  /** Rendered before the number: "+" is part of the figure (guide §12.3). */
  prefix: string;
  value: number;
  suffix: string;
  label: BilingualText;
  year: string;
  iconSrc: string;
};

// No hardcoded fallback: the guide bars publishing any number it does not
// list, so an empty database renders no impact section at all.

function AnimatedNumber({
  prefix,
  target,
  suffix,
}: {
  prefix: string;
  target: number;
  suffix: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1600;
          const steps = 40;
          const increment = target / steps;
          let current = 0;
          const interval = setInterval(() => {
            current = Math.min(current + increment, target);
            setCount(Math.round(current));
            if (current >= target) clearInterval(interval);
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {count.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

export function ImpactKPIs({ items }: { items?: KPI[] } = {}) {
  const { locale } = useLocale();
  const t = translations[locale].kpis;
  const KPIS = items ?? [];

  if (KPIS.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden bg-footer-bg pt-16 pb-8 md:pt-24 md:pb-10"
      data-nav-surface="solid"
      aria-labelledby="kpis-heading"
    >
      <div
        className="pointer-events-none absolute inset-y-0 right-[-10px] top-[-50px] hidden w-[260px] h-[368.053px] lg:block"
        style={{ opacity: 0.3 }}
        aria-hidden
      >
        <Image
          src="/images/home/updated-svgs/about-us-logo.svg"
          alt=""
          className=" -scale-y-100 object-contain object-center"
          fill
        />
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 left-[-15px] top-[-50px] hidden w-[260px] h-[368.053px] lg:block"
        style={{ opacity: 0.3 }}
        aria-hidden
      >
        <Image
          src="/images/home/updated-svgs/about-us-logo.svg"
          alt=""
          fill
          className=" -scale-y-100 -scale-x-100 object-contain object-left"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6">
        <div className="mb-14 text-center">
          <h2 id="kpis-heading" className="text-3xl font-bold text-white md:text-4xl">
            {t.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-white/70">
            {t.subheading}
          </p>
        </div>

        <div
          className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-2"
          dir="ltr"
        >
          {KPIS.map((kpi) => (
            <div key={kpi.label.ar} className="flex flex-col items-center text-center text-white">
              <div className="mb-4 hidden h-[32px] w-[32px] items-center justify-center lg:flex">
                <Image
                  src={kpi.iconSrc}
                  alt=""
                  width={32}
                  height={32}
                  className="h-[32px] w-[32px] object-contain"
                  aria-hidden
                />
              </div>

              <div
                className="flex items-center justify-center"
                style={{ minWidth: 86, height: 40, marginTop: -5.08 }}
              >
                <p
                  className="font-bold tabular-nums text-white"
                  style={{
                    fontSize: 36,
                    lineHeight: "40px",
                    letterSpacing: 0,
                  }}
                >
                  <AnimatedNumber prefix={kpi.prefix} target={kpi.value} suffix={kpi.suffix} />
                </p>
              </div>

              <p
                className="mt-4 line-clamp-3 break-words text-base font-normal leading-6 text-white"
                dir="rtl"
              >
                {kpi.label[locale]}
              </p>
            </div>
          ))}
        </div>

        {/* Mandatory under the grid (guide §3.6): the figures are only publishable
            with their source stated, and no figure changes without a written
            notice from Communications. */}
        <div className="mt-12 flex flex-col items-center gap-5">
          <p className="text-sm text-white/70">{t.source}</p>
          <Link
            href="/reports"
            className="rounded-full border border-white/30 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            {t.reportCTA}
          </Link>
        </div>
      </div>
    </section>
  );
}
