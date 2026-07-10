import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createFocusAreaFull } from "../actions";
import { FocusAreaCreateForm } from "@/components/admin/focus-area-create-form";
import { getAdminT } from "@/lib/admin-locale";

export default async function NewFocusAreaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { t } = await getAdminT();
  const { error } = await searchParams;
  const errorMsg = error === "slug_taken" ? t.common.slugTaken : error ? t.common.saveError : null;

  const supabase = await createClient();
  const { data: progs } = await supabase
    .from("programs")
    .select("slug, title_ar")
    .order("sort_order");
  const programOptions = (progs ?? []).map((p) => ({ slug: p.slug as string, title: p.title_ar as string }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/dashboard/focus-areas" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.focus.backTo}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.focus.newArea}</h1>
      </div>
      {errorMsg && (
        <p className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {errorMsg}
        </p>
      )}
      <FocusAreaCreateForm action={createFocusAreaFull} programOptions={programOptions} submitLabel={t.focus.create} />
    </div>
  );
}
