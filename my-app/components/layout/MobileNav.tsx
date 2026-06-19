"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MoonIcon, SearchIcon } from "@/components/layout/header-icons";
import type { NavItem } from "@/lib/site/config";
import { mainNavigation, siteConfig } from "@/lib/site/config";
import { useLocale } from "@/lib/i18n/context";
import { translations } from "@/lib/i18n/translations";

function NavLink({
  item,
  locale,
  onNavigate,
}: {
  item: NavItem;
  locale: "ar" | "en";
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isActive =
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  const label = locale === "en" ? (item.labelEn ?? item.label) : item.label;

  const className = `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "text-accent"
      : "text-white/90 hover:bg-white/5 hover:text-accent"
  }`;

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onNavigate}
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={item.href} className={className} onClick={onNavigate}>
      {label}
    </Link>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { locale } = useLocale();
  const t = translations[locale].header;

  const openLabel = locale === "en" ? "Close menu" : "إغلاق القائمة";
  const closeLabel = locale === "en" ? "Open menu" : "فتح القائمة";
  const siteLabel = locale === "en" ? siteConfig.nameEn : siteConfig.name;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-lg p-2 text-white hover:bg-white/10 lg:hidden"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? openLabel : closeLabel}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sr-only">{open ? (locale === "en" ? "Close" : "إغلاق") : (locale === "en" ? "Menu" : "القائمة")}</span>
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {open && (
        <div
          id="mobile-nav-panel"
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label={openLabel}
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 start-0 w-full max-w-sm bg-header-bg shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <span className="font-bold text-white">{siteLabel}</span>
              <button
                type="button"
                className="rounded-lg p-2 text-white hover:bg-white/10"
                aria-label={openLabel}
                onClick={() => setOpen(false)}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex max-h-[calc(100vh-4rem)] flex-col gap-1 overflow-y-auto p-4">
              {mainNavigation.map((item) => (
                <div key={item.href}>
                  <NavLink item={item} locale={locale} onNavigate={() => setOpen(false)} />
                  {item.children && (
                    <div className="me-3 mt-1 space-y-1 border-s border-white/10 ps-3">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.href}
                          item={child}
                          locale={locale}
                          onNavigate={() => setOpen(false)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="mt-6 flex items-center justify-center gap-1" dir="ltr">
                <button
                  type="button"
                  aria-label={t.searchLabel}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <SearchIcon />
                </button>
                <button
                  type="button"
                  aria-label={t.darkModeLabel}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <MoonIcon />
                </button>
                <LanguageSwitcher mobile />
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
