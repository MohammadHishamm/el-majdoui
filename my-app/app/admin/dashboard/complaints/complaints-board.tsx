"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, MailOpen, Paperclip, Search, X } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";
import type { AdminDict, AdminLocale } from "@/lib/admin-i18n";
import type { ContactAttachment, ContactRequestType } from "@/lib/site/contact-channel";
import { deleteRequest, setRequestRead } from "./actions";

export type ComplaintRow = {
  id: string;
  ticket_id: string;
  type: ContactRequestType;
  reference_no: string | null;
  full_name: string;
  phone: string;
  email: string;
  category: string;
  addressed_to: string | null;
  subject: string;
  body: string;
  attachments: ContactAttachment[];
  is_read: boolean;
  created_at: string;
};

const TYPE_STYLE: Record<ContactRequestType, string> = {
  complaint: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
  suggestion: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  inquiry: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
};

/** Filter pill order — matches the tab order on the public form. */
const TYPE_ORDER = ["suggestion", "complaint", "inquiry"] as const;

type TypeFilter = ContactRequestType | "all";

function Field({
  label,
  value,
  ltr,
}: {
  label: string;
  value: React.ReactNode;
  ltr?: boolean;
}) {
  return (
    <div className="col-span-2 grid grid-cols-subgrid items-baseline">
      <dt className="whitespace-nowrap text-[13px] leading-6 text-muted-foreground">
        {label}
      </dt>
      <dd className="min-w-0 text-[13px] font-medium leading-6 text-foreground">
        {ltr ? (
          <span dir="ltr" className="inline-block max-w-full break-words text-start">
            {value}
          </span>
        ) : (
          <span className="break-words">{value}</span>
        )}
      </dd>
    </div>
  );
}

function matches(row: ComplaintRow, q: string) {
  const hay = [
    row.ticket_id,
    row.reference_no,
    row.full_name,
    row.email,
    row.phone,
    row.subject,
    row.category,
    row.addressed_to,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

export function ComplaintsBoard({
  rows,
  signedUrls,
  t,
  locale,
}: {
  rows: ComplaintRow[];
  signedUrls: Record<string, string>;
  t: AdminDict;
  locale: AdminLocale;
}) {
  const [query, setQuery] = useState("");
  const [searchHint, setSearchHint] = useState(true);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const term = query.trim().toLowerCase();

  useEffect(() => {
    const timer = window.setTimeout(() => setSearchHint(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  /* Search is applied before the type pills so the pill counts describe the
     rows the search actually left — otherwise a pill could read "3" and then
     show nothing once clicked. */
  const searched = useMemo(
    () => (term ? rows.filter((r) => matches(r, term)) : rows),
    [rows, term],
  );

  const counts = useMemo(() => {
    const c: Record<TypeFilter, number> = {
      all: searched.length,
      suggestion: 0,
      complaint: 0,
      inquiry: 0,
    };
    for (const r of searched) c[r.type] += 1;
    return c;
  }, [searched]);

  const filtered = useMemo(
    () => (typeFilter === "all" ? searched : searched.filter((r) => r.type === typeFilter)),
    [searched, typeFilter],
  );

  const typeLabel: Record<ContactRequestType, string> = {
    suggestion: t.complaints.typeSuggestion,
    complaint: t.complaints.typeComplaint,
    inquiry: t.complaints.typeInquiry,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">{t.complaints.heading}</h1>
        <div className="flex items-center gap-3">
          <div
            className={`relative w-72 rounded-md transition-shadow duration-300 sm:w-80 ${
              searchHint ? "ring-2 ring-primary/70 ring-offset-2 ring-offset-background animate-pulse" : ""
            }`}
          >
            <Search className="pointer-events-none absolute top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground start-3" />
            <input
              type="text"
              role="searchbox"
              inputMode="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.complaints.searchPlaceholder}
              aria-label={t.complaints.search}
              className={`h-10 w-full rounded-md border bg-background text-sm outline-none transition-colors focus:border-primary ps-10 ${query ? "pe-10" : "pe-3"}`}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={t.complaints.clearSearch}
                className="absolute top-1/2 z-10 -translate-y-1/2 text-muted-foreground hover:text-foreground end-3"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <span className="shrink-0 text-sm text-muted-foreground">
            {filtered.length} {t.complaints.resultCount}
          </span>
        </div>
      </div>

      {/* Type filter. Active pills borrow the badge palette so a pill reads as
          the same thing as the label it selects, and each carries its count so
          the distribution is visible without clicking through. */}
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t.complaints.filterByType}>
        {(["all", ...TYPE_ORDER] as const).map((key) => {
          const active = typeFilter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTypeFilter(key)}
              aria-pressed={active}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? key === "all"
                    ? "border-primary bg-primary text-primary-foreground"
                    : `border-transparent ${TYPE_STYLE[key]}`
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {key === "all" ? t.complaints.filterAll : typeLabel[key]}
              <span
                className={`inline-flex size-5 min-w-5 items-center justify-center rounded-full text-[10px] font-medium leading-none tabular-nums ${
                  active ? "bg-black/10 dark:bg-white/20" : "bg-muted"
                }`}
              >
                <span className="translate-y-px">{counts[key]}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <p className="rounded-xl border p-6 text-center text-muted-foreground">
            {/* "nothing matched" vs "nothing exists" — a type pill can empty
                the list just as a search term can. */}
            {term || typeFilter !== "all" ? t.complaints.noResults : t.common.noItems}
          </p>
        ) : (
          filtered.map((r) => (
            <article
              key={r.id}
              className={`overflow-hidden rounded-xl border ${
                r.is_read ? "" : "border-primary/30 bg-primary/5"
              }`}
            >
              <header className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${TYPE_STYLE[r.type]}`}
                  >
                    {typeLabel[r.type]}
                  </span>
                  <h2 className="min-w-0 font-semibold">{r.subject}</h2>
                  {!r.is_read && (
                    <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
                      {t.messages.unread}
                    </span>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <form action={setRequestRead.bind(null, r.id, !r.is_read)} className="contents">
                    <button className="inline-flex h-7 items-center gap-1 rounded-md border px-2 text-xs leading-none hover:bg-accent">
                      {r.is_read ? <Mail className="size-3.5 shrink-0" /> : <MailOpen className="size-3.5 shrink-0" />}
                      <span className="translate-y-px">
                        {r.is_read ? t.messages.markUnread : t.messages.markRead}
                      </span>
                    </button>
                  </form>
                  <DeleteButton
                    action={deleteRequest.bind(null, r.id)}
                    className="inline-flex h-7 items-center gap-1 rounded-md border border-destructive/40 px-2 text-xs leading-none text-destructive hover:bg-destructive/5"
                  />
                </div>
              </header>

              <dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-4 gap-y-3 p-4 sm:grid-cols-[max-content_minmax(0,1fr)_max-content_minmax(0,1fr)] sm:gap-x-10 sm:gap-y-3.5">
                <Field label={t.complaints.ticket} value={r.ticket_id} ltr />
                {r.reference_no && (
                  <Field label={t.complaints.reference} value={r.reference_no} ltr />
                )}
                <Field label={t.complaints.submitter} value={r.full_name} />
                <Field label={t.complaints.category} value={r.category} />
                <Field
                  label={t.common.email}
                  ltr
                  value={
                    <a href={`mailto:${r.email}`} className="hover:underline">
                      {r.email}
                    </a>
                  }
                />
                <Field
                  label={t.complaints.addressedTo}
                  value={r.addressed_to || "—"}
                />
                <Field
                  label={t.complaints.phone}
                  ltr
                  value={
                    <a href={`tel:+966${r.phone.replace(/\s/g, "")}`} className="hover:underline">
                      +966 {r.phone}
                    </a>
                  }
                />
                <Field
                  label={t.common.date}
                  ltr
                  value={new Date(r.created_at).toLocaleString(locale === "ar" ? "ar-SA" : "en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                />
              </dl>

              <div className="border-t px-4 py-4">
                <p className="text-[13px] leading-6 text-muted-foreground">
                  {t.complaints.messageBody}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-[13px] font-medium leading-7 text-foreground" dir="auto">
                  {r.body}
                </p>

                {(r.attachments ?? []).length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-[13px] text-muted-foreground">
                      {t.complaints.attachments}
                    </span>
                    {r.attachments.map((a) => {
                      const href = signedUrls[a.path];
                      return href ? (
                        <a
                          key={a.path}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent"
                        >
                          <Paperclip className="size-3.5" /> {a.name}
                        </a>
                      ) : (
                        <span
                          key={a.path}
                          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-muted-foreground"
                        >
                          <Paperclip className="size-3.5" /> {a.name}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
