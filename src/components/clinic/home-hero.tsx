"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Sparkles, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Settings = Record<string, string>;

export function HomeHero({ settings }: { settings?: Partial<Settings> }) {
  const locale = useLocale();
  const t = useTranslations("Home");
  const Arrow = locale === "ar" ? ChevronLeft : ChevronRight;

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 luxury-gradient -z-10" />
      <div className="absolute inset-0 bg-grid opacity-50 -z-10" />
      {/* Decorative glow */}
      <div className="absolute -top-32 -end-32 h-96 w-96 rounded-full bg-accent/15 blur-3xl -z-10" />
      <div className="absolute top-40 -start-32 h-80 w-80 rounded-full bg-primary/5 blur-3xl -z-10" />

      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-5 max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-medium text-accent-foreground">{t("heroBadge")}</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] text-balance">
              {t("heroTitle")}{" "}
              <span className="text-gold-gradient">{t("heroTitleAccent")}</span>
            </h1>

            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed text-balance max-w-lg">
              {t("heroSubtitle")}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-2">
              <Button asChild size="lg" className="rounded-full gap-2 bg-primary hover:bg-primary/90 px-7 shadow-soft">
                <Link href={`/${locale}/booking`}>
                  <Calendar className="h-4 w-4" />
                  {t("heroCta")}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full gap-2 px-7 bg-card/50 backdrop-blur-sm">
                <Link href={`/${locale}/services`}>
                  {t("heroSecondary")}
                  <Arrow className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["a", "b", "c", "d"].map((s) => (
                    <div key={s} className="h-6 w-6 rounded-full bg-gradient-to-br from-accent to-primary border-2 border-background" />
                  ))}
                </div>
                <span>+5K {locale === "ar" ? "عميلة سعيدة" : "happy clients"}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Sparkles key={s} className="h-3 w-3 text-accent" />
                  ))}
                </div>
                <span>{locale === "ar" ? "4.9/5" : "4.9/5"}</span>
              </div>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-luxury">
              <img
                src="https://images.unsplash.com/photo-1631542307892-e4272b0c6c0b?w=900&q=80"
                alt="Beauty Clinic"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "https://picsum.photos/seed/clinic-hero/900/1100";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />

              {/* Floating card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-4 start-4 end-4 glass rounded-2xl p-4 border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-accent/30 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold">
                      {locale === "ar" ? "تشاور مجاني" : "Free Consultation"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {locale === "ar" ? "احجزي استشارتكِ الأولى اليوم" : "Book your first session today"}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
