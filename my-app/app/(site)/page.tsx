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
import { getFocusAreas, getHeroSlides, getKPIs, getNewsCarousel, getProgramPanels, getSiteSettings, getStrategicAlignment } from "@/lib/cms/fetchers";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, focusAreas, heroSlides, kpis, latestNews, panels, strategic] = await Promise.all([
    getSiteSettings(),
    getFocusAreas(),
    getHeroSlides(),
    getKPIs(),
    getNewsCarousel(),
    getProgramPanels(),
    getStrategicAlignment(),
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

  const orgLd = organizationJsonLd({
    email: settings?.contact.email,
    phone: settings?.contact.phone,
    address: settings?.contact.address.ar,
    sameAs: settings
      ? [
          settings.social.linkedin,
          settings.social.instagram,
          settings.social.twitter,
          settings.social.facebook,
          settings.social.snapchat,
          settings.social.youtube,
        ]
      : [],
  });

  return (
    <main>
      <JsonLd data={[orgLd, websiteJsonLd()]} />
      <HeroSlider slides={heroProps.length ? heroProps : undefined} />
      <FadeInUp><AboutBlock about={settings?.about} /></FadeInUp>
      <FadeInUp><LeadershipSpotlight data={settings?.leadership} /></FadeInUp>
      <FadeInUp><FocusAreaTiles areas={tileProps.length ? tileProps : undefined} /></FadeInUp>
      <FadeInUp><ProgramsExplorer panels={panels.length ? panels : undefined} /></FadeInUp>
      <FadeInUp><StrategicAlignment data={strategic ?? undefined} /></FadeInUp>
      <FadeInUp><ImpactKPIs items={kpis.length ? kpis : undefined} /></FadeInUp>
      <FadeInUp><LatestNews items={latestNews.length ? latestNews : undefined} /></FadeInUp>
      <FadeInUp><ContactSection /></FadeInUp>
    </main>
  );
}
