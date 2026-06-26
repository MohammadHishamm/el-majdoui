import { createClient } from "@supabase/supabase-js";

/**
 * Plain anonymous Supabase client (no cookies / no next/headers).
 * For PUBLIC site reads — RLS public-read policies return only published rows.
 * Safe to use during static rendering. Do NOT use for admin/auth operations
 * (those need the cookie-bound server client in `lib/supabase/server.ts`).
 */
export const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } },
);
