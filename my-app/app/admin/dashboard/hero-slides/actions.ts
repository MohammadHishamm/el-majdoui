"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { nextSortOrder } from "@/app/admin/dashboard/_actions/reorder";

function str(v: FormDataEntryValue | null): string {
  return String(v ?? "").trim();
}

function rowFromForm(form: FormData) {
  return {
    title_ar: str(form.get("title_ar")),
    title_en: str(form.get("title_en")),
    image: str(form.get("image")),
    href: str(form.get("href")) || null,
    published: form.get("published") === "on",
  };
}

export async function createHeroSlide(form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("hero_slides").insert({ ...rowFromForm(form), sort_order: await nextSortOrder("hero_slides") });
  if (error) redirect(`/admin/dashboard/hero-slides/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/dashboard/hero-slides");
  revalidatePath("/");
  redirect("/admin/dashboard/hero-slides");
}

export async function updateHeroSlide(id: string, form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("hero_slides").update(rowFromForm(form)).eq("id", id);
  if (error) redirect(`/admin/dashboard/hero-slides/${id}?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/dashboard/hero-slides");
  revalidatePath("/");
  redirect("/admin/dashboard/hero-slides");
}

export async function deleteHeroSlide(id: string) {
  const supabase = await createClient();
  await supabase.from("hero_slides").delete().eq("id", id);
  revalidatePath("/admin/dashboard/hero-slides");
  revalidatePath("/");
}
