import Link from "next/link";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { deleteMember, updateChairman } from "./actions";
import { BoardForm } from "@/components/admin/pages/BoardForm";
import { ReorderButtons } from "@/components/admin/reorder-buttons";

type Row = { id: string; type: string; name_ar: string; role_ar: string; image: string | null; published: boolean };

export default async function TeamListPage() {
  const supabase = await createClient();
  const { t } = await getAdminT();
  const TYPE: Record<string, string> = { board: t.team.typeBoard, leadership: t.team.typeLeadership };
  const { data, error } = await supabase
    .from("team_members")
    .select("id, type, name_ar, role_ar, image, published")
    .order("type")
    .order("sort_order");
  const rows = (data ?? []) as Row[];

  const { data: boardData } = await supabase.from("page_content").select("content").eq("slug", "board").single();
  const chairman = (boardData?.content as Record<string, unknown>) ?? {};

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border p-5">
        <h2 className="mb-4 text-base font-semibold">{t.nav.boardChairman}</h2>
        <BoardForm action={updateChairman} defaults={chairman} submitLabel={t.common.save} />
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t.team.heading}</h1>
        <Link href="/admin/dashboard/team/new" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="size-4" /> {t.team.newMember}
        </Link>
      </div>
      {error && <p className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">{t.common.loadError}</p>}
      <div className="grid gap-3">
        {rows.length === 0 ? (
          <p className="rounded-xl border p-6 text-center text-muted-foreground">{t.common.noItems}</p>
        ) : (
          rows.map((m, i) => (
            <div key={m.id} className="flex items-center justify-between rounded-xl border p-3">
              <div className="flex items-center gap-3" dir="rtl">
                <ReorderButtons
                  table="team_members"
                  id={m.id}
                  canUp={i > 0 && rows[i - 1].type === m.type}
                  canDown={i < rows.length - 1 && rows[i + 1].type === m.type}
                  index={rows.slice(0, i + 1).filter((r) => r.type === m.type).length}
                />
                <span className="relative size-10 overflow-hidden rounded-full bg-muted">
                  {m.image
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={m.image} alt="" className="size-full object-cover" />
                    : <span className="grid size-full place-items-center text-muted-foreground"><Users className="size-4" /></span>}
                </span>
                <div>
                  <div className="font-medium">{m.name_ar}</div>
                  <div className="text-xs text-muted-foreground">{TYPE[m.type]} · {m.role_ar}</div>
                </div>
                {!m.published && <span className="rounded-full bg-muted px-2 py-0.5 text-[11px]">{t.common.draft}</span>}
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/dashboard/team/${m.id}`} className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent"><Pencil className="size-3.5" /> {t.common.edit}</Link>
                <form action={deleteMember.bind(null, m.id)}>
                  <button className="inline-flex items-center gap-1 rounded-md border border-destructive/40 px-2 py-1 text-xs text-destructive hover:bg-destructive/5"><Trash2 className="size-3.5" /> {t.common.delete}</button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
