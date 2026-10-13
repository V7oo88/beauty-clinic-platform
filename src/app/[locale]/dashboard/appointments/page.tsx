import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AppointmentsTableClient } from "@/components/clinic/appointments-table";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/public-settings";
import { getCurrentUser } from "@/lib/server-utils";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

export default async function AppointmentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login?callbackUrl=/${locale}/dashboard/appointments`);
  const settings = await getSettings();

  const customer = await db.customer.findUnique({
    where: { userId: user.id },
    include: {
      appointments: {
        include: { service: true, doctor: true, payment: true },
        orderBy: { date: "desc" },
      },
    },
  });

  return (
    <>
      <Header />
      <main className="flex-1">
        <AppointmentsTableClient appointments={customer ? JSON.parse(JSON.stringify(customer.appointments)) : []} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
