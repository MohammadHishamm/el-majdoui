import Link from "next/link";

type Initiative = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: "نشطة" | "قادمة" | "موسمية";
  focusArea: string;
  focusColor: string;
  cta: string;
};

const INITIATIVES: Initiative[] = [
  {
    id: "1",
    title: "مبادرة تضمين",
    slug: "tadmeen",
    excerpt: "دعم وتمكين مستفيدي الضمان الاجتماعي من القادرين على العمل للحصول على فرص وظيفية مناسبة.",
    status: "نشطة",
    focusArea: "المحتاج",
    focusColor: "#005761",
    cta: "اعرف أكثر",
  },
  {
    id: "2",
    title: "مبادرة عمارة",
    slug: "imaara",
    excerpt: "منظومة متكاملة لإنشاء وتشغيل وصيانة مساجد المجدوعي لتوفير تجربة مثالية للمصلين.",
    status: "نشطة",
    focusArea: "مساجد المجدوعي",
    focusColor: "#00B5C2",
    cta: "اعرف أكثر",
  },
  {
    id: "3",
    title: "مبادرة منارة",
    slug: "manara",
    excerpt: "برامج تعليمية واجتماعية وتطويرية لقاصدي مساجد المجدوعي ومنسوبيها.",
    status: "نشطة",
    focusArea: "مساجد المجدوعي",
    focusColor: "#00B5C2",
    cta: "اعرف أكثر",
  },
  {
    id: "4",
    title: "مبادرة تطوير",
    slug: "tatweer",
    excerpt: "تطوير شركاء المؤسسة من العاملين مع المحتاج ليمتلكوا القدرات للتغيير.",
    status: "نشطة",
    focusArea: "شركاء التنفيذ",
    focusColor: "#80A5E0",
    cta: "اعرف أكثر",
  },
  {
    id: "5",
    title: "تفريج كربة",
    slug: "tafrij-karba",
    excerpt: "تقديم الدعم المباشر للأفراد والأسر المحتاجة لتلبية احتياجاتهم الأساسية.",
    status: "نشطة",
    focusArea: "المحتاج",
    focusColor: "#005761",
    cta: "اعرف أكثر",
  },
  {
    id: "6",
    title: "مبادرة رسالة",
    slug: "risala",
    excerpt: "استقطاب الأكفاء من منسوبي مساجد المجدوعي وتطوير مهاراتهم لنشر الوعي الشرعي.",
    status: "قادمة",
    focusArea: "مساجد المجدوعي",
    focusColor: "#00B5C2",
    cta: "اعرف أكثر",
  },
];

const STATUS_STYLES = {
  "نشطة": "bg-green-50 text-green-700 border-green-200",
  "قادمة": "bg-blue-50 text-blue-700 border-blue-200",
  "موسمية": "bg-amber-50 text-amber-700 border-amber-200",
};

export function FeaturedInitiatives() {
  return (
    <section className="bg-white py-16 md:py-24" data-nav-surface="light" aria-labelledby="initiatives-heading">
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <div className="mb-12 flex flex-col gap-4 text-right md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
              برامجنا
            </p>
            <h2 id="initiatives-heading" className="text-3xl font-bold text-text-dark md:text-4xl">
              المبادرات المميزة
            </h2>
          </div>
          <Link
            href="/programs"
            className="shrink-0 text-sm font-semibold text-primary hover:text-accent"
          >
            عرض جميع المبادرات ←
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {INITIATIVES.map((initiative) => (
            <Link
              key={initiative.id}
              href={`/programs/${initiative.slug}`}
              className="group flex flex-col rounded-2xl border border-bg-alt bg-white p-6 text-right shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="mb-4 flex items-center justify-between">
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[initiative.status]}`}
                >
                  {initiative.status}
                </span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                  style={{ backgroundColor: initiative.focusColor }}
                >
                  {initiative.focusArea}
                </span>
              </div>

              <h3 className="text-lg font-bold text-text-dark group-hover:text-primary transition-colors">
                {initiative.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-text-light">{initiative.excerpt}</p>

              <span
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors group-hover:text-accent"
                style={{ color: initiative.focusColor }}
              >
                {initiative.cta}
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 rtl:rotate-180">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
