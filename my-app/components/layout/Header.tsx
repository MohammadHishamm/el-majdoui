"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MoonIcon, SearchIcon } from "@/components/layout/header-icons";
import { MobileNav } from "@/components/layout/MobileNav";
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
  const headerRef = useRef<HTMLElement>(null);
  const overLight = useHeaderOverLight(headerRef);
  const solidHeader = overLight || openMenu !== null;
  const { locale } = useLocale();
  const t = translations[locale].header;

  const navItemClass = (active = false) =>
    `relative z-10 flex items-center gap-1 px-3 py-2 text-[16px] font-medium transition-colors ${
      active ? "text-accent" : "text-white/95 hover:text-accent"
    }`;

  useEffect(() => {
    if (!openMenu) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

  const openMenuOnHover = (href: string) => setOpenMenu(href);
  const closeMenuOnHover = () => setOpenMenu(null);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 transition-[background-color] duration-300"
      style={{ backgroundColor: solidHeader ? HEADER_SOLID_BG : "transparent" }}
    >
      <div className="relative">
        <div className="mx-auto flex h-28 w-full max-w-[1280px] items-center justify-between px-6">

          <Link href="/" className="relative z-10 shrink-0" aria-label={siteConfig.name}>
            <Image
              src="/images/logo.png"
              alt={siteConfig.name}
              width={260}
              height={143}
              className="h-[100px] w-auto object-contain"
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
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      className={navItemClass(isOpen)}
                    >
                      {locale === "en" ? (item.labelEn ?? item.label) : item.label}
                      <ChevronDown open={isOpen} />
                    </button>
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
                          <p className="text-right text-[18px] font-bold text-white">
                            {locale === "en" ? (item.labelEn ?? item.label) : item.label}
                          </p>
                          <div className="my-4 h-px w-full bg-white/20" />
                          <div className="flex justify-start">
                            <div className="min-w-[240px]">
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setOpenMenu(null)}
                                  className="block py-[9px] text-right text-[15px] text-white/80 transition-colors hover:text-accent"
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

          {/*
           * Utility cluster — explicit LTR so order matches Figma:
           * Search → Moon → Globe → EN (globe left of EN)
           */}
          <div className="relative z-10 flex items-center gap-0.5" dir="ltr">
            <button
              type="button"
              aria-label={t.searchLabel}
              className="hidden h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white lg:inline-flex"
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
      </div>
    </header>
  );
}
