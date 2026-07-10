import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-center bg-surface py-24" data-nav-surface="light">
        <Container className="text-center">
          <p className="text-sm font-medium text-[#00B5C2]">404</p>
          <h1 className="mt-2 text-3xl font-bold text-heading">الصفحة غير موجودة</h1>
          <p className="mt-4 text-body-2">
            عذراً، لم نتمكن من العثور على الصفحة المطلوبة.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-lg bg-btn-primary px-6 py-3 text-sm font-bold text-btn-primary-text transition-opacity hover:opacity-90"
          >
            العودة للرئيسية
          </Link>
        </Container>
      </main>
      <Footer />
    </>
  );
}
