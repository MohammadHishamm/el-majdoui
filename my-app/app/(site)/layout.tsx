import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getSiteSettings } from "@/lib/cms/fetchers";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  return (
    <>
      <Header />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer contact={settings?.contact} social={settings?.social} socialShow={settings?.socialShow} />
    </>
  );
}
