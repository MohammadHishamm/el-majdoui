"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { nextSortOrder } from "@/app/admin/dashboard/_actions/reorder";

function str(v: FormDataEntryValue | null): string {
  return String(v ?? "").trim();
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseImages(v: FormDataEntryValue | null): string[] {
  try {
    const arr = JSON.parse(String(v ?? "[]"));
    if (!Array.isArray(arr)) return [];
    // Drop video links pasted into image slots — those belong in "videos".
    return arr
      .map((s) => String(s).trim())
      .filter((s) => s && !/(youtube\.com|youtu\.be|vimeo\.com)/i.test(s));
  } catch {
    return [];
  }
}

function parseVideos(v: FormDataEntryValue | null): string[] {
  try {
    const arr = JSON.parse(String(v ?? "[]"));
    if (!Array.isArray(arr)) return [];
    return arr.map((s) => String(s).trim()).filter(Boolean).slice(0, 4);
  } catch {
    return [];
  }
}

function rowFromForm(form: FormData) {
  const title_en = str(form.get("title_en"));
  const slug = str(form.get("slug")) || slugify(title_en) || `album-${Math.random().toString(36).slice(2, 10)}`;
  const type = str(form.get("type")) === "video" ? "video" : "album";
  // Hard separation: a photo album never keeps videos, a video never keeps album images.
  const videos = type === "video" ? parseVideos(form.get("videos")) : [];
  const images = type === "album" ? parseImages(form.get("images")) : [];
  // The admin form only has one image ("Cover") — it's what shows on /gallery. Keep thumb synced to it.
  const cover = str(form.get("cover"));
  return {
    type,
    slug,
    title_ar: str(form.get("title_ar")),
    title_en,
    meta_ar: str(form.get("meta_ar")),
    meta_en: str(form.get("meta_en")),
    thumb: cover,
    cover,
    video_url: videos[0] ?? null,
    videos,
    images,
    date_ar: str(form.get("date_ar")),
    date_en: str(form.get("date_en")),
    location_ar: str(form.get("location_ar")),
    location_en: str(form.get("location_en")),
    photographer_ar: str(form.get("photographer_ar")),
    photographer_en: str(form.get("photographer_en")),
    section_ar: str(form.get("section_ar")),
    section_en: str(form.get("section_en")),
    about_ar: str(form.get("about_ar")),
    about_en: str(form.get("about_en")),
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
