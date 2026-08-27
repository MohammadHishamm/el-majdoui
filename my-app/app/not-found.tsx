import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";

/** Copy is fixed by the content guide (§10.1), including the secondary action. */
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-center bg-surface py-24" data-nav-surface="light">
        <Container className="text-center">
          <p className="text-sm font-medium text-[#00B5C2]">404</p>
          <h1 className="mt-2 text-3xl font-bold text-heading">الصفحة غير موجودة</h1>
          <p className="mt-4 text-body-2">
            يبدو أن الرابط الذي وصلت منه غير صحيح أو أن الصفحة نُقلت.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-block rounded-lg bg-btn-primary px-6 py-3 text-sm font-bold text-btn-primary-text transition-opacity hover:opacity-90"
            >
              العودة للرئيسية
            </Link>
            <Link
              href="/news"
              className="inline-block rounded-lg border border-panel-border px-6 py-3 text-sm font-bold text-heading transition-colors hover:bg-icon-box"
            >
              تصفّح المركز الإعلامي
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
