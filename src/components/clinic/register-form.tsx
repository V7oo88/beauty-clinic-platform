"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, Loader2, Mail, Lock, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { registerUser } from "@/server-actions/booking";

export function RegisterFormClient() {
  const t = useTranslations("Auth");
  const tNav = useTranslations("Nav");
  const locale = useLocale();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    if (password !== confirm) {
      toast.error(t("passwordMismatch"));
      return;
    }
    if (!agree) {
      toast.error(locale === "ar" ? "يجب الموافقة على الشروط" : "Please accept terms");
      return;
    }
    setLoading(true);
    try {
      const r = await registerUser({ email, password, name, phone });
      setLoading(false);
      if (!r.ok) {
        if (r.error === "EMAIL_EXISTS") {
          toast.error(t("emailExists"));
        } else if (r.error === "WEAK_PASSWORD") {
          toast.error(locale === "ar" ? "كلمة المرور قصيرة جدًا" : "Password too short");
        } else {
          toast.error(locale === "ar" ? "حدث خطأ" : "An error occurred");
        }
        return;
      }
      toast.success(t("registerSuccess"));
      router.push(`/${locale}/login`);
    } catch (e) {
      setLoading(false);
      toast.error(locale === "ar" ? "حدث خطأ" : "An error occurred");
    }
  };

  return (
    <section className="py-12 lg:py-20">
      <div className="container mx-auto px-4 max-w-md">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border shadow-luxury">
            <CardHeader className="space-y-3 text-center">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-accent to-primary mx-auto">
                <Sparkles className="h-6 w-6 text-background" />
              </div>
              <CardTitle className="font-display text-2xl">{t("registerTitle")}</CardTitle>
              <CardDescription>{t("registerSubtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("fullName")}</Label>
                  <div className="relative">
                    <User className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name" value={name} onChange={(e) => setName(e.target.value)}
                      required className="ps-10 rounded-xl" autoComplete="name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                      placeholder="you@example.com" className="ps-10 rounded-xl" autoComplete="email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("phone")}</Label>
                  <div className="relative">
                    <Phone className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder="+966 50 000 0000" className="ps-10 rounded-xl" autoComplete="tel" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t("password")}</Label>
                  <div className="relative">
                    <Lock className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                      required className="ps-10 rounded-xl" autoComplete="new-password" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">{t("confirmPassword")}</Label>
                  <div className="relative">
                    <Lock className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                    <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                      required className="ps-10 rounded-xl" autoComplete="new-password" />
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Checkbox id="agree" checked={agree} onCheckedChange={(v) => setAgree(!!v)} />
                  <label htmlFor="agree" className="text-xs text-muted-foreground">
                    {t("agreeTerms")}{" "}
                    <Link href={`/${locale}/terms`} className="text-accent hover:underline" target="_blank">
                      {locale === "ar" ? "الشروط والأحكام" : "Terms"}
                    </Link>
                  </label>
                </div>
                <Button type="submit" disabled={loading} className="w-full rounded-full gap-2 bg-primary hover:bg-primary/90">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {t("register")}
                </Button>
              </form>
              <div className="mt-6 text-center text-sm text-muted-foreground">
                {t("haveAccount")}{" "}
                <Link href={`/${locale}/login`} className="text-accent font-medium hover:underline">
                  {tNav("login")}
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
