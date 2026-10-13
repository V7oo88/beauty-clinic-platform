"use client";

import { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { createService, updateService, deleteService } from "@/server-actions/admin";

type Service = {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  shortDesc: string;
  shortDescEn: string;
  fullDesc: string;
  fullDescEn: string;
  image: string;
  durationMin: number;
  price: number;
  category?: string | null;
  isActive: boolean;
};

const empty = {
  slug: "", name: "", nameEn: "", shortDesc: "", shortDescEn: "", fullDesc: "", fullDescEn: "",
  image: "https://picsum.photos/seed/new-service/1200/800", durationMin: 30, price: 500, category: "",
};

export function AdminServicesClient({ services }: { services: Service[] }) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const [_, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(empty);

  const onOpenAdd = () => { setEditing(null); setForm(empty); setOpen(true); };
  const onOpenEdit = (s: Service) => {
    setEditing(s);
    setForm({ slug: s.slug, name: s.name, nameEn: s.nameEn, shortDesc: s.shortDesc, shortDescEn: s.shortDescEn, fullDesc: s.fullDesc, fullDescEn: s.fullDescEn, image: s.image, durationMin: s.durationMin, price: s.price, category: s.category ?? "" });
    setOpen(true);
  };

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      if (editing) {
        const r = await updateService(editing.id, form);
        if (r.ok) toast.success(locale === "ar" ? "تم الحفظ" : "Saved");
        else toast.error(locale === "ar" ? "خطأ" : "Error");
      } else {
        const r = await createService(form);
        if (r.ok) toast.success(locale === "ar" ? "تم الإضافة" : "Created");
        else toast.error(locale === "ar" ? "خطأ" : "Error");
      }
      setOpen(false);
    });
  };

  const onDelete = (id: string) => {
    startTransition(async () => {
      const r = await deleteService(id);
      if (r.ok) toast.success(locale === "ar" ? "تم الحذف" : "Deleted");
      else toast.error(locale === "ar" ? "خطأ" : "Error");
    });
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl lg:text-3xl font-semibold">{t("manageServices")}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={onOpenAdd} className="rounded-full gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" /> {t("addService")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? t("editService") : t("addService")}</DialogTitle></DialogHeader>
            <form onSubmit={onSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Name (AR)</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="rounded-xl" /></div>
                <div className="space-y-1.5"><Label>Name (EN)</Label><Input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} required className="rounded-xl" /></div>
                <div className="space-y-1.5"><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required className="rounded-xl font-mono" /></div>
                <div className="space-y-1.5"><Label>{locale === "ar" ? "التصنيف" : "Category"}</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-xl" /></div>
                <div className="space-y-1.5"><Label>{locale === "ar" ? "المدة (دقيقة)" : "Duration (min)"}</Label><Input type="number" value={form.durationMin} onChange={(e) => setForm({ ...form, durationMin: +e.target.value })} required className="rounded-xl" /></div>
                <div className="space-y-1.5"><Label>{locale === "ar" ? "السعر" : "Price"}</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} required className="rounded-xl" /></div>
              </div>
              <div className="space-y-1.5"><Label>Image URL</Label><Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label>Short desc (AR)</Label><Textarea value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} rows={2} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label>Short desc (EN)</Label><Textarea value={form.shortDescEn} onChange={(e) => setForm({ ...form, shortDescEn: e.target.value })} rows={2} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label>Full desc (AR)</Label><Textarea value={form.fullDesc} onChange={(e) => setForm({ ...form, fullDesc: e.target.value })} rows={3} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label>Full desc (EN)</Label><Textarea value={form.fullDescEn} onChange={(e) => setForm({ ...form, fullDescEn: e.target.value })} rows={3} className="rounded-xl" /></div>
              <DialogFooter>
                <Button type="submit" className="rounded-full gap-2 bg-primary hover:bg-primary/90">{t("save")}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border shadow-soft">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">{locale === "ar" ? "الخدمة" : "Service"}</TableHead>
                  <TableHead className="text-xs">Slug</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "التصنيف" : "Category"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "المدة" : "Duration"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "السعر" : "Price"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "الحالة" : "Active"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "إجراءات" : "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-xs">
                      <div className="flex items-center gap-2">
                        <img src={s.image} alt="" className="h-8 w-8 rounded-lg object-cover" />
                        <p className="font-medium">{locale === "ar" ? s.name : s.nameEn}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-mono">{s.slug}</TableCell>
                    <TableCell className="text-xs">{s.category ?? "—"}</TableCell>
                    <TableCell className="text-xs">{s.durationMin}</TableCell>
                    <TableCell className="text-xs">{new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US").format(s.price)}</TableCell>
                    <TableCell><Badge variant={s.isActive ? "default" : "destructive"} className="text-[10px]">{s.isActive ? "✓" : "✗"}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-7 text-xs rounded-full" onClick={() => onOpenEdit(s)}><Edit className="h-3 w-3" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild><Button size="sm" variant="destructive" className="h-7 text-xs rounded-full"><Trash2 className="h-3 w-3" /></Button></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t("confirmDelete")}</AlertDialogTitle>
                              <AlertDialogDescription>{locale === "ar" ? `حذف ${s.name}` : `Delete ${s.nameEn}`}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onDelete(s.id)}>{t("delete")}</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
