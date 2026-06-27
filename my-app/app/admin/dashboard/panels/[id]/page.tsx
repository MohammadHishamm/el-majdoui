import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { updatePanel } from "../actions";
import { PanelForm, type PanelValues } from "@/components/admin/panel-form";

export default async function EditPanelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { t } = await getAdminT();
  const { data } = await supabase.from("program_panels").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/dashboard/panels" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.panels.backTo}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.panels.editPanel} — {data.name_ar}</h1>
      </div>
      <PanelForm action={updatePanel.bind(null, id)} defaults={data as PanelValues} submitLabel={t.common.save} />
    </div>
  );
}
