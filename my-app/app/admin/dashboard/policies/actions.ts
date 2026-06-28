"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { nextSortOrder } from "@/app/admin/dashboard/_actions/reorder";

const str = (v: FormDataEntryValue | null) => String(v ?? "").trim();

function rowFromForm(form: FormData) {
  const cat = str(form.get("category"));
  return {
    title_ar: str(form.get("title_ar")),
    title_en: str(form.get("title_en")),
    version: str(form.get("version")) || null,
    category: ["basics", "governance", "guides"].includes(cat) ? cat : "basics",
    file: str(form.get("file")) || "#",
    published: form.get("published") === "on",
  };
}

export async function createPolicy(form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("policies").insert({ ...rowFromForm(form), sort_order: await nextSortOrder("policies") });
  if (error) redirect(`/admin/dashboard/policies/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/dashboard/policies");
  revalidatePath("/about/policies");
  redirect("/admin/dashboard/policies");
}

export async function updatePolicy(id: string, form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("policies").update(rowFromForm(form)).eq("id", id);
  if (error) redirect(`/admin/dashboard/policies/${id}?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/dashboard/policies");
  revalidatePath("/about/policies");
  redirect("/admin/dashboard/policies");
}

export async function deletePolicy(id: string) {
  const supabase = await createClient();
  await supabase.from("policies").delete().eq("id", id);
  revalidatePath("/admin/dashboard/policies");
  revalidatePath("/about/policies");
}
