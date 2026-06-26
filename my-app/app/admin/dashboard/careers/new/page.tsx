import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createJob } from "../actions";
import { JobForm } from "@/components/admin/job-form";
import { getAdminT } from "@/lib/admin-locale";

export default async function NewJobPage() {
  const { t } = await getAdminT();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/dashboard/careers" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.careers.backTo}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.careers.newJob}</h1>
      </div>
      <JobForm action={createJob} submitLabel={t.careers.create} />
    </div>
  );
}
