import type { Metadata } from "next";
import { siteConfig } from "@/lib/site/config";
import { HeroSlider } from "@/components/home/HeroSlider";
import { AboutBlock } from "@/components/home/AboutBlock";
import { LeadershipSpotlight } from "@/components/home/LeadershipSpotlight";
import { FocusAreaTiles } from "@/components/home/FocusAreaTiles";
import { ProgramsExplorer } from "@/components/home/ProgramsExplorer";
import { StrategicAlignment } from "@/components/home/StrategicAlignment";
import { ImpactKPIs } from "@/components/home/ImpactKPIs";
import { LatestNews } from "@/components/home/LatestNews";
import { ContactSection } from "@/components/home/ContactSection";
import { FadeInUp } from "@/components/ui/fade-in-up";
import { getFocusAreas, getHeroSlides, getKPIs, getLatestNews, getProgramPanels, getSiteSettings } from "@/lib/cms/fetchers";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, focusAreas, heroSlides, kpis, latestNews, panels] = await Promise.all([
    getSiteSettings(),
    getFocusAreas(),
    getHeroSlides(),
    getKPIs(),
    getLatestNews(),
    getProgramPanels(),
  ]);

  const heroProps = heroSlides.map((s) => ({ id: s.id, image: s.image, title: s.title, href: s.href }));
  const tileProps = focusAreas.map((a) => ({
    slug: a.slug,
    name: a.name,
    desc: a.desc,
    bg: a.bg,
    btnText: a.btnText,
    icon: a.icon ?? "",
    watermark: a.watermark ?? "",
  }));

  return (
    <main>
      <HeroSlider slides={heroProps.length ? heroProps : undefined} />
      <FadeInUp><AboutBlock about={settings?.about} /></FadeInUp>
      <FadeInUp><LeadershipSpotlight data={settings?.leadership} /></FadeInUp>
      <FadeInUp><FocusAreaTiles areas={tileProps.length ? tileProps : undefined} /></FadeInUp>
      <FadeInUp><ProgramsExplorer panels={panels.length ? panels : undefined} /></FadeInUp>
      <FadeInUp><StrategicAlignment /></FadeInUp>
      <FadeInUp><ImpactKPIs items={kpis.length ? kpis : undefined} /></FadeInUp>
      <FadeInUp><LatestNews items={latestNews.length ? latestNews : undefined} /></FadeInUp>
      <FadeInUp><ContactSection /></FadeInUp>
    </main>
  );
}
