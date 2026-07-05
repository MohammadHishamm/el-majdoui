import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, User } from "lucide-react";
import { FadeInUp } from "@/components/ui/fade-in-up";
import { T } from "@/components/ui/T";
import { NewsActions } from "@/components/news/NewsActions";
import { NewsCard } from "@/components/news/NewsCard";
import { newsCategoryLabel, type NewsItem } from "@/lib/news";

const TAG_ICON = "/images/news-and-announces/tag-icon.svg";

function SectionHeading({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} className="text-right text-[24px] font-bold leading-[36px] text-heading">
      {children}
    </h2>
  );
}

export default function NewsDetails({
  item,
  related = [],
  mostRead = [],
}: {
  item: NewsItem;
  related?: NewsItem[];
  mostRead?: NewsItem[];
}) {

  return (
    <main dir="rtl" className="bg-surface" data-nav-surface="light">
      {/* Header */}
      <section className="-mt-28 bg-surface pt-36 md:pt-40">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-[14px] text-body-3 transition-colors hover:text-heading"
            >
              <ArrowLeft className="size-4" />
              <T ar="العودة إلى الأخبار والإعلانات" en="Back to news & announcements" />
            </Link>

            <div className="mt-8 flex w-full flex-wrap items-center justify-start gap-x-5 gap-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-btn-primary px-3 py-1 text-[13px] font-medium text-btn-primary-text">
                <Image src={TAG_ICON} alt="" width={14} height={14} aria-hidden className="[filter:brightness(0)_invert(1)]" />
                {item.kicker ?? newsCategoryLabel(item.category)}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[14px] text-body-3">
                <CalendarDays className="size-4" />
                {item.date}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[14px] text-body-3">
                <User className="size-4" />
                {item.source}
              </span>
            </div>

            <h1 className="mt-5 text-right text-[28px] font-black leading-[1.25] text-heading md:text-[36px]">
              {item.title}
            </h1>
            <p className="mt-5 max-w-4xl text-right text-[18px] leading-[32px] text-body-4">
              {item.lead}
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Featured image */}
      <FadeInUp>
        <section className="bg-surface pt-10">
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
            <p className="mt-3 text-right text-[13px] text-body-3">{item.caption}</p>
          </div>
        </section>
      </FadeInUp>

      {/* Body + sidebar */}
      <section className="bg-surface py-14 md:py-16">
        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_346px] lg:gap-10 lg:px-8">
          {/* Main content (right) */}
          <article className="order-2 lg:order-1">
            <FadeInUp>
              <div className="space-y-5 text-right text-[17px] leading-[32px] text-body-2">
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
                      <li key={it} className="text-[16px] leading-[28px] text-body-2">
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeInUp>
            )}

            {item.quote && (
              <FadeInUp>
                <blockquote className="mt-10 rounded-[16px] border-r-[3.5px] border-[#00b5c2] bg-icon-box py-6 pr-7 pl-6 text-right">
                  <p className="text-[17px] leading-[32px] text-body-1">{`"${item.quote}"`}</p>
                </blockquote>
                {item.afterQuote && (
                  <p
                    className="mt-5 w-full text-right text-[17px] font-normal leading-[32.3px] text-body-1"
                    style={{ fontFamily: "var(--font-itf-rayat), sans-serif" }}
                  >
                    {item.afterQuote}
                  </p>
                )}
              </FadeInUp>
            )}

            {/* Tags + actions */}
            <FadeInUp>
              <div className="mt-10 flex flex-col gap-5 border-t border-panel-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap justify-start gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-icon-box px-3 py-1.5 text-[13px] text-heading"
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
            <div className="rounded-[16px] bg-icon-box p-6">
              <h3 className="text-right text-[16px] font-bold leading-[24px] text-heading">
                <T ar="معلومات الخبر" en="Article info" />
              </h3>
              <ul className="mt-4 space-y-3">
                {[
                  { ar: "القسم", en: "Section", value: newsCategoryLabel(item.category) },
                  { ar: "تاريخ النشر", en: "Published", value: item.date },
                  { ar: "المصدر", en: "Source", value: item.source },
                  { ar: "مدة القراءة", en: "Read time", value: item.readTime },
                ].map((row) => (
                  <li key={row.ar} className="flex items-center justify-between gap-3">
                    <span className="text-[14px] text-body-3"><T ar={row.ar} en={row.en} /></span>
                    <span className="text-[14px] font-bold text-heading">{row.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[16px] border-[1.18px] border-panel-border bg-panel p-6">
              <h3 className="text-right text-[16px] font-bold leading-[24px] text-heading">
                <T ar="الأكثر قراءة" en="Most read" />
              </h3>
              <ol className="mt-4 space-y-4">
                {mostRead.map((n, i) => (
                  <li key={n.slug}>
                    <Link href={`/news/${n.slug}`} className="group flex items-start justify-start gap-3 text-right">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-icon-box text-[13px] font-bold text-heading">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-[14px] font-medium leading-[21px] text-body-1 transition-colors group-hover:text-heading">
                          {n.title}
                        </p>
                        <p className="mt-1 text-[12px] text-body-3">{n.date}</p>
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
        <section className="bg-surface pb-20 md:pb-28" aria-labelledby="related-news">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <FadeInUp>
              <h2 id="related-news" className="mb-8 text-right text-[24px] font-bold leading-[36px] text-heading">
                <T ar="أخبار ذات صلة" en="Related news" />
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
