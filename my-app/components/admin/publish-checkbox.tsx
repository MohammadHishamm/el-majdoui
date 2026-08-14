"use client";

import { useOptimistic, useTransition } from "react";
import { setPublished } from "@/app/admin/dashboard/_actions/reorder";
import { useAdminT } from "@/components/admin/i18n";
import { useToast } from "@/components/admin/toast";

/**
 * Per-row publish checkbox for an admin list, so a long roster can be curated
 * without opening each item's editor.
 *
 * Optimistic because the server action revalidates the whole page: without it
 * the box would stay on its old value for the length of the round trip and
 * read as an ignored click. The optimistic value is discarded when the
 * transition ends and the re-rendered `published` prop takes over.
 */
export function PublishCheckbox({
  table,
  id,
  published,
  label,
}: {
  table: string;
  id: string;
  published: boolean;
  /** Accessible name — defaults to the shared "Published" string. */
  label?: string;
}) {
  const { t } = useAdminT();
  const toast = useToast();
  const [pending, start] = useTransition();
  const [shown, setShown] = useOptimistic(published);

  const text = label ?? t.common.published;

  return (
    <label
      className={`inline-flex cursor-pointer select-none items-center gap-1.5 text-xs ${
        pending ? "opacity-60" : ""
      }`}
      title={text}
    >
      <input
        type="checkbox"
        checked={shown}
        // The row is re-fetched by the server, so the input is controlled by
        // `published` rather than by any local state of its own.
        onChange={(e) => {
          const next = e.target.checked;
          start(async () => {
            setShown(next);
            const { ok } = await setPublished(table, id, next);
            // Confirm only what actually happened; a failed write reverts to
            // the server value on the next render, so say so rather than
            // leaving the user thinking it stuck.
            toast(ok ? t.common.saved : t.common.saveError, ok ? "success" : "error");
          });
        }}
        className="size-4 accent-primary"
      />
      <span className={shown ? "" : "text-muted-foreground"}>{text}</span>
    </label>
  );
}
