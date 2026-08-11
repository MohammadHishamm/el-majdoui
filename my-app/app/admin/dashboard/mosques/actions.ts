"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { nextSortOrder } from "@/app/admin/dashboard/_actions/reorder";

const str = (v: FormDataEntryValue | null) => String(v ?? "").trim();

/** Empty stays null so the map can skip the pin rather than plot it at 0,0. */
const num = (v: FormDataEntryValue | null) => {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

function rowFromForm(form: FormData) {
  return {
    slug: str(form.get("slug")),
    name_ar: str(form.get("name_ar")),
    name_en: str(form.get("name_en")),
    district_ar: str(form.get("district_ar")),
    district_en: str(form.get("district_en")),
    region_ar: str(form.get("region_ar")),
    region_en: str(form.get("region_en")),
    lat: num(form.get("lat")),
    lng: num(form.get("lng")),
    coords_verified: form.get("coords_verified") === "on",
    capacity: num(form.get("capacity")),
    area_sqm: num(form.get("area_sqm")),
    image: str(form.get("image")),
    maps_url: str(form.get("maps_url")),
    published: form.get("published") === "on",
  };
}

/** Both the map section and the focus-area page it lives on need busting. */
function revalidateMosques() {
  revalidatePath("/admin/dashboard/mosques");
  revalidatePath("/focus-areas/mosques");
}

export async function createMosque(form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("mosques")
    .insert({ ...rowFromForm(form), sort_order: await nextSortOrder("mosques") });
  if (error) redirect(`/admin/dashboard/mosques/new?error=${encodeURIComponent(error.message)}`);
  revalidateMosques();
  redirect("/admin/dashboard/mosques");
}

export async function updateMosque(id: string, form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("mosques").update(rowFromForm(form)).eq("id", id);
  if (error) redirect(`/admin/dashboard/mosques/${id}?error=${encodeURIComponent(error.message)}`);
  revalidateMosques();
  redirect("/admin/dashboard/mosques");
}

export async function deleteMosque(id: string) {
  const supabase = await createClient();
  await supabase.from("mosques").delete().eq("id", id);
  revalidateMosques();
}

export async function updateMosquesMapContent(form: FormData) {
  const supabase = await createClient();
  const content = {
    heading_ar: str(form.get("heading_ar")),
    intro_ar: str(form.get("intro_ar")),
  };
  const { error } = await supabase
    .from("page_content")
    .upsert({ slug: "mosques-map", content }, { onConflict: "slug" });
  if (error) redirect(`/admin/dashboard/mosques?error=${encodeURIComponent(error.message)}`);
  revalidateMosques();
  redirect("/admin/dashboard/mosques");
}
