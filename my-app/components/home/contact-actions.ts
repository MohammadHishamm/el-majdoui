"use server";

import { supabaseAnon } from "@/lib/supabase/anon";
import { isContactSubject } from "@/lib/site/contact-subjects";

export type ContactState = { ok: boolean; error: string | null };

export async function submitContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  // Honeypot: a real person never fills a field they cannot see.
  const trap = String(formData.get("company") ?? "").trim();

  if (trap) return { ok: true, error: null };

  if (!name || !email || !message) {
    return { ok: false, error: "missing" };
  }
  // The landing-page short form sends no subject; /contact always does, and
  // anything outside the five approved options is rejected rather than stored.
  if (subject && !isContactSubject(subject)) {
    return { ok: false, error: "subject" };
  }

  const { error } = await supabaseAnon
    .from("contact_messages")
    .insert({ name, email, phone: phone || null, subject, message });

  if (error) return { ok: false, error: "failed" };
  return { ok: true, error: null };
}
