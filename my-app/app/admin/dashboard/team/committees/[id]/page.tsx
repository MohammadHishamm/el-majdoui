import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { CommitteeForm } from "@/components/admin/committee-form";
import { normalizeDuties, normalizeMembers } from "@/lib/site/board-committees";
import { updateCommittee } from "../../committee-actions";

export default async function EditCommitteePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const { t } = await getAdminT();

  const supabase = await createClient();
  const { data } = await supabase.from("board_committees").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/dashboard/team"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.team.backTo}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.committees.editCommittee}</h1>
      </div>
      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {t.common.saveError}
        </p>
      )}
      <CommitteeForm
        action={updateCommittee.bind(null, id)}
        submitLabel={t.common.save}
        defaults={{
          slug: data.slug as string,
          title_ar: data.title_ar as string,
          title_en: data.title_en as string,
          description_ar: data.description_ar as string,
          description_en: data.description_en as string,
          members: normalizeMembers(data.members),
          duties: normalizeDuties(data.duties),
          published: data.published as boolean,
        }}
      />
    </div>
  );
}
