import { db } from "@/lib/db";
import { AdminCustomersClient } from "@/components/admin/customers";
import { setRequestLocale } from "next-intl/server";

export default async function AdminCustomersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const customers = await db.customer.findMany({
    include: {
      user: true,
      appointments: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return <AdminCustomersClient customers={JSON.parse(JSON.stringify(customers))} />;
}
