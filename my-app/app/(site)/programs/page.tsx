import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "البرامج والمبادرات",
  description: "برامج ومبادرات مؤسسة المجدوعي الخيرية",
};

export default function ProgramsPage() {
  return (
    <PagePlaceholder
      title="البرامج والمبادرات"
      description="استعرض مبادرات المؤسسة مع فلترة حسب المجال والحالة والفئة المستهدفة."
    />
  );
}
