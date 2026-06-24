import { redirect } from "next/navigation";

// القيادة التنفيذية lives within the combined "مجلس الأمناء والقيادات" page.
export default function LeadershipPage() {
  redirect("/about/board#leadership");
}
