import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "تواصل معنا" };

export default function ContactPage() {
  return (
    <PagePlaceholder
      title="تواصل معنا"
      description="نموذج اتصال، خريطة، وبيانات التواصل."
    />
  );
}
