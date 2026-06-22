"use client";

import Image from "next/image";
import { useLocale } from "@/lib/i18n/context";
import { translations } from "@/lib/i18n/translations";

const PORTRAIT_WIDTH = 506;

const TEXT_WIDTH = 592.02;
const QUOTE_HEIGHT = 116.96;
const ATTRIBUTION_HEIGHT = 77.2;
const ATTRIBUTION_PADDING_TOP = 25.17;
const ATTRIBUTION_BORDER_TOP = 1.18;

export function LeadershipSpotlight() {
  const { locale } = useLocale();
  const t = translations[locale].leadership;

  return (
    <section
      className="relative overflow-hidden bg-white py-20 md:py-28"
      data-nav-surface="light"
      aria-labelledby="leadership-heading"
    >
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-between">
          {/* Portrait — right in RTL */}
          <div
            className="relative w-full shrink-0 overflow-visible pb-10 max-lg:max-w-[min(100%,380px)] lg:pb-[67px]"
            style={{
              width: PORTRAIT_WIDTH,
              maxWidth: "100%",
            }}
          >
            <div className="relative aspect-[506/467] w-full overflow-hidden rounded-tr-[75px] max-lg:max-w-full lg:h-[467px] lg:w-[506px] lg:aspect-auto">
              <Image
                src="/images/figma/sections/leadership.jpg"
                alt={t.imageAlt}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 90vw, 506px"
                priority
              />
            </div>

            <div
              className="absolute bottom-0 left-0 z-10 flex h-[100px] w-[100px] items-center justify-center rounded-bl-[22px] bg-footer-bg p-2 shadow-lg max-lg:translate-x-2 lg:bottom-auto lg:left-[-91px] lg:top-[352px] lg:h-[182px] lg:w-[182px] lg:translate-x-0 lg:rounded-bl-[30px] lg:p-[13px]"
              aria-hidden
            >
              <Image
                src="/images/figma/sections/vector0.svg"
                alt=""
                width={141}
                height={141}
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          {/* Quote — left in RTL */}
          <div
            className="w-full shrink-0 text-right"
            style={{ maxWidth: TEXT_WIDTH }}
          >
            <Image
              src="/images/figma/sections/qoutation.svg"
              alt=""
              width={22}
              height={18}
              className="mb-6 me-auto block"
              aria-hidden
            />

            <blockquote
              id="leadership-heading"
              className="text-right font-normal text-text-dark"
              style={{ fontSize: 24, lineHeight: "39px", minHeight: QUOTE_HEIGHT }}
            >
              {t.quote}
            </blockquote>

            <footer
              className="text-right"
              style={{
                marginTop: 24,
                paddingTop: ATTRIBUTION_PADDING_TOP,
                borderTopWidth: ATTRIBUTION_BORDER_TOP,
                borderTopStyle: "solid",
                borderTopColor: "rgba(0, 0, 0, 0.12)",
                minHeight: ATTRIBUTION_HEIGHT,
              }}
            >
              <p className="text-right font-medium leading-10 text-primary" style={{ fontSize: 36 }}>
                {t.name}
              </p>
              <p className="mt-2 text-right font-medium leading-10 text-text-muted" style={{ fontSize: 24 }}>
                {t.role}
              </p>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}
