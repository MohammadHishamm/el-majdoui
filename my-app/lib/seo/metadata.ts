import type { Metadata } from "next";
import { siteConfig } from "@/lib/site/config";

type PageMeta = {
  title: string;
  description?: string;
  path?: string;
};

export function buildPageMetadata({ title, description, path }: PageMeta): Metadata {
  const url = path ? `${siteConfig.url}${path}` : siteConfig.url;

  return {
    title,
    description: description ?? siteConfig.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: description ?? siteConfig.description,
      url,
      locale: siteConfig.locale,
      siteName: siteConfig.fullName,
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: siteConfig.fullName,
    alternateName: siteConfig.nameEn,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}
