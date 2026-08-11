import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../focus-accent.css";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";
import { getFocusAreas, getFocusAreaDetail, getMosquesMapContent } from "@/lib/cms/fetchers";
import IntroSection from "@/components/focus-area/detail/IntroSection";
import CarouselSection from "@/components/focus-area/detail/CarouselSection";
import StatsSection from "@/components/focus-area/detail/StatsSection";
import ProgramsSection from "@/components/focus-area/detail/ProgramsSection";
import MosquesMapSection from "@/components/focus-area/mosques/MosquesMapSection";

type Props = { params: Promise<{ slug: string }> };

/* Per-slug accent for section titles, stat numbers, carousel controls and
   the "اعرف أكثر" link. Slugs absent here keep the default palette. */
const ACCENT_SLUGS = new Set(["mosques"]);

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const areas = await getFocusAreas();
  return areas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const areas = await getFocusAreas();
  const area = areas.find((a) => a.slug === slug);
  if (!area) return { title: "مجال غير موجود", robots: { index: false, follow: true } };
  const detail = await getFocusAreaDetail(slug);
  const title = detail?.title || area.name.ar;
  const description = detail?.intro || area.desc.ar;
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
  const areas = await getFocusAreas();
  const area = areas.find((a) => a.slug === slug);
  if (!area) notFound();

  const d = await getFocusAreaDetail(slug);
  // The mosque map is specific to this focus area; skip the query elsewhere.
  const mapContent = slug === "mosques" ? await getMosquesMapContent() : null;
  const hasDetail =
    !!d &&
    (!!d.intro ||
      d.carousel.slides.length > 0 ||
      d.stats.items.length > 0 ||
      d.programs.cards.length > 0);

  const accentSlug = ACCENT_SLUGS.has(slug) ? slug : undefined;

  if (d && hasDetail) {
    return (
      <main dir="rtl" data-nav-surface="light" data-focus-accent={accentSlug}>
        <IntroSection title={d.title} intro={d.intro} slug={slug} />
        {d.carousel.slides.length > 0 && (
          <CarouselSection heading={d.carousel.heading} slides={d.carousel.slides} />
        )}
        {d.stats.items.length > 0 && (
          <StatsSection items={d.stats.items} image={d.stats.image} />
        )}
        {mapContent && mapContent.mosques.length > 0 && (
          <MosquesMapSection
            heading={mapContent.heading}
            intro={mapContent.intro}
            mosques={mapContent.mosques}
          />
        )}
        {d.programs.cards.length > 0 && (
          <ProgramsSection heading={d.programs.heading} cards={d.programs.cards} />
        )}
      </main>
    );
  }

  return (
    <PagePlaceholder
      title={area.name.ar}
      description={area.desc.ar}
      eyebrow="مجال التركيز"
      backHref="/focus-areas"
      backLabel="جميع المجالات"
    />
  );
}
