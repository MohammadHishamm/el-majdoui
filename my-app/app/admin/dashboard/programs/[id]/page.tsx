import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { updateProgram } from "../actions";
import { ProgramForm, type ProgramValues } from "@/components/admin/program-form";

export default async function EditProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { t } = await getAdminT();
  const { data } = await supabase.from("programs").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/dashboard/programs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.programs.backTo}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.programs.editProgram}</h1>
      </div>
      <ProgramForm action={updateProgram.bind(null, id)} defaults={data as ProgramValues} submitLabel={t.common.save} />
    </div>
  );
}
