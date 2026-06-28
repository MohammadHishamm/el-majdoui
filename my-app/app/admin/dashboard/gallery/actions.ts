"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { nextSortOrder } from "@/app/admin/dashboard/_actions/reorder";

function str(v: FormDataEntryValue | null): string {
  return String(v ?? "").trim();
}

function rowFromForm(form: FormData) {
  return {
    type: str(form.get("type")) === "video" ? "video" : "album",
    title_ar: str(form.get("title_ar")),
    title_en: str(form.get("title_en")),
    meta_ar: str(form.get("meta_ar")),
    meta_en: str(form.get("meta_en")),
    thumb: str(form.get("thumb")),
    cover: str(form.get("cover")) || str(form.get("thumb")),
    video_url: str(form.get("video_url")) || null,
    published: form.get("published") === "on",
  };
}

export async function createGalleryItem(form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("gallery_items").insert({ ...rowFromForm(form), sort_order: await nextSortOrder("gallery_items") });
  if (error) redirect(`/admin/dashboard/gallery/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/dashboard/gallery");
  revalidatePath("/gallery");
  redirect("/admin/dashboard/gallery");
}

export async function updateGalleryItem(id: string, form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("gallery_items").update(rowFromForm(form)).eq("id", id);
  if (error) redirect(`/admin/dashboard/gallery/${id}?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/dashboard/gallery");
  revalidatePath("/gallery");
  redirect("/admin/dashboard/gallery");
}

export async function deleteGalleryItem(id: string) {
  const supabase = await createClient();
  await supabase.from("gallery_items").delete().eq("id", id);
  revalidatePath("/admin/dashboard/gallery");
  revalidatePath("/gallery");
}
