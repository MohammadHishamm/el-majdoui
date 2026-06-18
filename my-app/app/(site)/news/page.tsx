import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "الأخبار" };

export default function NewsPage() {
  return (
    <PagePlaceholder
      title="الأخبار"
      description="آخر أخبار وإعلانات وفعاليات المؤسسة."
      backHref="/media-center"
      backLabel="المركز الإعلامي"
    />
  );
}
