"use client";

import { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { createDoctor, updateDoctor, deleteDoctor } from "@/server-actions/admin";

type Service = { id: string; name: string; nameEn: string };
type Doctor = {
  id: string;
  name: string;
  nameEn: string;
  title: string;
  titleEn: string;
  specialty: string;
  specialtyEn: string;
  bio: string;
  bioEn: string;
  image: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  services: { serviceId: string }[];
};

export function AdminDoctorsClient({ doctors, services }: { doctors: Doctor[]; services: Service[] }) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const [_, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [form, setForm] = useState({
    name: "", nameEn: "", title: "", titleEn: "",
    specialty: "", specialtyEn: "", bio: "", bioEn: "",
    image: "https://picsum.photos/seed/new-doctor/600/750",
    experienceYears: 5,
  });
  const [serviceIds, setServiceIds] = useState<string[]>([]);

  const onOpenAdd = () => {
    setEditing(null);
    setForm({ name: "", nameEn: "", title: "", titleEn: "", specialty: "", specialtyEn: "", bio: "", bioEn: "", image: "https://picsum.photos/seed/new-doctor/600/750", experienceYears: 5 });
    setServiceIds([]);
    setOpen(true);
  };

  const onOpenEdit = (d: Doctor) => {
    setEditing(d);
    setForm({
      name: d.name, nameEn: d.nameEn, title: d.title, titleEn: d.titleEn,
      specialty: d.specialty, specialtyEn: d.specialtyEn, bio: d.bio, bioEn: d.bioEn,
      image: d.image, experienceYears: d.experienceYears,
    });
    setServiceIds(d.services.map((s) => s.serviceId));
    setOpen(true);
  };

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      if (editing) {
        const r = await updateDoctor(editing.id, form);
        if (r.ok) toast.success(locale === "ar" ? "تم الحفظ" : "Saved");
        else toast.error(locale === "ar" ? "خطأ" : "Error");
      } else {
        const r = await createDoctor({ ...form, serviceIds });
        if (r.ok) toast.success(locale === "ar" ? "تم الإضافة" : "Created");
        else toast.error(locale === "ar" ? "خطأ" : "Error");
      }
      setOpen(false);
    });
  };

  const onDelete = (id: string) => {
    startTransition(async () => {
      const r = await deleteDoctor(id);
      if (r.ok) toast.success(locale === "ar" ? "تم الحذف" : "Deleted");
      else toast.error(locale === "ar" ? "خطأ" : "Error");
    });
  };

  const toggleService = (sid: string) => {
    setServiceIds((p) => p.includes(sid) ? p.filter((x) => x !== sid) : [...p, sid]);
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl lg:text-3xl font-semibold">{t("manageDoctors")}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={onOpenAdd} className="rounded-full gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" /> {t("addDoctor")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? t("editDoctor") : t("addDoctor")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>{locale === "ar" ? "الاسم" : "Name (AR)"}</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label>Name (EN)</Label>
                  <Input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} required className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label>{locale === "ar" ? "المسمى" : "Title (AR)"}</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label>Title (EN)</Label>
                  <Input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} required className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label>{locale === "ar" ? "التخصص" : "Specialty (AR)"}</Label>
                  <Input value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} required className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label>Specialty (EN)</Label>
                  <Input value={form.specialtyEn} onChange={(e) => setForm({ ...form, specialtyEn: e.target.value })} required className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label>{locale === "ar" ? "الخبرة" : "Experience"}</Label>
                  <Input type="number" value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: +e.target.value })} required className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label>Image URL</Label>
                  <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Bio (AR)</Label>
                <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label>Bio (EN)</Label>
                <Textarea value={form.bioEn} onChange={(e) => setForm({ ...form, bioEn: e.target.value })} rows={3} className="rounded-xl" />
              </div>
              {!editing && (
                <div className="space-y-1.5">
                  <Label>{locale === "ar" ? "الخدمات" : "Services"}</Label>
                  <div className="flex flex-wrap gap-2">
                    {services.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleService(s.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition ${serviceIds.includes(s.id) ? "bg-accent/30 border-accent/50" : "bg-card border-border"}`}
                      >
                        {locale === "ar" ? s.name : s.nameEn}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button type="submit" className="rounded-full gap-2 bg-primary hover:bg-primary/90">
                  {t("save")}
                </Button>
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
                  <TableHead className="text-xs">{locale === "ar" ? "الطبيب" : "Doctor"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "التخصص" : "Specialty"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "الخبرة" : "Experience"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "التقييم" : "Rating"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "الخدمات" : "Services"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "الحالة" : "Active"}</TableHead>
                  <TableHead className="text-xs">{locale === "ar" ? "إجراءات" : "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="text-xs">
                      <div className="flex items-center gap-2">
                        <img src={d.image} alt="" className="h-8 w-8 rounded-full object-cover" />
                        <div>
                          <p className="font-medium">{locale === "ar" ? d.name : d.nameEn}</p>
                          <p className="text-[10px] text-muted-foreground">{locale === "ar" ? d.title : d.titleEn}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{locale === "ar" ? d.specialty : d.specialtyEn}</TableCell>
                    <TableCell className="text-xs">{d.experienceYears}</TableCell>
                    <TableCell className="text-xs">{d.rating.toFixed(1)} ({d.reviewCount})</TableCell>
                    <TableCell className="text-xs"><Badge variant="secondary" className="rounded-full">{d.services.length}</Badge></TableCell>
                    <TableCell><Badge variant={d.isActive ? "default" : "destructive"} className="text-[10px]">{d.isActive ? (locale === "ar" ? "نشط" : "Active") : (locale === "ar" ? "متوقف" : "Off")}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-7 text-xs rounded-full" onClick={() => onOpenEdit(d)}><Edit className="h-3 w-3" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" className="h-7 text-xs rounded-full"><Trash2 className="h-3 w-3" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t("confirmDelete")}</AlertDialogTitle>
                              <AlertDialogDescription>{locale === "ar" ? `سيتم حذف ${d.name}` : `Will delete ${d.nameEn}`}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onDelete(d.id)}>{t("delete")}</AlertDialogAction>
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
