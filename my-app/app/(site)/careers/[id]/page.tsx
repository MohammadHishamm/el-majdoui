import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `وظيفة — ${id}` };
}

export default async function CareerDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <PagePlaceholder
      title={`تفاصيل الوظيفة (${id})`}
      eyebrow="التوظيف"
      backHref="/careers"
      backLabel="جميع الوظائف"
    />
  );
}
