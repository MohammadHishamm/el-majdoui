"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, CloudUpload, X } from "lucide-react";
import { useLocale } from "@/lib/i18n/context";
import {
  ATTACHMENT_ACCEPT,
  ATTACHMENT_MAX_BYTES,
  ATTACHMENT_MAX_FILES,
  ATTACHMENT_MIME_TYPES,
  CONTACT_CATEGORIES,
  CONTACT_DEPARTMENTS,
  CONTACT_REQUEST_TYPES,
  CONTACT_TYPE_CONFIG,
  initialContactRequestState,
  type ContactRequestType,
} from "@/lib/site/contact-channel";
import { submitContactRequest } from "@/app/(site)/contact/actions";

/* The design's input chrome: 46px tall, 8px radius, #d1ddd9 hairline. The
   border is the one value with no semantic token — panel-border is nearly
   invisible at this size — so it's stated here and handed to dark mode. */
const FIELD =
  "h-[46px] w-full rounded-lg border border-[#d1ddd9] bg-panel px-4 text-sm text-body-1 outline-none transition-colors placeholder:text-body-3/70 focus:border-icon dark:border-panel-border";

const LABEL = "mb-2 block w-full text-[13px] font-medium text-body-1 dark:text-heading";

const STEP_TITLE =
  "text-[16px] font-bold leading-[normal] text-[#1A2E30] dark:text-heading";

/** Numbered step heading — teal square, then the step title. */
function StepHeader({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex w-full items-center gap-3">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-xl bg-btn-primary text-[12px] font-bold leading-none text-btn-primary-text">
        <span className="translate-y-px">{n}</span>
      </span>
      <span className={STEP_TITLE}>{title}</span>
    </div>
  );
}

function Required() {
  return <span className="text-red-500"> *</span>;
}

/** Custom select — native <select> lists can't be styled; this matches field chrome. */
function Select({
  name,
  options,
  placeholder,
  required,
  id,
  ar,
}: {
  name: string;
  options: { ar: string; en: string }[];
  placeholder: string;
  required?: boolean;
  id: string;
  ar: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const label = (o: { ar: string; en: string }) => (ar ? o.ar : o.en);
  const selected = options.find((o) => o.ar === value);
  const display = selected ? label(selected) : placeholder;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const pick = (next: string) => {
    setValue(next);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative w-full">
      <input type="hidden" name={name} value={value} required={required} />

      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`${FIELD} flex w-full cursor-pointer items-center text-right ${ar ? "pl-10" : "pr-10"} ${open ? "border-icon" : ""} ${value ? "text-body-1" : "text-body-3/70"}`}
      >
        <span className="min-w-0 flex-1 truncate">{display}</span>
      </button>

      <ChevronDown
        className={`pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-body-3 transition-transform ${open ? "rotate-180" : ""} ${ar ? "left-4" : "right-4"}`}
        aria-hidden
      />

      {open && (
        <ul
          role="listbox"
          aria-labelledby={id}
          className="absolute top-[calc(100%+6px)] z-50 max-h-60 w-full overflow-auto rounded-lg border border-[#d1ddd9] bg-panel py-1 shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:border-panel-border"
        >
          {/* The "no selection" row needs its own wording. Using `placeholder`
              here duplicated the first option verbatim — the design's example
              placeholder text *is* option one — so the list showed the same
              label twice and picking the upper one silently cleared the field. */}
          {!required && (
            <li role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={value === ""}
                onClick={() => pick("")}
                className={`w-full px-4 py-2.5 text-right text-[13px] transition-colors hover:bg-icon-box ${value === "" ? "bg-icon-box/70 font-medium text-[#005761] dark:text-heading" : "text-body-3"}`}
              >
                {ar ? "بدون تحديد" : "No selection"}
              </button>
            </li>
          )}
          {options.map((o) => {
            const active = value === o.ar;
            return (
              <li key={o.ar} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => pick(o.ar)}
                  className={`flex w-full items-center gap-2 px-4 py-2.5 text-right text-[13px] transition-colors hover:bg-icon-box ${
                    active
                      ? "bg-icon-box font-medium text-[#005761] dark:text-heading"
                      : "text-body-1"
                  }`}
                >
                  <span className="min-w-0 flex-1 truncate">{label(o)}</span>
                  {active && <Check className="size-3.5 shrink-0 text-[#005761] dark:text-heading" aria-hidden />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const formatSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export function ContactChannelForm() {
  const { locale } = useLocale();
  const ar = locale !== "en";
  const uid = useId();

  const [type, setType] = useState<ContactRequestType>("suggestion");
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [consentHint, setConsentHint] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [state, formAction, pending] = useActionState(
    submitContactRequest,
    initialContactRequestState,
  );

  /* On success the tall form is replaced by a short confirmation card, which
     leaves the page shorter than the current scroll offset — the reader is
     left staring at the footer with no idea the request went through. Send
     them back to the top so the confirmation and its ticket number are what
     they actually see. */
  useEffect(() => {
    if (!state.ok) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, [state.ok]);

  const cfg = CONTACT_TYPE_CONFIG[type];
  const L = (b: { ar: string; en: string }) => (ar ? b.ar : b.en);
  const consentMessage = ar
    ? "يرجى الإقرار بصحة البيانات والموافقة على سياسة الخصوصية قبل إرسال الطلب."
    : "Please check the box to confirm your details and accept the privacy policy before submitting.";

  /* The <input type="file"> is the source of truth for what gets posted, so
     accepted drops are written back into it via a DataTransfer rather than
     kept only in React state. */
  const commitFiles = (next: File[]) => {
    const dt = new DataTransfer();
    next.forEach((f) => dt.items.add(f));
    if (inputRef.current) inputRef.current.files = dt.files;
    setFiles(next);
  };

  const addFiles = (incoming: FileList | File[]) => {
    const picked = Array.from(incoming);
    const good = picked.filter(
      (f) =>
        ATTACHMENT_MIME_TYPES.includes(f.type as (typeof ATTACHMENT_MIME_TYPES)[number]) &&
        f.size <= ATTACHMENT_MAX_BYTES,
    );

    if (good.length < picked.length) {
      setFileError(
        ar
          ? "بعض الملفات غير مقبولة — يُسمح بـ PDF أو PNG أو JPG بحجم أقصى 10MB."
          : "Some files were rejected — PDF, PNG or JPG up to 10MB only.",
      );
    } else {
      setFileError(null);
    }

    const merged = [...files, ...good].slice(0, ATTACHMENT_MAX_FILES);
    if (files.length + good.length > ATTACHMENT_MAX_FILES) {
      setFileError(
        ar
          ? `يمكن إرفاق ${ATTACHMENT_MAX_FILES} ملفات كحد أقصى.`
          : `Up to ${ATTACHMENT_MAX_FILES} files.`,
      );
    }
    commitFiles(merged);
  };

  if (state.ok) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="box-border w-full shrink-0 rounded-2xl bg-white p-10 text-center shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:bg-panel"
      >
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-icon-box text-icon">
          <Check className="size-6" aria-hidden />
        </span>
        <h2 className="mt-5 text-xl font-bold text-body-1 dark:text-heading">
          {ar ? "تم استلام طلبك بنجاح" : "Your request has been received"}
        </h2>
        <p className="mt-5 inline-flex flex-col gap-1 rounded-xl bg-icon-box px-6 py-4">
          <span className="text-[13px] text-body-3">
            {ar ? "رقم التتبع (Ticket ID)" : "Tracking number (Ticket ID)"}
          </span>
          <span className="text-lg font-bold tracking-wide text-heading" dir="ltr">
            {state.ticketId}
          </span>
        </p>
      </div>
    );
  }

  const errorText =
    state.error === "missing"
      ? ar
        ? "يرجى تعبئة جميع الحقول المطلوبة."
        : "Please fill in all required fields."
      : state.error === "consent"
        ? ar
          ? "يجب الإقرار بصحة البيانات والموافقة على سياسة الخصوصية."
          : "You must confirm the details and accept the privacy policy."
        : state.error === "file"
          ? ar
            ? "أحد المرفقات غير مقبول — يُسمح بـ PDF أو PNG أو JPG بحجم أقصى 10MB."
            : "An attachment was rejected — PDF, PNG or JPG up to 10MB only."
          : state.error
            ? ar
              ? "تعذّر إرسال الطلب. يرجى المحاولة مرة أخرى."
              : "Could not send the request. Please try again."
            : null;

  return (
    <form
      action={formAction}
      className="box-border flex w-full min-w-0 shrink-0 flex-col items-stretch gap-9 rounded-2xl bg-white p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:bg-panel"
      onSubmit={(e) => {
        if (!consent) {
          e.preventDefault();
          setConsentHint(true);
        }
      }}
    >
      {/* type is state, not an input the user can edit — posted as a hidden field */}
      <input type="hidden" name="type" value={type} />

      {/* ---- Step 1: message type ---- */}
      <div className="flex w-full flex-col gap-4">
        <StepHeader n={1} title={ar ? "الخطوة ١: نوع الرسالة" : "Step 1: Message type"} />
        <div className="flex w-full gap-2 sm:gap-3" role="group">
          {CONTACT_REQUEST_TYPES.map((t) => {
            const active = t === type;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                aria-pressed={active}
                className={`min-w-0 flex-1 rounded-2xl border-2 border-btn-2-stroke px-2 py-2 text-center text-sm font-bold transition-colors sm:px-6 sm:py-2.5 sm:text-base ${
                  active
                    ? "bg-btn-primary text-btn-primary-text"
                    : "bg-btn-2-bg text-btn-2-text hover:bg-icon-box"
                }`}
              >
                {L(CONTACT_TYPE_CONFIG[t].tab)}
              </button>
            );
          })}
        </div>

        {/* Complaint-only, and optional even then ("إن وجد"). */}
        {cfg.hasReference && (
          <div className="mt-2 w-full">
            <label htmlFor={`${uid}-ref`} className={LABEL}>
              {ar
                ? "رقم المرجعية / المشروع المرتبط (إن وجد)"
                : "Reference / related project number (if any)"}
            </label>
            <input
              id={`${uid}-ref`}
              name="reference_no"
              type="text"
              className={FIELD}
              placeholder={ar ? "مثال: PRJ-2026-09" : "e.g. PRJ-2026-09"}
            />
          </div>
        )}
      </div>

      <hr className="w-full border-panel-border" />

      {/* ---- Step 2: personal details ---- */}
      <div className="flex w-full flex-col gap-4">
        <StepHeader n={2} title={ar ? "الخطوة ٢: البيانات الشخصية" : "Step 2: Your details"} />
        <div className="grid w-full gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${uid}-name`} className={LABEL}>
              {ar ? "الاسم الكامل" : "Full name"}
              <Required />
            </label>
            <input
              id={`${uid}-name`}
              name="full_name"
              type="text"
              required
              className={FIELD}
              placeholder={ar ? "ادخل اسمك الثلاثي..." : "Enter your full name…"}
            />
          </div>

          <div>
            <label htmlFor={`${uid}-phone`} className={LABEL}>
              {ar ? "رقم الجوال" : "Mobile number"}
              <Required />
            </label>
            {/* +966 is fixed chrome sitting outside the input, so the stored
                value is exactly the local number the user typed. */}
            <div className="flex h-[46px] items-center gap-2 rounded-lg border border-[#d1ddd9] bg-panel px-4 focus-within:border-icon dark:border-panel-border">
              <span className="shrink-0 text-sm text-body-3" dir="ltr">
                +966
              </span>
              <input
                id={`${uid}-phone`}
                name="phone"
                type="tel"
                required
                dir="ltr"
                className="h-full w-full bg-transparent text-sm text-body-1 outline-none placeholder:text-body-3/70"
                placeholder="5X XXX XXXX"
              />
            </div>
          </div>

          <div>
            <label htmlFor={`${uid}-email`} className={LABEL}>
              {ar ? "البريد الإلكتروني" : "Email"}
              <Required />
            </label>
            <input
              id={`${uid}-email`}
              name="email"
              type="email"
              required
              dir="ltr"
              className={FIELD}
              placeholder="example@domain.com"
            />
          </div>

          <div>
            <label htmlFor={`${uid}-category`} className={LABEL}>
              {ar ? "الجهة / التصنيف" : "Entity / category"}
              <Required />
            </label>
            <Select
              id={`${uid}-category`}
              name="category"
              required
              ar={ar}
              options={CONTACT_CATEGORIES}
              placeholder={ar ? "فرد (مستفيد)" : "Individual (beneficiary)"}
            />
          </div>
        </div>
      </div>

      <hr className="w-full border-panel-border" />

      {/* ---- Step 3: the message ---- */}
      <div className="flex w-full flex-col gap-4">
        <StepHeader n={3} title={ar ? "الخطوة ٣: تفاصيل الرسالة" : "Step 3: Message details"} />

        <div className="w-full">
          <label htmlFor={`${uid}-to`} className={LABEL}>
            {ar ? "الموجه إليه (اختياري)" : "Addressed to (optional)"}
          </label>
          <Select
            id={`${uid}-to`}
            name="addressed_to"
            ar={ar}
            options={CONTACT_DEPARTMENTS}
            placeholder={ar ? "إدارة البرامج والمنح" : "Programs & Grants"}
          />
        </div>

        <div className="w-full">
          <label htmlFor={`${uid}-subject`} className={LABEL}>
            {ar ? "عنوان الرسالة" : "Subject"}
            <Required />
          </label>
          <input
            id={`${uid}-subject`}
            name="subject"
            type="text"
            required
            className={FIELD}
            placeholder={ar ? "اكتب عنواناً مختصراً للطلب..." : "A short title for your request…"}
          />
        </div>

        <div className="w-full">
          <label htmlFor={`${uid}-body`} className={LABEL}>
            {L(cfg.bodyLabel)}
            <Required />
          </label>
          <textarea
            id={`${uid}-body`}
            name="body"
            required
            rows={5}
            className={`${FIELD} h-auto resize-y py-3 leading-6`}
            placeholder={L(cfg.bodyPlaceholder)}
          />
        </div>

        {/* ---- Attachments ---- */}
        <div className="w-full">
          <p className={LABEL}>{ar ? "مرفقات إضافية" : "Attachments"}</p>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              addFiles(e.dataTransfer.files);
            }}
            className={`rounded-lg border border-dashed p-8 text-center transition-colors ${
              dragging ? "border-icon bg-icon-box" : "border-[#9fc0c4] bg-surface-alt"
            }`}
          >
            <input
              ref={inputRef}
              id={`${uid}-files`}
              type="file"
              name="attachments"
              multiple
              accept={ATTACHMENT_ACCEPT}
              className="sr-only"
              onChange={(e) => e.target.files && addFiles(e.target.files)}
            />
            <CloudUpload className="mx-auto size-6 text-icon" aria-hidden />
            <label
              htmlFor={`${uid}-files`}
              className="mt-3 block cursor-pointer text-[13px] font-medium text-body-1 underline-offset-4 hover:underline dark:text-heading"
            >
              {ar ? "اسحب الملفات هنا أو اضغط للرفع" : "Drag files here, or click to upload"}
            </label>
            <p className="mt-1 text-[11px] text-body-3" dir="auto">
              {ar ? "PDF, PNG, JPG بحجم أقصى 10MB" : "PDF, PNG, JPG — 10MB max"}
            </p>
          </div>

          {fileError && (
            <p role="alert" className="mt-2 text-[12px] text-red-600">
              {fileError}
            </p>
          )}

          {files.length > 0 && (
            <ul className="mt-3 flex flex-col gap-2">
              {files.map((f, i) => (
                <li
                  key={`${f.name}-${i}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-panel-border bg-surface-alt px-3 py-2 text-[12px] text-body-2"
                >
                  <span className="min-w-0 truncate" dir="auto">
                    {f.name}
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="text-body-3" dir="ltr">
                      {formatSize(f.size)}
                    </span>
                    <button
                      type="button"
                      onClick={() => commitFiles(files.filter((_, j) => j !== i))}
                      aria-label={ar ? `إزالة ${f.name}` : `Remove ${f.name}`}
                      className="grid size-5 place-items-center rounded text-body-3 hover:bg-panel-border hover:text-body-1"
                    >
                      <X className="size-3.5" aria-hidden />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <hr className="w-full border-panel-border" />

      <div className="flex w-full flex-col gap-4">
        <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-body-2">
          <input
            type="checkbox"
            name="consent"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              if (e.target.checked) setConsentHint(false);
            }}
            className="size-4 shrink-0 accent-[#005761]"
          />
          {ar
            ? "أقر بصحة البيانات المرفقة وأوافق على سياسة الخصوصية"
            : "I confirm the details are accurate and accept the privacy policy"}
        </label>

        {consentHint && (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {consentMessage}
          </p>
        )}

        {errorText && (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorText}
          </p>
        )}

        <div className="relative">
          {!consent && !pending && (
            <button
              type="button"
              aria-label={consentMessage}
              className="absolute inset-0 z-10 cursor-not-allowed rounded-lg"
              onClick={() => setConsentHint(true)}
            />
          )}
          <button
            type="submit"
            disabled={!consent || pending}
            className="h-[46px] w-full rounded-lg bg-btn-primary text-base font-bold text-btn-primary-text transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
          {pending
            ? ar
              ? "جارٍ الإرسال…"
              : "Sending…"
            : ar
              ? "إرسال الطلب"
              : "Submit request"}
          </button>
        </div>
      </div>
    </form>
  );
}
