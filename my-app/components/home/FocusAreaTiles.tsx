import Link from "next/link";

const FOCUS_AREAS = [
  {
    name: "المحتاج",
    slug: "empowerment",
    color: "#005761",
    textAccent: "#00B5C2",
    desc: "تعمل المؤسسة على تفريج كروب المحتاجين عبر العطاء المباشر ونقلهم إلى دائرة التمكين الاقتصادي.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden className="h-12 w-12">
        <circle cx="24" cy="16" r="8" stroke="currentColor" strokeWidth="2.5" />
        <path d="M8 40c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "مساجد المجدوعي",
    slug: "mosques",
    color: "#00B5C2",
    textAccent: "#005761",
    desc: "تعتني المؤسسة بمساجد المجدوعي لتكون مُعمّرة ومستدامة ومهيأة لقاصديها ومنارة للعلم.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden className="h-12 w-12">
        <path d="M24 6L38 18v22H10V18L24 6z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M18 40V28a6 6 0 0112 0v12" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="24" cy="10" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "شركاء التنفيذ",
    slug: "partners-development",
    color: "#80A5E0",
    textAccent: "#005761",
    desc: "تسعى المؤسسة لتطوير جاهزية الجمعيات والكيانات غير الربحية الشريكة لإحداث أثر تنموي مستدام.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden className="h-12 w-12">
        <path d="M16 24c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="8" cy="28" r="6" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="40" cy="28" r="6" stroke="currentColor" strokeWidth="2.5" />
        <path d="M2 40c0-3.314 2.686-6 6-6s6 2.686 6 6M34 40c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function FocusAreaTiles() {
  return (
    <section className="bg-bg-light py-16 md:py-24" data-nav-surface="light" aria-labelledby="focus-heading">
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <div className="mb-12 text-right">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
            محاور العمل
          </p>
          <h2 id="focus-heading" className="text-3xl font-bold text-text-dark md:text-4xl">
            مجالات التركيز
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-text-light">
            تعمل المؤسسة وفق ثلاثة مجالات تركيز رئيسية لضمان أقصى أثر ممكن من المنح.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {FOCUS_AREAS.map((area) => (
            <div
              key={area.slug}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-lg"
              style={{ borderTop: `4px solid ${area.color}` }}
            >
              <div className="p-8 text-right">
                <div className="mb-5 inline-flex" style={{ color: area.color }}>
                  {area.icon}
                </div>
                <h3 className="text-xl font-bold text-text-dark">{area.name}</h3>
                <p className="mt-3 text-sm leading-7 text-text-light">{area.desc}</p>
                <Link
                  href={`/focus-areas/${area.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                  style={{ color: area.color }}
                >
                  استعرض المبادرات
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 rtl:rotate-180 transition-transform group-hover:-translate-x-1">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
