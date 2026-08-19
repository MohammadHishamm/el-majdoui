/**
 * Shared shape and limits for the job application form on /careers/[slug].
 *
 * Imported by both the client form and the server action so the two can never
 * disagree about what a valid CV is — the action repeats every check the
 * browser makes, because the browser is not the gate.
 */

export const CV_MAX_BYTES = 5 * 1024 * 1024;
export const CV_ACCEPT = ".pdf,.doc,.docx";

/** Mirrors the bucket's own allowed_mime_types in 0019. */
export const CV_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

/**
 * Browsers disagree about the MIME type of .doc/.docx (some send
 * application/octet-stream, some send nothing at all), so the extension is
 * accepted as a fallback and the upload is then labelled with the type the
 * bucket expects.
 */
export const CV_EXTENSIONS = ["pdf", "doc", "docx"] as const;

export function cvMimeFor(fileName: string, browserMime: string): string | null {
  if ((CV_MIME_TYPES as readonly string[]).includes(browserMime)) return browserMime;
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "application/pdf";
  if (ext === "doc") return "application/msword";
  if (ext === "docx")
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  return null;
}

/** Stored on job_applications.cv — `path` is a key in the private bucket. */
export type JobApplicationFile = {
  path: string;
  name: string;
  size: number;
  mime: string;
};

/**
 * Result of a submission, shared by the action and the form's useActionState.
 *
 * Lives here rather than beside the action because that file is "use server"
 * and such a module may only export async functions.
 */
export type JobApplicationState = {
  ok: boolean;
  /** Quoted back to the applicant as their reference, e.g. APP-2026-000042. */
  applicationNo: string | null;
  error: "missing" | "consent" | "file" | "failed" | null;
};

export const initialJobApplicationState: JobApplicationState = {
  ok: false,
  applicationNo: null,
  error: null,
};
