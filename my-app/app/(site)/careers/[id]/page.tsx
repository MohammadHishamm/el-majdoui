import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobApplicationForm } from "@/components/careers/JobApplicationForm";
import { getJobBySlug } from "@/lib/cms/fetchers";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = await getJobBySlug(id);
  if (!job) return { title: "وظيفة غير موجودة" };
  return { title: `التقديم على ${job.title} | مؤسسة المجدوعي الخيرية`, description: job.summary };
}

export default async function JobApplyPage({ params }: Props) {
  const { id } = await params;
  const job = await getJobBySlug(id);
  if (!job) notFound();
  return <JobApplicationForm job={job} />;
}
