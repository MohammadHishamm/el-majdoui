import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { updateFocusAreaDetail } from "../../actions";
import { FocusAreaDetailForm, type DetailValues } from "@/components/admin/focus-area-detail-form";

export default async function FocusAreaDetailEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { t } = await getAdminT();
  const { data } = await supabase.from("focus_areas").select("*").eq("id", id).single();
  if (!data) notFound();

  const { data: progs } = await supabase
    .from("programs")
    .select("slug, title_ar")
    .order("sort_order");
  const programOptions = (progs ?? []).map((p) => ({ slug: p.slug as string, title: p.title_ar as string }));

  const action = updateFocusAreaDetail.bind(null, id, data.slug as string);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/dashboard/focus-areas" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.focus.backTo}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.focus.detailHeading} — {data.name_ar}</h1>
      </div>
      <FocusAreaDetailForm action={action} defaults={data as DetailValues} programOptions={programOptions} submitLabel={t.common.save} />
    </div>
  );
}
