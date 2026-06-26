"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/lib/i18n/context";
import { translations } from "@/lib/i18n/translations";

type BilingualText = { ar: string; en: string };

type NewsItem = {
  id: string;
  slug: string;
  title: BilingualText;
  excerpt: BilingualText;
  date: BilingualText;
  image: string;
};

const NEWS: NewsItem[] = [
  {
    id: "1",
    slug: "takreem-shuraka-2024",
    title: {
      ar: "حفل تكريم الشركاء وداعمي مؤسسة المجدوعي الخيرية 2024",
      en: "Almajdouie Foundation Partners & Supporters Appreciation Ceremony 2024",
    },
    excerpt: {
      ar: "نظّمت المؤسسة حفلاً تكريمياً لشركائها وداعميها تقديراً لإسهاماتهم في مسيرة العطاء.",
      en: "The foundation organized an appreciation ceremony for its partners and supporters in recognition of their contributions to the journey of giving.",
    },
    date: { ar: "٢٨ أبريل ٢٠٢٤", en: "April 28, 2024" },
    image: "/images/figma/sections/leadership.png",
  },
  {
    id: "2",
    slug: "shiraka-15-jaha",
    title: {
      ar: "شراكة استراتيجية مع 15 جهة تنفيذية لتحقيق أثر مستدام",
      en: "Strategic Partnership with 15 Implementing Entities for Sustainable Impact",
    },
    excerpt: {
      ar: "أبرمت المؤسسة حزمة من الاتفاقيات الاستراتيجية مع جمعيات أهلية بارزة في المنطقة الشرقية.",
      en: "The foundation signed a package of strategic agreements with prominent civil associations in the Eastern Province.",
    },
    date: { ar: "١٥ مارس ٢٠٢٤", en: "March 15, 2024" },
    image: "/images/slide-show03.png",
  },
  {
    id: "3",
    slug: "mubadara-manara-launch",
    title: {
      ar: "إطلاق مبادرة منارة لتطوير الخدمات في مساجد المجدوعي",
      en: "Launching the Manara Initiative to Develop Services in Almajdouie Mosques",
    },
    excerpt: {
      ar: "أطلقت المؤسسة مبادرة منارة الهادفة إلى رفع مستوى الخدمات التعليمية والاجتماعية في المساجد.",
      en: "The foundation launched the Manara Initiative aimed at raising the level of educational and social services in mosques.",
    },
    date: { ar: "٣ فبراير ٢٠٢٤", en: "February 3, 2024" },
    image: "/images/hero-slide-1.png",
  },
];

export function LatestNews() {
  const { locale } = useLocale();
  const t = translations[locale].news;

  return (
    <section
      className="bg-white pt-9 pb-16 md:pt-12 md:pb-24"
      data-nav-surface="light"
      aria-labelledby="news-heading"
    >
      {/* Decorative divider — full page width */}
      <div
        className="mx-auto mb-12 h-11 w-full px-6 opacity-70"
        style={{
          backgroundImage: "url('/images/figma/sections/Container.png')",
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 100%",
          backgroundPosition: "center",
        }}
        aria-hidden
      />

      <div className="mx-auto w-full max-w-[1280px] px-6">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="text-right">
            <h2 id="news-heading" className="text-3xl font-bold text-text-dark md:text-4xl">
              {t.heading}
            </h2>
            <p className="mt-2 text-base text-text-light">{t.subheading}</p>
          </div>
          <Link
            href="/news"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-primary px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            {t.allNewsCTA}
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 rtl:rotate-180">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NEWS.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.slug}`}
              className="group flex w-[340px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-bg-alt transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title[locale]}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="340px"
                />
              </div>

              <div className="flex flex-1 flex-col p-5 text-right">
                <div className="mb-3 flex items-center gap-2 text-xs text-text-muted">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {item.date[locale]}
                </div>
                <h3 className="line-clamp-2 text-base font-bold leading-6 text-text-dark transition-colors group-hover:text-primary">
                  {item.title[locale]}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-light">{item.excerpt[locale]}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
