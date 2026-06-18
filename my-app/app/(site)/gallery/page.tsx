import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "معرض الصور" };

export default function GalleryPage() {
  return (
    <PagePlaceholder
      title="معرض الصور"
      description="ألبومات صور الفعاليات والمبادرات."
      backHref="/media-center"
      backLabel="المركز الإعلامي"
    />
  );
}
