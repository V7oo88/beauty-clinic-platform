import { db } from "@/lib/db";
import { getSettings } from "@/lib/public-settings";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Breadcrumbs } from "@/components/clinic/breadcrumbs";
import { DoctorsListClient } from "@/components/clinic/doctors-list";
import { setRequestLocale } from "next-intl/server";

export default async function DoctorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const settings = await getSettings();
  const doctors = await db.doctor.findMany({
    where: { isActive: true },
    orderBy: { rating: "desc" },
    include: { services: { include: { service: true } } },
  });

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 pt-6">
          <Breadcrumbs items={[{ label: locale === "ar" ? "الأطباء" : "Doctors" }]} />
        </div>
        <DoctorsListClient doctors={doctors} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
