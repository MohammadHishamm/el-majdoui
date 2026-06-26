"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const str = (v: FormDataEntryValue | null) => String(v ?? "").trim();
const lines = (v: FormDataEntryValue | null) =>
  String(v ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
const csv = (v: FormDataEntryValue | null) =>
  String(v ?? "").split(",").map((s) => s.trim()).filter(Boolean);

function parseStages(v: FormDataEntryValue | null) {
  return lines(v).map((line) => {
    const [title, ...rest] = line.split("::");
    return { title: (title ?? "").trim(), desc: rest.join("::").trim() };
  });
}

function rowFromForm(form: FormData) {
  return {
    slug: str(form.get("slug")),
    category: str(form.get("category")) || "empowerment",
    title_ar: str(form.get("title_ar")),
    title_en: str(form.get("title_en")),
    short_desc_ar: str(form.get("short_desc_ar")),
    short_desc_en: str(form.get("short_desc_en")),
    hero_desc: str(form.get("hero_desc")) || null,
    image: str(form.get("image")),
    about: str(form.get("about")) || null,
    objectives: lines(form.get("objectives")),
    stages: parseStages(form.get("stages")),
    target_groups: lines(form.get("target_groups")),
    quote: { text: str(form.get("quote_text")), author: str(form.get("quote_author")) },
    partners: lines(form.get("partners")),
    info: {
      launchYear: str(form.get("launch_year")),
      scope: str(form.get("scope")),
      beneficiaries: str(form.get("beneficiaries")),
      sector: str(form.get("sector")),
    },
    related: csv(form.get("related")),
    sort_order: Number(str(form.get("sort_order")) || "0"),
    published: form.get("published") === "on",
  };
}

export async function createProgram(form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("programs").insert(rowFromForm(form));
  if (error) redirect(`/admin/dashboard/programs/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/dashboard/programs");
  revalidatePath("/programs");
  redirect("/admin/dashboard/programs");
}

export async function updateProgram(id: string, form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("programs").update(rowFromForm(form)).eq("id", id);
  if (error) redirect(`/admin/dashboard/programs/${id}?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/dashboard/programs");
  revalidatePath("/programs");
  redirect("/admin/dashboard/programs");
}

export async function deleteProgram(id: string) {
  const supabase = await createClient();
  await supabase.from("programs").delete().eq("id", id);
  revalidatePath("/admin/dashboard/programs");
  revalidatePath("/programs");
}
