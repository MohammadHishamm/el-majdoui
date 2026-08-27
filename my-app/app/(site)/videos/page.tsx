import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  alternates: { canonical: "/videos" },
  title: "مكتبة الفيديو",
  description:
    "مقاطع مرئية توثّق أعمال مؤسسة المجدوعي الخيرية ومبادراتها.",
};

/**
 * The shortlist of videos, with their titles and descriptions, is still with
 * Communications (§7.3). Until it arrives the page states plainly that nothing
 * is published rather than embedding the YouTube channel wholesale.
 */
export default function VideosPage() {
  return (
    <PagePlaceholder
      eyebrow="المركز الإعلامي"
      title="مكتبة الفيديو"
      description="مقاطع مرئية توثّق أعمال المؤسسة ومبادراتها."
      backHref="/news"
      backLabel="المركز الإعلامي"
    />
  );
}
