"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Sparkles, Calendar, ChevronLeft, ChevronRight, ShieldCheck, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

type Settings = Record<string, string>;

export function HomeHero({ settings }: { settings?: Partial<Settings> }) {
  const locale = useLocale();
  const t = useTranslations("Home");
  const Arrow = locale === "ar" ? ChevronLeft : ChevronRight;

  return (
    <section className="relative overflow-hidden">
      {/* Background — soft lavender + cream gradient + grid */}
      <div className="absolute inset-0 luxury-gradient -z-10" />
      <div className="absolute inset-0 bg-grid opacity-40 -z-10" />
      {/* Decorative glows in purple tones */}
      <div className="absolute -top-32 -end-32 h-96 w-96 rounded-full bg-brand-lavender/40 blur-3xl -z-10" />
      <div className="absolute top-40 -start-32 h-80 w-80 rounded-full bg-brand-beige/40 blur-3xl -z-10" />
      <div className="absolute bottom-0 end-1/3 h-72 w-72 rounded-full bg-brand-lavender/20 blur-3xl -z-10" />

      <div className="container mx-auto px-4 py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-6 max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-lavender/60 border border-brand-border w-fit">
              <Sparkles className="h-4 w-4 text-brand-purple" />
              <span className="text-caption font-semibold text-brand-purple">{t("heroBadge")}</span>
            </div>

            <h1 className="text-display text-balance">
              {t("heroTitle")}{" "}
              <span className="text-purple-gradient">{t("heroTitleAccent")}</span>
            </h1>

            <p className="text-body-lg text-brand-secondary leading-relaxed text-pretty max-w-xl">
              {t("heroSubtitle")}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-2">
              <Button asChild size="lg" className="rounded-full gap-2 bg-brand-purple hover:bg-brand-purple/90 text-white shadow-purple px-8 h-12 text-body">
                <Link href={`/${locale}/booking`}>
                  <Calendar className="h-5 w-5" />
                  {t("heroCta")}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full gap-2 px-8 h-12 text-body border-brand-border bg-white/60 backdrop-blur-sm hover:bg-brand-lavender/40">
                <Link href={`/${locale}/services`}>
                  {t("heroSecondary")}
                  <Arrow className="h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-8 mt-6 text-caption text-brand-secondary">
              <div className="flex items-center gap-2.5">
                <div className="flex -space-x-2">
                  {["a", "b", "c", "d"].map((s, i) => (
                    <div
                      key={s}
                      className="h-8 w-8 rounded-full border-2 border-background shadow-soft"
                      style={{
                        background: `linear-gradient(135deg, var(--color-purple-deep), var(--color-purple-soft))`,
                        opacity: 1 - i * 0.12,
                      }}
                    />
                  ))}
                </div>
                <div>
                  <p className="font-bold text-brand-plum text-body-sm">+5,000</p>
                  <p>{locale === "ar" ? "عميلة سعيدة" : "happy clients"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Sparkles key={s} className="h-4 w-4 text-brand-purple" />
                  ))}
                </div>
                <div>
                  <p className="font-bold text-brand-plum text-body-sm">4.9/5</p>
                  <p>{locale === "ar" ? "متوسط التقييم" : "avg rating"}</p>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-caption text-brand-secondary">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-brand-purple" />
                <span>{locale === "ar" ? "بيئة آمنة ومعقّمة" : "Safe & sterile"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-brand-purple" />
                <span>{locale === "ar" ? "أطباء مرخّصون" : "Licensed doctors"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-brand-purple" />
                <span>{locale === "ar" ? "مواعيد مرنة" : "Flexible scheduling"}</span>
              </div>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative hidden lg:block"
          >
            {/* Decorative frame */}
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-lavender/40 to-brand-beige/40 blur-md" />

            {/* Main image — luxury beauty aesthetic clinic interior with treatment bed */}
            <div className="relative aspect-[4/5] rounded-[1.75rem] overflow-hidden shadow-luxury border-4 border-white">
              <img
                src="https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/738367c5dbb1.jpg"
                alt={locale === "ar" ? "داخل عيادة التجميل الفاخرة مع سرير علاج وبيئة معقّمة" : "Luxury beauty clinic interior with treatment bed in clean professional environment"}
                className="h-full w-full object-cover"
                loading="eager"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "https://picsum.photos/seed/clinic-luxury-hero/900/1100";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-plum/30 via-transparent to-transparent" />

              {/* Floating consultation card */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-5 start-5 end-5 glass rounded-2xl p-4 border border-brand-border shadow-luxury"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl purple-gradient flex items-center justify-center shrink-0 shadow-purple">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-h4 font-display font-semibold text-brand-plum">
                      {locale === "ar" ? "استشارة مجانية" : "Free Consultation"}
                    </p>
                    <p className="text-caption text-brand-secondary">
                      {locale === "ar" ? "احجزي استشارتكِ الأولى اليوم" : "Book your first session today"}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative stat card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="absolute -top-6 -end-4 bg-white rounded-2xl p-3 shadow-luxury border border-brand-border"
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-brand-lavender flex items-center justify-center">
                  <Award className="h-4 w-4 text-brand-purple" />
                </div>
                <div>
                  <p className="text-overline text-brand-secondary">{locale === "ar" ? "خبرة" : "experience"}</p>
                  <p className="text-h4 font-bold text-brand-plum">+8 {locale === "ar" ? "سنوات" : "years"}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
