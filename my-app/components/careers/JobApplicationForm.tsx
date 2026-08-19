"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { FadeInUp } from "@/components/ui/fade-in-up";
import type { Job } from "@/lib/careers";
import { submitJobApplication } from "@/app/(site)/careers/actions";
import {
  CV_ACCEPT,
  CV_MAX_BYTES,
  cvMimeFor,
  initialJobApplicationState,
  type JobApplicationState,
} from "@/lib/site/job-application";

const I = "/images/tawzeef";

const inputClass =
  "w-full rounded-[10px] border border-panel-border bg-btn-2-bg px-4 py-[11px] text-right text-[14px] text-body-1 placeholder:text-body-3 focus:border-icon focus:outline-none";

const formLabelClass =
  "mb-2 block w-full text-right text-[13px] font-medium leading-[19.5px] text-heading";
const formLabelStyle = { fontFamily: "var(--font-itf-rayat), sans-serif" };

const CONSENT_ERROR = "يرجى الموافقة على سياسة خصوصية البيانات قبل إرسال الطلب.";

/** Server-side rejections, phrased the same way the inline checks are. */
const SERVER_ERROR: Record<NonNullable<JobApplicationState["error"]>, string> = {
  missing: "يرجى تعبئة الحقول الأساسية المطلوبة.",
  consent: CONSENT_ERROR,
  file: "تعذر قبول الملف. يرجى إرفاق سيرة ذاتية بصيغة PDF أو DOCX وبحجم أقل من 5MB.",
  failed: "تعذر إرسال الطلب. يرجى المحاولة مرة أخرى.",
};

/** `field` marks the control the message is about, so it can be pointed at. */
type FormError = { message: string; field?: "consent" };

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={formLabelClass} style={formLabelStyle}>
        <span className="inline-flex items-center gap-1.5">
          {label}
          {icon && <Image src={icon} alt="" width={16} height={16} aria-hidden className="shrink-0" />}
        </span>
      </span>
      {children}
    </label>
  );
}

export function JobApplicationForm({ job }: { job: Job }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<FormError | null>(null);
  const [state, formAction, pending] = useActionState(
    submitJobApplication,
    initialJobApplicationState,
  );

  /* The confirmation replaces a form the applicant has just scrolled to the
     bottom of, so without this they land on the footer and see nothing of it.
     Instant, not smooth, and after a frame: the confirmation is far shorter
     than the form, so the page shrinks under a smooth scroll and the browser
     clamps it to the new bottom mid-animation — which is exactly the footer
     this is meant to avoid. */
  useEffect(() => {
    if (!state.ok) return;
    const top = () => window.scrollTo(0, 0);
    top();
    // Re-asserted after layout settles: the confirmation is far shorter than
    // the form, and the browser re-anchors the scroll position as the page
    // shrinks, which lands the applicant back on the footer.
    const t = setTimeout(top, 100);
    return () => clearTimeout(t);
  }, [state.ok]);

  /* The inline checks run before React hands the submit to the action —
     preventDefault here cancels it — so the applicant sees a missing CV or an
     unticked consent box immediately instead of after a round trip. The action
     repeats every one of them regardless. */
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const required = ["first_name", "last_name", "email", "phone"] as const;
    const stop = (message: string, field?: FormError["field"]) => {
      e.preventDefault();
      setError({ message, field });
    };

    // Checked in the order the fields appear, so the message names the first
    // thing the applicant still has to go back and do.
    for (const name of required) {
      const el = form.elements.namedItem(name) as HTMLInputElement | null;
      if (!el?.value.trim()) return stop("يرجى تعبئة الحقول الأساسية المطلوبة.");
    }

    const file = fileRef.current?.files?.[0];
    if (!file) return stop("يرجى إرفاق السيرة الذاتية.");
    if (file.size > CV_MAX_BYTES) return stop("حجم السيرة الذاتية يتجاوز 5MB.");
    if (!cvMimeFor(file.name, file.type)) {
      return stop("صيغة الملف غير مدعومة. يرجى إرفاق ملف PDF أو DOCX.");
    }
    if (!agree) {
      // The box is the whole reason the button looks unavailable, so send the
      // applicant straight to it rather than leaving them to find it.
      consentRef.current?.focus();
      return stop(CONSENT_ERROR, "consent");
    }

    setError(null);
  };

  const serverError: FormError | null = state.error
    ? { message: SERVER_ERROR[state.error], field: state.error === "consent" ? "consent" : undefined }
    : null;
  const shownError = error ?? serverError;
  const consentMissing = shownError?.field === "consent";

  return (
    <main dir="rtl" className="bg-surface" data-nav-surface="light">
      {/* Header */}
      <section className="-mt-28 bg-surface pt-36 md:pt-40">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 text-[14px] text-body-3 transition-colors hover:text-heading"
            >
              <ArrowLeft className="size-4" />
              العودة إلى التوظيف
            </Link>
            <p className="mt-6 text-right text-[14px] text-body-3">نموذج التقديم على وظيفة</p>
            <h1 className="mt-2 text-right text-[28px] font-bold text-heading md:text-[36px]">
              {job.title}
            </h1>
            <div className="mt-4 flex flex-wrap justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-icon-box px-3 py-1.5 text-[13px] text-heading">
                <Image src={`${I}/people-icon.svg`} alt="" width={14} height={14} aria-hidden />
                {job.department}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-icon-box px-3 py-1.5 text-[13px] text-heading">
                <Image src={`${I}/loacation-icon.svg`} alt="" width={14} height={14} aria-hidden />
                {job.location}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-icon-box px-3 py-1.5 text-[13px] text-heading">
                <Image src={`${I}/bag-icon.svg`} alt="" width={14} height={14} aria-hidden />
                {job.type}
              </span>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="bg-surface py-12 md:py-16">
        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_352px] lg:px-8">
          {/* Form (right) */}
          <div className="order-2 rounded-[16px] border-[1.18px] border-panel-border bg-panel p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-8 lg:order-1">
            {state.ok ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <span className="grid size-16 place-items-center rounded-full bg-icon-box">
                  <Check className="size-8 text-heading" />
                </span>
                <h2 className="text-[22px] font-bold text-heading">تم إرسال طلبك بنجاح</h2>
                <p className="max-w-md text-[15px] leading-[26px] text-body-4">
                  شكراً لتقديمك على وظيفة «{job.title}». سيقوم فريق التوظيف بمراجعة طلبك والتواصل معك قريباً.
                </p>
                {state.applicationNo && (
                  <p className="text-[14px] text-body-3">
                    رقم الطلب:{" "}
                    <span dir="ltr" className="inline-block font-bold text-heading">
                      {state.applicationNo}
                    </span>
                  </p>
                )}
                <Link href="/careers" className="mt-2 text-[14px] font-bold text-heading hover:underline">
                  العودة إلى التوظيف
                </Link>
              </div>
            ) : (
              <form action={formAction} onSubmit={onSubmit} noValidate>
                <input type="hidden" name="job_slug" value={job.id} />
                <h2 className="text-right text-[22px] font-bold text-heading">البيانات الشخصية</h2>
                <p className="mt-1 text-right text-[14px] text-body-3">
                  نرجو تعبئة الحقول الأساسية ليتسنى لنا التواصل معك.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="الاسم الأول" icon={`${I}/person-icon.svg`}>
                    <input name="first_name" type="text" placeholder="مثال: محمد" className={inputClass} required />
                  </Field>
                  <Field label="اسم العائلة" icon={`${I}/person-icon.svg`}>
                    <input name="last_name" type="text" placeholder="مثال: المجدوعي" className={inputClass} required />
                  </Field>
                  <Field label="البريد الإلكتروني" icon={`${I}/email-icon.svg`}>
                    <input name="email" type="email" placeholder="example@email.com" className={inputClass} required />
                  </Field>
                  <Field label="رقم الجوال" icon={`${I}/phone-icon.svg`}>
                    <input name="phone" type="tel" placeholder="966 5x xxx xxxx+" className={inputClass} required />
                  </Field>
                  <Field label="المدينة">
                    <input name="city" type="text" className={inputClass} />
                  </Field>
                  <Field label="سنوات الخبرة">
                    <input name="experience" type="text" className={inputClass} />
                  </Field>
                </div>

                <div className="my-8 h-px w-full bg-panel-border" />

                <h2 className="text-right text-[22px] font-bold text-heading">المؤهلات والملفات</h2>
                <p className="mt-1 text-right text-[14px] text-body-3">
                  ارفع سيرتك الذاتية وأخبرنا لماذا تناسبك هذه الوظيفة.
                </p>

                {/* CV upload */}
                <div className="mt-6">
                  <span className={formLabelClass} style={formLabelStyle}>
                    السيرة الذاتية (PDF / DOCX)
                  </span>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex w-full flex-col items-center justify-center gap-2 rounded-[12px] border border-dashed border-panel-border bg-surface-alt px-6 py-10 text-center transition-colors hover:bg-icon-box"
                  >
                    <span className="grid size-12 place-items-center rounded-full bg-icon-box">
                      <Image src={`${I}/upload-icon.svg`} alt="" width={20} height={20} aria-hidden />
                    </span>
                    <span className="text-[15px] font-bold text-heading">
                      {fileName ?? "اضغط لرفع السيرة الذاتية"}
                    </span>
                    <span className="text-[13px] text-body-3">الحد الأقصى 5MB · PDF أو DOCX</span>
                  </button>
                  <input
                    ref={fileRef}
                    name="cv"
                    type="file"
                    accept={CV_ACCEPT}
                    className="hidden"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                  />
                </div>

                <div className="mt-6">
                  <span className={formLabelClass} style={formLabelStyle}>
                    خطاب التقديم (اختياري)
                  </span>
                  <textarea
                    name="cover_letter"
                    rows={4}
                    placeholder="اكتب نبذة قصيرة عن خبراتك وأسباب اهتمامك بهذه الوظيفة…"
                    className={`${inputClass} resize-y`}
                  />
                </div>

                <div className="mt-6">
                  <span className={formLabelClass} style={formLabelStyle}>
                    رابط LinkedIn (اختياري)
                  </span>
                  <input name="linkedin" type="url" placeholder="https://linkedin.com/in/..." className={inputClass} />
                </div>

                {/* Turns red once the applicant has been told to tick it, so
                    the message and the control it names are read together. */}
                <label
                  className={`mt-6 flex w-full cursor-pointer items-start justify-start gap-3 rounded-[10px] transition-colors ${
                    consentMissing ? "-mx-2 bg-red-50 px-2 py-2 dark:bg-red-950/30" : ""
                  }`}
                >
                  <input
                    ref={consentRef}
                    type="checkbox"
                    name="consent"
                    checked={agree}
                    onChange={(e) => {
                      setAgree(e.target.checked);
                      if (e.target.checked && consentMissing) setError(null);
                    }}
                    aria-invalid={consentMissing}
                    /* A ring, not an outline — the browser draws its own focus
                       outline on this box the moment it is focused, and the two
                       would fight over the same property. */
                    className={`mt-0.5 size-4 shrink-0 accent-heading ${
                      consentMissing ? "ring-2 ring-red-500 ring-offset-2" : ""
                    }`}
                  />
                  <span
                    className={`text-right text-[14px] leading-[22px] ${
                      consentMissing ? "font-medium text-red-600" : "text-body-4"
                    }`}
                  >
                    أوافق على معالجة بياناتي وفق سياسة خصوصية البيانات المعتمدة في مؤسسة المجدوعي الخيرية.
                  </span>
                </label>

                {shownError && (
                  <p role="alert" className="mt-4 text-right text-[14px] text-red-600">
                    {shownError.message}
                  </p>
                )}

                <div className="mt-8 flex items-center justify-start gap-3">
                  {/* Reads as unavailable until consent is given, but stays
                      clickable on purpose: a truly disabled button swallows the
                      click, and the applicant is left with no idea what is
                      missing. `aria-disabled` conveys the same state without
                      taking the click away. */}
                  <button
                    type="submit"
                    disabled={pending}
                    aria-disabled={!agree}
                    title={!agree ? CONSENT_ERROR : undefined}
                    className={`rounded-full bg-btn-primary px-7 py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#00444c] disabled:cursor-not-allowed disabled:opacity-60 ${
                      !agree && !pending ? "cursor-not-allowed opacity-60 hover:bg-btn-primary" : ""
                    }`}
                  >
                    {pending ? "جارٍ الإرسال…" : "إرسال الطلب"}
                  </button>
                  <Link
                    href="/careers"
                    className="rounded-full px-6 py-3 text-[14px] font-medium text-body-4 transition-colors hover:bg-icon-box"
                  >
                    إلغاء
                  </Link>
                </div>
              </form>
            )}
          </div>

          {/* Sidebar (left) */}
          <aside className="order-1 flex flex-col gap-5 lg:order-2">
            <div className="rounded-[16px] bg-icon-box p-6">
              <h3 className="text-right text-[16px] font-bold text-heading">ملخص الوظيفة</h3>
              <ul className="mt-4 space-y-3">
                {[
                  ["القسم", job.department],
                  ["الموقع", job.location],
                  ["نوع العمل", job.type],
                  ["آخر موعد للتقديم", job.deadline],
                ].map(([label, value]) => (
                  <li key={label} className="flex items-center justify-between gap-3">
                    <span className="text-[14px] text-body-3">{label}</span>
                    <span className="text-[14px] font-bold text-heading">{value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[16px] border-[1.18px] border-panel-border bg-panel p-6">
              <h3 className="text-right text-[16px] font-bold text-heading">المتطلبات الأساسية</h3>
              <ul className="mt-4 space-y-3">
                {job.qualifications.map((q) => (
                  <li key={q} className="flex items-start justify-start gap-2 text-right">
                    <Image src={`${I}/correct-icon.svg`} alt="" width={16} height={16} aria-hidden className="mt-0.5 shrink-0" />
                    <span className="text-[14px] leading-[22px] text-body-4">{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
