"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import { FadeInUp } from "@/components/ui/fade-in-up";
import { jobs, reasons, type Job } from "@/lib/careers";

const I = "/images/tawzeef";
const TAG_ICON: Record<string, string> = {
  department: `${I}/people-icon.svg`,
  location: `${I}/loacation-icon.svg`,
  type: `${I}/bag-icon.svg`,
  experience: `${I}/clock-icon.svg`,
  education: `${I}/cap-icon.svg`,
  deadline: `${I}/calendar-icon.svg`,
};

function Tag({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f7f8] px-3 py-1.5 text-[13px] text-[#005761]">
      <Image src={icon} alt="" width={14} height={14} aria-hidden />
      {label}
    </span>
  );
}

function CheckList({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-right text-[16px] font-bold text-[#005761]">{heading}</h4>
      <ul className="mt-4 space-y-3">
        {items.map((it) => (
          <li key={it} className="flex items-start justify-start gap-2 text-right">
            <Image src={`${I}/correct-icon.svg`} alt="" width={16} height={16} aria-hidden className="mt-1 shrink-0" />
            <span className="text-[15px] leading-[24px] text-[#4a5565]">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function JobItem({ job, defaultOpen }: { job: Job; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  return (
    <article className="overflow-hidden rounded-[16px] border-[1.18px] border-[#f3f4f6] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]">
      <div className="flex flex-col gap-6 p-7 lg:flex-row lg:items-start lg:justify-between">
        {/* Title + summary + tags (right) */}
        <div className="flex-1 text-right">
          <h3 className="text-[20px] font-bold text-[#005761]">{job.title}</h3>
          <p className="mt-3 text-[15px] leading-[24px] text-[#4a5565]">{job.summary}</p>
          <div className="mt-4 flex flex-wrap justify-start gap-2">
            <Tag icon={TAG_ICON.deadline} label={`آخر موعد ${job.deadline}`} />
            <Tag icon={TAG_ICON.education} label={job.education} />
            <Tag icon={TAG_ICON.experience} label={job.experience} />
            <Tag icon={TAG_ICON.type} label={job.type} />
            <Tag icon={TAG_ICON.location} label={job.location} />
            <Tag icon={TAG_ICON.department} label={job.department} />
          </div>
        </div>

        {/* Apply + toggle (left) */}
        <div className="flex shrink-0 flex-col items-end gap-3">
          <Link
            href={`/careers/${job.id}`}
            dir="ltr"
            className="inline-flex items-center gap-2 rounded-full bg-[#005761] px-6 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#00444c]"
          >
            <Image src={`${I}/arrow-icon.svg`} alt="" width={16} height={16} aria-hidden className="shrink-0 [filter:brightness(0)_invert(1)]" />
            قدّم الآن
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex items-center gap-1.5 text-[14px] text-[#005761] hover:underline"
          >
            <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
            {open ? "إخفاء التفاصيل" : "عرض التفاصيل الكاملة"}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[#f3f4f6] bg-[#fafcfc] p-7">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <CheckList heading="المهام والمسؤوليات" items={job.responsibilities} />
            <CheckList heading="المؤهلات المطلوبة" items={job.qualifications} />
          </div>
          <div className="mt-6 flex justify-start">
            <div
              className="inline-flex items-start justify-center rounded-[12px] border-[1.18px] border-[#F3F4F6] bg-white text-[13px]"
              style={{ padding: "16px 18.826px 14.361px 22px", gap: "240.011px" }}
            >
              <span className="font-bold text-[#005761]">ينتهي {job.deadline}</span>
              <span className="inline-flex items-center gap-1.5 text-[#6a7282]">
                <Image src={`${I}/calendar-icon.svg`} alt="" width={14} height={14} aria-hidden />
                نشر بتاريخ {job.posted}
              </span>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export function CareersExplorer() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return jobs;
    return jobs.filter((j) => j.title.includes(q) || j.summary.includes(q) || j.department.includes(q));
  }, [query]);

  return (
    <div>
      {/* Why work with us */}
      <FadeInUp>
        <h2 className="mb-8 text-right text-[28px] font-medium text-[#005761] md:text-[32px]">
          لماذا تعمل معنا؟
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r) => (
            <div key={r.id} className="relative h-[360px] overflow-hidden rounded-tr-[60px] rounded-bl-[12px]">
              <Image src={r.image} alt="" fill sizes="(max-width: 1024px) 90vw, 360px" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-right" style={{ backgroundColor: r.color }}>
                <h3 className="text-[22px] font-bold text-white">{r.title}</h3>
                <p className="mt-2 text-[14px] leading-[24px] text-white/90">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </FadeInUp>

      {/* Search */}
      <div className="mt-12 flex justify-start">
        <div className="relative w-full sm:w-[340px]">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث بمسارات الوظائف..."
            aria-label="ابحث بمسارات الوظائف"
            className="w-full rounded-full border border-[#e5e7eb] bg-white py-[11px] pl-11 pr-4 text-right text-[14px] text-text-dark placeholder:text-right placeholder:text-text-muted focus:border-[#005761] focus:outline-none"
          />
        </div>
      </div>

      {/* Job listings */}
      <div className="mt-6 space-y-6">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-text-muted">لا توجد وظائف مطابقة لبحثك.</p>
        ) : (
          filtered.map((job, i) => <JobItem key={job.id} job={job} defaultOpen={i === 0} />)
        )}
      </div>
    </div>
  );
}
