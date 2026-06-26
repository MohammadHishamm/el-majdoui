import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createNews } from "../actions";
import { NewsForm } from "@/components/admin/news-form";
import { getAdminT } from "@/lib/admin-locale";

export default async function NewNewsPage() {
  const { t } = await getAdminT();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/dashboard/news" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.news.backToArticles}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.news.newArticle}</h1>
      </div>
      <NewsForm action={createNews} submitLabel={t.news.create} />
    </div>
  );
}
