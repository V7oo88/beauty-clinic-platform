import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProfileClient } from "@/components/clinic/profile-form";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/public-settings";
import { getCurrentUser } from "@/lib/server-utils";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login?callbackUrl=/${locale}/dashboard/profile`);
  const settings = await getSettings();

  const customer = await db.customer.findUnique({ where: { userId: user.id } });

  return (
    <>
      <Header />
      <main className="flex-1">
        <ProfileClient user={JSON.parse(JSON.stringify(user))} customer={customer ? JSON.parse(JSON.stringify(customer)) : null} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
