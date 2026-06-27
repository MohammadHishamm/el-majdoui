"use client";

import * as React from "react";
import Link from "next/link";
import {
  Briefcase,
  FileText,
  FolderKanban,
  Home,
  Landmark,
  LayoutDashboard,
  Newspaper,
  Settings2,
  Target,
  type LucideIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { useAdminT } from "@/components/admin/i18n";
import type { AdminDict } from "@/lib/admin-i18n";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { AppRole } from "@/lib/roles";

type NavKey = keyof AdminDict["nav"];
type NavLeaf = { key: NavKey; url: string; roles?: AppRole[] };
type NavGroup = {
  key: NavKey;
  icon: LucideIcon;
  roles?: AppRole[];
  items: NavLeaf[];
};

// Nav organised by site page → its sections. `roles` (omitted = everyone)
// gates each group/leaf so each role only sees what it can manage.
const NAV: NavGroup[] = [
  {
    key: "homePage",
    icon: Home,
    roles: ["super_admin", "content_editor"],
    items: [
      { key: "heroSlides", url: "/admin/dashboard/hero-slides" },
      { key: "aboutLeadership", url: "/admin/dashboard/site-settings" },
      { key: "focusAreas", url: "/admin/dashboard/focus-areas" },
      { key: "impactKpis", url: "/admin/dashboard/kpis" },
      { key: "homePrograms", url: "/admin/dashboard/panels" },
    ],
  },
  {
    key: "newsMedia",
    icon: Newspaper,
    roles: ["super_admin", "news_manager"],
    items: [
      { key: "allArticles", url: "/admin/dashboard/news" },
      { key: "newArticle", url: "/admin/dashboard/news/new" },
      { key: "galleryVideos", url: "/admin/dashboard/gallery" },
      { key: "reports", url: "/admin/dashboard/reports" },
    ],
  },
  {
    key: "focusAreas",
    icon: Target,
    roles: ["super_admin", "content_editor"],
    items: [{ key: "manageAreas", url: "/admin/dashboard/focus-areas" }],
  },
  {
    key: "programs",
    icon: FolderKanban,
    roles: ["super_admin", "content_editor"],
    items: [
      { key: "allPrograms", url: "/admin/dashboard/programs" },
      { key: "newProgram", url: "/admin/dashboard/programs/new" },
    ],
  },
  {
    key: "careers",
    icon: Briefcase,
    roles: ["super_admin", "content_editor"],
    items: [
      { key: "allJobs", url: "/admin/dashboard/careers" },
      { key: "newJob", url: "/admin/dashboard/careers/new" },
    ],
  },
  {
    key: "aboutGroup",
    icon: Landmark,
    roles: ["super_admin", "content_editor"],
    items: [
      { key: "boardLeadership", url: "/admin/dashboard/team" },
      { key: "policies", url: "/admin/dashboard/policies" },
    ],
  },
  {
    key: "sitePages",
    icon: FileText,
    roles: ["super_admin", "content_editor"],
    items: [
      { key: "pgVision", url: "/admin/dashboard/pages/vision-mission" },
      { key: "pgWho", url: "/admin/dashboard/pages/who-we-are" },
      { key: "pgStrategy", url: "/admin/dashboard/pages/strategy" },
      { key: "pgBrand", url: "/admin/dashboard/pages/brand-identity" },
    ],
  },
  {
    key: "settings",
    icon: Settings2,
    items: [
      { key: "siteContent", url: "/admin/dashboard/site-settings", roles: ["super_admin", "content_editor"] },
      { key: "messages", url: "/admin/dashboard/messages", roles: ["super_admin", "content_editor"] },
      { key: "usersRoles", url: "/admin/dashboard/users", roles: ["super_admin"] },
    ],
  },
];

function navForRole(role: AppRole, nav: AdminDict["nav"]) {
  return NAV.filter((g) => !g.roles || g.roles.includes(role))
    .map((g) => ({
      title: nav[g.key],
      url: g.items[0]?.url ?? "/admin/dashboard",
      icon: g.icon,
      items: g.items
        .filter((i) => !i.roles || i.roles.includes(role))
        .map((i) => ({ title: nav[i.key], url: i.url })),
    }))
    .filter((g) => g.items.length > 0);
}

export function AppSidebar({
  user,
  side,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: { name: string; email: string; role: AppRole };
  side?: "left" | "right";
}) {
  const { locale, t } = useAdminT();
  const items = navForRole(user.role, t.nav);
  const resolvedSide = side ?? (locale === "ar" ? "right" : "left");

  return (
    <Sidebar
      collapsible="icon"
      side={resolvedSide}
      dir={locale === "ar" ? "rtl" : "ltr"}
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/admin/dashboard" />}>
              <span className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LayoutDashboard className="size-4" />
              </span>
              <span className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-semibold">{t.brand.name}</span>
                <span className="truncate text-xs">{t.brand.sub}</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
