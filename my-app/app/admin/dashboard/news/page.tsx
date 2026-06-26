import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { deleteNews, togglePublishNews } from "./actions";

type Row = {
  id: string;
  slug: string;
  title_ar: string;
  category: string;
  published: boolean;
  featured: boolean;
  date: string;
};

export default async function NewsListPage() {
  const supabase = await createClient();
  const { t } = await getAdminT();
  const CATEGORY_LABEL: Record<string, string> = {
    institution: t.news.catInstitution,
    announcements: t.news.catAnnouncements,
    partnerships: t.news.catPartnerships,
  };
  const { data, error } = await supabase
    .from("news")
    .select("id, slug, title_ar, category, published, featured, date")
    .order("published_at", { ascending: false });

  const rows = (data ?? []) as Row[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t.news.heading}</h1>
        <Link
          href="/admin/dashboard/news/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4" /> {t.news.newArticle}
        </Link>
      </div>

      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {t.common.loadError}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-start text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 text-start font-medium">{t.common.title}</th>
              <th className="px-4 py-2.5 text-start font-medium">{t.common.category}</th>
              <th className="px-4 py-2.5 text-start font-medium">{t.common.date}</th>
              <th className="px-4 py-2.5 text-start font-medium">{t.common.status}</th>
              <th className="px-4 py-2.5 text-end font-medium">{t.common.actions}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  {t.common.noItems}
                </td>
              </tr>
            ) : (
              rows.map((n) => (
                <tr key={n.id} className="border-t">
                  <td className="px-4 py-3" dir="rtl">
                    <span className="font-medium">{n.title_ar}</span>
                    {n.featured && (
                      <span className="ms-2 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] text-amber-700">{t.news.featured}</span>
                    )}
                  </td>
                  <td className="px-4 py-3" dir="rtl">{CATEGORY_LABEL[n.category] ?? n.category}</td>
                  <td className="px-4 py-3" dir="rtl">{n.date}</td>
                  <td className="px-4 py-3">
                    <form action={togglePublishNews.bind(null, n.id, !n.published)}>
                      <button
                        type="submit"
                        className={`rounded-full px-2.5 py-0.5 text-xs ${
                          n.published
                            ? "bg-green-100 text-green-700"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {n.published ? t.common.published : t.common.draft}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/dashboard/news/${n.id}`}
                        className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent"
                      >
                        <Pencil className="size-3.5" /> {t.common.edit}
                      </Link>
                      <form action={deleteNews.bind(null, n.id)}>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1 rounded-md border border-destructive/40 px-2 py-1 text-xs text-destructive hover:bg-destructive/5"
                        >
                          <Trash2 className="size-3.5" /> {t.common.delete}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
