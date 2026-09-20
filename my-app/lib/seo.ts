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
// 1200x630 card for link previews (WhatsApp, X, LinkedIn). The previous default was
// the white/reversed logo on a transparent background, which rendered as a blank
// white box in every preview.
export const DEFAULT_OG_IMAGE = "/images/seo/og-default.png";
// Square, >=112px each side, on a solid background - Google's requirements for the
// Organization logo rich result.
export const ORG_LOGO_IMAGE = "/images/seo/logo-512.png";

/** "0138198415" -> "+966138198415" so search engines read it as a real number. */
function e164SaudiPhone(raw: string): string {
  const d = raw.replace(/\D/g, "");
  if (d.startsWith("966")) return "+" + d;
  if (d.startsWith("0") && d.length === 10) return "+966" + d.slice(1);
  return raw;
}

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
    logo: absoluteUrl(ORG_LOGO_IMAGE),
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    description: siteConfig.description,
    ...(opts.email ? { email: opts.email } : {}),
    ...(opts.phone ? { telephone: e164SaudiPhone(opts.phone) } : {}),
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
