"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type KPI = {
  value: number;
  suffix: string;
  label: string;
  icon: ReactNode;
};

const KPIS: KPI[] = [
  {
    value: 85,
    suffix: "%",
    label: "نسبة الاستدامة",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-10 w-10">
        <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="2" />
        <path d="M20 8v12l8 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: 3200,
    suffix: "",
    label: "فرصة عمل",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-10 w-10">
        <rect x="6" y="14" width="28" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M14 14V11a6 6 0 0112 0v3" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    value: 15,
    suffix: "",
    label: "شريك استراتيجي",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-10 w-10">
        <circle cx="14" cy="16" r="6" stroke="currentColor" strokeWidth="2" />
        <circle cx="26" cy="16" r="6" stroke="currentColor" strokeWidth="2" />
        <path d="M6 32c0-4.418 3.582-8 8-8s8 3.582 8 8M18 32c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: 120,
    suffix: "",
    label: "قرية مستفيدة",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-10 w-10">
        <path d="M6 34V18l14-10 14 10v16" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <rect x="15" y="24" width="10" height="10" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    value: 2500,
    suffix: "",
    label: "أسرة متعففة",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-10 w-10">
        <circle cx="20" cy="12" r="6" stroke="currentColor" strokeWidth="2" />
        <path d="M8 34c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: 45,
    suffix: "",
    label: "مسجد نموذجي",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-10 w-10">
        <path d="M20 6l12 10v18H8V16L20 6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M16 34V24a4 4 0 018 0v10" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
];

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1600;
          const steps = 40;
          const increment = target / steps;
          let current = 0;
          const interval = setInterval(() => {
            current = Math.min(current + increment, target);
            setCount(Math.round(current));
            if (current >= target) clearInterval(interval);
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString("ar-SA")}
      {suffix}
    </span>
  );
}

export function ImpactKPIs() {
  return (
    <section
      className="bg-primary py-16 md:py-24"
      data-nav-surface="solid"
      aria-labelledby="kpis-heading"
    >
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <div className="mb-14 text-center">
          <h2 id="kpis-heading" className="text-3xl font-bold text-white md:text-4xl">
            أرقام الأثر
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-white/70">
            إنجازاتنا في أرقام تعكس التزامنا بخدمة المجتمع
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {KPIS.map((kpi, i) => (
            <div key={i} className="flex flex-col items-center text-center text-white">
              <div className="mb-4 text-white/80">{kpi.icon}</div>
              <p className="text-3xl font-black md:text-4xl">
                <AnimatedNumber target={kpi.value} suffix={kpi.suffix} />
              </p>
              <p className="mt-2 text-sm text-white/70">{kpi.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
