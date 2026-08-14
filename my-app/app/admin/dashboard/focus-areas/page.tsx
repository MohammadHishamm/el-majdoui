import Link from "next/link";
import { LayoutPanelTop, Pencil, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { ReorderButtons } from "@/components/admin/reorder-buttons";
import { DeleteButton } from "@/components/admin/delete-button";
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
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">{t.focus.heading}</h1>
          <p className="text-sm text-muted-foreground">{t.focus.orderRtlHint}</p>
        </div>
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
          rows.map((a, i) => (
            <div key={a.id} className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
                <ReorderButtons table="focus_areas" id={a.id} canUp={i > 0} canDown={i < rows.length - 1} index={i + 1} />
                <span className="size-6 rounded" style={{ backgroundColor: a.bg_color }} />
                <span className="font-medium" dir="rtl">{a.name_ar}</span>
                <span className="text-xs text-muted-foreground">/{a.slug}</span>
                {!a.published && <span className="rounded-full bg-muted px-2 py-0.5 text-[11px]">{t.common.draft}</span>}
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <Link
                  href={`/admin/dashboard/focus-areas/${a.id}/detail`}
                  className="inline-flex items-center gap-1 rounded-md border border-primary/40 px-2 py-1 text-xs text-primary hover:bg-primary/5"
                >
                  <LayoutPanelTop className="size-3.5" /> {t.focus.editDetail}
                </Link>
                <Link
                  href={`/admin/dashboard/focus-areas/${a.id}`}
                  className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent"
                >
                  <Pencil className="size-3.5" /> {t.common.edit}
                </Link>
                <DeleteButton action={deleteFocusArea.bind(null, a.id)} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
