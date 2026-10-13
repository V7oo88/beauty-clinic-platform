import { db } from "@/lib/db";
import { AdminSchedulesClient } from "@/components/admin/schedules";
import { setRequestLocale } from "next-intl/server";

export default async function AdminSchedulesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const schedules = await db.schedule.findMany({
    include: { doctor: true },
    orderBy: [{ doctorId: "asc" }, { dayOfWeek: "asc" }],
  });
  const doctors = await db.doctor.findMany({ select: { id: true, name: true, nameEn: true } });
  return <AdminSchedulesClient schedules={JSON.parse(JSON.stringify(schedules))} doctors={JSON.parse(JSON.stringify(doctors))} />;
}
