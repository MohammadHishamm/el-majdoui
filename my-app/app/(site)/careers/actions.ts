"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  CV_MAX_BYTES,
  cvMimeFor,
  type JobApplicationFile,
  type JobApplicationState,
} from "@/lib/site/job-application";

const str = (v: FormDataEntryValue | null) => String(v ?? "").trim();

const BUCKET = "job-applications";

/** Keeps the stored key predictable and free of anything from the user's filename. */
function objectKey(applicationNo: string, mime: string) {
  const ext =
    mime === "application/pdf" ? "pdf" : mime === "application/msword" ? "doc" : "docx";
  return `${applicationNo}/${Date.now()}-cv.${ext}`;
}

/**
 * Handles a submission from the job application form on /careers/[slug].
 *
 * Runs on the service-role client because job_applications and its CV bucket
 * both refuse anonymous writes on purpose — the validation below is the only
 * gate, so it must not be skippable by posting straight at the REST API.
 *
 * The job itself is resolved here from the slug rather than trusted from the
 * form, so a crafted post can't file an application against a job that isn't
 * published (or doesn't exist).
 */
export async function submitJobApplication(
  _prev: JobApplicationState,
  formData: FormData,
): Promise<JobApplicationState> {
  const fail = (error: JobApplicationState["error"]): JobApplicationState => ({
    ok: false,
    applicationNo: null,
    error,
  });

  const jobSlug = str(formData.get("job_slug"));
  const firstName = str(formData.get("first_name"));
  const lastName = str(formData.get("last_name"));
  const email = str(formData.get("email"));
  const phone = str(formData.get("phone"));
  const city = str(formData.get("city"));
  const experience = str(formData.get("experience"));
  const coverLetter = str(formData.get("cover_letter"));
  const linkedin = str(formData.get("linkedin"));

  if (!jobSlug || !firstName || !lastName || !email || !phone) return fail("missing");
  if (formData.get("consent") !== "on") return fail("consent");

  const file = formData.get("cv");
  if (!(file instanceof File) || file.size === 0) return fail("file");
  if (file.size > CV_MAX_BYTES) return fail("file");
  const mime = cvMimeFor(file.name, file.type);
  if (!mime) return fail("file");

  const supabase = createAdminClient();

  const { data: job } = await supabase
    .from("jobs")
    .select("id, title_ar, published")
    .eq("slug", jobSlug)
    .single();
  if (!job || !job.published) return fail("failed");

  // The row is written first so an upload failure can never strand a file
  // under an application that doesn't exist; the CV is patched on afterwards.
  const { data: inserted, error: insertError } = await supabase
    .from("job_applications")
    .insert({
      job_id: job.id as string,
      job_slug: jobSlug,
      job_title: (job.title_ar as string) ?? "",
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      city: city || null,
      experience: experience || null,
      cover_letter: coverLetter || null,
      linkedin: linkedin || null,
      consent: true,
    })
    .select("id, application_no")
    .single();

  if (insertError || !inserted) return fail("failed");

  const applicationNo = inserted.application_no as string;
  const path = objectKey(applicationNo, mime);

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: mime, upsert: false });

  // A CV that failed to land would leave the recruiter with a name and no
  // résumé, which is worse than a clean retry — so this one rolls back.
  if (uploadError) {
    await supabase.from("job_applications").delete().eq("id", inserted.id as string);
    return fail("failed");
  }

  const cv: JobApplicationFile = {
    path,
    name: file.name,
    size: file.size,
    mime,
  };
  await supabase
    .from("job_applications")
    .update({ cv })
    .eq("id", inserted.id as string);

  return { ok: true, applicationNo, error: null };
}
