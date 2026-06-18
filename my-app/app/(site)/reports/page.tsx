import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "التقارير" };

export default function ReportsPage() {
  return (
    <PagePlaceholder
      title="التقارير"
      description="التقارير السنوية وتقارير الأثر والدراسات."
      backHref="/media-center"
      backLabel="المركز الإعلامي"
    />
  );
}
