"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MoonIcon, SearchIcon } from "@/components/layout/header-icons";
import "@/components/layout/header-search.css";
import type { NavItem } from "@/lib/site/config";
import { mainNavigation } from "@/lib/site/config";
import { useLocale } from "@/lib/i18n/context";
import { translations } from "@/lib/i18n/translations";
import { searchSite } from "@/lib/cms/search";
import { TYPE_LABELS, type SearchResult } from "@/lib/cms/search-types";

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
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const { locale } = useLocale();
  const t = translations[locale].header;
  const isArabic = locale === "ar";

  const openLabel = locale === "en" ? "Close menu" : "إغلاق القائمة";
  const closeLabel = locale === "en" ? "Open menu" : "فتح القائمة";

  const closeMenu = () => {
    setOpen(false);
    setSearchMode(false);
    setSearchQuery("");
  };

  useEffect(() => {
    // Close the menu on navigation (covers browser back/forward too).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (searchMode) searchInputRef.current?.focus();
  }, [searchMode]);

  // Debounced live search (all setState inside the timeout to satisfy react-hooks/set-state-in-effect).
  useEffect(() => {
    const term = searchQuery.trim();
    let active = true;
    const id = setTimeout(async () => {
      if (term.length < 2) {
        if (active) {
          setSearchResults([]);
          setSearchLoading(false);
        }
        return;
      }
      if (active) setSearchLoading(true);
      try {
        const res = await searchSite(term);
        if (active) setSearchResults(res);
      } catch {
        if (active) setSearchResults([]);
      } finally {
        if (active) setSearchLoading(false);
      }
    }, term.length < 2 ? 0 : 250);
    return () => {
      active = false;
      clearTimeout(id);
    };
  }, [searchQuery]);

  return (
    <>
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-lg p-2 text-white hover:bg-white/10 lg:hidden"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? openLabel : closeLabel}
        onClick={() => (open ? closeMenu() : setOpen(true))}
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
            onClick={closeMenu}
          />
          <div className="absolute start-0 top-0 flex h-[100dvh] w-full max-w-sm flex-col bg-header-bg shadow-xl">
            <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4 py-4">
              <div className="flex min-w-0 flex-1 items-center justify-start gap-0.5" dir="ltr">
                <button
                  type="button"
                  aria-label={t.searchLabel}
                  aria-pressed={searchMode}
                  onClick={() => setSearchMode((v) => !v)}
                  className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/10 hover:text-white ${
                    searchMode ? "bg-white/10 text-white" : "text-white/80"
                  }`}
                >
                  <SearchIcon />
                </button>
                <button
                  type="button"
                  aria-label={t.darkModeLabel}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <MoonIcon />
                </button>
                <LanguageSwitcher mobile />
              </div>
              <button
                type="button"
                className="shrink-0 rounded-lg p-2 text-white hover:bg-white/10"
                aria-label={openLabel}
                onClick={closeMenu}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {searchMode ? (
              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 pb-8">
                <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 focus-within:outline-none">
                  <SearchIcon />
                  <input
                    ref={searchInputRef}
                    type="text"
                    inputMode="search"
                    enterKeyHint="search"
                    role="searchbox"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    autoComplete="off"
                    placeholder={t.searchPlaceholder}
                    aria-label={t.searchLabel}
                    className={`header-search-input min-w-0 flex-1 bg-transparent py-1 text-[15px] text-white placeholder:text-white/50 focus-visible:outline-none ${
                      isArabic ? "text-right" : "text-left"
                    }`}
                  />
                </div>

                {searchQuery.trim().length >= 2 && (
                  <div className="mt-3">
                    {searchResults.length === 0 ? (
                      <p className={`py-3 text-[14px] text-white/70 ${isArabic ? "text-right" : "text-left"}`}>
                        {searchLoading
                          ? isArabic
                            ? "جارٍ البحث…"
                            : "Searching…"
                          : isArabic
                            ? "لا توجد نتائج"
                            : "No results"}
                      </p>
                    ) : (
                      <ul className="flex flex-col divide-y divide-white/10">
                        {searchResults.map((result) => (
                          <li key={result.url}>
                            <Link
                              href={result.url}
                              onClick={closeMenu}
                              className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-white/5"
                            >
                              <span className={`min-w-0 flex-1 ${isArabic ? "text-right" : "text-left"}`}>
                                <span className="block truncate text-[15px] font-medium text-white">{result.title}</span>
                                {result.snippet && (
                                  <span className="block truncate text-[13px] text-white/55">{result.snippet}</span>
                                )}
                              </span>
                              <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-white/70">
                                {TYPE_LABELS[result.typeKey][isArabic ? "ar" : "en"]}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-4 pb-8">
                {mainNavigation.map((item) => (
                  <div key={item.href}>
                    <NavLink item={item} locale={locale} onNavigate={closeMenu} />
                    {item.children && (
                      <div className="me-3 mt-1 space-y-1 border-s border-white/10 ps-3">
                        {item.children.map((child) => (
                          <NavLink
                            key={child.href}
                            item={child}
                            locale={locale}
                            onNavigate={closeMenu}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            )}
          </div>
        </div>
      )}
    </>
  );
}
