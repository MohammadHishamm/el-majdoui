import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { StrategicAlignmentForm } from "@/components/admin/strategic-alignment-form";
import { updateStrategicAlignment } from "./actions";

export default async function StrategicAlignmentAdminPage() {
  const supabase = await createClient();
  const { t } = await getAdminT();
  const { data } = await supabase
    .from("page_content")
    .select("content")
    .eq("slug", "strategic-alignment")
    .single();
  const content = (data?.content as Record<string, unknown>) ?? {};

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">{t.nav.homeStrategic}</h1>
      <StrategicAlignmentForm action={updateStrategicAlignment} defaults={content} submitLabel={t.common.save} />
    </div>
  );
}
