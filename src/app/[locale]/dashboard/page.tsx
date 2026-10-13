import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DashboardClient } from "@/components/clinic/dashboard";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/public-settings";
import { getCurrentUser } from "@/lib/server-utils";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login?callbackUrl=/${locale}/dashboard`);
  const settings = await getSettings();

  const customer = await db.customer.findUnique({
    where: { userId: user.id },
    include: {
      appointments: {
        include: { service: true, doctor: true, payment: true },
        orderBy: { date: "desc" },
      },
      reviews: true,
    },
  });

  const notifications = await db.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  if (!customer) {
    return (
      <>
        <Header />
        <main className="flex-1 py-16 text-center">
          <p className="text-muted-foreground">{locale === "ar" ? "لا يوجد ملف عميل مرتبط بحسابك." : "No customer profile linked to your account."}</p>
        </main>
        <Footer settings={settings} />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <DashboardClient
          user={JSON.parse(JSON.stringify(user))}
          customer={JSON.parse(JSON.stringify(customer))}
          notifications={JSON.parse(JSON.stringify(notifications))}
        />
      </main>
      <Footer settings={settings} />
    </>
  );
}
