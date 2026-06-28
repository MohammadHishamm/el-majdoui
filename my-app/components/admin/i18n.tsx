"use client";

import { createContext, useContext } from "react";
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
  return (
    <AdminI18nContext.Provider value={{ locale, t: adminDict[locale], theme }}>
      {children}
    </AdminI18nContext.Provider>
  );
}

export function useAdminT() {
  return useContext(AdminI18nContext);
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
