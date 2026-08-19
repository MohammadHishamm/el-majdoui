import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminT } from "@/lib/admin-locale";
import { ApplicationsBoard, type ApplicationRow } from "./applications-board";

/** Signed links expire — long enough to open a CV, short enough not to leak. */
const SIGNED_URL_TTL = 60 * 10;

export default async function ApplicationsPage() {
  const supabase = await createClient();
  const { t, locale } = await getAdminT();

  const { data, error } = await supabase
    .from("job_applications")
    .select("*")
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as ApplicationRow[];

  const paths = rows.map((r) => r.cv?.path).filter((p): p is string => Boolean(p));
  const signedUrls: Record<string, string> = {};
  if (paths.length) {
    const { data: urls } = await createAdminClient()
      .storage.from("job-applications")
      .createSignedUrls(paths, SIGNED_URL_TTL);
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
      <ApplicationsBoard rows={rows} signedUrls={signedUrls} t={t} locale={locale} />
    </>
  );
}
