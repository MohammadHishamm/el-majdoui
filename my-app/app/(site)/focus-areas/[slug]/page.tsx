import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";
import { focusAreas } from "@/lib/site/config";
import { getFocusAreaDetail } from "@/lib/cms/fetchers";
import IntroSection from "@/components/focus-area/detail/IntroSection";
import CarouselSection from "@/components/focus-area/detail/CarouselSection";
import StatsSection from "@/components/focus-area/detail/StatsSection";
import ProgramsSection from "@/components/focus-area/detail/ProgramsSection";

type Props = { params: Promise<{ slug: string }> };

const DETAIL_SLUGS = new Set(["empowerment", "mosques", "partners-development"]);

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return focusAreas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = focusAreas.find((a) => a.slug === slug);
  if (!area) return { title: "مجال غير موجود", robots: { index: false, follow: true } };
  const detail = DETAIL_SLUGS.has(slug) ? await getFocusAreaDetail(slug) : null;
  const title = detail?.title || area.name;
  const description = detail?.intro || area.shortDesc;
  const url = `/focus-areas/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title, description },
  };
}

export default async function FocusAreaDetailPage({ params }: Props) {
  const { slug } = await params;
  const area = focusAreas.find((a) => a.slug === slug);
  if (!area) notFound();

  if (DETAIL_SLUGS.has(slug)) {
    const d = await getFocusAreaDetail(slug);
    if (d) {
      return (
        <main dir="rtl" data-nav-surface="light">
          <IntroSection title={d.title} intro={d.intro} />
          <CarouselSection heading={d.carousel.heading} slides={d.carousel.slides} />
          <StatsSection items={d.stats.items} image={d.stats.image} />
          <ProgramsSection heading={d.programs.heading} cards={d.programs.cards} />
        </main>
      );
    }
  }

  return (
    <PagePlaceholder
      title={area.name}
      description={area.shortDesc}
      eyebrow="مجال التركيز"
      backHref="/focus-areas"
      backLabel="جميع المجالات"
    />
  );
}
