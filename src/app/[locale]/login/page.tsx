import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LoginFormClient } from "@/components/clinic/login-form";
import { getSettings } from "@/lib/public-settings";
import { setRequestLocale } from "next-intl/server";

export default async function LoginPage({
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
        <LoginFormClient />
      </main>
      <Footer settings={settings} />
    </>
  );
}
