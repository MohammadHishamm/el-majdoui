"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function str(v: FormDataEntryValue | null): string {
  return String(v ?? "").trim();
}

function rowFromForm(form: FormData) {
  return {
    title_ar: str(form.get("title_ar")),
    title_en: str(form.get("title_en")),
    excerpt_ar: str(form.get("excerpt_ar")),
    excerpt_en: str(form.get("excerpt_en")),
    image: str(form.get("image")),
    category: str(form.get("category")) || null,
    href: str(form.get("href")) || null,
    sort_order: Number(str(form.get("sort_order")) || "0"),
    published: form.get("published") === "on",
  };
}

export async function createHeroSlide(form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("hero_slides").insert(rowFromForm(form));
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
