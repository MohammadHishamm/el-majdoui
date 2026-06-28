import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { ReorderButtons } from "@/components/admin/reorder-buttons";
import { deleteProgram } from "./actions";

type Row = {
  id: string;
  slug: string;
  title_ar: string;
  category: string;
  sort_order: number;
  published: boolean;
};

export default async function ProgramsListPage() {
  const supabase = await createClient();
  const { t } = await getAdminT();
  const CAT: Record<string, string> = {
    empowerment: t.programs.catEmpowerment,
    mosques: t.programs.catMosques,
    partners: t.programs.catPartners,
  };
  const { data, error } = await supabase
    .from("programs")
    .select("id, slug, title_ar, category, sort_order, published")
    .order("sort_order");
  const rows = (data ?? []) as Row[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t.programs.heading}</h1>
        <Link
          href="/admin/dashboard/programs/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4" /> {t.programs.newProgram}
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
          rows.map((p, i) => (
            <div key={p.id} className="flex items-center justify-between rounded-xl border p-4">
              <div className="flex items-center gap-3" dir="rtl">
                <ReorderButtons table="programs" id={p.id} canUp={i > 0} canDown={i < rows.length - 1} index={i + 1} />
                <span className="font-medium">{p.title_ar}</span>
                <span className="text-xs text-muted-foreground">{CAT[p.category] ?? p.category}</span>
                {!p.published && <span className="rounded-full bg-muted px-2 py-0.5 text-[11px]">{t.common.draft}</span>}
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/dashboard/programs/${p.id}`}
                  className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent"
                >
                  <Pencil className="size-3.5" /> {t.common.edit}
                </Link>
                <form action={deleteProgram.bind(null, p.id)}>
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
