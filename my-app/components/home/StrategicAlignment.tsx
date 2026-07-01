"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "@/lib/i18n/context";
import { translations } from "@/lib/i18n/translations";

type Bi = { ar: string; en: string };
type Tab = { label: Bi; left: string; right: string };
export type StrategicAlignmentData = {
  background: string;
  heading: Bi;
  subheading: Bi;
  tabs: Tab[];
};

const DIR = "/images/home/strategicAlignment";

const FALLBACK: StrategicAlignmentData = {
  background: `${DIR}/main-background.png`,
  heading: { ar: "المواءمة الاستراتيجية للأعمال", en: "Strategic Business Alignment" },
  subheading: {
    ar: "مواءمة مبادراتنا وممكناتنا الداخلية مع برامج رؤية المملكة 2030 وأهداف التنمية المستدامة العالمية",
    en: "Aligning our initiatives and internal enablers with Saudi Vision 2030 programs and the global Sustainable Development Goals",
  },
  tabs: [
    {
      label: { ar: "تمكين المحتاج", en: "Empowering the Needy" },
      left: `${DIR}/left-image.png`,
      right: `${DIR}/right-image.png`,
    },
    { label: { ar: "مساجد المجدوعي", en: "Almajdouie Mosques" }, left: "", right: "" },
    { label: { ar: "شركاء التنفيذ", en: "Implementation Partners" }, left: "", right: "" },
    { label: { ar: "ممكنات داخلية", en: "Internal Enablers" }, left: "", right: "" },
  ],
};

export function StrategicAlignment({ data }: { data?: StrategicAlignmentData }) {
  const { locale } = useLocale();
  const t = translations[locale].strategic;
  const d = data ?? FALLBACK;
  const tabs = d.tabs.length ? d.tabs : FALLBACK.tabs;
  const [active, setActive] = useState(0);
  const tab = tabs[active] ?? tabs[0];

  const heading = d.heading?.[locale] || t.heading;
  const subheading = d.subheading?.[locale] || t.subheading;

  return (
    <section
      className="relative overflow-hidden py-16 md:py-24"
      data-nav-surface="solid"
      aria-labelledby="alignment-heading"
    >
      {/* Background photo */}
      {d.background && (
        <Image
          src={d.background}
          alt=""
          fill
          aria-hidden
          className="-z-10 object-cover object-center"
          sizes="100vw"
        />
      )}
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/25" />

      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <h2
            id="alignment-heading"
            className="text-[28px] font-medium leading-[1.2] text-white md:text-[36px]"
          >
            {heading}
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-[15px] leading-[26px] text-white/90 md:text-[18px] md:leading-[28px]">
            {subheading}
          </p>
        </div>

        {/* Tabs — fill when few, horizontal scroll when many */}
        <div className="mx-auto mt-8 w-full max-w-[768px] overflow-x-auto rounded-[20px] bg-[#f3f4f6] p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-2">
            {tabs.map((tb, i) => {
              const on = i === active;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={on}
                  className={`flex-1 basis-0 min-w-[140px] truncate rounded-[16px] px-4 py-3 text-[14px] font-bold transition-colors sm:text-[16px] ${
                    on ? "bg-[#005761] text-white" : "text-[#374151] hover:bg-white/60"
                  }`}
                  title={tb.label?.[locale] || tb.label?.ar}
                >
                  {tb.label?.[locale] || tb.label?.ar}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content card — two images split by a divider */}
        <div className="mx-auto mt-8 w-full max-w-[1200px] rounded-[20px] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] md:mt-10 md:p-10">
          <div className="flex flex-col items-stretch gap-8 md:flex-row md:items-center md:gap-0">
            {/* Right column (RTL start) — SDG goals */}
            <div className="flex flex-1 items-center justify-center px-2 md:px-8">
              {tab.right ? (
                <Image
                  src={tab.right}
                  alt={tab.label?.[locale] || ""}
                  width={483}
                  height={271}
                  className="h-auto w-full max-w-[483px] object-contain"
                  sizes="(max-width: 768px) 90vw, 483px"
                />
              ) : (
                <div className="h-[200px] w-full" />
              )}
            </div>

            {/* Divider */}
            <div aria-hidden className="hidden w-px self-stretch bg-[#f6f5f5] md:block" />

            {/* Left column — Vision 2030 + programs */}
            <div className="flex flex-1 items-center justify-center px-2 md:px-8">
              {tab.left ? (
                <Image
                  src={tab.left}
                  alt={tab.label?.[locale] || ""}
                  width={483}
                  height={271}
                  className="h-auto w-full max-w-[483px] object-contain"
                  sizes="(max-width: 768px) 90vw, 483px"
                />
              ) : (
                <div className="h-[200px] w-full" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
