"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Generic "move up / move down" reordering for any sort_order-backed table.
 * Renumbers the whole (optionally grouped) list 1..N so order is always clean,
 * even if rows started with duplicate or 0 sort_order values.
 */
type TableCfg = { revalidate: string[]; group?: string };

const TABLES: Record<string, TableCfg> = {
  hero_slides: { revalidate: ["/admin/dashboard/hero-slides", "/"] },
  focus_areas: { revalidate: ["/admin/dashboard/focus-areas", "/", "/focus-areas"] },
  gallery_items: { revalidate: ["/admin/dashboard/gallery", "/gallery"] },
  jobs: { revalidate: ["/admin/dashboard/careers", "/careers"] },
  kpis: { revalidate: ["/admin/dashboard/kpis", "/"] },
  policies: { revalidate: ["/admin/dashboard/policies", "/about/policies"] },
  programs: { revalidate: ["/admin/dashboard/programs", "/programs"] },
  reports: { revalidate: ["/admin/dashboard/reports", "/reports"] },
  team_members: { revalidate: ["/admin/dashboard/team", "/about/board"], group: "type" },
};

export async function moveRow(table: string, id: string, dir: "up" | "down") {
  const cfg = TABLES[table];
  if (!cfg) return;
  const supabase = await createClient();

  const { data: target } = await supabase.from(table).select("*").eq("id", id).single();
  if (!target) return;

  let query = supabase.from(table).select("id, sort_order").order("sort_order").order("id");
  if (cfg.group) query = query.eq(cfg.group, (target as Record<string, unknown>)[cfg.group]);
  const { data: rows } = await query;
  if (!rows || rows.length < 2) return;

  const idx = rows.findIndex((r) => r.id === id);
  const swap = dir === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swap < 0 || swap >= rows.length) return;

  [rows[idx], rows[swap]] = [rows[swap], rows[idx]];

  await Promise.all(rows.map((r, i) => supabase.from(table).update({ sort_order: i + 1 }).eq("id", r.id)));
  cfg.revalidate.forEach((p) => revalidatePath(p));
}

/** Next sort_order for a new row (append to the end), optionally within a group. */
export async function nextSortOrder(table: string, group?: { col: string; val: unknown }): Promise<number> {
  const supabase = await createClient();
  let query = supabase.from(table).select("sort_order").order("sort_order", { ascending: false }).limit(1);
  if (group) query = query.eq(group.col, group.val);
  const { data } = await query;
  const max = data && data.length ? Number(data[0].sort_order ?? 0) : 0;
  return (Number.isFinite(max) ? max : 0) + 1;
}
