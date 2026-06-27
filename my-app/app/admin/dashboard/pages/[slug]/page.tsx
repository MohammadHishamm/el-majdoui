import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { updatePageContent } from "../actions";
import { VisionMissionForm } from "@/components/admin/pages/VisionMissionForm";
import { WhoWeAreForm } from "@/components/admin/pages/WhoWeAreForm";
import { StrategyForm } from "@/components/admin/pages/StrategyForm";
import { BrandIdentityForm } from "@/components/admin/pages/BrandIdentityForm";

const VALID = new Set(["vision-mission", "who-we-are", "strategy", "brand-identity"]);

export default async function EditPagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!VALID.has(slug)) notFound();

  const supabase = await createClient();
  const { t } = await getAdminT();
  const { data } = await supabase.from("page_content").select("content").eq("slug", slug).single();
  const content = (data?.content as Record<string, unknown>) ?? {};

  const action = updatePageContent.bind(null, slug);
  const titles: Record<string, string> = {
    "vision-mission": t.nav.pgVision,
    "who-we-are": t.nav.pgWho,
    strategy: t.nav.pgStrategy,
    "brand-identity": t.nav.pgBrand,
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">{t.nav.sitePages} — {titles[slug]}</h1>
      {slug === "vision-mission" && <VisionMissionForm action={action} defaults={content} submitLabel={t.common.save} />}
      {slug === "who-we-are" && <WhoWeAreForm action={action} defaults={content} submitLabel={t.common.save} />}
      {slug === "strategy" && <StrategyForm action={action} defaults={content} submitLabel={t.common.save} />}
      {slug === "brand-identity" && <BrandIdentityForm action={action} defaults={content} submitLabel={t.common.save} />}
    </div>
  );
}
