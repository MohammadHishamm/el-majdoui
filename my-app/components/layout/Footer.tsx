import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { footerNavigation, siteConfig } from "@/lib/site/config";

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h2 className="mb-4 text-sm font-bold text-white">{title}</h2>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-white/75 transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-footer-bg text-white">
      <Container as="div" className="py-12 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="text-lg font-bold">{siteConfig.name}</p>
            <p className="mt-2 text-sm leading-7 text-white/75">
              {siteConfig.fullName}
            </p>
            <a
              href={siteConfig.grantPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
            >
              {siteConfig.grantPortalLabel}
            </a>
          </div>

          <FooterColumn title="مجالات التركيز" links={footerNavigation.focus} />
          <FooterColumn title="المركز الإعلامي" links={footerNavigation.media} />
          <FooterColumn title="عن المؤسسة" links={footerNavigation.about} />
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/60">
            © {year} {siteConfig.fullName}. جميع الحقوق محفوظة.
          </p>
          <div className="flex flex-wrap gap-4">
            {footerNavigation.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/60 hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
