import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RegisterFormClient } from "@/components/clinic/register-form";
import { getSettings } from "@/lib/public-settings";
import { setRequestLocale } from "next-intl/server";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const settings = await getSettings();
  return (
    <>
      <Header />
      <main className="flex-1">
        <RegisterFormClient />
      </main>
      <Footer settings={settings} />
    </>
  );
}
