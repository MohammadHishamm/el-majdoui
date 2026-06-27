"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const str = (v: FormDataEntryValue | null) => String(v ?? "").trim();

type Bi = { ar: string; en: string };
type Path = { id: string; title: Bi; desc: Bi; href: string };
type Initiative = { id: string; title: Bi; desc: Bi; paths: Path[] };

function parseInitiatives(v: FormDataEntryValue | null): Initiative[] {
  try {
    const arr = JSON.parse(String(v ?? "[]"));
    if (!Array.isArray(arr)) return [];
    return arr.map((it) => ({
      id: String(it.id ?? Math.random().toString(36).slice(2, 9)),
      title: { ar: String(it?.title?.ar ?? ""), en: String(it?.title?.en ?? "") },
      desc: { ar: String(it?.desc?.ar ?? ""), en: String(it?.desc?.en ?? "") },
      paths: Array.isArray(it.paths)
        ? it.paths.map((pa: Record<string, unknown>) => ({
            id: String(pa.id ?? Math.random().toString(36).slice(2, 9)),
            title: { ar: String((pa.title as Bi)?.ar ?? ""), en: String((pa.title as Bi)?.en ?? "") },
            desc: { ar: String((pa.desc as Bi)?.ar ?? ""), en: String((pa.desc as Bi)?.en ?? "") },
            href: String(pa.href ?? ""),
          }))
        : [],
    }));
  } catch {
    return [];
  }
}

export async function updatePanel(id: string, form: FormData) {
  const supabase = await createClient();
  const row = {
    name_ar: str(form.get("name_ar")),
    name_en: str(form.get("name_en")),
    desc_ar: str(form.get("desc_ar")),
    desc_en: str(form.get("desc_en")),
    bg_color: str(form.get("bg_color")) || "#005761",
    initiatives: parseInitiatives(form.get("initiatives")),
  };
  const { error } = await supabase.from("program_panels").update(row).eq("id", id);
  if (error) redirect(`/admin/dashboard/panels/${id}?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/dashboard/panels");
  revalidatePath("/");
  redirect("/admin/dashboard/panels");
}
