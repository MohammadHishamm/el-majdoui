import { redirect } from "next/navigation";
import { Trash2, UserPlus } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile, ROLE_LABELS, type AppRole } from "@/lib/auth";
import { getAdminT } from "@/lib/admin-locale";
import { TextField, SelectField, SubmitButton } from "@/components/admin/fields";
import { createUser, deleteUser, updateUserRole } from "./actions";

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: AppRole;
};

const ROLE_OPTIONS = [
  { value: "super_admin", label: "Super Admin" },
  { value: "content_editor", label: "Content Editor" },
  { value: "news_manager", label: "News Manager" },
];

export default async function UsersPage() {
  const me = await getCurrentProfile();
  if (me?.role !== "super_admin") redirect("/admin/dashboard");
  const { t } = await getAdminT();

  let rows: ProfileRow[] = [];
  let loadError: string | null = null;
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("profiles")
      .select("id, email, full_name, role")
      .order("created_at");
    if (error) loadError = error.message;
    rows = (data ?? []) as ProfileRow[];
  } catch (e) {
    loadError = e instanceof Error ? e.message : "SUPABASE_SERVICE_ROLE_KEY missing?";
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">{t.users.heading}</h1>

      {loadError && (
        <p className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {loadError}
        </p>
      )}

      {/* Existing users */}
      <div className="overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-start text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 text-start font-medium">{t.users.colName}</th>
              <th className="px-4 py-2.5 text-start font-medium">{t.users.colEmail}</th>
              <th className="px-4 py-2.5 text-start font-medium">{t.users.colRole}</th>
              <th className="px-4 py-2.5 text-end font-medium">{t.common.actions}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">{t.common.noItems}</td>
              </tr>
            ) : (
              rows.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-3">{u.full_name || "—"}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <form action={updateUserRole.bind(null, u.id)} className="flex items-center gap-2">
                      <select name="role" defaultValue={u.role} className="rounded-md border px-2 py-1 text-xs">
                        {ROLE_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      <button className="rounded-md border px-2 py-1 text-xs hover:bg-accent">{t.common.update}</button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      {u.id === me.id ? (
                        <span className="text-xs text-muted-foreground">{ROLE_LABELS[u.role]} ({t.common.you})</span>
                      ) : (
                        <form action={deleteUser.bind(null, u.id)}>
                          <button className="inline-flex items-center gap-1 rounded-md border border-destructive/40 px-2 py-1 text-xs text-destructive hover:bg-destructive/5">
                            <Trash2 className="size-3.5" /> {t.common.delete}
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create user */}
      <div className="max-w-xl rounded-xl border p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <UserPlus className="size-4" /> {t.users.invite}
        </h2>
        <form action={createUser} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField name="full_name" label={t.users.fullName} dir="ltr" />
            <TextField name="email" label={t.common.email} type="email" dir="ltr" required />
            <TextField name="password" label={t.users.tempPassword} type="text" dir="ltr" required />
            <SelectField name="role" label={t.common.role} defaultValue="content_editor" options={ROLE_OPTIONS} />
          </div>
          <div>
            <SubmitButton label={t.users.create} />
          </div>
        </form>
      </div>
    </div>
  );
}
