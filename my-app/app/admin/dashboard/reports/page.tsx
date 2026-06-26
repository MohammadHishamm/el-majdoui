import Link from "next/link";
import { FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { deleteReport } from "./actions";

type Row = {
  id: string;
  title_ar: string;
  period_ar: string;
  file: string;
  published: boolean;
};

export default async function ReportsListPage() {
  const supabase = await createClient();
  const { t } = await getAdminT();
  const { data, error } = await supabase
    .from("reports")
    .select("id, title_ar, period_ar, file, published")
    .order("sort_order");
  const rows = (data ?? []) as Row[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t.reports.heading}</h1>
        <Link
          href="/admin/dashboard/reports/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4" /> {t.reports.newReport}
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
          rows.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-xl border p-4">
              <div className="flex items-center gap-3" dir="rtl">
                <span className="grid size-8 place-items-center rounded bg-muted text-muted-foreground">
                  <FileText className="size-4" />
                </span>
                <div>
                  <div className="font-medium">{r.title_ar}</div>
                  <div className="text-xs text-muted-foreground">{r.period_ar}</div>
                </div>
                {!r.published && <span className="rounded-full bg-muted px-2 py-0.5 text-[11px]">{t.common.draft}</span>}
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/dashboard/reports/${r.id}`}
                  className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent"
                >
                  <Pencil className="size-3.5" /> {t.common.edit}
                </Link>
                <form action={deleteReport.bind(null, r.id)}>
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
