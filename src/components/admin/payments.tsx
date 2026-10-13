"use client";

import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Payment = {
  id: string;
  amount: number;
  method: string;
  status: string;
  txnRef: string | null;
  createdAt: string;
  appointment: {
    bookingRef: string;
    service: { name: string; nameEn: string };
    doctor: { name: string; nameEn: string };
    customer: { firstName: string; lastName: string };
  };
};

export function AdminPaymentsClient({ payments }: { payments: Payment[] }) {
  const t = useTranslations("Admin");
  const tStatus = useTranslations("Status");
  const locale = useLocale();

  const totalPaid = payments.filter((p) => p.status === "PAID").reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter((p) => p.status === "PENDING").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="p-4 lg:p-8">
      <h1 className="font-display text-2xl lg:text-3xl font-semibold mb-6">{t("payments")}</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <Card className="border-border shadow-soft"><CardContent className="p-4"><p className="text-xs text-muted-foreground">{locale === "ar" ? "مدفوع" : "Paid"}</p><p className="font-display text-2xl font-semibold text-emerald-600">{new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US").format(totalPaid)} {locale === "ar" ? "ر.س" : "SAR"}</p></CardContent></Card>
        <Card className="border-border shadow-soft"><CardContent className="p-4"><p className="text-xs text-muted-foreground">{locale === "ar" ? "معلّق" : "Pending"}</p><p className="font-display text-2xl font-semibold text-amber-600">{new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US").format(totalPending)} {locale === "ar" ? "ر.س" : "SAR"}</p></CardContent></Card>
        <Card className="border-border shadow-soft"><CardContent className="p-4"><p className="text-xs text-muted-foreground">{locale === "ar" ? "العدد" : "Count"}</p><p className="font-display text-2xl font-semibold">{payments.length}</p></CardContent></Card>
      </div>

      <Card className="border-border shadow-soft">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">{locale === "ar" ? "رقم العملية" : "Txn Ref"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "الحجز" : "Booking"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "العميل" : "Customer"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "الخدمة" : "Service"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "الطريقة" : "Method"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "المبلغ" : "Amount"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "الحالة" : "Status"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "التاريخ" : "Date"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-xs font-mono">{p.txnRef ?? "—"}</TableCell>
                    <TableCell className="text-xs font-mono">{p.appointment.bookingRef}</TableCell>
                    <TableCell className="text-xs">{p.appointment.customer.firstName} {p.appointment.customer.lastName}</TableCell>
                    <TableCell className="text-xs">{locale === "ar" ? p.appointment.service.name : p.appointment.service.nameEn}</TableCell>
                    <TableCell className="text-xs">{p.method === "CASH" ? (locale === "ar" ? "نقدي" : "Cash") : (locale === "ar" ? "بطاقة" : "Card")}</TableCell>
                    <TableCell className="text-xs font-medium">{new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US").format(p.amount)} {locale === "ar" ? "ر.س" : "SAR"}</TableCell>
                    <TableCell><Badge variant={p.status === "PAID" ? "default" : p.status === "FAILED" ? "destructive" : "secondary"} className="text-[10px]">{tStatus(p.status)}</Badge></TableCell>
                    <TableCell className="text-xs">{new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", { day: "numeric", month: "short", year: "numeric" }).format(new Date(p.createdAt))}</TableCell>
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
