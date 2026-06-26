"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile, type AppRole } from "@/lib/auth";

const ROLES: AppRole[] = ["super_admin", "content_editor", "news_manager"];

async function requireSuperAdmin() {
  const profile = await getCurrentProfile();
  if (profile?.role !== "super_admin") redirect("/admin/dashboard");
}

function str(v: FormDataEntryValue | null): string {
  return String(v ?? "").trim();
}

function asRole(v: string): AppRole {
  return (ROLES as string[]).includes(v) ? (v as AppRole) : "news_manager";
}

export async function createUser(form: FormData) {
  await requireSuperAdmin();
  const email = str(form.get("email"));
  const password = str(form.get("password"));
  const fullName = str(form.get("full_name"));
  const role = asRole(str(form.get("role")));

  if (!email || password.length < 8) {
    redirect("/admin/dashboard/users?error=" + encodeURIComponent("Email and 8+ char password required"));
  }

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });
  if (error || !data.user) {
    redirect("/admin/dashboard/users?error=" + encodeURIComponent(error?.message ?? "Create failed"));
  }
  await admin.from("profiles").update({ role, full_name: fullName }).eq("id", data.user.id);

  revalidatePath("/admin/dashboard/users");
  redirect("/admin/dashboard/users");
}

export async function updateUserRole(id: string, form: FormData) {
  await requireSuperAdmin();
  const role = asRole(str(form.get("role")));
  const admin = createAdminClient();
  await admin.from("profiles").update({ role }).eq("id", id);
  revalidatePath("/admin/dashboard/users");
}

export async function deleteUser(id: string) {
  await requireSuperAdmin();
  const admin = createAdminClient();
  await admin.auth.admin.deleteUser(id);
  revalidatePath("/admin/dashboard/users");
}
