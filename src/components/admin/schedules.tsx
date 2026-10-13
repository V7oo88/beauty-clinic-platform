"use client";

import { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { addSchedule, deleteSchedule } from "@/server-actions/admin";

type Doctor = { id: string; name: string; nameEn: string };
type Schedule = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isWorking: boolean;
  doctorId: string;
  doctor: { name: string; nameEn: string };
};

export function AdminSchedulesClient({ schedules, doctors }: { schedules: Schedule[]; doctors: Doctor[] }) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const [_, startTransition] = useTransition();
  const [form, setForm] = useState({ doctorId: "", dayOfWeek: 0, startTime: "10:00", endTime: "17:00", isWorking: true });
  const [list, setList] = useState(schedules);

  const days = Array.from({ length: 7 }, (_, i) => i);
  const dayName = (d: number) => t(`days.${d}`);

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.doctorId) {
      toast.error(locale === "ar" ? "اختاري الطبيب" : "Pick doctor");
      return;
    }
    startTransition(async () => {
      const r = await addSchedule(form);
      if (r.ok) {
        toast.success(locale === "ar" ? "تم الإضافة" : "Added");
        // optimistic update
        const doc = doctors.find((d) => d.id === form.doctorId);
        setList((p) => [
          ...p,
          { id: "temp-" + Date.now(), doctorId: form.doctorId, doctor: { name: doc?.name ?? "", nameEn: doc?.nameEn ?? "" }, ...form },
        ]);
      } else toast.error(locale === "ar" ? "خطأ" : "Error");
    });
  };

  const onDelete = (id: string) => {
    startTransition(async () => {
      const r = await deleteSchedule(id);
      if (r.ok) {
        setList((p) => p.filter((x) => x.id !== id));
        toast.success(locale === "ar" ? "تم الحذف" : "Deleted");
      }
    });
  };

  return (
    <div className="p-4 lg:p-8">
      <h1 className="font-display text-2xl lg:text-3xl font-semibold mb-6">{t("manageSchedules")}</h1>

      <Card className="border-border shadow-soft mb-6">
        <CardContent className="p-4">
          <form onSubmit={onAdd} className="flex flex-wrap items-end gap-3">
            <div className="space-y-1.5 flex-1 min-w-[180px]">
              <Label>{locale === "ar" ? "الطبيب" : "Doctor"}</Label>
              <Select value={form.doctorId} onValueChange={(v) => setForm({ ...form, doctorId: v })}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder={locale === "ar" ? "اختاري الطبيب" : "Pick doctor"} /></SelectTrigger>
                <SelectContent>
                  {doctors.map((d) => <SelectItem key={d.id} value={d.id}>{locale === "ar" ? d.name : d.nameEn}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t("dayOfWeek")}</Label>
              <Select value={String(form.dayOfWeek)} onValueChange={(v) => setForm({ ...form, dayOfWeek: +v })}>
                <SelectTrigger className="rounded-xl w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {days.map((d) => <SelectItem key={d} value={String(d)}>{dayName(d)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t("startTime")}</Label>
              <Input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label>{t("endTime")}</Label>
              <Input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="rounded-xl" />
            </div>
            <div className="flex items-center gap-2">
              <Switch id="isWorking" checked={form.isWorking} onCheckedChange={(v) => setForm({ ...form, isWorking: v })} />
              <Label htmlFor="isWorking" className="text-xs">{t("isWorking")}</Label>
            </div>
            <Button type="submit" className="rounded-full gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" /> {t("addSlot")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border shadow-soft">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">{locale === "ar" ? "الطبيب" : "Doctor"}</TableHead>
                  <TableHead className="text-xs">{t("dayOfWeek")}</TableHead>
                  <TableHead className="text-xs">{t("startTime")}</TableHead>
                  <TableHead className="text-xs">{t("endTime")}</TableHead>
                  <TableHead className="text-xs">{t("isWorking")}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "إجراءات" : "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-xs">{locale === "ar" ? s.doctor.name : s.doctor.nameEn}</TableCell>
                    <TableCell className="text-xs">{dayName(s.dayOfWeek)}</TableCell>
                    <TableCell className="text-xs">{s.startTime}</TableCell>
                    <TableCell className="text-xs">{s.endTime}</TableCell>
                    <TableCell className="text-xs">{s.isWorking ? "✓" : "✗"}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="destructive" className="h-7 text-xs rounded-full" onClick={() => onDelete(s.id)}><Trash2 className="h-3 w-3" /></Button>
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
