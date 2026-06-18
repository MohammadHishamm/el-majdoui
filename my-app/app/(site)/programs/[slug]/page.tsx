import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug.replace(/-/g, " ") };
}

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  return (
    <PagePlaceholder
      title={slug.replace(/-/g, " ")}
      eyebrow="مبادرة"
      backHref="/programs"
      backLabel="جميع المبادرات"
    />
  );
}
