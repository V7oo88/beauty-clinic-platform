"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Phone, Mail, MapPin, Clock, Send, Loader2, MessageCircle } from "lucide-react";
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
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    toast.success(t("sent"));
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const phone = settings["clinic.phone"] ?? "+966 11 200 0000";
  const email = settings["clinic.email"] ?? "info@clinic.com";
  const address = locale === "ar" ? (settings["clinic.address"] ?? t("addressValue")) : (settings["clinic.addressEn"] ?? "Riyadh, Al Olaya, King Fahd Road");
  const hours = locale === "ar" ? (settings["clinic.hours"] ?? "الأحد - الخميس: 10ص - 9م، الجمعة: مغلق") : (settings["clinic.hoursEn"] ?? "Sun–Thu: 10AM–9PM, Fri: Closed");
  const whatsapp = settings["clinic.whatsapp"] ?? "+9665600000000";

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-14">
          <span className="text-overline text-brand-purple font-semibold mb-4 inline-block">
            {locale === "ar" ? "تواصل" : "Contact"}
          </span>
          <h1 className="text-h1 text-brand-plum text-balance">{t("title")}</h1>
          <p className="text-body-lg text-brand-secondary mt-4 max-w-2xl mx-auto text-pretty">{t("subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="border-brand shadow-luxury bg-white rounded-2xl">
            <CardHeader><CardTitle className="font-display text-h2 text-brand-plum">{t("formTitle")}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-body-sm font-medium text-brand-plum">{t("name")}</Label>
                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="rounded-xl h-11 text-body" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-body-sm font-medium text-brand-plum">{t("phone")}</Label>
                    <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl h-11 text-body" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-body-sm font-medium text-brand-plum">{t("email")}</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="rounded-xl h-11 text-body" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-body-sm font-medium text-brand-plum">{t("subject")}</Label>
                  <Input id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required className="rounded-xl h-11 text-body" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-body-sm font-medium text-brand-plum">{t("message")}</Label>
                  <Textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5} className="rounded-xl text-body" />
                </div>
                <Button type="submit" disabled={sending} className="w-full rounded-full gap-2 bg-brand-purple hover:bg-brand-purple/90 text-white h-12 text-body font-medium shadow-purple">
                  {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  {t("send")}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Info */}
          <div className="space-y-4">
            <Card className="border-brand shadow-soft bg-white rounded-2xl">
              <CardContent className="p-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-brand-lavender flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-brand-purple" />
                  </div>
                  <div>
                    <p className="text-overline text-brand-secondary mb-1">{t("address")}</p>
                    <p className="text-body font-medium text-brand-plum">{address}</p>
                  </div>
                </div>
                <div className="border-t border-brand-border pt-5 flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-brand-lavender flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-brand-purple" />
                  </div>
                  <div>
                    <p className="text-overline text-brand-secondary mb-1">{t("phone")}</p>
                    <a href={`tel:${phone}`} className="text-body font-medium text-brand-plum hover:text-brand-purple transition">{phone}</a>
                  </div>
                </div>
                <div className="border-t border-brand-border pt-5 flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-brand-lavender flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-brand-purple" />
                  </div>
                  <div>
                    <p className="text-overline text-brand-secondary mb-1">{t("email")}</p>
                    <a href={`mailto:${email}`} className="text-body font-medium text-brand-plum hover:text-brand-purple transition">{email}</a>
                  </div>
                </div>
                <div className="border-t border-brand-border pt-5 flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-brand-lavender flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-brand-purple" />
                  </div>
                  <div>
                    <p className="text-overline text-brand-secondary mb-1">{t("hours")}</p>
                    <p className="text-body font-medium text-brand-plum">{hours}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick WhatsApp CTA */}
            <Card className="border-brand bg-brand-lavender/40 rounded-2xl overflow-hidden">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl purple-gradient flex items-center justify-center shrink-0 shadow-purple">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-h4 font-display font-semibold text-brand-plum">
                    {locale === "ar" ? "تواصل واتساب" : "WhatsApp Us"}
                  </p>
                  <p className="text-caption text-brand-secondary">
                    {locale === "ar" ? "رد سريع خلال ساعات العمل" : "Quick reply during working hours"}
                  </p>
                </div>
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                  className="ms-auto h-10 px-4 rounded-full bg-brand-purple text-white text-body-sm font-medium flex items-center hover:bg-brand-purple/90 transition"
                >
                  {locale === "ar" ? "مراسلة" : "Chat"}
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
