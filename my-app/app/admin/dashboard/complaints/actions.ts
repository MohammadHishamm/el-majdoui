"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ContactAttachment } from "@/lib/site/contact-channel";

const PATH = "/admin/dashboard/complaints";

export async function setRequestRead(id: string, read: boolean) {
  const supabase = await createClient();
  await supabase.from("contact_requests").update({ is_read: read }).eq("id", id);
  revalidatePath(PATH);
}

/**
 * Deletes the request and its attachments together — the bucket is private and
 * nothing else references these objects, so leaving them behind would just be
 * orphaned personal data.
 */
export async function deleteRequest(id: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("contact_requests")
    .select("attachments")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("contact_requests").delete().eq("id", id);
  if (error) return;

  const paths = ((data?.attachments as ContactAttachment[]) ?? []).map((a) => a.path);
  if (paths.length) {
    await createAdminClient().storage.from("contact-attachments").remove(paths);
  }
  revalidatePath(PATH);
}
