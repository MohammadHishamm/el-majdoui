"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { nextSortOrder } from "@/app/admin/dashboard/_actions/reorder";

const str = (v: FormDataEntryValue | null) => String(v ?? "").trim();

function rowFromForm(form: FormData) {
  return {
    value: Number(str(form.get("value")) || "0"),
    suffix: str(form.get("suffix")),
    label_ar: str(form.get("label_ar")),
    label_en: str(form.get("label_en")),
    year: str(form.get("year")) || null,
    icon: str(form.get("icon")) || null,
    published: form.get("published") === "on",
  };
}

export async function createKpi(form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("kpis").insert({ ...rowFromForm(form), sort_order: await nextSortOrder("kpis") });
  if (error) redirect(`/admin/dashboard/kpis/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/dashboard/kpis");
  revalidatePath("/");
  redirect("/admin/dashboard/kpis");
}

export async function updateKpi(id: string, form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("kpis").update(rowFromForm(form)).eq("id", id);
  if (error) redirect(`/admin/dashboard/kpis/${id}?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/dashboard/kpis");
  revalidatePath("/");
  redirect("/admin/dashboard/kpis");
}

export async function deleteKpi(id: string) {
  const supabase = await createClient();
  await supabase.from("kpis").delete().eq("id", id);
  revalidatePath("/admin/dashboard/kpis");
  revalidatePath("/");
}
