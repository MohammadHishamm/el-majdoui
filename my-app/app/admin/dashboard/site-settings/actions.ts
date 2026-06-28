"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function str(v: FormDataEntryValue | null): string {
  return String(v ?? "").trim();
}

export async function updateSiteSettings(form: FormData) {
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
    founded_year: str(form.get("founded_year")) || null,
    license_no: str(form.get("license_no")) || null,
    contact_email: str(form.get("contact_email")) || null,
    contact_phone: str(form.get("contact_phone")) || null,
    contact_address_ar: str(form.get("contact_address_ar")) || null,
    contact_address_en: str(form.get("contact_address_en")) || null,
    social_linkedin: str(form.get("social_linkedin")) || null,
    social_instagram: str(form.get("social_instagram")) || null,
    social_twitter: str(form.get("social_twitter")) || null,
    social_facebook: str(form.get("social_facebook")) || null,
    social_snapchat: str(form.get("social_snapchat")) || null,
  };
  const { error } = await supabase.from("site_settings").update(row).eq("id", true);
  if (error) {
    revalidatePath("/admin/dashboard/site-settings");
    return;
  }
  revalidatePath("/admin/dashboard/site-settings");
  revalidatePath("/", "layout");
}
