import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createMosque } from "../actions";
import { MosqueForm } from "@/components/admin/mosque-form";
import { getAdminT } from "@/lib/admin-locale";

export default async function NewMosquePage() {
  const { t } = await getAdminT();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/dashboard/mosques"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.mosques.backTo}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.mosques.newMosque}</h1>
      </div>
      <MosqueForm action={createMosque} submitLabel={t.mosques.create} />
    </div>
  );
}
