import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "من نحن" };

export default function WhoWeArePage() {
  return (
    <PagePlaceholder
      title="من نحن"
      eyebrow="عن المؤسسة"
      backHref="/about"
    />
  );
}
