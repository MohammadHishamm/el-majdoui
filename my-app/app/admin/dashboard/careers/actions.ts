"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const str = (v: FormDataEntryValue | null) => String(v ?? "").trim();
const lines = (v: FormDataEntryValue | null) =>
  String(v ?? "").split("\n").map((s) => s.trim()).filter(Boolean);

function rowFromForm(form: FormData) {
  return {
    slug: str(form.get("slug")),
    title_ar: str(form.get("title_ar")),
    title_en: str(form.get("title_en")),
    summary_ar: str(form.get("summary_ar")),
    summary_en: str(form.get("summary_en")),
    department: str(form.get("department")) || null,
    location: str(form.get("location")) || null,
    type: str(form.get("type")) || null,
    experience: str(form.get("experience")) || null,
    education: str(form.get("education")) || null,
    deadline: str(form.get("deadline")) || null,
    posted: str(form.get("posted")) || null,
    responsibilities: lines(form.get("responsibilities")),
    qualifications: lines(form.get("qualifications")),
    sort_order: Number(str(form.get("sort_order")) || "0"),
    published: form.get("published") === "on",
  };
}

export async function createJob(form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("jobs").insert(rowFromForm(form));
  if (error) redirect(`/admin/dashboard/careers/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/dashboard/careers");
  revalidatePath("/careers");
  redirect("/admin/dashboard/careers");
}

export async function updateJob(id: string, form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("jobs").update(rowFromForm(form)).eq("id", id);
  if (error) redirect(`/admin/dashboard/careers/${id}?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/dashboard/careers");
  revalidatePath("/careers");
  redirect("/admin/dashboard/careers");
}

export async function deleteJob(id: string) {
  const supabase = await createClient();
  await supabase.from("jobs").delete().eq("id", id);
  revalidatePath("/admin/dashboard/careers");
  revalidatePath("/careers");
}

export async function updateCareersContent(form: FormData) {
  const supabase = await createClient();
  let content: unknown = {};
  try {
    content = JSON.parse(String(form.get("content") ?? "{}"));
  } catch {
    content = {};
  }
  const { error } = await supabase.from("page_content").upsert({ slug: "careers", content }, { onConflict: "slug" });
  if (error) redirect(`/admin/dashboard/careers?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/dashboard/careers");
  revalidatePath("/careers");
  redirect("/admin/dashboard/careers");
}
