import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "سياسة الخصوصية" };

export default function PrivacyPolicyPage() {
  return (
    <PagePlaceholder
      title="سياسة الخصوصية"
      description="سياسة الخصوصية وحماية البيانات."
    />
  );
}
