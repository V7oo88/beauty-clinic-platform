import { db } from "@/lib/db";
import { AdminPaymentsClient } from "@/components/admin/payments";
import { setRequestLocale } from "next-intl/server";

export default async function AdminPaymentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const payments = await db.payment.findMany({
    include: { appointment: { include: { service: true, doctor: true, customer: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return <AdminPaymentsClient payments={JSON.parse(JSON.stringify(payments))} />;
}
