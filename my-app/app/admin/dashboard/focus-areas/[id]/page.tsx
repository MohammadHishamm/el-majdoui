import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { updateFocusArea } from "../actions";
import { FocusAreaForm, type FocusAreaValues } from "@/components/admin/focus-area-form";

export default async function EditFocusAreaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { t } = await getAdminT();
  const { data } = await supabase.from("focus_areas").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/dashboard/focus-areas" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.focus.backTo}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.focus.editArea}</h1>
      </div>
      <FocusAreaForm action={updateFocusArea.bind(null, id)} defaults={data as FocusAreaValues} submitLabel={t.common.save} />
    </div>
  );
}
