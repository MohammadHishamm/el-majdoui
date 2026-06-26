import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { updateHeroSlide } from "../actions";
import { HeroSlideForm, type HeroSlideValues } from "@/components/admin/hero-slide-form";

export default async function EditHeroSlidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { t } = await getAdminT();
  const { data } = await supabase.from("hero_slides").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/dashboard/hero-slides" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.hero.backTo}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.hero.editSlide}</h1>
      </div>
      <HeroSlideForm action={updateHeroSlide.bind(null, id)} defaults={data as HeroSlideValues} submitLabel={t.common.save} />
    </div>
  );
}
