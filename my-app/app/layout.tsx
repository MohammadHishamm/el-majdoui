import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteConfig } from "@/lib/site/config";
import { LocaleProvider } from "@/lib/i18n/context";
import AlMajdouieLoader from "@/components/AlMajdouieLoader";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const itfRayat = localFont({
  src: [
    { path: "../fonts/itfrayat-Light.otf", weight: "300", style: "normal" },
    { path: "../fonts/itfrayat-Regular.otf", weight: "400", style: "normal" },
    { path: "../fonts/itfrayat-Medium.otf", weight: "500", style: "normal" },
    { path: "../fonts/itfrayat-Bold.otf", weight: "700", style: "normal" },
    { path: "../fonts/itfrayat-Black.otf", weight: "900", style: "normal" },
  ],
  variable: "--font-itf-rayat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.fullName,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.nameEn,
  authors: [{ name: siteConfig.fullName, url: siteConfig.url }],
  publisher: siteConfig.fullName,
  keywords: [
    "مؤسسة المجدوعي الخيرية",
    "المجدوعي الخيرية",
    "أعمال خيرية",
    "تمكين اقتصادي",
    "مساجد المجدوعي",
    "الدمام",
    "المنطقة الشرقية",
    "Almajdouie Foundation",
    "charity Saudi Arabia",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: siteConfig.fullName,
    url: siteConfig.url,
    title: siteConfig.fullName,
    description: siteConfig.description,
    images: [{ url: DEFAULT_OG_IMAGE, alt: siteConfig.fullName }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.fullName,
    description: siteConfig.description,
    images: [DEFAULT_OG_IMAGE],
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={cn("h-full", "antialiased", itfRayat.variable, "font-sans", geist.variable)}
    >
      <body className={`${itfRayat.className} flex min-h-full flex-col font-sans`}>
        <AlMajdouieLoader />
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
