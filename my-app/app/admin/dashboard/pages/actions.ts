"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const PUBLIC_PATH: Record<string, string> = {
  "vision-mission": "/about/vision-mission",
  "who-we-are": "/about/who-we-are",
  strategy: "/about/strategy",
  "brand-identity": "/brand-identity",
};

export async function updatePageContent(slug: string, form: FormData) {
  const supabase = await createClient();
  let content: unknown = {};
  try {
    content = JSON.parse(String(form.get("content") ?? "{}"));
  } catch {
    content = {};
  }
  const { error } = await supabase
    .from("page_content")
    .upsert({ slug, content }, { onConflict: "slug" });
  if (error) redirect(`/admin/dashboard/pages/${slug}?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/dashboard/pages");
  if (PUBLIC_PATH[slug]) revalidatePath(PUBLIC_PATH[slug]);
  redirect("/admin/dashboard/pages");
}
