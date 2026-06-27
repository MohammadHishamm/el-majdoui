"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function lines(v: FormDataEntryValue | null): string[] {
  return String(v ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function csv(v: FormDataEntryValue | null): string[] {
  return String(v ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function str(v: FormDataEntryValue | null): string {
  return String(v ?? "").trim();
}

function rowFromForm(form: FormData) {
  const axesHeading = str(form.get("axes_heading"));
  const axesItems = lines(form.get("axes_items"));
  const axes =
    axesHeading || axesItems.length ? { heading: axesHeading, items: axesItems } : null;

  return {
    slug: str(form.get("slug")),
    category: str(form.get("category")) || "institution",
    title_ar: str(form.get("title_ar")),
    title_en: str(form.get("title_en")),
    excerpt_ar: str(form.get("excerpt_ar")),
    excerpt_en: str(form.get("excerpt_en")),
    kicker: str(form.get("kicker")) || null,
    date: str(form.get("date")),
    source: str(form.get("source")) || null,
    read_time: str(form.get("read_time")) || null,
    image: str(form.get("image")),
    caption: str(form.get("caption")) || null,
    lead: str(form.get("lead")) || null,
    body: lines(form.get("body")),
    axes,
    quote: str(form.get("quote")) || null,
    after_quote: str(form.get("after_quote")) || null,
    tags: csv(form.get("tags")),
    related: csv(form.get("related")),
    featured: form.get("featured") === "on",
    home_featured: form.get("home_featured") === "on",
    published: form.get("published") === "on",
  };
}

export async function createNews(form: FormData) {
  const supabase = await createClient();
  const row = rowFromForm(form);
  if (!row.slug || !row.title_ar) {
    redirect("/admin/dashboard/news/new?error=missing");
  }
  const { error } = await supabase.from("news").insert(row);
  if (error) redirect(`/admin/dashboard/news/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/dashboard/news");
  revalidatePath("/news");
  revalidatePath("/");
  redirect("/admin/dashboard/news");
}

export async function updateNews(id: string, form: FormData) {
  const supabase = await createClient();
  const row = rowFromForm(form);
  const { error } = await supabase.from("news").update(row).eq("id", id);
  if (error) redirect(`/admin/dashboard/news/${id}?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/dashboard/news");
  revalidatePath("/news");
  revalidatePath("/");
  redirect("/admin/dashboard/news");
}

export async function deleteNews(id: string) {
  const supabase = await createClient();
  await supabase.from("news").delete().eq("id", id);
  revalidatePath("/admin/dashboard/news");
  revalidatePath("/news");
  revalidatePath("/");
}

export async function togglePublishNews(id: string, next: boolean) {
  const supabase = await createClient();
  await supabase.from("news").update({ published: next }).eq("id", id);
  revalidatePath("/admin/dashboard/news");
  revalidatePath("/news");
  revalidatePath("/");
}
