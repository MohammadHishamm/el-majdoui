"use client";

import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { adminDict, type AdminDict, type AdminLocale } from "@/lib/admin-i18n";
import { cn } from "@/lib/utils";

type Ctx = { locale: AdminLocale; t: AdminDict };
const AdminI18nContext = createContext<Ctx>({ locale: "en", t: adminDict.en });

export function AdminI18nProvider({
  locale,
  children,
}: {
  locale: AdminLocale;
  children: React.ReactNode;
}) {
  return (
    <AdminI18nContext.Provider value={{ locale, t: adminDict[locale] }}>
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
