"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n/context";
import { translations } from "@/lib/i18n/translations";

type BilingualText = { ar: string; en: string };

type KPI = {
  value: number;
  suffix: string;
  label: BilingualText;
  year: string;
  iconSrc: string;
};

const KPIS: KPI[] = [
  {
    value: 85,
    suffix: "%",
    label: { ar: "نسبة الاستدامة", en: "Sustainability Rate" },
    year: "2024",
    iconSrc: "/images/figma/sections/stats-sixth-logo.svg",
  },
  {
    value: 3200,
    suffix: "",
    label: { ar: "فرصة عمل", en: "Job Opportunities" },
    year: "2024",
    iconSrc: "/images/figma/sections/stats-fifth-logo.svg",
  },
  {
    value: 15,
    suffix: "",
    label: { ar: "شريك تنفيذي", en: "Executive Partners" },
    year: "2024",
    iconSrc: "/images/figma/sections/stats-fourth-logo.svg",
  },
  {
    value: 120,
    suffix: "",
    label: { ar: "كربة مفرجة", en: "Hardships Relieved" },
    year: "2024",
    iconSrc: "/images/figma/sections/stats-heart-logo.svg",
  },
  {
    value: 2500,
    suffix: "",
    label: { ar: "أسرة مُمكّنة", en: "Empowered Families" },
    year: "2024",
    iconSrc: "/images/figma/sections/stats-second-logo.png",
  },
  {
    value: 45,
    suffix: "",
    label: { ar: "مسجد نموذجي", en: "Model Mosques" },
    year: "2024",
    iconSrc: "/images/figma/sections/stats-first-logo.svg",
  },
];

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
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
      {count.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

export function ImpactKPIs() {
  const { locale } = useLocale();
  const t = translations[locale].kpis;

  return (
    <section
      className="relative overflow-hidden bg-footer-bg pt-16 pb-8 md:pt-24 md:pb-10"
      data-nav-surface="solid"
      aria-labelledby="kpis-heading"
    >
      <div
        className="pointer-events-none absolute inset-y-0 right-[-250px] top-[-30px] hidden h-[70%] w-1/2 lg:block"
        style={{ opacity: 0.3 }}
        aria-hidden
      >
        <Image
          src="/images/figma/sections/stats-right.png"
          alt=""
          fill
          className="-scale-x-100 object-contain object-center"
          sizes="320px"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 left-[-75px] top-[-30px] hidden h-[70%] w-1/2 lg:block"
        style={{ opacity: 0.3 }}
        aria-hidden
      >
        <Image
          src="/images/figma/sections/stats-left.png"
          alt=""
          fill
          className="object-contain object-left"
          sizes="(max-width: 768px) 100vw, 50vw"
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
                  <AnimatedNumber target={kpi.value} suffix={kpi.suffix} />
                </p>
              </div>

              <p
                className="mt-4 text-base font-normal leading-6 text-white"
                dir="rtl"
              >
                {kpi.label[locale]}
              </p>
              <p className="mt-1 text-sm font-normal leading-5 text-white/70">{kpi.year}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
