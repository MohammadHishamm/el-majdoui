"use client";

import { useState } from "react";
import { FadeInUp } from "@/components/ui/fade-in-up";
import { BrandGuideTabs, brandGuideTheme, type BrandGuide } from "@/components/brand/BrandGuideTabs";

type BrandIdentityViewProps = {
  eyebrow: string;
  title: string;
  intro: string;
  tabsHeading: string;
  guides: BrandGuide[];
};

export function BrandIdentityView({
  eyebrow,
  title,
  intro,
  tabsHeading,
  guides,
}: BrandIdentityViewProps) {
  const [activeKey, setActiveKey] = useState<BrandGuide["key"]>(guides[0]?.key ?? "foundation");
  const t = brandGuideTheme[activeKey];

  return (
    <>
      <section className="-mt-28 bg-surface pt-40 md:pt-44">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <p className="text-right text-[14px] font-medium leading-none text-body-3">{eyebrow}</p>
            <h1
              className={`mt-4 text-right text-[36px] font-medium leading-[40px] transition-colors md:text-[40px] ${t.heading}`}
            >
              {title}
            </h1>
            <p className="mt-5 max-w-3xl text-right text-[16px] leading-[29px] text-body-2">{intro}</p>
            <div className={`mt-8 h-px w-full transition-colors ${t.divider}`} />
          </FadeInUp>
        </div>
      </section>

      <BrandGuideTabs
        guides={guides}
        heading={tabsHeading}
        activeKey={activeKey}
        onActiveKeyChange={setActiveKey}
      />
    </>
  );
}
