import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createKpi } from "../actions";
import { KpiForm } from "@/components/admin/kpi-form";
import { getAdminT } from "@/lib/admin-locale";

export default async function NewKpiPage() {
  const { t } = await getAdminT();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/dashboard/kpis" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.kpis.backTo}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.kpis.newKpi}</h1>
      </div>
      <KpiForm action={createKpi} submitLabel={t.kpis.create} />
    </div>
  );
}
