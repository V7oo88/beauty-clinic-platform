"use client";

import { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateSettingsMany } from "@/server-actions/admin";

type Settings = Record<string, string>;

export function AdminSettingsClient({ settings }: { settings: Settings }) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const [_, startTransition] = useTransition();
  const [form, setForm] = useState<Settings>(settings);
  const [saving, setSaving] = useState(false);

  const fields: { key: string; label: string }[] = [
    { key: "clinic.name", label: locale === "ar" ? "اسم العيادة (عربي)" : "Clinic name (AR)" },
    { key: "clinic.nameEn", label: "Clinic name (EN)" },
    { key: "clinic.phone", label: locale === "ar" ? "الهاتف" : "Phone" },
    { key: "clinic.email", label: locale === "ar" ? "البريد" : "Email" },
    { key: "clinic.address", label: locale === "ar" ? "العنوان (عربي)" : "Address (AR)" },
    { key: "clinic.addressEn", label: "Address (EN)" },
    { key: "clinic.hours", label: locale === "ar" ? "ساعات العمل (عربي)" : "Working hours (AR)" },
    { key: "clinic.hoursEn", label: "Working hours (EN)" },
    { key: "clinic.facebook", label: "Facebook URL" },
    { key: "clinic.instagram", label: "Instagram URL" },
    { key: "clinic.twitter", label: "Twitter URL" },
    { key: "clinic.whatsapp", label: "WhatsApp" },
  ];

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    startTransition(async () => {
      const items = fields.map((f) => ({ key: f.key, value: form[f.key] ?? "" }));
      const r = await updateSettingsMany(items);
      setSaving(false);
      if (r.ok) toast.success(locale === "ar" ? "تم الحفظ" : "Saved");
      else toast.error(locale === "ar" ? "خطأ" : "Error");
    });
  };

  return (
    <div className="p-4 lg:p-8">
      <h1 className="font-display text-2xl lg:text-3xl font-semibold mb-6">{t("settings")}</h1>
      <Card className="border-border shadow-soft">
        <CardHeader><CardTitle className="text-lg">{locale === "ar" ? "معلومات العيادة" : "Clinic Info"}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={onSave} className="space-y-4 max-w-2xl">
            <div className="grid sm:grid-cols-2 gap-3">
              {fields.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <Label htmlFor={f.key}>{f.label}</Label>
                  <Input id={f.key} value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="rounded-xl" />
                </div>
              ))}
            </div>
            <Button type="submit" disabled={saving} className="rounded-full gap-2 bg-primary hover:bg-primary/90">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {t("save")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
