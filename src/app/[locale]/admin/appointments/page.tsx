import { db } from "@/lib/db";
import { AdminAppointmentsClient } from "@/components/admin/appointments";
import { setRequestLocale } from "next-intl/server";

export default async function AdminAppointmentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const appointments = await db.appointment.findMany({
    include: { customer: true, service: true, doctor: true, payment: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return <AdminAppointmentsClient appointments={JSON.parse(JSON.stringify(appointments))} />;
}
