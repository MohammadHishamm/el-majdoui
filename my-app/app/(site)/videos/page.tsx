import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "مكتبة الفيديو" };

export default function VideosPage() {
  return (
    <PagePlaceholder
      title="مكتبة الفيديو"
      description="فيديوهات المؤسسة من YouTube ومنصات أخرى."
      backHref="/media-center"
      backLabel="المركز الإعلامي"
    />
  );
}
