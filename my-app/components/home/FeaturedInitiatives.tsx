import Link from "next/link";

type Initiative = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: "نشطة" | "قادمة" | "موسمية";
  focusArea: string;
  focusColor: string;
  imageBg: string;
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
    imageBg: "linear-gradient(135deg, #005761 0%, #00B5C2 100%)",
  },
  {
    id: "2",
    title: "مبادرة عمارة",
    slug: "imaara",
    excerpt: "منظومة متكاملة لإنشاء وتشغيل وصيانة مساجد المجدوعي لتوفير تجربة مثالية للمصلين.",
    status: "نشطة",
    focusArea: "مساجد المجدوعي",
    focusColor: "#00B5C2",
    imageBg: "linear-gradient(135deg, #00B5C2 0%, #005761 100%)",
  },
  {
    id: "3",
    title: "مبادرة منارة",
    slug: "manara",
    excerpt: "برامج تعليمية واجتماعية وتطويرية لقاصدي مساجد المجدوعي ومنسوبيها.",
    status: "نشطة",
    focusArea: "مساجد المجدوعي",
    focusColor: "#00B5C2",
    imageBg: "linear-gradient(135deg, #004d57 0%, #007a82 100%)",
  },
  {
    id: "4",
    title: "مبادرة تطوير",
    slug: "tatweer",
    excerpt: "تطوير شركاء المؤسسة من العاملين مع المحتاج ليمتلكوا القدرات للتغيير.",
    status: "نشطة",
    focusArea: "شركاء التنفيذ",
    focusColor: "#80A5E0",
    imageBg: "linear-gradient(135deg, #80A5E0 0%, #4a7cb5 100%)",
  },
  {
    id: "5",
    title: "تفريج كربة",
    slug: "tafrij-karba",
    excerpt: "تقديم الدعم المباشر للأفراد والأسر المحتاجة لتلبية احتياجاتهم الأساسية.",
    status: "نشطة",
    focusArea: "المحتاج",
    focusColor: "#005761",
    imageBg: "linear-gradient(135deg, #003d45 0%, #005761 100%)",
  },
  {
    id: "6",
    title: "مبادرة رسالة",
    slug: "risala",
    excerpt: "استقطاب الأكفاء من منسوبي مساجد المجدوعي وتطوير مهاراتهم لنشر الوعي الشرعي.",
    status: "قادمة",
    focusArea: "مساجد المجدوعي",
    focusColor: "#00B5C2",
    imageBg: "linear-gradient(135deg, #006e75 0%, #009aa3 100%)",
  },
];

const STATUS_STYLES: Record<string, string> = {
  "نشطة": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "قادمة": "bg-sky-50 text-sky-700 border border-sky-200",
  "موسمية": "bg-amber-50 text-amber-700 border border-amber-200",
};

export function FeaturedInitiatives() {
  return (
    <section
      className="bg-white py-20 md:py-28"
      data-nav-surface="light"
      aria-labelledby="initiatives-heading"
    >
      <div className="mx-auto w-full max-w-[1280px] px-6">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-4 text-right md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
              برامجنا
            </p>
            <h2
              id="initiatives-heading"
              className="text-3xl font-bold text-text-dark md:text-4xl"
            >
              البرامج والمبادرات
            </h2>
          </div>
          <Link
            href="/programs"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-accent"
          >
            عرض جميع المبادرات
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 rtl:rotate-180">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INITIATIVES.map((item) => (
            <Link
              key={item.id}
              href={`/programs/${item.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-bg-alt transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Image / gradient banner */}
              <div
                className="relative h-44 w-full"
                style={{ background: item.imageBg }}
              >
                {/* Focus area tag — top-start */}
                <span
                  className="absolute end-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
                >
                  {item.focusArea}
                </span>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-6 text-right">
                {/* Status badge */}
                <span
                  className={`mb-3 inline-block self-end rounded-full px-3 py-0.5 text-xs font-semibold ${STATUS_STYLES[item.status] ?? ""}`}
                >
                  {item.status}
                </span>

                <h3 className="text-lg font-bold text-text-dark transition-colors group-hover:text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-7 text-text-light">
                  {item.excerpt}
                </p>

                <span
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors group-hover:text-accent"
                  style={{ color: item.focusColor }}
                >
                  اعرف أكثر
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4 rtl:rotate-180"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
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
