import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createHeroSlide } from "../actions";
import { HeroSlideForm } from "@/components/admin/hero-slide-form";
import { getAdminT } from "@/lib/admin-locale";

export default async function NewHeroSlidePage() {
  const { t } = await getAdminT();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/dashboard/hero-slides" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.hero.backTo}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.hero.newSlide}</h1>
      </div>
      <HeroSlideForm action={createHeroSlide} submitLabel={t.hero.create} />
    </div>
  );
}
