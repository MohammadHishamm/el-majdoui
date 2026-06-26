export type Reason = {
  id: string;
  title: string;
  desc: string;
  image: string;
  color: string;
};

const DIR = "/images/tawzeef";

export const reasons: Reason[] = [
  {
    id: "impact",
    title: "أثر مجتمعي ملموس",
    desc: "كل دور لدينا يصنع فرقاً مباشراً في حياة المحتاجين والمستفيدين من برامجنا.",
    image: `${DIR}/reason-1.png`,
    color: "#005761",
  },
  {
    id: "growth",
    title: "تطوير مهني مستمر",
    desc: "مسارات تدريب وتأهيل مستمرة، وفرص نمو حقيقية في قطاع التنمية المؤسسية.",
    image: `${DIR}/reason-2.png`,
    color: "#00b5c2",
  },
  {
    id: "culture",
    title: "بيئة عمل محفزة",
    desc: "بيئة مؤسسية مرنة تشجع على الإبداع والمبادرة وتقدّر التنوع والشغف بالعطاء.",
    image: `${DIR}/reason-3.png`,
    color: "#80a5e0",
  },
];

export type Job = {
  id: string;
  title: string;
  summary: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  education: string;
  /** Deadline date label, e.g. "30 يونيو 2026". */
  deadline: string;
  posted: string;
  responsibilities: string[];
  qualifications: string[];
};

export const jobs: Job[] = [
  {
    id: "grants-specialist",
    title: "أخصائي منح ومبادرات تدوير",
    summary:
      "يساهم شاغل الوظيفة في إدارة دورة المنح الكاملة، من استقبال الطلبات وحتى قياس الأثر بالتعاون مع الجمعيات الشريكة وإدارة البرامج.",
    department: "إدارة المنح",
    location: "الدمام",
    type: "دوام كامل",
    experience: "خبرة 3-5 سنوات",
    education: "بكالوريوس في تخصص ذي صلة",
    deadline: "30 يونيو 2026",
    posted: "10 يونيو 2026",
    responsibilities: [
      "إدارة دورة المنح من الاستقبال والتقييم والاعتماد والصرف والمتابعة.",
      "تطوير معايير وآليات المنح بما يضمن الشفافية والكفاءة.",
      "بناء وتطوير العلاقات مع الجمعيات والمنظمات المستفيدة.",
      "إعداد التقارير الدورية لقياس أثر المنح.",
    ],
    qualifications: [
      "بكالوريوس في إدارة الأعمال أو العمل الاجتماعي أو ما يعادلها.",
      "3 سنوات خبرة في إدارة المنح أو القطاع غير الربحي.",
      "مهارات تواصل وكتابة تقارير عالية.",
      "إجادة العربية والإنجليزية كتابةً وتحدثاً.",
    ],
  },
  {
    id: "governance-officer",
    title: "مسؤول حوكمة وتميز مؤسسي",
    summary:
      "يقود شاغل الوظيفة منظومة الحوكمة والامتثال داخل المؤسسة وضمان توافق العمليات مع اللوائح والسياسات الرسمية المعتمدة.",
    department: "الحوكمة والعمليات",
    location: "الدمام",
    type: "دوام كامل",
    experience: "خبرة 4-7 سنوات",
    education: "بكالوريوس في الإدارة أو القانون",
    deadline: "28 يونيو 2026",
    posted: "08 يونيو 2026",
    responsibilities: [
      "بناء وتطوير منظومة الحوكمة والامتثال داخل المؤسسة.",
      "ضمان توافق العمليات مع اللوائح والسياسات الرسمية المعتمدة.",
      "إدارة المخاطر المؤسسية وتطوير الضوابط الداخلية.",
      "إعداد تقارير الالتزام ومؤشرات التميز المؤسسي.",
    ],
    qualifications: [
      "بكالوريوس في الإدارة أو القانون أو ما يعادلها.",
      "4 سنوات خبرة في الحوكمة أو الالتزام أو التدقيق الداخلي.",
      "معرفة عميقة بلوائح القطاع غير الربحي.",
      "إجادة العربية والإنجليزية كتابةً وتحدثاً.",
    ],
  },
];

export function getJob(id: string): Job | undefined {
  return jobs.find((j) => j.id === id);
}
