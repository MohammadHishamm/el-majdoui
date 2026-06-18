import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "مجلس الأمناء" };

export default function BoardPage() {
  return (
    <PagePlaceholder
      title="مجلس الأمناء"
      eyebrow="عن المؤسسة"
      backHref="/about"
    />
  );
}
