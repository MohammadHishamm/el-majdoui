"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, Mail, MailOpen, Search, X } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";
import type { AdminDict, AdminLocale } from "@/lib/admin-i18n";
import type { JobApplicationFile } from "@/lib/site/job-application";
import { deleteApplication, setApplicationRead } from "./actions";

export type ApplicationRow = {
  id: string;
  application_no: string;
  job_id: string | null;
  job_slug: string;
  job_title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string | null;
  experience: string | null;
  cover_letter: string | null;
  linkedin: string | null;
  cv: JobApplicationFile | null;
  is_read: boolean;
  created_at: string;
};

/* Complaints colour their pills by request type, a fixed set of three. The set
   here is the job postings, which the foundation adds and removes, so the
   palette is assigned by position instead and cycles once it runs out. */
const JOB_STYLES = [
  "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
  "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200",
  "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
  "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-200",
];

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

function matches(row: ApplicationRow, q: string) {
  const hay = [
    row.application_no,
    row.first_name,
    row.last_name,
    `${row.first_name} ${row.last_name}`,
    row.email,
    row.phone,
    row.city,
    row.job_title,
    row.experience,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

/** Bytes → the compact label shown next to the CV link. */
function fileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ApplicationsBoard({
  rows,
  signedUrls,
  t,
  locale,
}: {
  rows: ApplicationRow[];
  signedUrls: Record<string, string>;
  t: AdminDict;
  locale: AdminLocale;
}) {
  const [query, setQuery] = useState("");
  const [searchHint, setSearchHint] = useState(true);
  const [jobFilter, setJobFilter] = useState<string>("all");
  const term = query.trim().toLowerCase();

  useEffect(() => {
    const timer = window.setTimeout(() => setSearchHint(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  /* One pill per posting that has been applied to, keyed by the stored title
     so an application still groups correctly after its job row is deleted.
     Newest application first, which is the order the list itself is in. */
  const jobs = useMemo(() => {
    const seen: string[] = [];
    for (const r of rows) {
      const key = r.job_title || r.job_slug;
      if (key && !seen.includes(key)) seen.push(key);
    }
    return seen;
  }, [rows]);

  const jobStyle = useMemo(() => {
    const map: Record<string, string> = {};
    jobs.forEach((j, i) => {
      map[j] = JOB_STYLES[i % JOB_STYLES.length];
    });
    return map;
  }, [jobs]);

  /* Search is applied before the job pills so the pill counts describe the
     rows the search actually left — otherwise a pill could read "3" and then
     show nothing once clicked. */
  const searched = useMemo(
    () => (term ? rows.filter((r) => matches(r, term)) : rows),
    [rows, term],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: searched.length };
    for (const j of jobs) c[j] = 0;
    for (const r of searched) {
      const key = r.job_title || r.job_slug;
      if (key in c) c[key] += 1;
    }
    return c;
  }, [searched, jobs]);

  const filtered = useMemo(
    () =>
      jobFilter === "all"
        ? searched
        : searched.filter((r) => (r.job_title || r.job_slug) === jobFilter),
    [searched, jobFilter],
  );

  const fullName = (r: ApplicationRow) => `${r.first_name} ${r.last_name}`.trim();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">{t.applications.heading}</h1>
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
              placeholder={t.applications.searchPlaceholder}
              aria-label={t.applications.search}
              className={`h-10 w-full rounded-md border bg-background text-sm outline-none transition-colors focus:border-primary ps-10 ${query ? "pe-10" : "pe-3"}`}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={t.applications.clearSearch}
                className="absolute top-1/2 z-10 -translate-y-1/2 text-muted-foreground hover:text-foreground end-3"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <span className="shrink-0 text-sm text-muted-foreground">
            {filtered.length} {t.applications.resultCount}
          </span>
        </div>
      </div>

      {/* Job filter. Active pills borrow the badge palette so a pill reads as
          the same thing as the posting it selects, and each carries its count
          so the distribution is visible without clicking through. */}
      {jobs.length > 1 && (
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t.applications.filterByJob}>
          {["all", ...jobs].map((key) => {
            const active = jobFilter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setJobFilter(key)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? key === "all"
                      ? "border-primary bg-primary text-primary-foreground"
                      : `border-transparent ${jobStyle[key]}`
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {key === "all" ? t.applications.filterAll : key}
                <span
                  className={`inline-flex size-5 min-w-5 items-center justify-center rounded-full text-[10px] font-medium leading-none tabular-nums ${
                    active ? "bg-black/10 dark:bg-white/20" : "bg-muted"
                  }`}
                >
                  <span className="translate-y-px">{counts[key] ?? 0}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <p className="rounded-xl border p-6 text-center text-muted-foreground">
            {/* "nothing matched" vs "nothing exists" — a job pill can empty the
                list just as a search term can. */}
            {term || jobFilter !== "all" ? t.applications.noResults : t.common.noItems}
          </p>
        ) : (
          filtered.map((r) => {
            const job = r.job_title || r.job_slug;
            const cvHref = r.cv ? signedUrls[r.cv.path] : undefined;
            return (
              <article
                key={r.id}
                className={`overflow-hidden rounded-xl border ${
                  r.is_read ? "" : "border-primary/30 bg-primary/5"
                }`}
              >
                <header className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        jobStyle[job] ?? JOB_STYLES[0]
                      }`}
                    >
                      {job || "—"}
                    </span>
                    <h2 className="min-w-0 font-semibold">{fullName(r)}</h2>
                    {!r.is_read && (
                      <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
                        {t.messages.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <form action={setApplicationRead.bind(null, r.id, !r.is_read)} className="contents">
                      <button className="inline-flex h-7 items-center gap-1 rounded-md border px-2 text-xs leading-none hover:bg-accent">
                        {r.is_read ? <Mail className="size-3.5 shrink-0" /> : <MailOpen className="size-3.5 shrink-0" />}
                        <span className="translate-y-px">
                          {r.is_read ? t.messages.markUnread : t.messages.markRead}
                        </span>
                      </button>
                    </form>
                    <DeleteButton
                      action={deleteApplication.bind(null, r.id)}
                      className="inline-flex h-7 items-center gap-1 rounded-md border border-destructive/40 px-2 text-xs leading-none text-destructive hover:bg-destructive/5"
                    />
                  </div>
                </header>

                <dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-4 gap-y-3 p-4 sm:grid-cols-[max-content_minmax(0,1fr)_max-content_minmax(0,1fr)] sm:gap-x-10 sm:gap-y-3.5">
                  <Field label={t.applications.applicationNo} value={r.application_no} ltr />
                  <Field label={t.applications.applicant} value={fullName(r)} />
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
                    label={t.applications.phone}
                    ltr
                    value={
                      <a href={`tel:${r.phone.replace(/\s/g, "")}`} className="hover:underline">
                        {r.phone}
                      </a>
                    }
                  />
                  <Field label={t.applications.city} value={r.city || "—"} />
                  <Field label={t.applications.experience} value={r.experience || "—"} />
                  <Field
                    label={t.applications.linkedin}
                    ltr
                    value={
                      r.linkedin ? (
                        <a
                          href={r.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {r.linkedin}
                        </a>
                      ) : (
                        "—"
                      )
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
                    {t.applications.coverLetter}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-[13px] font-medium leading-7 text-foreground" dir="auto">
                    {r.cover_letter?.trim() || t.applications.noCoverLetter}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-[13px] text-muted-foreground">{t.applications.cv}</span>
                    {r.cv ? (
                      cvHref ? (
                        <a
                          href={cvHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent"
                        >
                          <FileText className="size-3.5" /> {r.cv.name}
                          <span className="text-muted-foreground">({fileSize(r.cv.size)})</span>
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-muted-foreground">
                          <FileText className="size-3.5" /> {r.cv.name}
                        </span>
                      )
                    ) : (
                      <span className="text-[13px] text-muted-foreground">—</span>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
