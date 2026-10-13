import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContactClient } from "@/components/clinic/contact-content";
import { getSettings } from "@/lib/public-settings";
import { setRequestLocale } from "next-intl/server";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const settings = await getSettings();
  return (
    <>
      <Header />
      <main className="flex-1"><ContactClient settings={settings} /></main>
      <Footer settings={settings} />
    </>
  );
}
