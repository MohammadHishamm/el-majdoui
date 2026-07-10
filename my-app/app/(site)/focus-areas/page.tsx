import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { T } from "@/components/ui/T";
import { getFocusAreas } from "@/lib/cms/fetchers";
import { focusAreas as FALLBACK } from "@/lib/site/config";

export const metadata: Metadata = {
  alternates: { canonical: "/focus-areas" },
  title: "مجالات التركيز",
  description: "مجالات تركيز مؤسسة المجدوعي الخيرية",
};

export const dynamic = "force-dynamic";

export default async function FocusAreasPage() {
  const data = await getFocusAreas();
  const areas = data.length
    ? data.map((a) => ({ slug: a.slug, name: a.name.ar, shortDesc: a.desc.ar, color: a.bg }))
    : FALLBACK.map((a) => ({ slug: a.slug, name: a.name, shortDesc: a.shortDesc, color: a.color }));

  return (
    <>
      <PageHeader
        title={<T ar="مجالات التركيز" en="Focus Areas" />}
        description={
          <T
            ar="تعمل المؤسسة في ثلاثة مجالات رئيسية لتحقيق أثر تنموي مستدام."
            en="The foundation works across three main areas to achieve sustainable developmental impact."
          />
        }
      />
      <Container as="main" className="py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {areas.map((area) => (
            <Link
              key={area.slug}
              href={`/focus-areas/${area.slug}`}
              className="rounded-xl border border-panel-border bg-panel p-6 transition-shadow hover:shadow-md"
              style={{ borderTopColor: area.color, borderTopWidth: 4 }}
            >
              <h2 className="line-clamp-2 break-words text-xl font-bold text-body-1 dark:text-heading">{area.name}</h2>
              <p className="mt-2 line-clamp-3 break-words text-body-2">{area.shortDesc}</p>
              <span className="mt-4 inline-block text-sm font-medium text-heading">
                <T ar="استعرض المبادرات ←" en="Explore initiatives ←" />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
