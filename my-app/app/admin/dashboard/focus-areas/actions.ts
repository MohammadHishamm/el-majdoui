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
    slug: str(form.get("slug")),
    name_ar: str(form.get("name_ar")),
    name_en: str(form.get("name_en")),
    short_desc_ar: str(form.get("short_desc_ar")),
    short_desc_en: str(form.get("short_desc_en")),
    bg_color: str(form.get("bg_color")) || "#005761",
    btn_text_color: str(form.get("btn_text_color")) || "#005761",
    icon: str(form.get("icon")) || null,
    watermark: str(form.get("watermark")) || null,
    published: form.get("published") === "on",
  };
}

export async function createFocusArea(form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("focus_areas").insert({ ...rowFromForm(form), sort_order: await nextSortOrder("focus_areas") });
  if (error) redirect(`/admin/dashboard/focus-areas/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/dashboard/focus-areas");
  revalidatePath("/");
  redirect("/admin/dashboard/focus-areas");
}

export async function updateFocusArea(id: string, form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("focus_areas").update(rowFromForm(form)).eq("id", id);
  if (error) redirect(`/admin/dashboard/focus-areas/${id}?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/dashboard/focus-areas");
  revalidatePath("/");
  redirect("/admin/dashboard/focus-areas");
}

export async function deleteFocusArea(id: string) {
  const supabase = await createClient();
  await supabase.from("focus_areas").delete().eq("id", id);
  revalidatePath("/admin/dashboard/focus-areas");
  revalidatePath("/");
}

function parseJson<T>(v: FormDataEntryValue | null, fallback: T): T {
  try {
    const x = JSON.parse(String(v ?? ""));
    return x ?? fallback;
  } catch {
    return fallback;
  }
}

export async function updateFocusAreaDetail(id: string, slug: string, form: FormData) {
  const supabase = await createClient();
  const row = {
    detail_title_ar: str(form.get("detail_title_ar")),
    detail_title_en: str(form.get("detail_title_en")),
    detail_intro_ar: str(form.get("detail_intro_ar")),
    detail_intro_en: str(form.get("detail_intro_en")),
    carousel: {
      heading: { ar: str(form.get("carousel_heading_ar")), en: str(form.get("carousel_heading_en")) },
      slides: parseJson(form.get("slides"), [] as unknown[]),
    },
    stats: {
      image: str(form.get("stats_image")),
      items: parseJson(form.get("stats_items"), [] as unknown[]),
    },
    detail_programs: {
      heading: { ar: str(form.get("programs_heading_ar")), en: str(form.get("programs_heading_en")) },
      items: parseJson(form.get("program_items"), [] as unknown[]),
    },
  };
  const { error } = await supabase.from("focus_areas").update(row).eq("id", id);
  if (error) redirect(`/admin/dashboard/focus-areas/${id}/detail?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/dashboard/focus-areas");
  revalidatePath(`/focus-areas/${slug}`);
  redirect("/admin/dashboard/focus-areas");
}
