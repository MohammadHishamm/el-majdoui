"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { nextSortOrder } from "@/app/admin/dashboard/_actions/reorder";
import { normalizeDuties, normalizeMembers } from "@/lib/site/board-committees";

const str = (v: FormDataEntryValue | null) => String(v ?? "").trim();

/** Bad JSON must not wipe the list — an empty array is the safe read. */
function parse<T>(v: FormDataEntryValue | null, norm: (raw: unknown) => T[]): T[] {
  try {
    return norm(JSON.parse(String(v ?? "[]")));
  } catch {
    return [];
  }
}

function rowFromForm(form: FormData) {
  return {
    slug: str(form.get("slug")),
    title_ar: str(form.get("title_ar")),
    title_en: str(form.get("title_en")),
    description_ar: str(form.get("description_ar")),
    description_en: str(form.get("description_en")),
    members: parse(form.get("members"), normalizeMembers),
    duties: parse(form.get("duties"), normalizeDuties),
    published: form.get("published") === "on",
  };
}

/** Both the board page and the admin list need busting. */
function revalidateCommittees() {
  revalidatePath("/admin/dashboard/team");
  revalidatePath("/about/board");
}

export async function createCommittee(form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("board_committees")
    .insert({ ...rowFromForm(form), sort_order: await nextSortOrder("board_committees") });
  if (error) {
    redirect(`/admin/dashboard/team/committees/new?error=${encodeURIComponent(error.message)}`);
  }
  revalidateCommittees();
  redirect("/admin/dashboard/team");
}

export async function updateCommittee(id: string, form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("board_committees").update(rowFromForm(form)).eq("id", id);
  if (error) {
    redirect(`/admin/dashboard/team/committees/${id}?error=${encodeURIComponent(error.message)}`);
  }
  revalidateCommittees();
  redirect("/admin/dashboard/team");
}

export async function deleteCommittee(id: string) {
  const supabase = await createClient();
  await supabase.from("board_committees").delete().eq("id", id);
  revalidateCommittees();
}

/**
 * The CEO office is a single record, so it is saved straight into its
 * page_content row rather than through a list.
 */
export async function updateCeoOffice(form: FormData) {
  const supabase = await createClient();
  const keys = [
    "heading_ar", "heading_en", "name_ar", "name_en", "role_ar", "role_en",
    "bio_ar", "bio_en", "photo",
    "phone_label_ar", "phone_label_en", "phone_value",
    "email_label_ar", "email_label_en", "email_value",
    "hours_label_ar", "hours_label_en", "hours_value_ar", "hours_value_en",
    "cta_label_ar", "cta_label_en", "cta_href",
  ];
  const content = Object.fromEntries(keys.map((k) => [k, str(form.get(k))]));

  const { error } = await supabase
    .from("page_content")
    .upsert({ slug: "ceo-office", content }, { onConflict: "slug" });
  if (error) {
    redirect(`/admin/dashboard/team?error=${encodeURIComponent(error.message)}`);
  }
  revalidateCommittees();
  redirect("/admin/dashboard/team");
}
