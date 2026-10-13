import { db } from "@/lib/db";
import { getSettings } from "@/lib/public-settings";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Breadcrumbs } from "@/components/clinic/breadcrumbs";
import { DoctorDetailClient } from "@/components/clinic/doctor-detail";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const doctor = await db.doctor.findUnique({
    where: { id },
    include: {
      services: { include: { service: true } },
      schedules: { orderBy: { dayOfWeek: "asc" } },
    },
  });
  if (!doctor || !doctor.isActive) notFound();
  const settings = await getSettings();

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 pt-6">
          <Breadcrumbs
            items={[
              { label: locale === "ar" ? "الأطباء" : "Doctors", href: `/${locale}/doctors` },
              { label: locale === "ar" ? doctor.name : doctor.nameEn },
            ]}
          />
        </div>
        <DoctorDetailClient doctor={doctor} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
