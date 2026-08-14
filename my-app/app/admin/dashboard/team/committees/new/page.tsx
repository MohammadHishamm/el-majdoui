import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAdminT } from "@/lib/admin-locale";
import { CommitteeForm } from "@/components/admin/committee-form";
import { createCommittee } from "../../committee-actions";

export default async function NewCommitteePage({
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
          href="/admin/dashboard/team"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.team.backTo}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.committees.newCommittee}</h1>
      </div>
      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {t.common.saveError}
        </p>
      )}
      <CommitteeForm action={createCommittee} submitLabel={t.committees.create} />
    </div>
  );
}
