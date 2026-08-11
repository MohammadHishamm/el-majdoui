import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { updateMosque } from "../actions";
import { MosqueForm, type MosqueValues } from "@/components/admin/mosque-form";

export default async function EditMosquePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { t } = await getAdminT();
  const { data } = await supabase.from("mosques").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/dashboard/mosques"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.mosques.backTo}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.mosques.editMosque}</h1>
      </div>
      <MosqueForm
        action={updateMosque.bind(null, id)}
        defaults={data as MosqueValues}
        submitLabel={t.common.save}
      />
    </div>
  );
}
