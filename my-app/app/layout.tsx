import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteConfig } from "@/lib/site/config";
import { LocaleProvider } from "@/lib/i18n/context";
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
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    locale: siteConfig.locale,
    siteName: siteConfig.fullName,
    type: "website",
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
      className={cn("h-full", "antialiased", itfRayat.variable, "font-sans", geist.variable)}
    >
      <body className={`${itfRayat.className} flex min-h-full flex-col font-sans`}>
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
