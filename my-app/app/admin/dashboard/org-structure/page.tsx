import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { DeleteButton } from "@/components/admin/delete-button";
import { normalizePeople, orgIcon } from "@/lib/site/org-levels";
import { deleteOrgLevel } from "./actions";

type Row = {
  id: string;
  level_no: number;
  title_ar: string;
  subtitle_ar: string;
  icon: string;
  bg_color: string;
  leaders: unknown;
  members: unknown;
  published: boolean;
};

export default async function OrgStructureListPage() {
  const supabase = await createClient();
  const { t } = await getAdminT();
  const { data, error } = await supabase
    .from("org_levels")
    .select("id, level_no, title_ar, subtitle_ar, icon, bg_color, leaders, members, published")
    .order("level_no");
  const rows = (data ?? []) as Row[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">{t.org.heading}</h1>
        <Link
          href="/admin/dashboard/org-structure/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4" /> {t.org.newLevel}
        </Link>
      </div>

      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {t.common.loadError}
        </p>
      )}

      <div className="grid gap-3">
        {rows.length === 0 ? (
          <p className="rounded-xl border p-6 text-center text-muted-foreground">
            {t.common.noItems}
          </p>
        ) : (
          rows.map((l) => {
            const Icon = orgIcon(l.icon);
            const people =
              normalizePeople(l.leaders).length + normalizePeople(l.members).length;
            return (
              <div
                key={l.id}
                className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3" dir="rtl">
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-lg text-white"
                    style={{ backgroundColor: l.bg_color }}
                  >
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="font-medium">
                      {l.level_no}. {l.title_ar}
                    </div>
                    <div className="text-xs text-muted-foreground">{l.subtitle_ar}</div>
                  </div>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px]">
                    {people} {t.org.peopleCount}
                  </span>
                  {!l.published && (
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px]">
                      {t.common.draft}
                    </span>
                  )}
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/dashboard/org-structure/${l.id}`}
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent"
                  >
                    <Pencil className="size-3.5" /> {t.common.edit}
                  </Link>
                  <DeleteButton action={deleteOrgLevel.bind(null, l.id)} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
