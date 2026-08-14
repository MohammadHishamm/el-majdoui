"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizePeople } from "@/lib/site/org-levels";

const str = (v: FormDataEntryValue | null) => String(v ?? "").trim();

/** Bad JSON must not wipe the existing people — an empty list is the safe read. */
const people = (v: FormDataEntryValue | null) => {
  try {
    return normalizePeople(JSON.parse(String(v ?? "[]")));
  } catch {
    return [];
  }
};

function rowFromForm(form: FormData) {
  return {
    level_no: Number(str(form.get("level_no"))) || 1,
    title_ar: str(form.get("title_ar")),
    title_en: str(form.get("title_en")),
    subtitle_ar: str(form.get("subtitle_ar")),
    subtitle_en: str(form.get("subtitle_en")),
    description_ar: str(form.get("description_ar")),
    description_en: str(form.get("description_en")),
    icon: str(form.get("icon")) || "landmark",
    bg_color: str(form.get("bg_color")) || "#005761",
    leaders: people(form.get("leaders")),
    members_label_ar: str(form.get("members_label_ar")),
    members_label_en: str(form.get("members_label_en")),
    members: people(form.get("members")),
    published: form.get("published") === "on",
  };
}

/** The public page and the admin list both need busting. */
function revalidateOrg() {
  revalidatePath("/admin/dashboard/org-structure");
  revalidatePath("/about/org-structure");
}

export async function createOrgLevel(form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("org_levels").insert(rowFromForm(form));
  if (error) {
    redirect(`/admin/dashboard/org-structure/new?error=${encodeURIComponent(error.message)}`);
  }
  revalidateOrg();
  redirect("/admin/dashboard/org-structure");
}

export async function updateOrgLevel(id: string, form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("org_levels").update(rowFromForm(form)).eq("id", id);
  if (error) {
    redirect(`/admin/dashboard/org-structure/${id}?error=${encodeURIComponent(error.message)}`);
  }
  revalidateOrg();
  redirect("/admin/dashboard/org-structure");
}

export async function deleteOrgLevel(id: string) {
  const supabase = await createClient();
  await supabase.from("org_levels").delete().eq("id", id);
  revalidateOrg();
}
