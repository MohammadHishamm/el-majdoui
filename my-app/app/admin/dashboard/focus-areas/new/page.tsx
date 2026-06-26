import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createFocusArea } from "../actions";
import { FocusAreaForm } from "@/components/admin/focus-area-form";
import { getAdminT } from "@/lib/admin-locale";

export default async function NewFocusAreaPage() {
  const { t } = await getAdminT();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/dashboard/focus-areas" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.focus.backTo}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.focus.newArea}</h1>
      </div>
      <FocusAreaForm action={createFocusArea} submitLabel={t.focus.create} />
    </div>
  );
}
