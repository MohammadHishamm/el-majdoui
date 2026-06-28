import { siteConfig } from "@/lib/site/config";

/** Canonical site origin with no trailing slash. */
export const SITE_URL = siteConfig.url.replace(/\/+$/, "");

/** Build an absolute URL from a path (passes through full URLs untouched). */
export function absoluteUrl(path = "/"): string {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Default social-share image (foundation logo) used when a page has none. */
export const DEFAULT_OG_IMAGE = "/images/logo.png";

/** Pick a page's own image for OG, falling back to the logo. */
export function ogImage(image?: string | null): string {
  return image && image.trim() ? image : DEFAULT_OG_IMAGE;
}

/** Organization (NGO) structured data for the homepage. `sameAs` = real social links. */
export function organizationJsonLd(opts: {
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  sameAs?: (string | null | undefined)[];
}) {
  const sameAs = (opts.sameAs ?? []).filter(
    (u): u is string => typeof u === "string" && u.trim() !== "" && u.trim() !== "#",
  );
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: siteConfig.fullName,
    alternateName: siteConfig.nameEn,
    url: SITE_URL,
    logo: absoluteUrl(DEFAULT_OG_IMAGE),
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    description: siteConfig.description,
    ...(opts.email ? { email: opts.email } : {}),
    ...(opts.phone ? { telephone: opts.phone } : {}),
    address: {
      "@type": "PostalAddress",
      addressCountry: "SA",
      addressRegion: "Eastern Province",
      addressLocality: "Dammam",
      ...(opts.address ? { streetAddress: opts.address } : {}),
    },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/** WebSite structured data for the homepage. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.fullName,
    url: SITE_URL,
    inLanguage: "ar",
  };
}

/** BreadcrumbList from [{name, path}] items (path relative or absolute). */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}
