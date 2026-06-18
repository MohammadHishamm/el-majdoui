import Link from "next/link";

type NewsItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imagePlaceholder: string;
};

const NEWS: NewsItem[] = [
  {
    id: "1",
    slug: "takreem-shuraka-2024",
    title: "حفل تكريم الشركاء وداعمي مؤسسة المجدوعي الخيرية 2024",
    excerpt: "نظّمت المؤسسة حفلاً تكريمياً لشركائها وداعميها تقديراً لإسهاماتهم في مسيرة العطاء.",
    date: "١٥ رجب ١٤٤٦",
    category: "فعاليات",
    imagePlaceholder: "bg-primary/10",
  },
  {
    id: "2",
    slug: "shiraka-15-jaha",
    title: "شراكة استراتيجية مع 15 جهة تنفيذية لتحقيق أثر مستدام",
    excerpt: "أبرمت المؤسسة حزمة من الاتفاقيات الاستراتيجية مع جمعيات أهلية بارزة في المنطقة الشرقية.",
    date: "٢ جمادى الأولى ١٤٤٦",
    category: "أخبار",
    imagePlaceholder: "bg-accent/10",
  },
  {
    id: "3",
    slug: "mubadara-manara-launch",
    title: "إطلاق مبادرة منارة لتطوير الخدمات في مساجد المجدوعي",
    excerpt: "أطلقت المؤسسة مبادرة منارة الهادفة إلى رفع مستوى الخدمات التعليمية والاجتماعية في المساجد.",
    date: "٢٠ ربيع الأول ١٤٤٦",
    category: "مبادرات",
    imagePlaceholder: "bg-light-blue/20",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "فعاليات": "bg-purple-50 text-purple-700",
  "أخبار": "bg-blue-50 text-blue-700",
  "مبادرات": "bg-green-50 text-green-700",
  "تقارير": "bg-amber-50 text-amber-700",
};

export function LatestNews() {
  return (
    <section className="bg-bg-light py-16 md:py-24" data-nav-surface="light" aria-labelledby="news-heading">
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <div className="mb-12 flex flex-col gap-4 text-right md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
              آخر المستجدات
            </p>
            <h2 id="news-heading" className="text-3xl font-bold text-text-dark md:text-4xl">
              آخر الأخبار
            </h2>
          </div>
          <Link
            href="/news"
            className="shrink-0 text-sm font-semibold text-primary hover:text-accent"
          >
            عرض جميع الأخبار ←
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {NEWS.map((item, idx) => (
            <Link
              key={item.id}
              href={`/news/${item.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Image area */}
              <div className={`h-48 w-full ${item.imagePlaceholder} flex items-center justify-center`}>
                <span className="text-xs text-text-muted">صورة الخبر</span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5 text-right">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs text-text-muted">{item.date}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[item.category] ?? "bg-gray-100 text-gray-600"}`}>
                    {item.category}
                  </span>
                </div>
                <h3 className="text-base font-bold leading-6 text-text-dark transition-colors group-hover:text-primary line-clamp-2">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-text-light line-clamp-2">
                  {item.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors group-hover:text-accent">
                  اقرأ المزيد
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 rtl:rotate-180">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
