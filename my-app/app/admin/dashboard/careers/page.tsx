import Link from "next/link";
import { Briefcase, Pencil, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { ReorderButtons } from "@/components/admin/reorder-buttons";
import { deleteJob, updateCareersContent } from "./actions";
import { CareersContentForm } from "@/components/admin/pages/CareersContentForm";

type Row = {
  id: string;
  slug: string;
  title_ar: string;
  department: string | null;
  deadline: string | null;
  published: boolean;
};

export default async function CareersListPage() {
  const supabase = await createClient();
  const { t } = await getAdminT();
  const { data, error } = await supabase
    .from("jobs")
    .select("id, slug, title_ar, department, deadline, published")
    .order("sort_order");
  const rows = (data ?? []) as Row[];

  const { data: pc } = await supabase.from("page_content").select("content").eq("slug", "careers").single();
  const careersContent = (pc?.content as Record<string, unknown>) ?? {};

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border p-5">
        <h2 className="mb-4 text-base font-semibold">{t.careers.pageContentHeading}</h2>
        <CareersContentForm action={updateCareersContent} defaults={careersContent} submitLabel={t.common.save} />
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t.careers.heading}</h1>
        <Link
          href="/admin/dashboard/careers/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4" /> {t.careers.newJob}
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
          rows.map((j, i) => (
            <div key={j.id} className="flex items-center justify-between rounded-xl border p-4">
              <div className="flex items-center gap-3" dir="rtl">
                <ReorderButtons table="jobs" id={j.id} canUp={i > 0} canDown={i < rows.length - 1} index={i + 1} />
                <span className="grid size-8 place-items-center rounded bg-muted text-muted-foreground">
                  <Briefcase className="size-4" />
                </span>
                <div>
                  <div className="font-medium">{j.title_ar}</div>
                  <div className="text-xs text-muted-foreground">{j.department}{j.deadline ? ` · ${j.deadline}` : ""}</div>
                </div>
                {!j.published && <span className="rounded-full bg-muted px-2 py-0.5 text-[11px]">{t.common.draft}</span>}
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/dashboard/careers/${j.id}`}
                  className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent"
                >
                  <Pencil className="size-3.5" /> {t.common.edit}
                </Link>
                <form action={deleteJob.bind(null, j.id)}>
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
