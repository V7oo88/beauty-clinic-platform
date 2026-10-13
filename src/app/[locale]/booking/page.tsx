import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BookingFlowClient } from "@/components/booking/booking-flow";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/public-settings";
import { setRequestLocale } from "next-intl/server";

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ service?: string; doctor?: string }>;
}) {
  const { locale } = await params;
  const { service: serviceSlug, doctor: doctorId } = await searchParams;
  setRequestLocale(locale);
  const settings = await getSettings();
  const services = await db.service.findMany({ where: { isActive: true }, orderBy: { createdAt: "asc" } });
  const doctors = await db.doctor.findMany({
    where: { isActive: true },
    orderBy: { rating: "desc" },
    include: { services: true },
  });

  const initialService = serviceSlug ? services.find((s) => s.slug === serviceSlug) : null;
  const initialDoctor = doctorId ? doctors.find((d) => d.id === doctorId) : null;

  return (
    <>
      <Header />
      <main className="flex-1">
        <BookingFlowClient
          services={services}
          doctors={doctors}
          initialServiceId={initialService?.id ?? null}
          initialDoctorId={initialDoctor?.id ?? null}
        />
      </main>
      <Footer settings={settings} />
    </>
  );
}
