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
      className="relative overflow-hidden bg-bg-light py-20 md:py-28"
      data-nav-surface="light"
      aria-labelledby="about-heading"
    >
      {/*
       * Decorative side images — both at 30% opacity so they are very faint
       * like in the Figma reference.
       * In RTL:  inset-s-0 = physical right,  inset-e-0 = physical left
       */}

      {/* Physical RIGHT — about-right.png */}
      <div
        className="pointer-events-none absolute inset-y-0 right-[-65px] inset-s-0 w-[360px] lg:w-[320px]"
        style={{ opacity: 0.3 }}
        aria-hidden
      >
        <Image
          src="/images/about-right.png"
          alt=""
          fill
          className="object-contain object-center"
          sizes="320px"
        />
      </div>

      {/* Physical LEFT — about-left.png */}
      <div
        className="pointer-events-none absolute inset-y-0 left-[-75px] top-[-30px] w-1/2 h-[70%]"
        style={{ opacity: 0.3 }}
        aria-hidden
      >
        <Image
          src="/images/about-left.png"
          alt=""
          fill
          className="object-contain object-left"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[960px] px-6 text-center">
        <h2
          id="about-heading"
          className="text-[40px] leading-[1.35] text-primary md:text-[44px]"
          style={{ fontWeight: 500 }}
        >
          {t.heading}
        </h2>

        <p
          className="mx-auto mt-6 max-w-[800px] text-[18px] leading-[1.85] md:text-[19px]"
          style={{ color: "#4A5565" }}
        >
          {t.body}
        </p>

        <Link
          href="/about/who-we-are"
          className="mt-10 inline-flex items-center gap-2.5 rounded-full border border-text-dark px-8 py-3 text-[16px] text-text-dark transition-all hover:border-primary hover:bg-primary hover:text-white"
          style={{ fontWeight: 500 }}
        >
          {t.cta}
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4" aria-hidden>
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
