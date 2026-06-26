import Link from "next/link";
import { FileText, Image as ImageIcon, Target, Users } from "lucide-react";
import { getCurrentProfile, ROLE_LABELS } from "@/lib/auth";
import { getAdminT } from "@/lib/admin-locale";

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  const role = profile?.role ?? "news_manager";
  const { t } = await getAdminT();

  const cards = [
    { title: t.dash.heroSlides, href: "/admin/dashboard/hero-slides", icon: ImageIcon, roles: ["super_admin", "content_editor"] },
    { title: t.dash.news, href: "/admin/dashboard/news", icon: FileText, roles: ["super_admin", "news_manager"] },
    { title: t.dash.focus, href: "/admin/dashboard/focus-areas", icon: Target, roles: ["super_admin", "content_editor"] },
    { title: t.dash.users, href: "/admin/dashboard/users", icon: Users, roles: ["super_admin"] },
  ].filter((c) => c.roles.includes(role));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">{t.dash.welcome}{profile?.full_name ? `، ${profile.full_name}` : ""}</h1>
        <p className="text-sm text-muted-foreground">
          {t.dash.signedInAs} {profile?.email} · {ROLE_LABELS[role]}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="flex items-center gap-3 rounded-xl border bg-card p-5 transition-colors hover:bg-accent"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <c.icon className="size-5" />
            </span>
            <span className="font-medium">{c.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
