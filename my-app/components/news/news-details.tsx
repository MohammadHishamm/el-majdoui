import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, User } from "lucide-react";
import { FadeInUp } from "@/components/ui/fade-in-up";
import { NewsActions } from "@/components/news/NewsActions";
import { NewsCard } from "@/components/news/NewsCard";
import {
  getNews,
  mostReadSlugs,
  newsCategoryLabel,
  type NewsItem,
} from "@/lib/news";

const TAG_ICON = "/images/news-and-announces/tag-icon.svg";

function SectionHeading({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} className="text-right text-[24px] font-bold leading-[36px] text-[#005761]">
      {children}
    </h2>
  );
}

export default function NewsDetails({ item }: { item: NewsItem }) {
  const related = item.related
    .map((slug) => getNews(slug))
    .filter((n): n is NewsItem => Boolean(n))
    .slice(0, 3);

  const mostRead = mostReadSlugs
    .map((slug) => getNews(slug))
    .filter((n): n is NewsItem => Boolean(n))
    .slice(0, 3);

  return (
    <main dir="rtl" className="bg-white" data-nav-surface="light">
      {/* Header */}
      <section className="-mt-28 bg-white pt-36 md:pt-40">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-[14px] text-text-muted transition-colors hover:text-[#005761]"
            >
              <ArrowLeft className="size-4" />
              العودة إلى الأخبار والإعلانات
            </Link>

            <div className="mt-8 flex w-full flex-wrap items-center justify-start gap-x-5 gap-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#005761] px-3 py-1 text-[13px] font-medium text-white">
                <Image src={TAG_ICON} alt="" width={14} height={14} aria-hidden className="[filter:brightness(0)_invert(1)]" />
                {item.kicker ?? newsCategoryLabel(item.category)}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[14px] text-[#6a7282]">
                <CalendarDays className="size-4" />
                {item.date}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[14px] text-[#6a7282]">
                <User className="size-4" />
                {item.source}
              </span>
            </div>

            <h1 className="mt-5 text-right text-[28px] font-black leading-[1.25] text-[#005761] md:text-[36px]">
              {item.title}
            </h1>
            <p className="mt-5 max-w-4xl text-right text-[18px] leading-[32px] text-text-light">
              {item.lead}
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Featured image */}
      <FadeInUp>
        <section className="bg-white pt-10">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="relative aspect-[1120/490] w-full overflow-hidden rounded-[16px]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1120px"
                className="object-cover"
              />
            </div>
            <p className="mt-3 text-right text-[13px] text-text-muted">{item.caption}</p>
          </div>
        </section>
      </FadeInUp>

      {/* Body + sidebar */}
      <section className="bg-white py-14 md:py-16">
        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_346px] lg:gap-10 lg:px-8">
          {/* Main content (right) */}
          <article className="order-2 lg:order-1">
            <FadeInUp>
              <div className="space-y-5 text-right text-[17px] leading-[32px] text-[#364153]">
                {item.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </FadeInUp>

            {item.axes && (
              <FadeInUp>
                <div className="mt-10">
                  <SectionHeading>{item.axes.heading}</SectionHeading>
                  <ul className="mt-5 space-y-3 text-right">
                    {item.axes.items.map((it) => (
                      <li key={it} className="text-[16px] leading-[28px] text-[#364153]">
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeInUp>
            )}

            {item.quote && (
              <FadeInUp>
                <blockquote className="mt-10 rounded-[16px] border-r-[3.5px] border-[#00b5c2] bg-[#f8fbfb] py-6 pr-7 pl-6 text-right">
                  <p className="text-[17px] leading-[32px] text-[#1e2939]">{`"${item.quote}"`}</p>
                </blockquote>
                {item.afterQuote && (
                  <p
                    className="mt-5 w-full text-right text-[17px] font-normal leading-[32.3px] text-[#1E2939]"
                    style={{ fontFamily: "var(--font-itf-rayat), sans-serif" }}
                  >
                    {item.afterQuote}
                  </p>
                )}
              </FadeInUp>
            )}

            {/* Tags + actions */}
            <FadeInUp>
              <div className="mt-10 flex flex-col gap-5 border-t border-[#f3f4f6] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap justify-start gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#f0f7f8] px-3 py-1.5 text-[13px] text-[#005761]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <NewsActions title={item.title} />
              </div>
            </FadeInUp>
          </article>

          {/* Sidebar (left) */}
          <aside className="order-1 flex flex-col gap-5 lg:order-2">
            <div className="rounded-[16px] bg-[#e8f1f2] p-6">
              <h3 className="text-right text-[16px] font-bold leading-[24px] text-[#005761]">
                معلومات الخبر
              </h3>
              <ul className="mt-4 space-y-3">
                {[
                  ["القسم", newsCategoryLabel(item.category)],
                  ["تاريخ النشر", item.date],
                  ["المصدر", item.source],
                  ["مدة القراءة", item.readTime],
                ].map(([label, value]) => (
                  <li key={label} className="flex items-center justify-between gap-3">
                    <span className="text-[14px] text-[#6a7282]">{label}</span>
                    <span className="text-[14px] font-bold text-[#005761]">{value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[16px] border-[1.18px] border-[#f3f4f6] bg-white p-6">
              <h3 className="text-right text-[16px] font-bold leading-[24px] text-[#005761]">
                الأكثر قراءة
              </h3>
              <ol className="mt-4 space-y-4">
                {mostRead.map((n, i) => (
                  <li key={n.slug}>
                    <Link href={`/news/${n.slug}`} className="group flex items-start justify-start gap-3 text-right">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#e8f1f2] text-[13px] font-bold text-[#005761]">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-[14px] font-medium leading-[21px] text-[#1e2939] transition-colors group-hover:text-[#005761]">
                          {n.title}
                        </p>
                        <p className="mt-1 text-[12px] text-[#6a7282]">{n.date}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-white pb-20 md:pb-28" aria-labelledby="related-news">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <FadeInUp>
              <h2 id="related-news" className="mb-8 text-right text-[24px] font-bold leading-[36px] text-[#005761]">
                أخبار ذات صلة
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((n) => (
                  <NewsCard key={n.slug} item={n} />
                ))}
              </div>
            </FadeInUp>
          </div>
        </section>
      )}
    </main>
  );
}
