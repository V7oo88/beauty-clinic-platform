"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, Loader2, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";

export function LoginFormClient() {
  const t = useTranslations("Auth");
  const tNav = useTranslations("Nav");
  const locale = useLocale();
  const router = useRouter();
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") ?? `/${locale}/dashboard`;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [_, startTransition] = useTransition();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      toast.error(t("loginError"));
      return;
    }
    toast.success(locale === "ar" ? "تم تسجيل الدخول" : "Signed in");
    startTransition(() => router.push(callbackUrl));
  };

  return (
    <section className="py-12 lg:py-20">
      <div className="container mx-auto px-4 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-border shadow-luxury">
            <CardHeader className="space-y-3 text-center">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-accent to-primary mx-auto">
                <Sparkles className="h-6 w-6 text-background" />
              </div>
              <CardTitle className="font-display text-2xl">{t("loginTitle")}</CardTitle>
              <CardDescription>{t("loginSubtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="ps-10 rounded-xl"
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t("password")}</Label>
                  <div className="relative">
                    <Lock className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="ps-10 rounded-xl"
                      autoComplete="current-password"
                    />
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full rounded-full gap-2 bg-primary hover:bg-primary/90">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {t("login")}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                {t("noAccount")}{" "}
                <Link href={`/${locale}/register`} className="text-accent font-medium hover:underline">
                  {tNav("register")}
                </Link>
              </div>

              {/* Demo creds hint */}
              <div className="mt-6 rounded-xl bg-accent/10 border border-accent/30 p-3 text-xs text-muted-foreground">
                <p className="font-medium mb-1">{locale === "ar" ? "بيانات تجريبية:" : "Demo credentials:"}</p>
                <p>admin@clinic.com / Admin@2026</p>
                <p>client@clinic.com / Client@2026</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
