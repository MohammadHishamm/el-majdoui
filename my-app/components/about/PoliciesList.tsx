"use client";

import { useState } from "react";
import Image from "next/image";
import { FadeInUp } from "@/components/ui/fade-in-up";

type CategoryId = "all" | "basics" | "governance" | "guides";

const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "basics", label: "اللوائح الأساسية" },
  { id: "governance", label: "سياسات الحوكمة" },
  { id: "guides", label: "أدلة العمل والآليات" },
];

type Policy = {
  id: string;
  title: string;
  version: string;
  category: Exclude<CategoryId, "all">;
  /** Path to the downloadable PDF. "#" = file not yet provided. */
  file: string;
};

const VERSION = "إصدار V2 · تحديث 2026";

// NOTE: category assignments are inferred from each title (لائحة → basics،
// سياسة → governance، آلية/دليل → guides). Adjust as needed.
const POLICIES: Policy[] = [
  {
    id: "basic-regulation",
    title: "اللائحة الأساسية لمؤسسة المجدوعي الخيرية",
    version: VERSION,
    category: "basics",
    file: "#",
  },
  {
    id: "data-privacy",
    title: "سياسة خصوصية البيانات وسرية المعلومات",
    version: VERSION,
    category: "governance",
    file: "#",
  },
  {
    id: "conflict-of-interest",
    title: "سياسة تنظيم تعارض المصالح",
    version: VERSION,
    category: "governance",
    file: "#",
  },
  {
    id: "grant-acceptance",
    title: "آلية قبول المنح المالي وضوابطه",
    version: VERSION,
    category: "guides",
    file: "#",
  },
  {
    id: "stakeholder-relations",
    title: "دليل تنظيم علاقات أصحاب المصلحة",
    version: VERSION,
    category: "guides",
    file: "#",
  },
  {
    id: "whistleblowing",
    title: "سياسة الإبلاغ عن المخالفات وحماية مقدمي البلاغات",
    version: VERSION,
    category: "governance",
    file: "#",
  },
  {
    id: "investment",
    title: "آلية الاستثمار وصرف أموال المؤسسة",
    version: VERSION,
    category: "guides",
    file: "#",
  },
];

type PolicyInput = { id: string; title: string; version: string; category: string; file: string };

function PolicyRow({ policy }: { policy: PolicyInput }) {
  const pending = policy.file === "#";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,0.72fr)] lg:gap-6">
      {/* Doc icon + title — RTL start (physical right) */}
      <div className="flex min-w-0 items-center gap-4 lg:justify-self-start">
        <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-[#e8f1f2]">
          <Image
            src="/images/policies/document-icon.svg"
            alt=""
            width={20}
            height={20}
            aria-hidden
          />
        </span>
        <h3 className="text-right text-[16px] font-bold leading-[24px] text-[#005761]">
          {policy.title}
        </h3>
      </div>

      {/* Version — fixed center column, aligned across all rows */}
      <p className="hidden shrink-0 text-center text-[13px] leading-[19.5px] text-[#6a7282] lg:block lg:justify-self-center">
        {policy.version}
      </p>

      {/* Download — RTL end (physical left) */}
      <a
        href={policy.file}
        download={!pending}
        onClick={pending ? (e) => e.preventDefault() : undefined}
        aria-disabled={pending}
        className="inline-flex shrink-0 items-center gap-2 rounded-full border-[1.18px] border-[#005761] px-5 py-[9px] text-[14px] font-medium text-[#005761] transition-colors hover:bg-[#f0f7f8] lg:justify-self-end"
      >
        <span>تحميل الملف</span>
        <Image
          src="/images/policies/download-icon.svg"
          alt=""
          width={16}
          height={16}
          aria-hidden
        />
      </a>
    </div>
  );
}

export function PoliciesList({ items }: { items?: PolicyInput[] }) {
  const [active, setActive] = useState<CategoryId>("all");
  const all: PolicyInput[] = items && items.length ? items : POLICIES;

  const visible =
    active === "all" ? all : all.filter((policy) => policy.category === active);

  return (
    <div>
      {/* Filter tabs — right-aligned in RTL */}
      <div className="flex flex-wrap justify-start gap-3">
        {CATEGORIES.map((category) => {
          const isActive = active === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setActive(category.id)}
              aria-pressed={isActive}
              className={`rounded-full border-[1.18px] px-6 py-[10px] text-[14px] font-medium transition-colors ${
                isActive
                  ? "border-[#005761] bg-[#005761] text-white"
                  : "border-[#e5e7eb] bg-white text-[#005761] hover:bg-[#f0f7f8]"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      {/* Policy list */}
      <div className="mt-8 divide-y divide-[#f3f4f6] overflow-hidden rounded-[16px] border border-[#eef0f2] bg-white">
        {visible.map((policy, i) => (
          <FadeInUp key={policy.id} delay={i * 90} duration={500}>
            <PolicyRow policy={policy} />
          </FadeInUp>
        ))}
      </div>
    </div>
  );
}
