import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProgramDetails from "@/components/programs/program-details";
import { type Program } from "@/lib/programs";
import { getAllPrograms, getProgramBySlug } from "@/lib/cms/fetchers";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, ogImage } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) return { title: "مبادرة غير موجودة", robots: { index: false, follow: true } };
  const url = `/programs/${slug}`;
  return {
    title: program.title,
    description: program.shortDesc,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: program.title,
      description: program.shortDesc,
      images: [{ url: ogImage(program.image), alt: program.title }],
    },
    twitter: { card: "summary_large_image", title: program.title, description: program.shortDesc, images: [ogImage(program.image)] },
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

  const breadcrumb = breadcrumbJsonLd([
    { name: "الرئيسية", path: "/" },
    { name: "البرامج والمبادرات", path: "/programs" },
    { name: program.title, path: `/programs/${program.slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <ProgramDetails program={program} related={related} />
    </>
  );
}
