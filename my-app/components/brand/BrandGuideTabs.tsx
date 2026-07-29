"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { FadeInUp } from "@/components/ui/fade-in-up";
import { ColorSwatches } from "@/components/brand/ColorSwatches";
import { DownloadIcon } from "@/components/brand/DownloadIcon";

export type LogoLink = { text: string; href: string };
export type LogoCard = { image: string; label: string; variant: "light" | "dark"; links: LogoLink[] };
export type Color = { name: string; hex: string };

export type BrandGuide = {
  /** Stable key — also drives the accent theme. */
  key: "foundation" | "mosques";
  tab_label: string;
  pdf_title: string;
  pdf_subtitle: string;
  pdf_file: string;
  logos_heading: string;
  colors_heading: string;
  logos: LogoCard[];
  colors?: Color[];
};

/* Each sub-brand keeps its own accent. The foundation uses the site's semantic
   tokens; مساجد المجدوعي uses the maroon/gold palette from the brand guide. */
const THEME = {
  foundation: {
    banner: "bg-[#005761]",
    bannerButton: "bg-white text-[#005761] hover:bg-white/90",
    heading: "text-heading",
    label: "text-heading",
    linkText: "text-btn-2-text",
    border: "border-panel-border",
    divider: "bg-panel-border",
    darkCard: "bg-[#0A1F2D]",
    tabActive: "bg-[#005761] text-white",
    tabInactive: "bg-surface-alt text-heading hover:bg-icon-box",
  },
  mosques: {
    banner: "bg-[#883C4E]",
    bannerButton: "bg-[#AA946F] text-white hover:bg-[#AA946F]/90",
    heading: "text-[#883C4E]",
    label: "text-[#883C4E]",
    linkText: "text-[#883C4E]",
    border: "border-[#883C4E]",
    divider: "bg-[#883C4E]",
    darkCard: "bg-[#010F19]",
    tabActive: "bg-[#883C4E] text-white",
    tabInactive: "bg-surface-alt text-[#005761] dark:text-mosque-accent hover:bg-icon-box",
  },
} as const;

export const brandGuideTheme = THEME;

export function BrandGuideTabs({
  guides,
  heading,
  activeKey: controlledKey,
  onActiveKeyChange,
}: {
  guides: BrandGuide[];
  heading: string;
  activeKey?: BrandGuide["key"];
  onActiveKeyChange?: (key: BrandGuide["key"]) => void;
}) {
  const [internalKey, setInternalKey] = useState(guides[0]?.key);
  const activeKey = controlledKey ?? internalKey;
  const setActiveKey = (key: BrandGuide["key"]) => {
    onActiveKeyChange?.(key);
    if (controlledKey === undefined) setInternalKey(key);
  };
  const active = guides.find((g) => g.key === activeKey) ?? guides[0];
  const baseId = useId();

  if (!active) return null;
  const t = THEME[active.key];

  return (
    <>
      {/* Tab switcher */}
      <section className="bg-surface pt-8">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <h2 className={`text-right text-[22px] font-bold leading-[28px] ${t.heading}`}>
                {heading}
              </h2>
              <div role="tablist" aria-label={heading} className="flex flex-wrap gap-3">
                {guides.map((guide) => {
                  const isActive = guide.key === active.key;
                  const gt = THEME[guide.key];
                  return (
                    <button
                      key={guide.key}
                      type="button"
                      role="tab"
                      id={`${baseId}-tab-${guide.key}`}
                      aria-selected={isActive}
                      aria-controls={`${baseId}-panel-${guide.key}`}
                      onClick={() => setActiveKey(guide.key)}
                      className={`rounded-full border px-5 py-3 text-[15px] font-bold leading-[22.5px] transition-colors ${t.border} ${isActive ? gt.tabActive : gt.tabInactive}`}
                    >
                      {guide.tab_label}
                    </button>
                  );
                })}
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      <div
        role="tabpanel"
        id={`${baseId}-panel-${active.key}`}
        aria-labelledby={`${baseId}-tab-${active.key}`}
      >
        {/* PDF guide banner — it exists only to hand over the file, so it stays out
            of the page until a guide has actually been uploaded for this brand. */}
        {active.pdf_file && (
        <section className="bg-surface pt-10">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <FadeInUp>
              <div
                className={`flex flex-col items-stretch gap-6 rounded-[12px] px-6 py-7 text-right md:flex-row md:items-center md:justify-between md:px-9 md:py-8 ${t.banner}`}
              >
                <div>
                  <h3 className="text-[18px] font-bold leading-[27px] text-white">{active.pdf_title}</h3>
                  <p className="mt-1 text-[14px] leading-[21px] text-white/90">{active.pdf_subtitle}</p>
                </div>
                <a
                  href={active.pdf_file}
                  download
                  className={`inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-[20px] px-6 py-3 text-[15px] font-bold leading-none transition-colors md:self-auto ${t.bannerButton}`}
                >
                  <span className="translate-y-0.5 h-3">تحميل الدليل كاملاً PDF</span>
                  <DownloadIcon size={20} />
                </a>
              </div>
            </FadeInUp>
          </div>
        </section>
        )}

        {/* Official logo & usages */}
        <section className="bg-surface pt-16" aria-labelledby={`${baseId}-logos`}>
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <FadeInUp>
              <h2
                id={`${baseId}-logos`}
                className={`mb-8 text-right text-[24px] font-bold leading-[33px] ${t.heading}`}
              >
                {active.logos_heading}
              </h2>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {active.logos.map((card, ci) => (
                  <div key={ci} className="flex flex-col">
                    <div
                      className={`flex h-[279.995px] shrink-0 items-center justify-center self-stretch rounded-[0_120px_0_0] ${card.variant === "dark" ? t.darkCard : "bg-[#F9FAFB]"}`}
                    >
                      {card.image && (
                        <Image
                          src={card.image}
                          alt={card.label}
                          width={400}
                          height={160}
                          sizes="(max-width: 1024px) 80vw, 400px"
                          className="max-h-[180px] w-auto object-contain"
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-3 px-5 pb-5 pt-5">
                      <p className={`text-right text-[14px] font-bold leading-[21px] ${t.label}`}>
                        {card.label}
                      </p>
                      <div className="flex flex-wrap justify-start gap-2">
                        {(card.links ?? []).filter((link) => link.href).map((link, li) => (
                          <a
                            key={li}
                            href={link.href}
                            download
                            className={`inline-flex items-center gap-1.5 rounded-full border-[1.18px] px-3 py-[9px] text-[12px] font-bold transition-colors hover:bg-icon-box ${t.border} ${t.linkText}`}
                          >
                            <DownloadIcon size={14} />
                            {link.text}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </FadeInUp>
          </div>
        </section>

        {/* Approved colors */}
        <section className="bg-surface py-16 md:py-20" aria-labelledby={`${baseId}-colors`}>
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <FadeInUp>
              <h2
                id={`${baseId}-colors`}
                className={`mb-8 text-right text-[24px] font-bold leading-[33px] ${t.heading}`}
              >
                {active.colors_heading}
              </h2>
              <ColorSwatches colors={active.colors} hexClassName={t.heading} borderClassName={t.border} />
            </FadeInUp>
          </div>
        </section>
      </div>
    </>
  );
}
