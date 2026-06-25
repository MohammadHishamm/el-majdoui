export type Report = {
  id: string;
  title: string;
  /** Period label, e.g. "عام 2025" or "الربع الأول 2026". */
  period: string;
  /** Path to the PDF (under /public). */
  file: string;
};

// NOTE: all reports point at the same test PDF for now. Replace each `file`
// with the real document path once the PDFs are uploaded.
const TEST_PDF = "/images/taqareer/invoice-37.pdf";

export const reports: Report[] = [
  {
    id: "annual-2025",
    title: "التقرير السنوي لإنجازات مؤسسة المجدوعي الخيرية",
    period: "عام 2025",
    file: TEST_PDF,
  },
  {
    id: "impact-empowerment-q1-2026",
    title: "تقرير الأثر التنموي لقطاع التمكين الاقتصادي",
    period: "الربع الأول 2026",
    file: TEST_PDF,
  },
  {
    id: "mosques-operation-q4-2025",
    title: "التقرير الدوري لعمارة وتشغيل مساجد المجدوعي",
    period: "الربع الرابع 2025",
    file: TEST_PDF,
  },
  {
    id: "audited-financials-2024",
    title: "القوائم المالية المدققة للمؤسسة",
    period: "عام 2024",
    file: TEST_PDF,
  },
  {
    id: "partners-2025",
    title: "تقرير شراكات التنفيذ مع الجمعيات",
    period: "عام 2025",
    file: TEST_PDF,
  },
];
