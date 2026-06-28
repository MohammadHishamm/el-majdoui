"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateStrategicAlignment(form: FormData) {
  const supabase = await createClient();
  let content: unknown = {};
  try {
    content = JSON.parse(String(form.get("content") ?? "{}"));
  } catch {
    content = {};
  }
  const { error } = await supabase
    .from("page_content")
    .upsert({ slug: "strategic-alignment", content }, { onConflict: "slug" });
  if (error) redirect(`/admin/dashboard/strategic-alignment?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/dashboard/strategic-alignment");
  revalidatePath("/");
  redirect("/admin/dashboard/strategic-alignment");
}
