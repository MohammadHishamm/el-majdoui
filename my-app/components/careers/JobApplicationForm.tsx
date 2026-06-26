"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { FadeInUp } from "@/components/ui/fade-in-up";
import type { Job } from "@/lib/careers";

const I = "/images/tawzeef";

const inputClass =
  "w-full rounded-[10px] border border-[#e5e7eb] bg-white px-4 py-[11px] text-right text-[14px] text-text-dark placeholder:text-text-muted focus:border-[#005761] focus:outline-none";

const formLabelClass =
  "mb-2 block w-full text-right text-[13px] font-medium leading-[19.5px] text-[#005761]";
const formLabelStyle = { fontFamily: "var(--font-itf-rayat), sans-serif" };

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
  const [fileName, setFileName] = useState<string | null>(null);
  const [agree, setAgree] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const required = ["firstName", "lastName", "email", "phone"] as const;
    for (const name of required) {
      const el = form.elements.namedItem(name) as HTMLInputElement | null;
      if (!el?.value.trim()) {
        setError("يرجى تعبئة الحقول الأساسية المطلوبة.");
        return;
      }
    }
    if (!fileName) {
      setError("يرجى إرفاق السيرة الذاتية.");
      return;
    }
    if (!agree) {
      setError("يرجى الموافقة على سياسة خصوصية البيانات.");
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  return (
    <main dir="rtl" className="bg-white" data-nav-surface="light">
      {/* Header */}
      <section className="-mt-28 bg-white pt-36 md:pt-40">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 text-[14px] text-text-muted transition-colors hover:text-[#005761]"
            >
              <ArrowLeft className="size-4" />
              العودة إلى التوظيف
            </Link>
            <p className="mt-6 text-right text-[14px] text-text-muted">نموذج التقديم على وظيفة</p>
            <h1 className="mt-2 text-right text-[28px] font-bold text-[#005761] md:text-[36px]">
              {job.title}
            </h1>
            <div className="mt-4 flex flex-wrap justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f7f8] px-3 py-1.5 text-[13px] text-[#005761]">
                <Image src={`${I}/people-icon.svg`} alt="" width={14} height={14} aria-hidden />
                {job.department}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f7f8] px-3 py-1.5 text-[13px] text-[#005761]">
                <Image src={`${I}/loacation-icon.svg`} alt="" width={14} height={14} aria-hidden />
                {job.location}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f7f8] px-3 py-1.5 text-[13px] text-[#005761]">
                <Image src={`${I}/bag-icon.svg`} alt="" width={14} height={14} aria-hidden />
                {job.type}
              </span>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_352px] lg:px-8">
          {/* Form (right) */}
          <div className="order-2 rounded-[16px] border-[1.18px] border-[#f3f4f6] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-8 lg:order-1">
            {submitted ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <span className="grid size-16 place-items-center rounded-full bg-[#e8f1f2]">
                  <Check className="size-8 text-[#005761]" />
                </span>
                <h2 className="text-[22px] font-bold text-[#005761]">تم إرسال طلبك بنجاح</h2>
                <p className="max-w-md text-[15px] leading-[26px] text-text-light">
                  شكراً لتقديمك على وظيفة «{job.title}». سيقوم فريق التوظيف بمراجعة طلبك والتواصل معك قريباً.
                </p>
                <Link href="/careers" className="mt-2 text-[14px] font-bold text-[#005761] hover:underline">
                  العودة إلى التوظيف
                </Link>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <h2 className="text-right text-[22px] font-bold text-[#005761]">البيانات الشخصية</h2>
                <p className="mt-1 text-right text-[14px] text-text-muted">
                  نرجو تعبئة الحقول الأساسية ليتسنى لنا التواصل معك.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="الاسم الأول" icon={`${I}/person-icon.svg`}>
                    <input name="firstName" type="text" placeholder="مثال: محمد" className={inputClass} required />
                  </Field>
                  <Field label="اسم العائلة" icon={`${I}/person-icon.svg`}>
                    <input name="lastName" type="text" placeholder="مثال: المجدوعي" className={inputClass} required />
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

                <div className="my-8 h-px w-full bg-[#f0f0f0]" />

                <h2 className="text-right text-[22px] font-bold text-[#005761]">المؤهلات والملفات</h2>
                <p className="mt-1 text-right text-[14px] text-text-muted">
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
                    className="flex w-full flex-col items-center justify-center gap-2 rounded-[12px] border border-dashed border-[#cfe0e2] bg-[#fafcfc] px-6 py-10 text-center transition-colors hover:bg-[#f0f7f8]"
                  >
                    <span className="grid size-12 place-items-center rounded-full bg-[#e8f1f2]">
                      <Image src={`${I}/upload-icon.svg`} alt="" width={20} height={20} aria-hidden />
                    </span>
                    <span className="text-[15px] font-bold text-[#005761]">
                      {fileName ?? "اضغط لرفع السيرة الذاتية"}
                    </span>
                    <span className="text-[13px] text-text-muted">الحد الأقصى 5MB · PDF أو DOCX</span>
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                  />
                </div>

                <div className="mt-6">
                  <span className={formLabelClass} style={formLabelStyle}>
                    خطاب التقديم (اختياري)
                  </span>
                  <textarea
                    name="coverLetter"
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

                <label className="mt-6 flex w-full cursor-pointer items-start justify-start gap-3">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-0.5 size-4 shrink-0 accent-[#005761]"
                  />
                  <span className="text-right text-[14px] leading-[22px] text-[#4a5565]">
                    أوافق على معالجة بياناتي وفق سياسة خصوصية البيانات المعتمدة في مؤسسة المجدوعي الخيرية.
                  </span>
                </label>

                {error && <p className="mt-4 text-right text-[14px] text-red-600">{error}</p>}

                <div className="mt-8 flex items-center justify-start gap-3">
                  <button
                    type="submit"
                    className="rounded-full bg-[#005761] px-7 py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#00444c]"
                  >
                    إرسال الطلب
                  </button>
                  <Link
                    href="/careers"
                    className="rounded-full px-6 py-3 text-[14px] font-medium text-[#4a5565] transition-colors hover:bg-[#f0f7f8]"
                  >
                    إلغاء
                  </Link>
                </div>
              </form>
            )}
          </div>

          {/* Sidebar (left) */}
          <aside className="order-1 flex flex-col gap-5 lg:order-2">
            <div className="rounded-[16px] bg-[#e8f1f2] p-6">
              <h3 className="text-right text-[16px] font-bold text-[#005761]">ملخص الوظيفة</h3>
              <ul className="mt-4 space-y-3">
                {[
                  ["القسم", job.department],
                  ["الموقع", job.location],
                  ["نوع العمل", job.type],
                  ["آخر موعد للتقديم", job.deadline],
                ].map(([label, value]) => (
                  <li key={label} className="flex items-center justify-between gap-3">
                    <span className="text-[14px] text-[#6a7282]">{label}</span>
                    <span className="text-[14px] font-bold text-[#005761]">{value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[16px] border-[1.18px] border-[#f3f4f6] bg-white p-6">
              <h3 className="text-right text-[16px] font-bold text-[#005761]">المتطلبات الأساسية</h3>
              <ul className="mt-4 space-y-3">
                {job.qualifications.map((q) => (
                  <li key={q} className="flex items-start justify-start gap-2 text-right">
                    <Image src={`${I}/correct-icon.svg`} alt="" width={16} height={16} aria-hidden className="mt-0.5 shrink-0" />
                    <span className="text-[14px] leading-[22px] text-[#4a5565]">{q}</span>
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
