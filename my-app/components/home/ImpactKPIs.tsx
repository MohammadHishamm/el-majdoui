"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type KPI = {
  value: number;
  unit: string;
  label: string;
  prefix?: string;
};

const KPIS: KPI[] = [
  { value: 5000, unit: "+", label: "مستفيد", prefix: "" },
  { value: 15, unit: "", label: "مبادرة نشطة" },
  { value: 12, unit: "", label: "مسجد تحت الرعاية" },
  { value: 15, unit: "+", label: "شريك تنفيذي" },
  { value: 3, unit: "", label: "مجالات تركيز" },
  { value: 2, unit: "", label: "منطقة جغرافية" },
  { value: 143, unit: "", label: "رقم الترخيص" },
  { value: 100, unit: "%", label: "شفافية وحوكمة" },
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
    <section className="bg-primary py-16 md:py-24" data-nav-surface="solid" aria-labelledby="kpis-heading">
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
            أثرنا في أرقام
          </p>
          <h2 id="kpis-heading" className="text-3xl font-bold text-white md:text-4xl">
            أرقام الأثر
          </h2>
          <p className="mt-4 text-base text-white/75">
            إنجازات المؤسسة منذ تأسيسها في خدمة المحتاج والمجتمع.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-px bg-white/10 rounded-2xl overflow-hidden md:grid-cols-4">
          {KPIS.map((kpi, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center bg-primary p-8 text-center"
            >
              <p className="text-4xl font-black text-white md:text-5xl">
                {kpi.prefix}
                <AnimatedNumber target={kpi.value} suffix={kpi.unit} />
              </p>
              <p className="mt-3 text-sm font-medium text-white/75">{kpi.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/reports"
            className="inline-block rounded-full border-2 border-white/40 px-8 py-3 text-sm font-semibold text-white transition-all hover:border-accent hover:text-accent"
          >
            عرض التقرير السنوي
          </Link>
        </div>
      </div>
    </section>
  );
}
