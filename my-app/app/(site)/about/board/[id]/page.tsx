import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `عضو مجلس الأمناء — ${id}` };
}

export default async function BoardMemberPage({ params }: Props) {
  const { id } = await params;
  return (
    <PagePlaceholder
      title={`عضو مجلس الأمناء (${id})`}
      eyebrow="مجلس الأمناء"
      backHref="/about/board"
      backLabel="مجلس الأمناء"
    />
  );
}
