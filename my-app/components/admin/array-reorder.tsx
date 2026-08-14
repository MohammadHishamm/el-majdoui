"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useAdminT } from "@/components/admin/i18n";

/**
 * Up/down controls for an item inside a jsonb array being edited in a form.
 *
 * Deliberately mirrors ReorderButtons — same chevrons, same numbered badge, so
 * ordering feels identical wherever it appears in the admin. It cannot reuse
 * that component, though: ReorderButtons persists immediately by calling
 * moveRow(table, id), whereas these rows have no id of their own and only exist
 * in form state until the form is submitted. Moving here reorders the array and
 * the new order is saved with the rest of the record.
 */
export function ArrayReorder({
  index,
  total,
  onMove,
}: {
  /** 0-based position of this item. */
  index: number;
  total: number;
  onMove: (from: number, to: number) => void;
}) {
  const { t } = useAdminT();
  const btn =
    "grid size-6 place-items-center rounded border text-muted-foreground hover:bg-accent disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <span className="text-[10px] font-medium text-muted-foreground">{t.common.order}</span>
      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => onMove(index, index - 1)}
          className={btn}
          aria-label="Move up"
          title="Move up"
        >
          <ChevronUp className="size-3.5" />
        </button>
        <button
          type="button"
          disabled={index === total - 1}
          onClick={() => onMove(index, index + 1)}
          className={btn}
          aria-label="Move down"
          title="Move down"
        >
          <ChevronDown className="size-3.5" />
        </button>
      </div>
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
        {index + 1}
      </span>
    </div>
  );
}

/** Swap helper shared by the array editors. */
export function moveInArray<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = structuredClone(list);
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}
