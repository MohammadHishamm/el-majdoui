const HOME_SECTIONS = [
  { id: "hero", label: "هيرو / سلايدر الأخبار" },
  { id: "leadership", label: "كلمة قيادي" },
  { id: "about", label: "التعريف بالمؤسسة" },
  { id: "focus-areas", label: "مجالات التركيز" },
  { id: "initiatives", label: "المبادرات المميزة" },
  { id: "kpis", label: "أرقام الأثر" },
  { id: "news", label: "آخر الأخبار" },
] as const;

export function HomeSectionPlaceholder({
  id,
  label,
}: {
  id: string;
  label: string;
}) {
  return (
    <section
      id={id}
      className="border-b border-bg-alt py-16 md:py-24"
      aria-labelledby={`${id}-heading`}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          id={`${id}-heading`}
          className="text-2xl font-bold text-text-dark md:text-3xl"
        >
          {label}
        </h2>
        <div className="mt-8 rounded-xl border border-dashed border-light-blue/40 bg-bg-alt p-10 text-center">
          <p className="text-text-muted">قسم {label} — بانتظار تصميم Figma</p>
        </div>
      </div>
    </section>
  );
}

export function HomeSections() {
  return (
    <>
      {HOME_SECTIONS.map((section) => (
        <HomeSectionPlaceholder
          key={section.id}
          id={section.id}
          label={section.label}
        />
      ))}
    </>
  );
}
