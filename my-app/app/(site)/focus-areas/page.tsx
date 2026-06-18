import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { focusAreas } from "@/lib/site/config";

export const metadata: Metadata = {
  title: "مجالات التركيز",
  description: "مجالات تركيز مؤسسة المجدوعي الخيرية",
};

export default function FocusAreasPage() {
  return (
    <>
      <PageHeader
        title="مجالات التركيز"
        description="تعمل المؤسسة في ثلاثة مجالات رئيسية لتحقيق أثر تنموي مستدام."
      />
      <Container as="main" className="py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {focusAreas.map((area) => (
            <Link
              key={area.slug}
              href={`/focus-areas/${area.slug}`}
              className="rounded-xl border border-bg-alt bg-white p-6 transition-shadow hover:shadow-md"
              style={{ borderTopColor: area.color, borderTopWidth: 4 }}
            >
              <h2 className="text-xl font-bold text-text-dark">{area.name}</h2>
              <p className="mt-2 text-text-medium">{area.shortDesc}</p>
              <span className="mt-4 inline-block text-sm font-medium text-primary">
                استعرض المبادرات ←
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
