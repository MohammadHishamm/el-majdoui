import Image from "next/image";
import Link from "next/link";

export function LeadershipSpotlight() {
  return (
    <section className="bg-white py-16 md:py-20" data-nav-surface="light" aria-labelledby="leadership-heading">
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-12">
          {/* Quote content */}
          <div className="flex-1 text-right">
            <span className="mb-3 inline-block text-5xl leading-none text-accent/30 font-serif select-none">
              ❝
            </span>
            <blockquote className="mt-2 text-xl font-medium leading-9 text-text-dark md:text-2xl">
              نسعى في مؤسسة المجدوعي إلى أن يكون كل درهم وُجّه نحو المحتاج أثراً حقيقياً يُغير مسار حياته نحو التمكين والكرامة.
            </blockquote>
            <footer className="mt-6">
              <p className="text-base font-bold text-text-dark">الشيخ علي بن إبراهيم المجدوعي</p>
              <p className="mt-1 text-sm text-text-medium">رئيس مجلس الأمناء</p>
            </footer>
            <Link
              href="/about/board"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent"
            >
              اقرأ المزيد
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 rtl:rotate-180">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          {/* Photo placeholder */}
          <div className="shrink-0">
            <div className="h-40 w-40 rounded-full bg-bg-alt ring-4 ring-accent/20 md:h-48 md:w-48 overflow-hidden">
              <div className="flex h-full w-full items-center justify-center text-text-muted text-sm">
                صورة القيادي
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
