import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { deleteFocusArea } from "./actions";

type Row = {
  id: string;
  slug: string;
  name_ar: string;
  bg_color: string;
  sort_order: number;
  published: boolean;
};

export default async function FocusAreasListPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("focus_areas")
    .select("id, slug, name_ar, bg_color, sort_order, published")
    .order("sort_order");
  const rows = (data ?? []) as Row[];
  const { t } = await getAdminT();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t.focus.heading}</h1>
        <Link
          href="/admin/dashboard/focus-areas/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4" /> {t.focus.newArea}
        </Link>
      </div>

      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {t.common.loadError}
        </p>
      )}

      <div className="grid gap-3">
        {rows.length === 0 ? (
          <p className="rounded-xl border p-6 text-center text-muted-foreground">{t.common.noItems}</p>
        ) : (
          rows.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <span className="size-6 rounded" style={{ backgroundColor: a.bg_color }} />
                <span className="font-medium" dir="rtl">{a.name_ar}</span>
                <span className="text-xs text-muted-foreground">/{a.slug}</span>
                {!a.published && <span className="rounded-full bg-muted px-2 py-0.5 text-[11px]">{t.common.draft}</span>}
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/dashboard/focus-areas/${a.id}`}
                  className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent"
                >
                  <Pencil className="size-3.5" /> {t.common.edit}
                </Link>
                <form action={deleteFocusArea.bind(null, a.id)}>
                  <button className="inline-flex items-center gap-1 rounded-md border border-destructive/40 px-2 py-1 text-xs text-destructive hover:bg-destructive/5">
                    <Trash2 className="size-3.5" /> {t.common.delete}
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
