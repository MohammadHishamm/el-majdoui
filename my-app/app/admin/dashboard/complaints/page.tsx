import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminT } from "@/lib/admin-locale";
import { ComplaintsBoard, type ComplaintRow } from "./complaints-board";

/** Signed links expire — long enough to open a file, short enough not to leak. */
const SIGNED_URL_TTL = 60 * 10;

export default async function ComplaintsPage() {
  const supabase = await createClient();
  const { t, locale } = await getAdminT();

  const { data, error } = await supabase
    .from("contact_requests")
    .select("*")
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as ComplaintRow[];

  const allPaths = rows.flatMap((r) => (r.attachments ?? []).map((a) => a.path));
  const signedUrls: Record<string, string> = {};
  if (allPaths.length) {
    const { data: urls } = await createAdminClient()
      .storage.from("contact-attachments")
      .createSignedUrls(allPaths, SIGNED_URL_TTL);
    for (const u of urls ?? []) {
      if (u.path && u.signedUrl) signedUrls[u.path] = u.signedUrl;
    }
  }

  return (
    <>
      {error && (
        <p className="mb-4 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {t.common.loadError}
        </p>
      )}
      <ComplaintsBoard rows={rows} signedUrls={signedUrls} t={t} locale={locale} />
    </>
  );
}
