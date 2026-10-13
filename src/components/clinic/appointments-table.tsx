"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { RefreshCw, Ban, Eye, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cancelBooking } from "@/server-actions/booking";

type Appt = {
  id: string;
  bookingRef: string;
  date: string;
  timeSlot: string;
  status: string;
  service: { id: string; slug: string; name: string; nameEn: string; image: string; price: number };
  doctor: { id: string; name: string; nameEn: string };
  payment?: { method: string; status: string; amount: number } | null;
};

export function AppointmentsTableClient({ appointments }: { appointments: Appt[] }) {
  const locale = useLocale();
  const t = useTranslations("Dashboard");
  const tStatus = useTranslations("Status");
  const [_, startTransition] = useTransition();
  const [list, setList] = useState(appointments);

  const onCancel = (id: string) => {
    const a = list.find((x) => x.id === id);
    if (!a) return;
    startTransition(async () => {
      const r = await cancelBooking(a.bookingRef);
      if (r.ok) {
        setList((p) => p.map((x) => (x.id === id ? { ...x, status: "CANCELLED" } : x)));
        toast.success(locale === "ar" ? "تم الإلغاء" : "Cancelled");
      } else {
        toast.error(locale === "ar" ? "تعذّر" : "Failed");
      }
    });
  };

  return (
    <section className="py-8 lg:py-12 bg-secondary/20 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl lg:text-3xl font-semibold">{t("upcomingAppointments")}</h1>
          <Button asChild className="rounded-full bg-primary hover:bg-primary/90">
            <Link href={`/${locale}/booking`}>
              <Calendar className="h-4 w-4 me-1" /> {locale === "ar" ? "حجز جديد" : "New booking"}
            </Link>
          </Button>
        </div>

        <Card className="border-border shadow-soft">
          <CardContent className="p-0">
            {list.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">{t("noUpcoming")}</div>
            ) : (
              <div className="divide-y divide-border">
                {list.map((a) => (
                  <div key={a.id} className="flex items-center gap-4 p-4 hover:bg-accent/10 transition">
                    <img src={a.service.image} alt="" className="h-14 w-14 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{locale === "ar" ? a.service.name : a.service.nameEn}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{locale === "ar" ? a.doctor.name : a.doctor.nameEn}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(a.date))}
                      </p>
                      {a.payment && (
                        <p className="text-[10px] text-accent font-medium mt-0.5">
                          {a.payment.method === "CASH" ? (locale === "ar" ? "نقدي" : "Cash") : (locale === "ar" ? "بطاقة" : "Card")} · {tStatus(a.payment.status)} · {new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US").format(a.payment.amount)} {locale === "ar" ? "ر.س" : "SAR"}
                        </p>
                      )}
                    </div>
                    <Badge variant={a.status === "CANCELLED" ? "destructive" : a.status === "COMPLETED" ? "default" : "secondary"}>
                      {tStatus(a.status)}
                    </Badge>
                    <div className="hidden sm:flex gap-2 shrink-0">
                      <Button size="sm" variant="outline" className="rounded-full h-7 text-xs" asChild>
                        <Link href={`/${locale}/booking?service=${a.service.slug}&doctor=${a.doctor.id}`}>
                          <RefreshCw className="h-3 w-3" /> {t("rebook")}
                        </Link>
                      </Button>
                      {(a.status === "PENDING" || a.status === "CONFIRMED") && (
                        <Button size="sm" variant="destructive" className="rounded-full h-7 text-xs" onClick={() => onCancel(a.id)}>
                          <Ban className="h-3 w-3" /> {t("cancel")}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
