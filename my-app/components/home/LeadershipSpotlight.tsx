"use client";

import Image from "next/image";
import { useLocale } from "@/lib/i18n/context";
import { translations } from "@/lib/i18n/translations";

const PORTRAIT_WIDTH = 506;
const PORTRAIT_HEIGHT = 467;

const DECO_BOX_SIZE = 182;
const DECO_BOX_PADDING = 13;
const DECO_BOX_RADIUS_BL = 30;
const DECO_BOX_LEFT = -91;
const DECO_BOX_TOP = 352;

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
            className="relative shrink-0 overflow-visible pb-[67px]"
            style={{
              width: PORTRAIT_WIDTH,
              maxWidth: "100%",
            }}
          >
            <div
              className="relative overflow-hidden rounded-tr-[75px]"
              style={{
                width: PORTRAIT_WIDTH,
                height: PORTRAIT_HEIGHT,
                maxWidth: "100%",
              }}
            >
              <Image
                src="/images/figma/sections/leadership.jpg"
                alt={t.imageAlt}
                fill
                className="object-cover object-top"
                sizes={`${PORTRAIT_WIDTH}px`}
                priority
              />
            </div>

            <div
              className="absolute flex items-center justify-center bg-primary shadow-lg"
              style={{
                width: DECO_BOX_SIZE,
                height: DECO_BOX_SIZE,
                padding: DECO_BOX_PADDING,
                borderBottomLeftRadius: DECO_BOX_RADIUS_BL,
                left: DECO_BOX_LEFT,
                top: DECO_BOX_TOP,
              }}
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
