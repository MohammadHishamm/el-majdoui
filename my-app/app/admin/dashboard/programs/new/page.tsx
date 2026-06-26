import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createProgram } from "../actions";
import { ProgramForm } from "@/components/admin/program-form";
import { getAdminT } from "@/lib/admin-locale";

export default async function NewProgramPage() {
  const { t } = await getAdminT();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/dashboard/programs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.programs.backTo}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.programs.newProgram}</h1>
      </div>
      <ProgramForm action={createProgram} submitLabel={t.programs.create} />
    </div>
  );
}
