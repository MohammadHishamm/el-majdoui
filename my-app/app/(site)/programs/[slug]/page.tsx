import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProgramDetails from "@/components/programs/program-details";
import { getProgram, programs } from "@/lib/programs";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program) return { title: "مبادرة غير موجودة" };
  return {
    title: `${program.title} | مؤسسة المجدوعي الخيرية`,
    description: program.shortDesc,
  };
}

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program) notFound();

  return <ProgramDetails program={program} />;
}
