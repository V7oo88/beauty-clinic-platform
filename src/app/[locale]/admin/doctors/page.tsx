import { db } from "@/lib/db";
import { AdminDoctorsClient } from "@/components/admin/doctors";
import { setRequestLocale } from "next-intl/server";

export default async function AdminDoctorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const doctors = await db.doctor.findMany({
    include: { services: true },
    orderBy: { createdAt: "desc" },
  });
  const services = await db.service.findMany();
  return <AdminDoctorsClient doctors={JSON.parse(JSON.stringify(doctors))} services={JSON.parse(JSON.stringify(services))} />;
}
