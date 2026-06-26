"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/context";
import { translations } from "@/lib/i18n/translations";

export function AboutBlock() {
  const { locale } = useLocale();
  const t = translations[locale].about;

  return (
    <section
      className="relative overflow-hidden bg-[#f9fafb] py-16 md:py-24"
      data-nav-surface="light"
      aria-labelledby="about-heading"
    >
      {/* Decorative botanical motifs — faint, desktop only (matches Figma) */}
      {/* Physical LEFT — top corner, ~480×340 @ 25% */}
      <div
        className="pointer-events-none absolute left-[-80px] top-[-40px] hidden h-[340px] w-[480px] opacity-25 md:block"
        aria-hidden
      >
        <Image
          src="/images/about-left.png"
          alt=""
          fill
          className="object-contain object-left-top"
          sizes="480px"
        />
      </div>

      {/* Physical RIGHT — ~320×320 @ 30% */}
      <div
        className="pointer-events-none absolute right-[-60px] top-[41px] hidden size-[320px] opacity-30 md:block"
        aria-hidden
      >
        <Image
          src="/images/about-right.png"
          alt=""
          fill
          className="object-contain object-right-top"
          sizes="320px"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[896px] px-6 text-center">
        <h2
          id="about-heading"
          className="text-[28px] font-medium leading-[1.2] text-[#005761] md:text-[36px]"
        >
          {t.heading}
        </h2>

        <p className="mx-auto mt-6 max-w-[896px] text-[16px] leading-[1.7] text-[#364153] md:text-[20px] md:leading-[32.5px]">
          {t.body}
        </p>

        <Link
          href="/about/who-we-are"
          dir="rtl"
          className="mt-9 inline-flex items-center gap-2 rounded-full border-[1.18px] border-[#005761] bg-white px-6 py-2.5 text-[14px] font-bold text-[#005761] transition-colors hover:bg-[#005761] hover:text-white"
        >
          {t.cta}
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden>
            <path
              fillRule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
