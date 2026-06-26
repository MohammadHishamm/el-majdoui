import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { updateNews } from "../actions";
import { NewsForm, type NewsFormValues } from "@/components/admin/news-form";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { t } = await getAdminT();
  const { data } = await supabase.from("news").select("*").eq("id", id).single();
  if (!data) notFound();

  const action = updateNews.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/dashboard/news" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4 rtl:rotate-180" /> {t.news.backToArticles}
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{t.news.editArticle}</h1>
      </div>
      <NewsForm action={action} defaults={data as NewsFormValues} submitLabel={t.news.saveChanges} />
    </div>
  );
}
