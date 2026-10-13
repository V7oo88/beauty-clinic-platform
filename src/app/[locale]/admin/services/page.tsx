import { db } from "@/lib/db";
import { AdminServicesClient } from "@/components/admin/services";
import { setRequestLocale } from "next-intl/server";

export default async function AdminServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const services = await db.service.findMany({ orderBy: { createdAt: "desc" } });
  return <AdminServicesClient services={JSON.parse(JSON.stringify(services))} />;
}
