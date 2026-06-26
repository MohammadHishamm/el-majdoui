import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { updatePolicy } from "../actions";
import { PolicyForm, type PolicyValues } from "@/components/admin/policy-form";

export default async function EditPolicyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { t } = await getAdminT();
  const { data } = await supabase.from("policies").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/dashboard/policies" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.policies.backTo}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.policies.editPolicy}</h1>
      </div>
      <PolicyForm action={updatePolicy.bind(null, id)} defaults={data as PolicyValues} submitLabel={t.common.save} />
    </div>
  );
}
