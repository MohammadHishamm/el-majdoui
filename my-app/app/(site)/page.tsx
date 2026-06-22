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

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function HomePage() {
  return (
    <main>
      <HeroSlider />
      <FadeInUp><AboutBlock /></FadeInUp>
      <FadeInUp><LeadershipSpotlight /></FadeInUp>
      <FadeInUp><FocusAreaTiles /></FadeInUp>
      <FadeInUp><ProgramsExplorer /></FadeInUp>
      <FadeInUp><StrategicAlignment /></FadeInUp>
      <FadeInUp><ImpactKPIs /></FadeInUp>
      <FadeInUp><LatestNews /></FadeInUp>
      <FadeInUp><ContactSection /></FadeInUp>
    </main>
  );
}
