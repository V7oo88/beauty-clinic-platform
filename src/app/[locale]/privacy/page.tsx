import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LegalContent } from "@/components/clinic/legal-content";
import { getSettings } from "@/lib/public-settings";
import { setRequestLocale } from "next-intl/server";

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const settings = await getSettings();
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 lg:py-24 max-w-3xl">
          <LegalContent type="privacy" />
        </div>
      </main>
      <Footer settings={settings} />
    </>
  );
}
