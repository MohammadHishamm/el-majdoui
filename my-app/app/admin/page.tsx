import Image from "next/image";

import { LoginForm } from "@/components/login-form";
import { LanguageToggle, ThemeToggle } from "@/components/admin/i18n";
import { adminDict } from "@/lib/admin-i18n";
import { getAdminLocale } from "@/lib/admin-locale";

export default async function AdminLoginPage() {
  const locale = await getAdminLocale();
  const t = adminDict[locale].login;

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Brand panel */}
      <section className="relative flex flex-col justify-between overflow-hidden bg-[#0a1f2d] px-8 py-12 text-white sm:px-12 sm:py-14 lg:px-16 lg:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0a1f2d] via-[#005761] to-[#007a87]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -end-24 -top-24 size-72 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -start-16 size-96 rounded-full bg-[#00b5c2]/20 blur-3xl"
        />

        <div className="relative z-10 flex items-center gap-5 sm:gap-6">
          <Image
            src="/images/logo.png"
            alt="Almajdouie Foundation"
            width={240}
            height={96}
            className="h-auto w-[130px] shrink-0 sm:w-[150px] lg:w-[170px]"
            priority
          />
          <div className="text-start">
            <p className="text-lg font-semibold tracking-tight sm:text-xl">Almajdouie Foundation</p>
            <p className="mt-1 text-sm text-white/75 sm:text-base">مؤسسة المجدوعي الخيرية</p>
          </div>
        </div>

        <div className="relative z-10 mt-12 hidden max-w-lg text-start lg:block">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">
            {t.title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/80 lg:text-lg">{t.brandTagline}</p>
        </div>

        <p className="relative z-10 mt-10 text-xs text-white/55 lg:mt-0">{t.secureNote}</p>
      </section>

      {/* Form panel */}
      <section className="flex min-h-svh flex-col bg-[#f0f7f8] px-6 py-10 dark:bg-background sm:px-12 sm:py-14 lg:px-16 lg:py-16">
        <div className="mb-8 flex justify-end gap-2 lg:mb-10">
          <LanguageToggle className="border-border bg-white px-4 py-2 text-sm text-foreground shadow-sm hover:bg-white/90 dark:bg-card dark:hover:bg-card/90" />
          <ThemeToggle className="border-border bg-white px-3 py-2 text-foreground shadow-sm hover:bg-white/90 dark:bg-card dark:hover:bg-card/90" />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="w-full max-w-xl">
            <div className="mb-10 text-center lg:hidden">
              <Image
                src="/images/logo.png"
                alt="Almajdouie Foundation"
                width={200}
                height={80}
                className="mx-auto mb-6 block h-auto w-[160px]"
              />
              <h1 className="text-2xl font-semibold text-[#0a1f2d] dark:text-foreground">{t.title}</h1>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t.subtitle}</p>
            </div>
            <LoginForm />
          </div>
        </div>
      </section>
    </div>
  );
}
