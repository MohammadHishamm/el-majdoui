import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteConfig } from "@/lib/site/config";
import { LocaleProvider } from "@/lib/i18n/context";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { InlineScript } from "@/components/theme/InlineScript";
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
  icons: {
    icon: [
      { url: "/images/home/updated-svgs/header-footer-logo.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/favicon.png", type: "image/png", sizes: "256x256" },
    ],
    apple: { url: "/images/favicon.png", type: "image/png" },
  },
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
      suppressHydrationWarning
      className={cn("h-full", "antialiased", itfRayat.variable, "font-sans", geist.variable)}
    >
      <head>
        {/* No-flash theme: apply the saved theme before first paint. Defaults to light. */}
        <InlineScript html="(function(){try{if(localStorage.getItem('theme')==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();" />
      </head>
      <body className={`${itfRayat.className} flex min-h-full flex-col font-sans`}>
        <AlMajdouieLoader />
        <ThemeProvider>
          <LocaleProvider>{children}</LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
