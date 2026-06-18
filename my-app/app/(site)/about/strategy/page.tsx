import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "الاستراتيجية" };

export default function StrategyPage() {
  return (
    <PagePlaceholder
      title="الاستراتيجية"
      eyebrow="عن المؤسسة"
      backHref="/about"
    />
  );
}
