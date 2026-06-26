"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const str = (v: FormDataEntryValue | null) => String(v ?? "").trim();

function rowFromForm(form: FormData) {
  return {
    title_ar: str(form.get("title_ar")),
    title_en: str(form.get("title_en")),
    period_ar: str(form.get("period_ar")),
    period_en: str(form.get("period_en")),
    file: str(form.get("file")),
    sort_order: Number(str(form.get("sort_order")) || "0"),
    published: form.get("published") === "on",
  };
}

export async function createReport(form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("reports").insert(rowFromForm(form));
  if (error) redirect(`/admin/dashboard/reports/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/dashboard/reports");
  revalidatePath("/reports");
  redirect("/admin/dashboard/reports");
}

export async function updateReport(id: string, form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("reports").update(rowFromForm(form)).eq("id", id);
  if (error) redirect(`/admin/dashboard/reports/${id}?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/dashboard/reports");
  revalidatePath("/reports");
  redirect("/admin/dashboard/reports");
}

export async function deleteReport(id: string) {
  const supabase = await createClient();
  await supabase.from("reports").delete().eq("id", id);
  revalidatePath("/admin/dashboard/reports");
  revalidatePath("/reports");
}
