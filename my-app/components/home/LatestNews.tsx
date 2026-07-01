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

function NewsCard({ item, locale }: { item: NewsItem; locale: "ar" | "en" }) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className="group flex w-[300px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-bg-alt transition-all hover:-translate-y-1 hover:shadow-lg sm:w-[340px]"
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
  );
}

export function LatestNews({ items }: { items?: NewsItem[] }) {
  const { locale } = useLocale();
  const t = translations[locale].news;
  const list = items && items.length ? items : NEWS;
  // ~4.5s of travel per card keeps the speed constant regardless of how many there are.
  const duration = Math.max(24, Math.round(list.length * 4.5));

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
          backgroundImage: "url('/images/home/updated-svgs/horizontal-art.svg')",
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

        {/* Auto-scrolling carousel — pauses on hover, manual-scroll fallback for reduced motion */}
        <div
          className="news-marquee"
          style={{ "--news-marquee-dur": `${duration}s` } as React.CSSProperties}
        >
          <div className="news-marquee__track">
            <ul className="news-marquee__group">
              {list.map((item) => (
                <li key={item.id}>
                  <NewsCard item={item} locale={locale} />
                </li>
              ))}
            </ul>
            <ul className="news-marquee__group" aria-hidden>
              {list.map((item) => (
                <li key={`dup-${item.id}`}>
                  <NewsCard item={item} locale={locale} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .news-marquee {
          overflow: hidden;
          direction: ltr;
          -webkit-mask-image: linear-gradient(to right, transparent, #000 4%, #000 96%, transparent);
          mask-image: linear-gradient(to right, transparent, #000 4%, #000 96%, transparent);
        }
        .news-marquee__track {
          display: flex;
          gap: 24px;
          width: max-content;
          padding-block: 4px 16px;
          animation: news-marquee var(--news-marquee-dur, 40s) linear infinite;
          will-change: transform;
        }
        .news-marquee:hover .news-marquee__track,
        .news-marquee:focus-within .news-marquee__track {
          animation-play-state: paused;
        }
        .news-marquee__group {
          display: flex;
          gap: 24px;
          flex-shrink: 0;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        @keyframes news-marquee {
          to { transform: translateX(calc(-50% - 12px)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .news-marquee {
            overflow-x: auto;
            -webkit-mask-image: none;
            mask-image: none;
            scrollbar-width: none;
          }
          .news-marquee::-webkit-scrollbar { display: none; }
          .news-marquee__track { animation: none; }
          .news-marquee__group[aria-hidden] { display: none; }
        }
      `}</style>
    </section>
  );
}
