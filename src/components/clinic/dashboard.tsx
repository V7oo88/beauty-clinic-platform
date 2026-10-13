"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Calendar,
  CalendarCheck,
  CalendarX,
  Bell,
  User,
  LogOut,
  RefreshCw,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { cancelBooking, markNotificationsRead } from "@/server-actions/booking";
import { cn } from "@/lib/utils";

type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  appointments: {
    id: string;
    bookingRef: string;
    date: string;
    timeSlot: string;
    status: string;
    notes?: string | null;
    service: { id: string; name: string; nameEn: string; price: number; image: string; slug: string };
    doctor: { id: string; name: string; nameEn: string };
    payment?: { method: string; status: string; amount: number } | null;
  }[];
};

type User = { id: string; email: string; name?: string | null; role: string };

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

const statusVariant = (status: string) => {
  switch (status) {
    case "CONFIRMED": return "default";
    case "PENDING": return "secondary";
    case "COMPLETED": return "default";
    case "CANCELLED": return "destructive";
    case "NO_SHOW": return "destructive";
    default: return "secondary";
  }
};

export function DashboardClient({
  user,
  customer,
  notifications,
}: {
  user: User;
  customer: Customer;
  notifications: Notification[];
}) {
  const locale = useLocale();
  const t = useTranslations("Dashboard");
  const tStatus = useTranslations("Status");
  const [_, startTransition] = useTransition();
  const [apptList, setApptList] = useState(customer.appointments);
  const [notifList, setNotifList] = useState(notifications);

  const now = new Date();
  const upcoming = apptList
    .filter((a) => new Date(a.date) >= now && a.status !== "CANCELLED")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = apptList
    .filter((a) => new Date(a.date) < now || a.status === "COMPLETED" || a.status === "CANCELLED")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const onCancel = async (id: string) => {
    const appt = apptList.find((a) => a.id === id);
    if (!appt) return;
    startTransition(async () => {
      const r = await cancelBooking(appt.bookingRef);
      if (r.ok) {
        setApptList((prev) => prev.map((a) => (a.id === id ? { ...a, status: "CANCELLED" } : a)));
        toast.success(locale === "ar" ? "تم إلغاء الموعد" : "Appointment cancelled");
      } else {
        toast.error(locale === "ar" ? "تعذّر الإلغاء" : "Cancel failed");
      }
    });
  };

  const onMarkRead = async () => {
    startTransition(async () => {
      const r = await markNotificationsRead();
      if (r.ok) {
        setNotifList((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    });
  };

  return (
    <section className="py-8 lg:py-12 min-h-screen bg-secondary/20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Welcome */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-semibold">{t("welcome")}, {customer.firstName}</h1>
            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="rounded-full gap-1">
              <Link href={`/${locale}/dashboard/profile`}>
                <User className="h-3.5 w-3.5" /> {t("profile")}
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="rounded-full gap-1" onClick={() => signOut({ callbackUrl: `/${locale}` })}>
              <LogOut className="h-3.5 w-3.5" /> {t("logout")}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming */}
            <Card className="border-border shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-4 w-4 text-accent" />
                  {t("upcomingAppointments")}
                </CardTitle>
                <Button asChild size="sm" className="rounded-full bg-primary hover:bg-primary/90">
                  <Link href={`/${locale}/booking`}>
                    {locale === "ar" ? "حجز جديد" : "New booking"}
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {upcoming.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CalendarX className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    {t("noUpcoming")}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcoming.map((a) => (
                      <motion.div
                        key={a.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-border p-4 flex items-center gap-3"
                      >
                        <img src={a.service.image} alt="" className="h-14 w-14 rounded-lg object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-sm truncate">{locale === "ar" ? a.service.name : a.service.nameEn}</p>
                            <Badge variant={statusVariant(a.status)}>{tStatus(a.status)}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{locale === "ar" ? a.doctor.name : a.doctor.nameEn}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(a.date))}
                          </p>
                          {a.payment && (
                            <p className="text-[10px] mt-1 text-accent font-medium">
                              {a.payment.method === "CASH" ? (locale === "ar" ? "نقدي" : "Cash") : (locale === "ar" ? "بطاقة" : "Card")} · {tStatus(a.payment.status)} · {new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US").format(a.payment.amount)} {locale === "ar" ? "ر.س" : "SAR"}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <Button size="sm" variant="outline" className="rounded-full h-7 text-xs" asChild>
                            <Link href={`/${locale}/booking?service=${a.service.slug}&doctor=${a.doctor.id}`}>
                              <RefreshCw className="h-3 w-3" /> {t("rebook")}
                            </Link>
                          </Button>
                          {(a.status === "PENDING" || a.status === "CONFIRMED") && (
                            <Button
                              size="sm"
                              variant="destructive"
                              className="rounded-full h-7 text-xs"
                              onClick={() => onCancel(a.id)}
                            >
                              {t("cancel")}
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Past */}
            <Card className="border-border shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarCheck className="h-4 w-4 text-accent" />
                  {t("pastAppointments")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {past.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    {t("noPast")}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {past.map((a) => (
                      <div key={a.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border text-sm">
                        <div className="min-w-0">
                          <p className="font-medium truncate">{locale === "ar" ? a.service.name : a.service.nameEn}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(a.date))}
                          </p>
                        </div>
                        <Badge variant={statusVariant(a.status)}>{tStatus(a.status)}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Notifications */}
          <Card className="border-border shadow-soft h-fit">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-4 w-4 text-accent" />
                {t("notifications")}
              </CardTitle>
              {notifList.some((n) => !n.isRead) && (
                <Button size="sm" variant="ghost" className="text-xs rounded-full h-7" onClick={onMarkRead}>
                  {t("markAllRead")}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {notifList.length === 0 ? (
                <p className="text-center py-12 text-muted-foreground text-sm">{t("noNotifications")}</p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {notifList.map((n) => (
                    <div key={n.id} className={cn("p-3 rounded-lg border text-xs", n.isRead ? "bg-card border-border" : "bg-accent/15 border-accent/30")}>
                      <div className="flex items-center gap-2">
                        {!n.isRead && <span className="h-2 w-2 rounded-full bg-accent shrink-0" />}
                        <p className="font-semibold">{n.title}</p>
                      </div>
                      <p className="text-muted-foreground mt-1">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(n.createdAt))}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
