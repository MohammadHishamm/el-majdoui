"use client";

import Image from "next/image";
import Link from "next/link";
import { siteConfig, footerNavigation } from "@/lib/site/config";
import { useLocale } from "@/lib/i18n/context";
import { translations } from "@/lib/i18n/translations";

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="text-right">
      <h2 className="mb-4 text-sm font-bold text-white">{title}</h2>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-white/75 transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

type FooterContact = { phone?: string | null; email?: string | null; address?: { ar?: string | null; en?: string | null } };
type FooterSocial = {
  linkedin?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  facebook?: string | null;
  snapchat?: string | null;
  youtube?: string | null;
};
type FooterSocialShow = Partial<Record<keyof FooterSocial, boolean>>;

const SOCIAL = [
  {
    label: "LinkedIn",
    href: siteConfig.social.linkedin,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: siteConfig.social.instagram,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "Snapchat",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
        <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.317 4.187-.076.819.1 1.21.686 1.21h.007c.308 0 .79-.126 1.449-.26.579-.116 1.051-.192 1.43-.192.377 0 .726.05 1.032.156.856.292.905.788.905.849 0 .62-.541.95-1.006 1.193-.166.086-.36.172-.565.26-.622.267-1.395.6-1.735 1.191-.048.085-.069.197-.051.319.077.519.518 1.94 1.731 3.071.58.537 1.369.85 2.248.857.339.008.655.117.893.314.24.197.387.47.387.768 0 .483-.39.895-.966 1.044-.265.067-.569.108-.916.118-.387.013-.805.024-1.244.11-.52.105-.862.271-1.096.459-.348.277-.445.602-.439 1.036.003.216-.017.441-.104.71-.128.4-.451.798-.987 1.154-1.031.683-1.963.806-2.857.806-.35 0-.694-.028-1.03-.057-.43-.037-.87-.08-1.312-.08-.462 0-.93.041-1.385.08-.339.03-.677.057-1.025.057-.906 0-1.826-.125-2.855-.806-.533-.355-.857-.753-.986-1.154-.087-.27-.107-.495-.104-.71.006-.434-.09-.759-.44-1.036-.234-.187-.576-.354-1.096-.459-.439-.086-.857-.097-1.244-.11-.347-.01-.651-.05-.916-.118C.39 19.852 0 19.44 0 18.957c0-.298.147-.571.387-.768.238-.197.554-.306.893-.314.879-.007 1.668-.32 2.248-.857 1.213-1.131 1.654-2.552 1.731-3.071.018-.122-.003-.234-.051-.319-.34-.591-1.113-.924-1.735-1.191a6.62 6.62 0 01-.565-.26C2.363 11.911 1.822 11.581 1.822 10.96c0-.061.049-.557.905-.849a3.22 3.22 0 011.032-.156c.379 0 .851.076 1.43.192.659.134 1.141.26 1.449.26h.007c.586 0 .762-.391.686-1.21-.086-.968-.212-2.994.317-4.187C9.859 1.069 13.216.793 12.206.793z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: siteConfig.social.twitter,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

const QUICK_LINK_HREFS = ["/about", "/programs", "/news", "/careers"];

export function Footer({
  contact,
  social,
  socialShow,
}: {
  contact?: FooterContact;
  social?: FooterSocial;
  socialShow?: FooterSocialShow;
} = {}) {
  const year = new Date().getFullYear();
  const { locale } = useLocale();
  const t = translations[locale].footer;

  const phone = contact?.phone || siteConfig.contact.phone;
  const email = contact?.email || siteConfig.contact.email;
  const address =
    (locale === "en" ? contact?.address?.en : contact?.address?.ar) ||
    (locale === "en" ? siteConfig.contact.addressEn : siteConfig.contact.address);
  // Each social maps to its URL + a show flag + the social-object key.
  const socialMeta: Record<string, { href: string | null | undefined; key: keyof FooterSocial }> = {
    LinkedIn: { href: social?.linkedin, key: "linkedin" },
    Instagram: { href: social?.instagram, key: "instagram" },
    Snapchat: { href: social?.snapchat, key: "snapchat" },
    Facebook: { href: social?.facebook, key: "facebook" },
    X: { href: social?.twitter, key: "twitter" },
    YouTube: { href: social?.youtube, key: "youtube" },
  };
  // Show a platform only when its checkbox is on AND it has a real URL (not empty / not "#").
  const visibleSocial = SOCIAL.filter((s) => {
    const meta = socialMeta[s.label];
    if (!meta) return false;
    const show = socialShow?.[meta.key] ?? true;
    const url = (meta.href ?? "").trim();
    return show && url !== "" && url !== "#";
  });

  const quickLinks = QUICK_LINK_HREFS.map((href, i) => ({
    label: t.quickLinkLabels[i],
    href,
  }));

  const focusLinks = footerNavigation.focus.map((link) => ({
    label: locale === "en" ? (link.labelEn ?? link.label) : link.label,
    href: link.href,
  }));

  return (
    <footer className="mt-auto bg-footer-bg text-white">
      <div className="mx-auto w-full max-w-[1280px] px-6 py-14 md:py-16">
        {/* Figma column order (RTL: first = rightmost): Brand → Quick Links → Focus Areas → Contact */}
        <div className="grid items-start gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand — rightmost in RTL */}
          <div className="text-right">
            <Image
              src="/images/home/updated-svgs/header-footer-logo.svg"
              alt={siteConfig.name}
              width={240}
              height={96}
              className="-mt-4 mb-1 block h-auto w-[200px] md:w-[240px] p-2"
            />
            <p className="text-sm leading-7 text-white/75">{t.siteDescription}</p>
          </div>

          <FooterColumn title={t.quickLinks} links={quickLinks} />

          <FooterColumn title={t.focusAreas} links={focusLinks} />

          {/* Contact — leftmost in RTL */}
          <div className="text-right">
            <h2 className="mb-4 text-sm font-bold">{t.contactUs}</h2>
            <ul className="space-y-3 text-sm text-white/75">
              <li className="flex w-full items-center justify-start gap-2">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-accent" aria-hidden>
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span dir="ltr">{phone}</span>
              </li>
              <li className="flex w-full items-center justify-start gap-2">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-accent" aria-hidden>
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span dir="ltr">{email}</span>
              </li>
              <li className="flex w-full items-center justify-start gap-2">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-accent" aria-hidden>
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar: social icons RIGHT, copyright LEFT (RTL: social first in DOM) */}
        <div className="mt-12 flex flex-col gap-6 border-t border-white/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            {visibleSocial.map((s) => (
              <a
                key={s.label}
                href={socialMeta[s.label]?.href || s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-accent"
              >
                {s.icon}
              </a>
            ))}
          </div>

          <p className="text-sm text-white/60">
            © {year} {siteConfig.fullName}. {t.allRights}.
          </p>
        </div>
      </div>
    </footer>
  );
}
