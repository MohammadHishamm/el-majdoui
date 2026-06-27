import Link from "next/link";
import { Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";

type Row = { id: string; slug: string; name_ar: string; bg_color: string; initiatives: unknown[] };

export default async function PanelsListPage() {
  const supabase = await createClient();
  const { t } = await getAdminT();
  const { data, error } = await supabase
    .from("program_panels")
    .select("id, slug, name_ar, bg_color, initiatives")
    .order("sort_order");
  const rows = (data ?? []) as Row[];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">{t.panels.heading}</h1>
      {error && <p className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">{t.common.loadError}</p>}
      <div className="grid gap-3">
        {rows.length === 0 ? (
          <p className="rounded-xl border p-6 text-center text-muted-foreground">{t.common.noItems}</p>
        ) : (
          rows.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-xl border p-4">
              <div className="flex items-center gap-3" dir="rtl">
                <span className="size-6 rounded" style={{ backgroundColor: p.bg_color }} />
                <span className="font-medium">{p.name_ar}</span>
                <span className="text-xs text-muted-foreground">
                  {Array.isArray(p.initiatives) ? p.initiatives.length : 0} {t.panels.initiatives}
                </span>
              </div>
              <Link href={`/admin/dashboard/panels/${p.id}`} className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent">
                <Pencil className="size-3.5" /> {t.common.edit}
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
