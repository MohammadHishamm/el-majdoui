import type { Metadata } from "next";
import { siteConfig } from "@/lib/site/config";
import { HeroSlider } from "@/components/home/HeroSlider";
import { LeadershipSpotlight } from "@/components/home/LeadershipSpotlight";
import { AboutBlock } from "@/components/home/AboutBlock";
import { FocusAreaTiles } from "@/components/home/FocusAreaTiles";
import { FeaturedInitiatives } from "@/components/home/FeaturedInitiatives";
import { ImpactKPIs } from "@/components/home/ImpactKPIs";
import { LatestNews } from "@/components/home/LatestNews";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function HomePage() {
  return (
    <main>
      {/* 1. Hero Slider */}
      <HeroSlider />

      {/* 2. About Block */}
      <AboutBlock />

      {/* 3. Leadership Spotlight */}
      <LeadershipSpotlight />

      {/* 4. Focus Area Tiles */}
      <FocusAreaTiles />

      {/* 5. Featured Initiatives */}
      <FeaturedInitiatives />

      {/* 6. Impact KPIs */}
      <ImpactKPIs />

      {/* 7. Latest News */}
      <LatestNews />
    </main>
  );
}
