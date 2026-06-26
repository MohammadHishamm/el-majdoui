import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { updateGalleryItem } from "../actions";
import { GalleryForm, type GalleryValues } from "@/components/admin/gallery-form";

export default async function EditGalleryItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { t } = await getAdminT();
  const { data } = await supabase.from("gallery_items").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/dashboard/gallery" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.gallery.backTo}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.gallery.editItem}</h1>
      </div>
      <GalleryForm action={updateGalleryItem.bind(null, id)} defaults={data as GalleryValues} submitLabel={t.common.save} />
    </div>
  );
}
