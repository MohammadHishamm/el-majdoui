import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "التوظيف" };

export default function CareersPage() {
  return (
    <PagePlaceholder
      title="التوظيف"
      description="فرص العمل المتاحة في مؤسسة المجدوعي الخيرية."
    />
  );
}
