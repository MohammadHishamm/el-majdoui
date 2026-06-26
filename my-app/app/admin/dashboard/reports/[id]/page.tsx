import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { updateReport } from "../actions";
import { ReportForm, type ReportValues } from "@/components/admin/report-form";

export default async function EditReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { t } = await getAdminT();
  const { data } = await supabase.from("reports").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/dashboard/reports" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.reports.backTo}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.reports.editReport}</h1>
      </div>
      <ReportForm action={updateReport.bind(null, id)} defaults={data as ReportValues} submitLabel={t.common.save} />
    </div>
  );
}
