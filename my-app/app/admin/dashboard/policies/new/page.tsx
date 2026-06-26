import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createPolicy } from "../actions";
import { PolicyForm } from "@/components/admin/policy-form";
import { getAdminT } from "@/lib/admin-locale";

export default async function NewPolicyPage() {
  const { t } = await getAdminT();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/dashboard/policies" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.policies.backTo}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.policies.newPolicy}</h1>
      </div>
      <PolicyForm action={createPolicy} submitLabel={t.policies.create} />
    </div>
  );
}
