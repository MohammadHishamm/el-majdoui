import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getAllNews, getAllPrograms, getAllJobs, getFocusAreas } from "@/lib/cms/fetchers";

// Rebuild the sitemap on a schedule so newly published DB content gets indexed.
export const revalidate = 3600;

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [news, programs, jobs, areas] = await Promise.all([
    getAllNews(),
    getAllPrograms(),
    getAllJobs(),
    getFocusAreas(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const focusEntries: MetadataRoute.Sitemap = areas.map((a) => ({
    url: `${SITE_URL}/focus-areas/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const newsEntries: MetadataRoute.Sitemap = news.map((n) => ({
    url: `${SITE_URL}/news/${n.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const programEntries: MetadataRoute.Sitemap = programs.map((p) => ({
    url: `${SITE_URL}/programs/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const jobEntries: MetadataRoute.Sitemap = jobs.map((j) => ({
    url: `${SITE_URL}/careers/${j.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...focusEntries, ...newsEntries, ...programEntries, ...jobEntries];
}
