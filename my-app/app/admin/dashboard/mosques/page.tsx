import Link from "next/link";
import { MapPin, Pencil, Plus, TriangleAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { ReorderButtons } from "@/components/admin/reorder-buttons";
import { DeleteButton } from "@/components/admin/delete-button";
import { PublishCheckbox } from "@/components/admin/publish-checkbox";
import { deleteMosque, updateMosquesMapContent } from "./actions";
import { MosquesMapContentForm } from "@/components/admin/pages/MosquesMapContentForm";

type Row = {
  id: string;
  name_ar: string;
  district_ar: string | null;
  region_ar: string | null;
  lat: number | null;
  lng: number | null;
  coords_verified: boolean;
  published: boolean;
};

export default async function MosquesListPage() {
  const supabase = await createClient();
  const { t } = await getAdminT();
  const { data, error } = await supabase
    .from("mosques")
    .select("id, name_ar, district_ar, region_ar, lat, lng, coords_verified, published")
    .order("sort_order");
  const rows = (data ?? []) as Row[];

  const { data: pc } = await supabase
    .from("page_content")
    .select("content")
    .eq("slug", "mosques-map")
    .single();
  const mapContent = (pc?.content as Record<string, unknown>) ?? {};

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border p-5">
        <h2 className="mb-4 text-base font-semibold">{t.mosques.pageContentHeading}</h2>
        <MosquesMapContentForm
          action={updateMosquesMapContent}
          defaults={mapContent}
          submitLabel={t.common.save}
        />
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t.mosques.heading}</h1>
        <Link
          href="/admin/dashboard/mosques/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4" /> {t.mosques.newMosque}
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
          rows.map((m, i) => {
            const missingCoords = m.lat == null || m.lng == null;
            return (
              <div key={m.id} className="flex items-center justify-between rounded-xl border p-4">
                <div className="flex items-center gap-3" dir="rtl">
                  <ReorderButtons
                    table="mosques"
                    id={m.id}
                    canUp={i > 0}
                    canDown={i < rows.length - 1}
                    index={i + 1}
                  />
                  <span className="grid size-8 place-items-center rounded bg-muted text-muted-foreground">
                    <MapPin className="size-4" />
                  </span>
                  <div>
                    <div className="font-medium">{m.name_ar}</div>
                    <div className="text-xs text-muted-foreground">
                      {[m.district_ar, m.region_ar].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                  {/* Flags rows added by hand without confirmed coordinates —
                      a wrong pin looks just as authoritative as a right one.
                      The roster imported from the register is all verified. */}
                  {(missingCoords || !m.coords_verified) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                      <TriangleAlert className="size-3" /> {t.mosques.unverified}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {/* Inline, because curating 36 facilities one editor at a
                      time is the whole reason this control exists. */}
                  <PublishCheckbox table="mosques" id={m.id} published={m.published} />
                  <Link
                    href={`/admin/dashboard/mosques/${m.id}`}
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent"
                  >
                    <Pencil className="size-3.5" /> {t.common.edit}
                  </Link>
                  <DeleteButton action={deleteMosque.bind(null, m.id)} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
