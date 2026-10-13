"use client";

import { useState, useTransition, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Check, Ban, CheckCheck, UserX, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { setAppointmentStatus } from "@/server-actions/admin";

type Appt = {
  id: string;
  bookingRef: string;
  date: string;
  timeSlot: string;
  status: string;
  notes?: string | null;
  customer: { firstName: string; lastName: string; phone: string; email?: string };
  service: { name: string; nameEn: string; price: number };
  doctor: { name: string; nameEn: string };
  payment?: { method: string; status: string; amount: number } | null;
};

const STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"] as const;

export function AdminAppointmentsClient({ appointments }: { appointments: Appt[] }) {
  const t = useTranslations("Admin");
  const tStatus = useTranslations("Status");
  const locale = useLocale();
  const [_, startTransition] = useTransition();
  const [list, setList] = useState(appointments);
  const [filter, setFilter] = useState("ALL");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return list.filter((a) => {
      const matchesFilter = filter === "ALL" || a.status === filter;
      const name = `${a.customer.firstName} ${a.customer.lastName}`.toLowerCase();
      const matchesQ = !q || name.includes(q.toLowerCase()) || a.bookingRef.toLowerCase().includes(q.toLowerCase());
      return matchesFilter && matchesQ;
    });
  }, [list, filter, q]);

  const updateStatus = (id: string, status: string) => {
    startTransition(async () => {
      const r = await setAppointmentStatus(id, status);
      if (r.ok) {
        setList((p) => p.map((x) => (x.id === id ? { ...x, status } : x)));
        toast.success(locale === "ar" ? "تم التحديث" : "Updated");
      } else toast.error(locale === "ar" ? "خطأ" : "Error");
    });
  };

  return (
    <div className="p-4 lg:p-8">
      <h1 className="font-display text-2xl lg:text-3xl font-semibold mb-6">{t("appointments")}</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={locale === "ar" ? "بحث..." : "Search..."} className="rounded-xl sm:max-w-xs" />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="rounded-xl sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{locale === "ar" ? "الكل" : "All"}</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{tStatus(s)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card className="border-border shadow-soft">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">{locale === "ar" ? "المرجع" : "Ref"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "العميل" : "Customer"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "الخدمة" : "Service"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "الطبيب" : "Doctor"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "التاريخ" : "Date"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "الدفع" : "Payment"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "الحالة" : "Status"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "إجراءات" : "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="text-xs font-mono">{a.bookingRef}</TableCell>
                    <TableCell className="text-xs">
                      <p className="font-medium">{a.customer.firstName} {a.customer.lastName}</p>
                      <p className="text-[10px] text-muted-foreground">{a.customer.phone}</p>
                    </TableCell>
                    <TableCell className="text-xs">{locale === "ar" ? a.service.name : a.service.nameEn}</TableCell>
                    <TableCell className="text-xs">{locale === "ar" ? a.doctor.name : a.doctor.nameEn}</TableCell>
                    <TableCell className="text-xs">
                      {new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(a.date))}
                    </TableCell>
                    <TableCell className="text-xs">
                      {a.payment ? (
                        <>
                          <p>{a.payment.method === "CASH" ? (locale === "ar" ? "نقدي" : "Cash") : (locale === "ar" ? "بطاقة" : "Card")}</p>
                          <p className="text-[10px] text-muted-foreground">{new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US").format(a.payment.amount)} {locale === "ar" ? "ر.س" : "SAR"}</p>
                        </>
                      ) : "—"}
                    </TableCell>
                    <TableCell><Badge variant={a.status === "CANCELLED" || a.status === "NO_SHOW" ? "destructive" : "secondary"} className="text-[10px]">{tStatus(a.status)}</Badge></TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {a.status === "PENDING" && (
                          <Button size="sm" variant="outline" className="h-7 text-xs rounded-full" onClick={() => updateStatus(a.id, "CONFIRMED")}><Check className="h-3 w-3" /> {t("confirm")}</Button>
                        )}
                        {(a.status === "PENDING" || a.status === "CONFIRMED") && (
                          <>
                            <Button size="sm" variant="outline" className="h-7 text-xs rounded-full" onClick={() => updateStatus(a.id, "COMPLETED")}><CheckCheck className="h-3 w-3" /> {t("complete")}</Button>
                            <Button size="sm" variant="destructive" className="h-7 text-xs rounded-full" onClick={() => updateStatus(a.id, "CANCELLED")}><Ban className="h-3 w-3" /> {t("cancel")}</Button>
                            <Button size="sm" variant="ghost" className="h-7 text-xs rounded-full" onClick={() => updateStatus(a.id, "NO_SHOW")}><UserX className="h-3 w-3" /> {t("noShow")}</Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
