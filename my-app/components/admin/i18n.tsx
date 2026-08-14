"use client";

import { createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Languages, Moon, Sun } from "lucide-react";
import { adminDict, type AdminDict, type AdminLocale, type AdminTheme } from "@/lib/admin-i18n";
import { cn } from "@/lib/utils";

type Ctx = { locale: AdminLocale; t: AdminDict; theme: AdminTheme };
const AdminI18nContext = createContext<Ctx>({ locale: "en", t: adminDict.en, theme: "light" });

export function AdminI18nProvider({
  locale,
  theme = "light",
  children,
}: {
  locale: AdminLocale;
  theme?: AdminTheme;
  children: React.ReactNode;
}) {
  /**
   * Mirror the admin theme onto <body>.
   *
   * The admin palette is scoped to `.admin-theme` / `.admin-theme.dark` on a
   * div inside the layout, but Radix portals (the mobile sidebar Sheet, and
   * every dialog/dropdown/tooltip) mount at document.body — *outside* that
   * div. They therefore resolved `--sidebar*`, `--background` and friends from
   * `:root`, which holds the public site's light palette, and rendered as a
   * white panel over the dark admin UI.
   *
   * Custom properties inherit from the nearest declaring ancestor, so putting
   * the same classes on body makes portalled content pick up the admin values
   * without touching the primitives themselves. Removed on unmount so the
   * public site never inherits them.
   */
  useEffect(() => {
    const { body } = document;
    const classes = theme === "dark" ? ["admin-theme", "dark"] : ["admin-theme"];
    body.classList.add(...classes);
    // Remove exactly what was added — the public site's own dark mode lives on
    // <html>, and blindly stripping "dark" here would be reaching outside.
    return () => body.classList.remove(...classes);
  }, [theme]);

  return (
    <AdminI18nContext.Provider value={{ locale, t: adminDict[locale], theme }}>
      {children}
    </AdminI18nContext.Provider>
  );
}

export function useAdminT() {
  return useContext(AdminI18nContext);
}

/** Inline label localizer for form labels not worth a dict key: l("English", "العربية"). */
export function useL() {
  const { locale } = useAdminT();
  return (en: string, ar: string) => (locale === "ar" ? ar : en);
}

/** Toggles EN/AR via cookie + refresh (server components re-read the cookie). */
export function LanguageToggle({ className }: { className?: string }) {
  const { locale, t } = useAdminT();
  const router = useRouter();
  const next = locale === "en" ? "ar" : "en";

  return (
    <button
      type="button"
      onClick={() => {
        document.cookie = `admin_locale=${next};path=/;max-age=31536000`;
        router.refresh();
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium hover:bg-accent",
        className
      )}
      aria-label="Switch language"
    >
      <Languages className="size-4" />
      {t.langName}
    </button>
  );
}

/** Toggles light/dark via cookie + refresh (server re-reads the cookie & re-applies the theme class). */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, t } = useAdminT();
  const router = useRouter();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => {
        document.cookie = `admin_theme=${next};path=/;max-age=31536000`;
        router.refresh();
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium hover:bg-accent",
        className
      )}
      aria-label={t.themeToggle}
      title={t.themeToggle}
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
