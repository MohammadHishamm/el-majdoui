import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getCurrentProfile } from "@/lib/auth";
import { getAdminT } from "@/lib/admin-locale";
import { LanguageToggle, ThemeToggle } from "@/components/admin/i18n";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/admin");
  const { locale, t } = await getAdminT();
  const isArabic = locale === "ar";

  const sidebar = (
    <AppSidebar
      side={isArabic ? "right" : "left"}
      user={{
        name: profile.full_name || profile.email,
        email: profile.email,
        role: profile.role,
      }}
    />
  );

  const inset = (
    <SidebarInset dir={isArabic ? "rtl" : "ltr"}>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex flex-1 items-center gap-2 px-4">
          <SidebarTrigger className="-ms-1" />
          <Separator orientation="vertical" className="me-2 data-[orientation=vertical]:h-4" />
          <span className="text-sm font-medium">{t.header}</span>
          <div className="ms-auto flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
    </SidebarInset>
  );

  return (
    <SidebarProvider dir="ltr">
      {isArabic ? (
        <>
          {inset}
          {sidebar}
        </>
      ) : (
        <>
          {sidebar}
          {inset}
        </>
      )}
    </SidebarProvider>
  );
}
