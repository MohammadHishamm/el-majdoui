import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createMember } from "../actions";
import { TeamForm } from "@/components/admin/team-form";
import { getAdminT } from "@/lib/admin-locale";

export default async function NewMemberPage() {
  const { t } = await getAdminT();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/dashboard/team" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.team.backTo}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.team.newMember}</h1>
      </div>
      <TeamForm action={createMember} submitLabel={t.team.create} />
    </div>
  );
}
