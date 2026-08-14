import { AdminI18nProvider } from "@/components/admin/i18n";
import { ToastProvider } from "@/components/admin/toast";
import { adminDict } from "@/lib/admin-i18n";
import { getAdminLocale, getAdminTheme } from "@/lib/admin-locale";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [locale, theme] = await Promise.all([getAdminLocale(), getAdminTheme()]);
  const dir = adminDict[locale].dir as "ltr" | "rtl";
  return (
    <div
      dir={dir}
      lang={locale}
      className={`admin-theme min-h-screen bg-background text-foreground${theme === "dark" ? " dark" : ""}`}
    >
      <AdminI18nProvider locale={locale} theme={theme}>
        <ToastProvider>{children}</ToastProvider>
      </AdminI18nProvider>
    </div>
  );
}
