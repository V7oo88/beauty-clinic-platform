import { db } from "@/lib/db";
import { AdminDashboardClient } from "@/components/admin/dashboard";
import { setRequestLocale } from "next-intl/server";

export default async function AdminDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Stats
  const total = await db.appointment.count();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  const todayCount = await db.appointment.count({
    where: { date: { gte: todayStart, lte: todayEnd } },
  });
  const upcoming = await db.appointment.count({
    where: { date: { gte: new Date() }, status: { in: ["PENDING", "CONFIRMED"] } },
  });
  const totalRevenue = await db.payment.aggregate({ _sum: { amount: true }, where: { status: "PAID" } });
  const customersCount = await db.customer.count();
  const doctorsCount = await db.doctor.count();

  // Top services
  const topServicesRaw = await db.appointment.groupBy({
    by: ["serviceId"],
    _count: true,
    orderBy: { _count: { serviceId: "desc" } },
    take: 5,
  });
  const services = await db.service.findMany();
  const topServices = await Promise.all(
    topServicesRaw.map(async (row) => {
      const s = services.find((x) => x.id === row.serviceId);
      return {
        name: s ? (locale === "ar" ? s.name : s.nameEn) : "—",
        count: row._count,
      };
    })
  );

  // Recent bookings
  const recent = await db.appointment.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: { customer: true, service: true, doctor: true },
  });

  return (
    <AdminDashboardClient
      stats={{
        total,
        todayCount,
        upcoming,
        revenue: totalRevenue._sum.amount ?? 0,
        customersCount,
        doctorsCount,
      }}
      topServices={topServices}
      recentBookings={JSON.parse(JSON.stringify(recent))}
    />
  );
}
