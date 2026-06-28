"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { nextSortOrder } from "@/app/admin/dashboard/_actions/reorder";

const str = (v: FormDataEntryValue | null) => String(v ?? "").trim();

function rowFromForm(form: FormData) {
  return {
    type: str(form.get("type")) === "leadership" ? "leadership" : "board",
    name_ar: str(form.get("name_ar")),
    name_en: str(form.get("name_en")),
    role_ar: str(form.get("role_ar")),
    role_en: str(form.get("role_en")),
    image: str(form.get("image")) || null,
    published: form.get("published") === "on",
  };
}

export async function createMember(form: FormData) {
  const supabase = await createClient();
  const row = rowFromForm(form);
  const sort_order = await nextSortOrder("team_members", { col: "type", val: row.type });
  const { error } = await supabase.from("team_members").insert({ ...row, sort_order });
  if (error) redirect(`/admin/dashboard/team/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/dashboard/team");
  revalidatePath("/about/board");
  redirect("/admin/dashboard/team");
}

export async function updateMember(id: string, form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("team_members").update(rowFromForm(form)).eq("id", id);
  if (error) redirect(`/admin/dashboard/team/${id}?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/dashboard/team");
  revalidatePath("/about/board");
  redirect("/admin/dashboard/team");
}

export async function updateChairman(form: FormData) {
  const supabase = await createClient();
  let content: unknown = {};
  try {
    content = JSON.parse(String(form.get("content") ?? "{}"));
  } catch {
    content = {};
  }
  const { error } = await supabase.from("page_content").upsert({ slug: "board", content }, { onConflict: "slug" });
  if (error) redirect(`/admin/dashboard/team?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/dashboard/team");
  revalidatePath("/about/board");
  redirect("/admin/dashboard/team");
}

export async function deleteMember(id: string) {
  const supabase = await createClient();
  await supabase.from("team_members").delete().eq("id", id);
  revalidatePath("/admin/dashboard/team");
  revalidatePath("/about/board");
}
