import type { MetadataRoute } from "next";
import { focusAreas, siteConfig } from "@/lib/site/config";

const staticRoutes = [
  "",
  "/focus-areas",
  "/programs",
  "/media-center",
  "/news",
  "/gallery",
  "/videos",
  "/reports",
  "/brand-identity",
  "/about",
  "/about/who-we-are",
  "/about/vision-mission",
  "/about/strategy",
  "/about/board",
  "/about/leadership",
  "/about/policies",
  "/careers",
  "/contact",
  "/privacy-policy",
  "/sitemap",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...focusAreas.map((area) => ({
      url: `${base}/focus-areas/${area.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
