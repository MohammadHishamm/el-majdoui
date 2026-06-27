"use server";

import { supabaseAnon } from "@/lib/supabase/anon";

export type ContactState = { ok: boolean; error: string | null };

export async function submitContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { ok: false, error: "missing" };
  }

  const { error } = await supabaseAnon
    .from("contact_messages")
    .insert({ name, email, phone: phone || null, message });

  if (error) return { ok: false, error: "failed" };
  return { ok: true, error: null };
}
