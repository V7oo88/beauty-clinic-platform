"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CalendarClock,
  TrendingUp,
  Users,
  Stethoscope,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Stats = {
  total: number;
  todayCount: number;
  upcoming: number;
  revenue: number;
  customersCount: number;
  doctorsCount: number;
};

type TopService = { name: string; count: number };
type RecentBooking = {
  id: string;
  bookingRef: string;
  date: string;
  timeSlot: string;
  status: string;
  customer: { firstName: string; lastName: string; phone: string };
  service: { name: string; nameEn: string; price: number };
  doctor: { name: string; nameEn: string };
};

export function AdminDashboardClient({
  stats,
  topServices,
  recentBookings,
}: {
  stats: Stats;
  topServices: TopService[];
  recentBookings: RecentBooking[];
}) {
  const t = useTranslations("Admin");
  const locale = useLocale();

  const statCards = [
    { label: t("statsTotalBookings"), value: stats.total, Icon: CalendarDays, color: "from-blue-400/30 to-purple-400/30" },
    { label: t("statsTodayBookings"), value: stats.todayCount, Icon: CalendarClock, color: "from-emerald-400/30 to-teal-400/30" },
    { label: t("statsUpcoming"), value: stats.upcoming, Icon: TrendingUp, color: "from-amber-400/30 to-orange-400/30" },
    { label: t("statsRevenue"), value: `${new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US").format(stats.revenue)} ${locale === "ar" ? "ر.س" : "SAR"}`, Icon: TrendingUp, color: "from-rose-400/30 to-pink-400/30" },
    { label: t("statsCustomers"), value: stats.customersCount, Icon: Users, color: "from-violet-400/30 to-fuchsia-400/30" },
    { label: t("statsDoctors"), value: stats.doctorsCount, Icon: Stethoscope, color: "from-cyan-400/30 to-sky-400/30" },
  ];

  return (
    <div className="p-4 lg:p-8">
      <h1 className="font-display text-2xl lg:text-3xl font-semibold mb-6">{t("dashboard")}</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-border shadow-soft overflow-hidden relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-50`} />
              <CardContent className="relative p-4">
                <div className="flex items-center gap-2 mb-2">
                  <s.Icon className="h-4 w-4 text-foreground" />
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">{s.label}</p>
                </div>
                <p className="font-display text-2xl font-semibold">{s.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top services */}
        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-4 w-4 text-accent" />
              {t("statsTopServices")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topServices.length === 0 ? (
              <p className="text-center py-6 text-muted-foreground text-sm">{locale === "ar" ? "لا توجد بيانات" : "No data"}</p>
            ) : (
              <div className="space-y-2">
                {topServices.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/10">
                    <span className="text-sm font-medium truncate">{s.name}</span>
                    <Badge variant="secondary" className="rounded-full">{s.count}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent bookings */}
        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="h-4 w-4 text-accent" />
              {t("recentBookings")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentBookings.length === 0 ? (
              <p className="text-center py-6 text-muted-foreground text-sm">{locale === "ar" ? "لا توجد حجوزات" : "No bookings"}</p>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">{locale === "ar" ? "العميل" : "Customer"}</TableHead>
                      <TableHead className="text-xs">{locale === "ar" ? "الخدمة" : "Service"}</TableHead>
                      <TableHead className="text-xs">{locale === "ar" ? "الحالة" : "Status"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBookings.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="text-xs">
                          <p className="font-medium">{b.customer.firstName} {b.customer.lastName}</p>
                          <p className="text-[10px] text-muted-foreground">{b.customer.phone}</p>
                        </TableCell>
                        <TableCell className="text-xs">{locale === "ar" ? b.service.name : b.service.nameEn}</TableCell>
                        <TableCell><Badge variant="secondary" className="text-[10px]">{b.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
