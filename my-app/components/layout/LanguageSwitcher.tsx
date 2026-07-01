"use client";

import { useEffect, useRef, useState } from "react";
import { LocalizeIcon } from "@/components/layout/header-icons";
import { useLocale, type Locale } from "@/lib/i18n/context";
import { translations } from "@/lib/i18n/translations";

const LOCALES: { code: Locale; label: string; short: string }[] = [
  { code: "ar", label: "العربية", short: "AR" },
  { code: "en", label: "English", short: "EN" },
];

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="currentColor"
      aria-hidden
      className={`h-2.5 w-2.5 shrink-0 opacity-70 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="M6 8L2 4h8L6 8z" />
    </svg>
  );
}

export function LanguageSwitcher({ mobile = false }: { mobile?: boolean }) {
  const { locale, setLocale } = useLocale();
  const t = translations[locale].langSwitcher;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  const selectLocale = (code: Locale) => {
    setLocale(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className={mobile ? "relative" : "relative hidden lg:block"}>
      <button
        type="button"
        aria-label={t.changeLanguage}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
      >
        <LocalizeIcon />
        <span className=" pt-1 pl-1 text-[13px] font-medium leading-none tracking-wide">
          {current.short}
        </span>
        <ChevronDown open={open} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t.chooseLanguage}

          className="absolute inset-e-0 top-[calc(100%+6px)] z-50 min-w-[148px] overflow-hidden rounded-lg border border-white/10 bg-header-bg py-1 shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
        >
          {LOCALES.map((item) => (
            <li key={item.code} role="option" aria-selected={locale === item.code}>
              <button
                type="button"
                onClick={() => selectLocale(item.code)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-[14px] transition-colors hover:bg-white/5 hover:text-accent ${
                  locale === item.code ? "text-accent" : "text-white/85"
                }`}
              >
                <span>{item.label}</span>
                <span className="text-[12px] opacity-60">{item.short}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
