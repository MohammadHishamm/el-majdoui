import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "الرؤية والرسالة والقيم" };

export default function VisionMissionPage() {
  return (
    <PagePlaceholder
      title="الرؤية والرسالة والقيم"
      eyebrow="عن المؤسسة"
      backHref="/about"
    />
  );
}
