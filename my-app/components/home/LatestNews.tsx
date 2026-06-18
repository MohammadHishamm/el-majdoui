import Link from "next/link";
import Image from "next/image";

type NewsItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
};

const NEWS: NewsItem[] = [
  {
    id: "1",
    slug: "takreem-shuraka-2024",
    title: "حفل تكريم الشركاء وداعمي مؤسسة المجدوعي الخيرية 2024",
    excerpt: "نظّمت المؤسسة حفلاً تكريمياً لشركائها وداعميها تقديراً لإسهاماتهم في مسيرة العطاء.",
    date: "٢٨ أبريل ٢٠٢٤",
    image: "/images/figma/sections/leadership.jpg",
  },
  {
    id: "2",
    slug: "shiraka-15-jaha",
    title: "شراكة استراتيجية مع 15 جهة تنفيذية لتحقيق أثر مستدام",
    excerpt: "أبرمت المؤسسة حزمة من الاتفاقيات الاستراتيجية مع جمعيات أهلية بارزة في المنطقة الشرقية.",
    date: "١٥ مارس ٢٠٢٤",
    image: "/images/slide-show03.png",
  },
  {
    id: "3",
    slug: "mubadara-manara-launch",
    title: "إطلاق مبادرة منارة لتطوير الخدمات في مساجد المجدوعي",
    excerpt: "أطلقت المؤسسة مبادرة منارة الهادفة إلى رفع مستوى الخدمات التعليمية والاجتماعية في المساجد.",
    date: "٣ فبراير ٢٠٢٤",
    image: "/images/hero-slide-1.png",
  },
];

export function LatestNews() {
  return (
    <section
      className="bg-white py-16 md:py-24"
      data-nav-surface="light"
      aria-labelledby="news-heading"
    >
      {/* Decorative divider */}
      <div className="mx-auto mb-12 flex w-full max-w-[1280px] items-center justify-center gap-2 overflow-hidden px-6" aria-hidden>
        {Array.from({ length: 32 }).map((_, i) => (
          <Image
            key={i}
            src="/images/figma/sections/First.png"
            alt=""
            width={20}
            height={20}
            className="h-5 w-5 shrink-0 opacity-30"
            style={{ filter: "invert(28%) sepia(83%) saturate(460%) hue-rotate(149deg) brightness(94%) contrast(101%)" }}
          />
        ))}
      </div>

      <div className="mx-auto w-full max-w-[1280px] px-6">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="text-right">
            <h2 id="news-heading" className="text-3xl font-bold text-text-dark md:text-4xl">
              أحدث الأخبار
            </h2>
            <p className="mt-2 text-base text-text-light">تابع آخر مستجداتنا وفعالياتنا</p>
          </div>
          <Link
            href="/news"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-primary px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            جميع الأخبار
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
                  alt={item.title}
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
                  {item.date}
                </div>
                <h3 className="line-clamp-2 text-base font-bold leading-6 text-text-dark transition-colors group-hover:text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-light">{item.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
