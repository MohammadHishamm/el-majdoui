"use client";

import { useTransition } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { moveRow } from "@/app/admin/dashboard/_actions/reorder";
import { useAdminT } from "@/components/admin/i18n";

/** Up/down reorder control for a list row (persists sort_order via the server). */
export function ReorderButtons({
  table,
  id,
  canUp,
  canDown,
  index,
}: {
  table: string;
  id: string;
  canUp: boolean;
  canDown: boolean;
  /** 1-based position shown next to the arrows. */
  index?: number;
}) {
  const { t } = useAdminT();
  const [pending, start] = useTransition();
  const btn =
    "grid size-6 place-items-center rounded border text-muted-foreground hover:bg-accent disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <div className="flex shrink-0 flex-col items-center gap-1">
      <span className="text-[10px] font-medium text-muted-foreground">{t.common.order}</span>
      <div className="flex items-center gap-1" aria-label={t.common.order}>
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            disabled={!canUp || pending}
            onClick={() => start(() => moveRow(table, id, "up"))}
            className={btn}
            aria-label="Move up"
            title="Move up"
          >
            <ChevronUp className="size-3.5" />
          </button>
          <button
            type="button"
            disabled={!canDown || pending}
            onClick={() => start(() => moveRow(table, id, "down"))}
            className={btn}
            aria-label="Move down"
            title="Move down"
          >
            <ChevronDown className="size-3.5" />
          </button>
        </div>
        {index != null && (
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
            {index}
          </span>
        )}
      </div>
    </div>
  );
}
