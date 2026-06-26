import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProgramDetails from "@/components/programs/program-details";
import { type Program } from "@/lib/programs";
import { getAllPrograms, getProgramBySlug } from "@/lib/cms/fetchers";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) return { title: "مبادرة غير موجودة" };
  return {
    title: `${program.title} | مؤسسة المجدوعي الخيرية`,
    description: program.shortDesc,
  };
}

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) notFound();

  const all = await getAllPrograms();
  const bySlug = new Map(all.map((p) => [p.slug, p]));
  const related = program.related
    .map((s) => bySlug.get(s))
    .filter((p): p is Program => Boolean(p))
    .slice(0, 3);

  return <ProgramDetails program={program} related={related} />;
}
