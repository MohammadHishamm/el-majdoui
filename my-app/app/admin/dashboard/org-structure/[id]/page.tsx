import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { OrgLevelForm } from "@/components/admin/org-level-form";
import { normalizePeople } from "@/lib/site/org-levels";
import { updateOrgLevel } from "../actions";

export default async function EditOrgLevelPage({
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
  const { data } = await supabase.from("org_levels").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/dashboard/org-structure"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.org.backTo}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.org.editLevel}</h1>
      </div>
      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {t.common.saveError}
        </p>
      )}
      <OrgLevelForm
        action={updateOrgLevel.bind(null, id)}
        submitLabel={t.common.save}
        defaults={{
          level_no: data.level_no as number,
          title_ar: data.title_ar as string,
          title_en: data.title_en as string,
          subtitle_ar: data.subtitle_ar as string,
          subtitle_en: data.subtitle_en as string,
          description_ar: data.description_ar as string,
          description_en: data.description_en as string,
          icon: data.icon as string,
          bg_color: data.bg_color as string,
          leaders: normalizePeople(data.leaders),
          members_label_ar: data.members_label_ar as string,
          members_label_en: data.members_label_en as string,
          members: normalizePeople(data.members),
          published: data.published as boolean,
        }}
      />
    </div>
  );
}
