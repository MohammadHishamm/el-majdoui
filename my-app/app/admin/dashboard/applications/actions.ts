"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { JobApplicationFile } from "@/lib/site/job-application";

const PATH = "/admin/dashboard/applications";

export async function setApplicationRead(id: string, read: boolean) {
  const supabase = await createClient();
  await supabase.from("job_applications").update({ is_read: read }).eq("id", id);
  revalidatePath(PATH);
}

/**
 * Deletes the application and its CV together — the bucket is private and
 * nothing else references the object, so leaving it behind would just be
 * orphaned personal data.
 */
export async function deleteApplication(id: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("job_applications")
    .select("cv")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("job_applications").delete().eq("id", id);
  if (error) return;

  const cv = data?.cv as JobApplicationFile | null;
  if (cv?.path) {
    await createAdminClient().storage.from("job-applications").remove([cv.path]);
  }
  revalidatePath(PATH);
}
