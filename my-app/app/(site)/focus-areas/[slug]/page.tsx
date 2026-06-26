import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";
import { focusAreas } from "@/lib/site/config";
import EconomicEmpowermentSection from "@/components/focus-area/economic/EconomicEmpowermentSection";
import TargetGroupsSection from "@/components/focus-area/economic/TargetGroupsSection";
import StatsSection from "@/components/focus-area/economic/StatsSection";
import ProgramsSection from "@/components/focus-area/economic/ProgramsSection";
import MosquesIntroSection from "@/components/focus-area/mosques/MosquesIntroSection";
import MosquesTargetGroupsSection from "@/components/focus-area/mosques/MosquesTargetGroupsSection";
import MosquesStatsSection from "@/components/focus-area/mosques/MosquesStatsSection";
import MosquesProgramsSection from "@/components/focus-area/mosques/MosquesProgramsSection";
import PartnersIntroSection from "@/components/focus-area/partners/PartnersIntroSection";
import PartnersTargetGroupsSection from "@/components/focus-area/partners/PartnersTargetGroupsSection";
import PartnersStatsSection from "@/components/focus-area/partners/PartnersStatsSection";
import PartnersProgramsSection from "@/components/focus-area/partners/PartnersProgramsSection";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return focusAreas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = focusAreas.find((a) => a.slug === slug);
  if (!area) return { title: "مجال غير موجود" };
  return { title: area.name, description: area.shortDesc };
}

export default async function FocusAreaDetailPage({ params }: Props) {
  const { slug } = await params;
  const area = focusAreas.find((a) => a.slug === slug);
  if (!area) notFound();

  // التمكين الاقتصادي للمحتاج — fully designed page (GSAP-animated)
  if (slug === "empowerment") {
    return (
      <main dir="rtl" data-nav-surface="light">
        <EconomicEmpowermentSection />
        <TargetGroupsSection />
        <StatsSection />
        <ProgramsSection />
      </main>
    );
  }

  // مساجد المجدوعي — same animated layout as the economic page, different content
  if (slug === "mosques") {
    return (
      <main dir="rtl" data-nav-surface="light">
        <MosquesIntroSection />
        <MosquesTargetGroupsSection />
        <MosquesStatsSection />
        <MosquesProgramsSection />
      </main>
    );
  }

  // شركاء التنفيذ — same animated layout, different content
  if (slug === "partners-development") {
    return (
      <main dir="rtl" data-nav-surface="light">
        <PartnersIntroSection />
        <PartnersTargetGroupsSection />
        <PartnersStatsSection />
        <PartnersProgramsSection />
      </main>
    );
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
