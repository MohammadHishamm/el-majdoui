import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "القيادات التنفيذية" };

export default function LeadershipPage() {
  return (
    <PagePlaceholder
      title="القيادات التنفيذية"
      eyebrow="عن المؤسسة"
      backHref="/about"
    />
  );
}
