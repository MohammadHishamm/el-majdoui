"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MoonIcon, SearchIcon } from "@/components/layout/header-icons";
import { MobileNav } from "@/components/layout/MobileNav";
import "@/components/layout/header-search.css";
import { HEADER_SOLID_BG, useHeaderOverLight } from "@/components/layout/use-header-surface";
import { mainNavigation, siteConfig } from "@/lib/site/config";
import { useLocale } from "@/lib/i18n/context";
import { translations } from "@/lib/i18n/translations";

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="currentColor"
      aria-hidden
      className={`h-3 w-3 shrink-0 opacity-70 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="M6 8L2 4h8L6 8z" />
    </svg>
  );
}

function CloseIcon({ className = "h-3.5 w-3.5 shrink-0" }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden className={className}>
      <path
        d="M1 1l12 12M13 1L1 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const HEADER_H = 112;

const dropdownOpenClasses = [
  "visible opacity-100",
  "[clip-path:inset(0_0_0%_0)]",
].join(" ");

const dropdownClosedClasses = [
  "invisible opacity-0",
  "[clip-path:inset(0_0_100%_0)]",
].join(" ");

export function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const headerRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const overLight = useHeaderOverLight(headerRef);
  const solidHeader = overLight || openMenu !== null || searchOpen;
  const { locale } = useLocale();
  const t = translations[locale].header;
  const isArabic = locale === "ar";
  const dropdownTextAlign = isArabic ? "text-right" : "text-left";

  const navItemClass = (active = false) =>
    `relative z-10 flex items-center gap-1 px-3 py-2 text-[16px] font-medium transition-colors ${
      active ? "text-accent" : "text-white/95 hover:text-accent"
    }`;

  const openSearch = () => {
    setOpenMenu(null);
    setSearchOpen(true);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  const toggleSearch = () => {
    if (searchOpen) closeSearch();
    else openSearch();
  };

  useEffect(() => {
    if (!searchOpen) return;
    searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!openMenu && !searchOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
        setSearchOpen(false);
        setSearchQuery("");
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setSearchOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu, searchOpen]);

  const openMenuOnHover = (href: string) => {
    setSearchOpen(false);
    setOpenMenu(href);
  };

  const closeMenuOnHover = () => setOpenMenu(null);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 transition-[background-color] duration-300"
      style={{ backgroundColor: solidHeader ? HEADER_SOLID_BG : "transparent" }}
    >
      <div className="relative">
        <div className="mx-auto flex h-28 w-full max-w-[1280px] items-center justify-between gap-6 px-6">
          <Link href="/" className="relative z-10 shrink-0" aria-label={siteConfig.name}>
            <Image
              src="/images/home/updated-svgs/header-footer-logo.svg"
              alt={siteConfig.name}
              width={182.127}
              height={111.994}
              className=" object-contain"
              priority
            />
          </Link>

          <nav
            className="hidden h-full flex-1 items-stretch justify-center gap-1 lg:flex"
            aria-label={t.mainNavLabel}
          >
            {mainNavigation.map((item) => {
              const isOpen = openMenu === item.href;

              return (
                <div
                  key={item.href}
                  className="flex h-full items-center"
                  onMouseEnter={() => item.children && openMenuOnHover(item.href)}
                  onMouseLeave={() => item.children && closeMenuOnHover()}
                >
                  {item.children ? (
                    <Link
                      href={item.href}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      onClick={() => setOpenMenu(null)}
                      className={navItemClass(isOpen)}
                    >
                      {locale === "en" ? (item.labelEn ?? item.label) : item.label}
                      <ChevronDown open={isOpen} />
                    </Link>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setOpenMenu(null)}
                      className={navItemClass()}
                    >
                      {locale === "en" ? (item.labelEn ?? item.label) : item.label}
                    </Link>
                  )}

                  {item.children && (
                    <div
                      className={[
                        "absolute left-0 right-0 top-0 z-1",
                        "transition-all duration-200 ease-out",
                        isOpen ? dropdownOpenClasses : dropdownClosedClasses,
                      ].join(" ")}
                      style={{ backgroundColor: HEADER_SOLID_BG }}
                      aria-hidden={!isOpen}
                    >
                      <div style={{ paddingTop: HEADER_H }}>
                        <div className="mx-auto max-w-[1280px] px-6 pt-5 pb-7">
                          <p className={`${dropdownTextAlign} text-[18px] font-bold text-white`}>
                            {locale === "en" ? (item.labelEn ?? item.label) : item.label}
                          </p>
                          <div className="my-4 h-px w-full bg-white/20" />
                          <div className="flex justify-start">
                            <div className={`min-w-[240px] ${dropdownTextAlign}`}>
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setOpenMenu(null)}
                                  className={`block py-[9px] text-[15px] text-white/80 transition-colors hover:text-accent ${dropdownTextAlign}`}
                                >
                                  {locale === "en" ? (child.labelEn ?? child.label) : child.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="relative z-10 flex items-center gap-0.5" dir="ltr">
            <button
              type="button"
              aria-label={t.searchLabel}
              aria-expanded={searchOpen}
              aria-controls="header-search-panel"
              onClick={toggleSearch}
              className={`hidden h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/10 lg:inline-flex ${
                searchOpen ? "bg-white/10 text-white" : "text-white/80 hover:text-white"
              }`}
            >
              <SearchIcon />
            </button>
            <button
              type="button"
              aria-label={t.darkModeLabel}
              className="hidden h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white lg:inline-flex"
            >
              <MoonIcon />
            </button>
            <LanguageSwitcher />
            <MobileNav />
          </div>
        </div>

        {/* Search dropdown — same slide-down panel as nav menus */}
        <div
          id="header-search-panel"
          className={[
            "absolute left-0 right-0 top-0 z-1",
            "transition-all duration-200 ease-out",
            searchOpen ? dropdownOpenClasses : dropdownClosedClasses,
          ].join(" ")}
          style={{ backgroundColor: HEADER_SOLID_BG }}
          aria-hidden={!searchOpen}
        >
          <div style={{ paddingTop: HEADER_H }}>
            <div className="mx-auto max-w-[1280px] px-6 pb-7 pt-5">
              <div className="flex items-center gap-6">
                <form
                  role="search"
                  className="header-search-form relative flex min-w-0 max-w-[1232px] flex-1 items-center gap-4"
                  style={{ height: 63.62, maxHeight: 80 }}
                  onSubmit={(event) => event.preventDefault()}
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    inputMode="search"
                    enterKeyHint="search"
                    role="searchbox"
                    name="q"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    autoComplete="off"
                    placeholder={t.searchPlaceholder}
                    aria-label={t.searchLabel}
                    tabIndex={searchOpen ? 0 : -1}
                    className="header-search-input min-w-0 flex-1 bg-transparent py-2 text-right text-[15px] font-normal leading-none tracking-normal text-white placeholder:text-right placeholder:text-white/55"
                  />
                  <span className="header-search-underline" aria-hidden />
                  <SearchIcon className="relative z-[1] h-4 w-4 shrink-0 opacity-90" />
                </form>

                <button
                  type="button"
                  onClick={closeSearch}
                  tabIndex={searchOpen ? 0 : -1}
                  className="shrink-0 text-[15px] font-normal leading-none text-white/95 transition-colors hover:text-white"
                >
                  <span className="relative inline-block">
                    {t.searchClose}
                    <CloseIcon className="absolute -top-1.5 end-[-7px] h-2 w-2" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
