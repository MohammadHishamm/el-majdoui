import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createGalleryItem } from "../actions";
import { GalleryForm } from "@/components/admin/gallery-form";
import { getAdminT } from "@/lib/admin-locale";

export default async function NewGalleryItemPage() {
  const { t } = await getAdminT();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/dashboard/gallery" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.gallery.backTo}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.gallery.newItem}</h1>
      </div>
      <GalleryForm action={createGalleryItem} submitLabel={t.gallery.create} />
    </div>
  );
}
