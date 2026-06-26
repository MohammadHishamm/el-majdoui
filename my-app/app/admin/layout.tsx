import { AdminI18nProvider } from "@/components/admin/i18n";
import { adminDict } from "@/lib/admin-i18n";
import { getAdminLocale } from "@/lib/admin-locale";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const locale = await getAdminLocale();
  const dir = adminDict[locale].dir as "ltr" | "rtl";
  return (
    <div dir={dir} lang={locale} className="admin-theme min-h-screen bg-background text-foreground">
      <AdminI18nProvider locale={locale}>{children}</AdminI18nProvider>
    </div>
  );
}
