import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createReport } from "../actions";
import { ReportForm } from "@/components/admin/report-form";
import { getAdminT } from "@/lib/admin-locale";

export default async function NewReportPage() {
  const { t } = await getAdminT();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/dashboard/reports" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.reports.backTo}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.reports.newReport}</h1>
      </div>
      <ReportForm action={createReport} submitLabel={t.reports.create} />
    </div>
  );
}
