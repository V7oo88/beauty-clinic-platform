"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Phone, Mail, MapPin, Clock, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type Settings = Record<string, string>;

export function ContactClient({ settings }: { settings: Partial<Settings> }) {
  const t = useTranslations("Contact");
  const locale = useLocale();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Mock submission
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    toast.success(t("sent"));
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const phone = settings["clinic.phone"] ?? "+966 11 200 0000";
  const email = settings["clinic.email"] ?? "info@clinic.com";
  const address = locale === "ar" ? (settings["clinic.address"] ?? t("addressValue")) : (settings["clinic.addressEn"] ?? "Riyadh, Al Olaya, King Fahd Road");
  const hours = locale === "ar" ? (settings["clinic.hours"] ?? "الأحد - الخميس: 10ص - 9م، الجمعة: مغلق") : (settings["clinic.hoursEn"] ?? "Sun–Thu: 10AM–9PM, Fri: Closed");

  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">
            {locale === "ar" ? "تواصل" : "Contact"}
          </span>
          <h1 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-balance">{t("subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="border-border shadow-soft">
            <CardHeader><CardTitle className="font-display text-xl">{t("formTitle")}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("name")}</Label>
                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("phone")}</Label>
                    <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">{t("subject")}</Label>
                  <Input id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t("message")}</Label>
                  <Textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={4} className="rounded-xl" />
                </div>
                <Button type="submit" disabled={sending} className="w-full rounded-full gap-2 bg-primary hover:bg-primary/90">
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {t("send")}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Info */}
          <Card className="border-border shadow-soft h-fit">
            <CardHeader><CardTitle className="font-display text-xl">{t("infoTitle")}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("address")}</p>
                  <p className="text-sm font-medium mt-0.5">{address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("phone")}</p>
                  <a href={`tel:${phone}`} className="text-sm font-medium mt-0.5 block hover:text-accent">{phone}</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("email")}</p>
                  <a href={`mailto:${email}`} className="text-sm font-medium mt-0.5 block hover:text-accent">{email}</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("hours")}</p>
                  <p className="text-sm font-medium mt-0.5">{hours}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
