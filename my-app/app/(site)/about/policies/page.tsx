import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "السياسات واللوائح" };

export default function PoliciesPage() {
  return (
    <PagePlaceholder
      title="السياسات واللوائح"
      eyebrow="عن المؤسسة"
      backHref="/about"
    />
  );
}
