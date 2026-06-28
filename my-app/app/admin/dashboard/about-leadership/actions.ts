"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function str(v: FormDataEntryValue | null): string {
  return String(v ?? "").trim();
}

export async function updateAboutLeadership(form: FormData) {
  const supabase = await createClient();
  const row = {
    about_title_ar: str(form.get("about_title_ar")),
    about_title_en: str(form.get("about_title_en")),
    about_body_ar: str(form.get("about_body_ar")),
    about_body_en: str(form.get("about_body_en")),
    leadership_quote_ar: str(form.get("leadership_quote_ar")),
    leadership_quote_en: str(form.get("leadership_quote_en")),
    leadership_name_ar: str(form.get("leadership_name_ar")),
    leadership_name_en: str(form.get("leadership_name_en")),
    leadership_position_ar: str(form.get("leadership_position_ar")),
    leadership_position_en: str(form.get("leadership_position_en")),
    leadership_photo: str(form.get("leadership_photo")) || null,
  };
  const { error } = await supabase.from("site_settings").update(row).eq("id", true);
  if (error) {
    revalidatePath("/admin/dashboard/about-leadership");
    return;
  }
  revalidatePath("/admin/dashboard/about-leadership");
  revalidatePath("/", "layout");
}
