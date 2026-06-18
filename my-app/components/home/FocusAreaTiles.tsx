import Link from "next/link";

const FOCUS_AREAS = [
  {
    name: "المحتاج",
    slug: "empowerment",
    bg: "#80A5E0",
    btnText: "#005761",
    desc: "تعمل المؤسسة على تفريج كرب المحتاجين عبر العطاء المباشر ونقلهم إلى دائرة التمكين الاقتصادي.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden className="h-12 w-12">
        <circle cx="24" cy="16" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M8 42c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "مساجد المجدوعي",
    slug: "mosques",
    bg: "#00B5C2",
    btnText: "#005761",
    desc: "تعتني المؤسسة بمساجد المجدوعي لتكون مُعمّرة ومستدامة ومهيأة لقاصديها ومنارة للعلم.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden className="h-12 w-12">
        <path d="M24 6l16 12v24H8V18L24 6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M18 42V30a6 6 0 0112 0v12" stroke="currentColor" strokeWidth="2" />
        <circle cx="24" cy="10" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "شركاء التنفيذ",
    slug: "partners-development",
    bg: "#005761",
    btnText: "#005761",
    desc: "تسعى المؤسسة لتطوير جاهزية الجمعيات والكيانات غير الربحية الشريكة لإحداث أثر تنموي مستدام.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden className="h-12 w-12">
        <circle cx="24" cy="18" r="7" stroke="currentColor" strokeWidth="2" />
        <circle cx="10" cy="32" r="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="38" cy="32" r="5" stroke="currentColor" strokeWidth="2" />
        <path d="M5 44c0-2.761 2.239-5 5-5s5 2.239 5 5M33 44c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function FocusAreaTiles() {
  return (
    <section
      className="bg-white py-16 md:py-24"
      data-nav-surface="light"
      aria-labelledby="focus-heading"
    >
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <h2
          id="focus-heading"
          className="mb-12 text-center text-3xl font-bold text-text-dark md:text-4xl"
        >
          مجالات التركيز
        </h2>

        <div className="grid gap-5 md:grid-cols-3">
          {FOCUS_AREAS.map((area) => (
            <div
              key={area.slug}
              className="flex min-h-[520px] flex-col rounded-2xl p-10 text-right text-white"
              style={{ backgroundColor: area.bg }}
            >
              <div className="mb-6 text-white/90">{area.icon}</div>

              <h3 className="text-2xl font-bold">{area.name}</h3>
              <p className="mt-4 flex-1 text-sm leading-8 text-white/85">{area.desc}</p>

              <Link
                href={`/focus-areas/${area.slug}`}
                className="mt-8 inline-flex w-fit items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ color: area.btnText }}
              >
                استعرض المبادرات
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
