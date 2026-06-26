import { createClient } from "@/lib/supabase/server";
import { type AppRole, ROLE_LABELS } from "@/lib/roles";

export { ROLE_LABELS };
export type { AppRole };

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: AppRole;
};

/** The signed-in user's profile (id, email, name, role), or null if signed out. */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .single();

  if (!data) {
    // Profile row may not exist yet; fall back to a least-privilege default.
    return { id: user.id, email: user.email ?? "", full_name: null, role: "news_manager" };
  }
  return data as Profile;
}
