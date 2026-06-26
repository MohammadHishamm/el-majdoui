"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
    sort_order: Number(str(form.get("sort_order")) || "0"),
    published: form.get("published") === "on",
  };
}

export async function createFocusArea(form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("focus_areas").insert(rowFromForm(form));
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
