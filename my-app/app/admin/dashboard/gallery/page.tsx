import Link from "next/link";
import { Pencil, Plus, Trash2, Video, Images } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { deleteGalleryItem } from "./actions";

type Row = {
  id: string;
  type: "album" | "video";
  title_ar: string;
  meta_ar: string;
  thumb: string;
  published: boolean;
};

export default async function GalleryListPage() {
  const supabase = await createClient();
  const { t } = await getAdminT();
  const { data, error } = await supabase
    .from("gallery_items")
    .select("id, type, title_ar, meta_ar, thumb, published")
    .order("sort_order");
  const rows = (data ?? []) as Row[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t.gallery.heading}</h1>
        <Link
          href="/admin/dashboard/gallery/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4" /> {t.gallery.newItem}
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
          rows.map((g) => (
            <div key={g.id} className="flex items-center justify-between rounded-xl border p-3">
              <div className="flex items-center gap-3">
                <span className="relative h-12 w-20 overflow-hidden rounded bg-muted">
                  {g.thumb && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={g.thumb} alt="" className="size-full object-cover" />
                  )}
                </span>
                <span className="grid size-6 place-items-center rounded bg-muted text-muted-foreground">
                  {g.type === "video" ? <Video className="size-3.5" /> : <Images className="size-3.5" />}
                </span>
                <div dir="rtl">
                  <div className="font-medium">{g.title_ar}</div>
                  <div className="text-xs text-muted-foreground">{g.meta_ar}</div>
                </div>
                {!g.published && <span className="rounded-full bg-muted px-2 py-0.5 text-[11px]">{t.common.draft}</span>}
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/dashboard/gallery/${g.id}`}
                  className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent"
                >
                  <Pencil className="size-3.5" /> {t.common.edit}
                </Link>
                <form action={deleteGalleryItem.bind(null, g.id)}>
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
