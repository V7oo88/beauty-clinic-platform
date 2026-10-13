"use client";

import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  createdAt: string;
  user: { email: string; name?: string | null };
  appointments: { id: string }[];
};

export function AdminCustomersClient({ customers }: { customers: Customer[] }) {
  const t = useTranslations("Admin");
  const locale = useLocale();

  return (
    <div className="p-4 lg:p-8">
      <h1 className="font-display text-2xl lg:text-3xl font-semibold mb-6">{t("manageCustomers")}</h1>
      <Card className="border-border shadow-soft">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">{locale === "ar" ? "الاسم" : "Name"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "البريد" : "Email"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "الهاتف" : "Phone"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "الحجوزات" : "Appointments"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "منذ" : "Since"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="text-xs font-medium">{c.firstName} {c.lastName}</TableCell>
                    <TableCell className="text-xs">{c.user.email}</TableCell>
                    <TableCell className="text-xs">{c.phone || "—"}</TableCell>
                    <TableCell><Badge variant="secondary" className="rounded-full text-[10px]">{c.appointments.length}</Badge></TableCell>
                    <TableCell className="text-xs">{new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", { day: "numeric", month: "short", year: "numeric" }).format(new Date(c.createdAt))}</TableCell>
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
