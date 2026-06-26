import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { updateMember } from "../actions";
import { TeamForm, type TeamValues } from "@/components/admin/team-form";

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { t } = await getAdminT();
  const { data } = await supabase.from("team_members").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/dashboard/team" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.team.backTo}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.team.editMember}</h1>
      </div>
      <TeamForm action={updateMember.bind(null, id)} defaults={data as TeamValues} submitLabel={t.common.save} />
    </div>
  );
}
