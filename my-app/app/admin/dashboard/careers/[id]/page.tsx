import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { updateJob } from "../actions";
import { JobForm, type JobValues } from "@/components/admin/job-form";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { t } = await getAdminT();
  const { data } = await supabase.from("jobs").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/dashboard/careers" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.careers.backTo}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.careers.editJob}</h1>
      </div>
      <JobForm action={updateJob.bind(null, id)} defaults={data as JobValues} submitLabel={t.common.save} />
    </div>
  );
}
