import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "الهوية البصرية" };

export default function BrandIdentityPage() {
  return (
    <PagePlaceholder
      title="الهوية البصرية"
      description="تحميل الشعارات ودليل الهوية وقوالب المؤسسة."
      backHref="/media-center"
      backLabel="المركز الإعلامي"
    />
  );
}
