import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";

type PagePlaceholderProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  backHref?: string;
  backLabel?: string;
};

export function PagePlaceholder({
  title,
  description,
  eyebrow,
  backHref,
  backLabel = "العودة",
}: PagePlaceholderProps) {
  return (
    <>
      <PageHeader title={title} description={description} eyebrow={eyebrow} />
      <Container as="main" className="py-12">
        <div className="rounded-xl border border-dashed border-light-blue/40 bg-surface-alt p-8 text-center">
          <p className="text-body-3">
            سيتم تنفيذ تصميم هذه الصفحة بعد ربط Figma.
          </p>
          {backHref && (
            <Link
              href={backHref}
              className="mt-6 inline-block text-sm font-medium text-heading hover:text-icon"
            >
              {backLabel}
            </Link>
          )}
        </div>
      </Container>
    </>
  );
}
