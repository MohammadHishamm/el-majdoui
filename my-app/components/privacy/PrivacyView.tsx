"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocale } from "@/lib/i18n/context";
import { PrivacyToc } from "@/components/privacy/PrivacyToc";

export type Bi = { ar: string; en: string };
export type PrivacySection = { title: Bi; body: Bi; bullets: { ar: string[]; en: string[] } };
export type PrivacyContent = {
  updated: Bi;
  title: Bi;
  intro: Bi;
  sections: PrivacySection[];
  calloutTitle: Bi;
  calloutDesc: Bi;
  calloutButton: Bi;
  orgName: Bi;
  orgDesc: Bi;
};

export function PrivacyView({ content }: { content: PrivacyContent }) {
  const { locale } = useLocale();
  const isEn = locale === "en";
  // English falls back to Arabic when a translation is missing.
  const p = (b: Bi) => (isEn && b.en ? b.en : b.ar);
  const bullets = (s: PrivacySection) => (isEn && s.bullets.en.length ? s.bullets.en : s.bullets.ar);

  const tocItems = content.sections.map((sec, i) => ({ id: `policy-section-${i + 1}`, label: p(sec.title) }));
  const Arrow = isEn ? ArrowRight : ArrowLeft;

  return (
    <main dir={isEn ? "ltr" : "rtl"} className="-mt-28 bg-surface pt-40 md:pt-44" data-nav-surface="light">
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-16 sm:px-6 md:pb-24 lg:px-20">
        {/* ── Page head ── */}
        <p className="text-sm text-body-3">{p(content.updated)}</p>
        <h1 className="mt-4 text-[32px] font-medium leading-tight text-heading md:text-[48px]">
          {p(content.title)}
        </h1>
        <div className="mt-8 h-px w-full bg-panel-border" />
        <p className="mt-8 text-lg leading-relaxed text-body-1 md:text-2xl md:leading-10">
          {p(content.intro)}
        </p>

        {/* ── Body: sidebar (right in RTL) + content ── */}
        <div className="mt-10 flex flex-col gap-10 md:mt-14 lg:flex-row">
          {/* ── Sidebar ── */}
          <aside className="w-full shrink-0 lg:w-[280px]">
            <div className="flex flex-col gap-6 lg:sticky lg:top-36">
              <PrivacyToc items={tocItems} />
              <div className="hidden flex-col gap-2 px-5 text-start lg:flex">
                <p className="text-lg text-body-1 dark:text-heading">{p(content.orgName)}</p>
                <p className="text-xs leading-normal text-body-3">{p(content.orgDesc)}</p>
              </div>
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col gap-10">
            {content.sections.map((sec, i) => (
              <section
                key={i}
                id={`policy-section-${i + 1}`}
                className="scroll-mt-36 flex flex-col gap-4"
              >
                <h2 className="text-xl font-bold text-heading">
                  {i + 1}. {p(sec.title)}
                </h2>
                {p(sec.body) && <p className="text-base leading-relaxed text-body-2">{p(sec.body)}</p>}
                {bullets(sec).length > 0 && (
                  <ul className="flex list-disc flex-col gap-2 ps-5 marker:text-heading">
                    {bullets(sec).map((b, j) => (
                      <li key={j} className="text-base leading-relaxed text-body-2">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {/* ── Support callout ── */}
            <div className="flex flex-col gap-4 rounded-xl border border-panel-border bg-surface-alt p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1 text-start">
                <p className="text-base font-bold text-heading">{p(content.calloutTitle)}</p>
                <p className="text-sm text-body-2">{p(content.calloutDesc)}</p>
              </div>
              <Link
                href="/#contact"
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-btn-2-stroke px-4 py-2.5 text-sm font-bold text-btn-2-text transition-colors hover:bg-icon-box"
              >
                {p(content.calloutButton)}
                <Arrow className="size-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
