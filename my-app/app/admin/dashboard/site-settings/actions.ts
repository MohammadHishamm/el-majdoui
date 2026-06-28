"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function str(v: FormDataEntryValue | null): string {
  return String(v ?? "").trim();
}

export async function updateSiteSettings(form: FormData) {
  const supabase = await createClient();
  const row = {
    founded_year: str(form.get("founded_year")) || null,
    license_no: str(form.get("license_no")) || null,
    contact_email: str(form.get("contact_email")) || null,
    contact_phone: str(form.get("contact_phone")) || null,
    contact_address_ar: str(form.get("contact_address_ar")) || null,
    contact_address_en: str(form.get("contact_address_en")) || null,
    social_linkedin: str(form.get("social_linkedin")) || null,
    social_instagram: str(form.get("social_instagram")) || null,
    social_youtube: str(form.get("social_youtube")) || null,
    social_linkedin_show: form.get("social_linkedin_show") === "on",
    social_instagram_show: form.get("social_instagram_show") === "on",
    social_twitter_show: form.get("social_twitter_show") === "on",
    social_facebook_show: form.get("social_facebook_show") === "on",
    social_snapchat_show: form.get("social_snapchat_show") === "on",
    social_youtube_show: form.get("social_youtube_show") === "on",
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
