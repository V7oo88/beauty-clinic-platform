"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Save, Loader2, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateProfile } from "@/server-actions/booking";

type User = { id: string; email: string; name?: string | null; role: string };
type Customer = { id: string; firstName: string; lastName: string; phone: string };

export function ProfileClient({ user, customer }: { user: User; customer: Customer | null }) {
  const locale = useLocale();
  const t = useTranslations("Dashboard");
  const tAuth = useTranslations("Auth");
  const [_, startTransition] = useTransition();
  const [firstName, setFirstName] = useState(customer?.firstName ?? "");
  const [lastName, setLastName] = useState(customer?.lastName ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [saving, setSaving] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    startTransition(async () => {
      const r = await updateProfile({ firstName, lastName, phone });
      setSaving(false);
      if (r.ok) toast.success(locale === "ar" ? "تم الحفظ" : "Saved");
      else toast.error(locale === "ar" ? "خطأ" : "Error");
    });
  };

  return (
    <section className="py-8 lg:py-12 bg-secondary/20 min-h-screen">
      <div className="container mx-auto px-4 max-w-xl">
        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-accent" />
              {t("editProfile")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{tAuth("fullName")}</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{locale === "ar" ? "اللقب" : "Last name"}</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{tAuth("phone")}</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{tAuth("email")}</Label>
                <Input id="email" type="email" value={user.email} disabled className="rounded-xl bg-muted/30" />
              </div>
              <Button type="submit" disabled={saving} className="rounded-full gap-2 bg-primary hover:bg-primary/90">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {t("save")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
