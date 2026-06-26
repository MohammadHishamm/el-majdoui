import Link from "next/link";
import { BarChart3, Pencil, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { deleteKpi } from "./actions";

type Row = { id: string; value: number; suffix: string; label_ar: string; published: boolean };

export default async function KpisListPage() {
  const supabase = await createClient();
  const { t } = await getAdminT();
  const { data, error } = await supabase
    .from("kpis")
    .select("id, value, suffix, label_ar, published")
    .order("sort_order");
  const rows = (data ?? []) as Row[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t.kpis.heading}</h1>
        <Link href="/admin/dashboard/kpis/new" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="size-4" /> {t.kpis.newKpi}
        </Link>
      </div>
      {error && <p className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">{t.common.loadError}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        {rows.length === 0 ? (
          <p className="rounded-xl border p-6 text-center text-muted-foreground sm:col-span-2">{t.common.noItems}</p>
        ) : (
          rows.map((k) => (
            <div key={k.id} className="flex items-center justify-between rounded-xl border p-4">
              <div className="flex items-center gap-3" dir="rtl">
                <span className="grid size-9 place-items-center rounded bg-muted text-muted-foreground"><BarChart3 className="size-4" /></span>
                <div>
                  <div className="font-bold text-primary">{k.value}{k.suffix}</div>
                  <div className="text-xs text-muted-foreground">{k.label_ar}</div>
                </div>
                {!k.published && <span className="rounded-full bg-muted px-2 py-0.5 text-[11px]">{t.common.draft}</span>}
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/dashboard/kpis/${k.id}`} className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent"><Pencil className="size-3.5" /> {t.common.edit}</Link>
                <form action={deleteKpi.bind(null, k.id)}>
                  <button className="inline-flex items-center gap-1 rounded-md border border-destructive/40 px-2 py-1 text-xs text-destructive hover:bg-destructive/5"><Trash2 className="size-3.5" /> {t.common.delete}</button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
