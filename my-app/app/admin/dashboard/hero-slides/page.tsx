import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { deleteHeroSlide } from "./actions";

type Row = {
  id: string;
  title_ar: string;
  image: string;
  sort_order: number;
  published: boolean;
};

export default async function HeroSlidesListPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("id, title_ar, image, sort_order, published")
    .order("sort_order");
  const rows = (data ?? []) as Row[];
  const { t } = await getAdminT();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t.hero.heading}</h1>
        <Link
          href="/admin/dashboard/hero-slides/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4" /> {t.hero.newSlide}
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
          rows.map((sld) => (
            <div key={sld.id} className="flex items-center justify-between rounded-xl border p-3">
              <div className="flex items-center gap-3">
                <span className="relative h-12 w-20 overflow-hidden rounded bg-muted">
                  {sld.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={sld.image} alt="" className="size-full object-cover" />
                  )}
                </span>
                <span className="font-medium" dir="rtl">{sld.title_ar}</span>
                {!sld.published && <span className="rounded-full bg-muted px-2 py-0.5 text-[11px]">{t.common.draft}</span>}
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/dashboard/hero-slides/${sld.id}`}
                  className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent"
                >
                  <Pencil className="size-3.5" /> {t.common.edit}
                </Link>
                <form action={deleteHeroSlide.bind(null, sld.id)}>
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
