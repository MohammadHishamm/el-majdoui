import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobApplicationForm } from "@/components/careers/JobApplicationForm";
import { getJobBySlug } from "@/lib/cms/fetchers";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site/config";
import { absoluteUrl, breadcrumbJsonLd, SITE_URL } from "@/lib/seo";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = await getJobBySlug(id);
  if (!job) return { title: "وظيفة غير موجودة", robots: { index: false, follow: true } };
  const url = `/careers/${id}`;
  const title = `التقديم على ${job.title}`;
  return {
    title,
    description: job.summary,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title, description: job.summary },
    twitter: { card: "summary", title, description: job.summary },
  };
}

function employmentType(t: string): string {
  if (t.includes("جزئ") || /part/i.test(t)) return "PART_TIME";
  if (t.includes("تدريب") || /intern/i.test(t)) return "INTERN";
  if (t.includes("عقد") || /contract/i.test(t)) return "CONTRACTOR";
  return "FULL_TIME";
}

export default async function JobApplyPage({ params }: Props) {
  const { id } = await params;
  const job = await getJobBySlug(id);
  if (!job) notFound();

  const descHtml = [
    job.summary,
    job.responsibilities.length ? `<p><strong>المهام:</strong></p><ul>${job.responsibilities.map((r) => `<li>${r}</li>`).join("")}</ul>` : "",
    job.qualifications.length ? `<p><strong>المؤهلات:</strong></p><ul>${job.qualifications.map((q) => `<li>${q}</li>`).join("")}</ul>` : "",
  ]
    .filter(Boolean)
    .join("");

  const jobLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: descHtml || job.summary,
    inLanguage: "ar",
    ...(job.postedAt ? { datePosted: job.postedAt } : {}),
    employmentType: employmentType(job.type),
    hiringOrganization: {
      "@type": "Organization",
      name: siteConfig.fullName,
      sameAs: SITE_URL,
      logo: absoluteUrl("/images/logo.png"),
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location || "الدمام",
        addressRegion: "المنطقة الشرقية",
        addressCountry: "SA",
      },
    },
    directApply: true,
  };
  const breadcrumb = breadcrumbJsonLd([
    { name: "الرئيسية", path: "/" },
    { name: "التوظيف", path: "/careers" },
    { name: job.title, path: `/careers/${id}` },
  ]);

  return (
    <>
      <JsonLd data={[jobLd, breadcrumb]} />
      <JobApplicationForm job={job} />
    </>
  );
}
