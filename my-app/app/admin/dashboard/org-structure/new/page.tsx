import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAdminT } from "@/lib/admin-locale";
import { OrgLevelForm } from "@/components/admin/org-level-form";
import { createOrgLevel } from "../actions";

export default async function NewOrgLevelPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { t } = await getAdminT();
  const { error } = await searchParams;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/dashboard/org-structure"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.org.backTo}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.org.newLevel}</h1>
      </div>
      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {t.common.saveError}
        </p>
      )}
      <OrgLevelForm action={createOrgLevel} submitLabel={t.org.create} />
    </div>
  );
}
