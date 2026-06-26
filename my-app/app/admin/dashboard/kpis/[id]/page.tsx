import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { updateKpi } from "../actions";
import { KpiForm, type KpiValues } from "@/components/admin/kpi-form";

export default async function EditKpiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { t } = await getAdminT();
  const { data } = await supabase.from("kpis").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/dashboard/kpis" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.kpis.backTo}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.kpis.editKpi}</h1>
      </div>
      <KpiForm action={updateKpi.bind(null, id)} defaults={data as KpiValues} submitLabel={t.common.save} />
    </div>
  );
}
