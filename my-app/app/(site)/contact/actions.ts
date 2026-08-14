"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  ATTACHMENT_MAX_BYTES,
  ATTACHMENT_MAX_FILES,
  ATTACHMENT_MIME_TYPES,
  CONTACT_TYPE_CONFIG,
  isContactRequestType,
  type ContactAttachment,
  type ContactRequestState,
} from "@/lib/site/contact-channel";

const str = (v: FormDataEntryValue | null) => String(v ?? "").trim();

const BUCKET = "contact-attachments";

/** Keeps the stored key predictable and free of anything from the user's filename. */
function objectKey(ticketPrefix: string, index: number, mime: string) {
  const ext = mime === "application/pdf" ? "pdf" : mime === "image/png" ? "png" : "jpg";
  return `${ticketPrefix}/${Date.now()}-${index}.${ext}`;
}

/**
 * Handles a submission from the قناة الشكاوى والمقترحات form.
 *
 * Runs on the service-role client because the table and the attachments bucket
 * both refuse anonymous writes on purpose — the validation below is the only
 * gate, so it must not be skippable by posting straight at the REST API.
 * Every check the browser makes is repeated here.
 */
export async function submitContactRequest(
  _prev: ContactRequestState,
  formData: FormData,
): Promise<ContactRequestState> {
  const type = str(formData.get("type"));
  if (!isContactRequestType(type)) return { ok: false, ticketId: null, error: "missing" };

  const fullName = str(formData.get("full_name"));
  const phone = str(formData.get("phone"));
  const email = str(formData.get("email"));
  const category = str(formData.get("category"));
  const subject = str(formData.get("subject"));
  const body = str(formData.get("body"));
  const addressedTo = str(formData.get("addressed_to"));
  // Only meaningful for شكوى; ignored outright for the other two so a crafted
  // post can't attach a reference number to a suggestion.
  const referenceNo = CONTACT_TYPE_CONFIG[type].hasReference
    ? str(formData.get("reference_no"))
    : "";

  if (!fullName || !phone || !email || !category || !subject || !body) {
    return { ok: false, ticketId: null, error: "missing" };
  }
  if (formData.get("consent") !== "on") {
    return { ok: false, ticketId: null, error: "consent" };
  }

  const files = formData
    .getAll("attachments")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length > ATTACHMENT_MAX_FILES) return { ok: false, ticketId: null, error: "file" };
  for (const file of files) {
    if (file.size > ATTACHMENT_MAX_BYTES) return { ok: false, ticketId: null, error: "file" };
    if (!ATTACHMENT_MIME_TYPES.includes(file.type as (typeof ATTACHMENT_MIME_TYPES)[number])) {
      return { ok: false, ticketId: null, error: "file" };
    }
  }

  const supabase = createAdminClient();

  // The row is written first so an upload failure can never strand files under
  // a ticket that doesn't exist; attachments are patched on afterwards.
  const { data: inserted, error: insertError } = await supabase
    .from("contact_requests")
    .insert({
      type,
      reference_no: referenceNo || null,
      full_name: fullName,
      phone,
      email,
      category,
      addressed_to: addressedTo || null,
      subject,
      body,
      consent: true,
    })
    .select("id, ticket_id")
    .single();

  if (insertError || !inserted) return { ok: false, ticketId: null, error: "failed" };

  const ticketId = inserted.ticket_id as string;

  if (files.length) {
    const stored: ContactAttachment[] = [];
    for (const [i, file] of files.entries()) {
      const path = objectKey(ticketId, i, file.type);
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false });
      // A failed upload must not lose the message itself — the request is
      // already saved, so record what landed and let the rest go.
      if (!error) stored.push({ path, name: file.name, size: file.size, mime: file.type });
    }
    if (stored.length) {
      await supabase
        .from("contact_requests")
        .update({ attachments: stored })
        .eq("id", inserted.id as string);
    }
  }

  return { ok: true, ticketId, error: null };
}
