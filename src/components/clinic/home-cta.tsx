"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Sparkles, Calendar, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeCta() {
  const t = useTranslations("Home");
  const locale = useLocale();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[2rem] overflow-hidden purple-gradient p-10 lg:p-16 text-center shadow-luxury"
        >
          {/* Decorative */}
          <div className="absolute -top-24 -end-24 h-72 w-72 rounded-full bg-brand-lavender/20 blur-3xl" />
          <div className="absolute -bottom-24 -start-24 h-72 w-72 rounded-full bg-brand-beige/15 blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 pattern-dots opacity-25" />

          <div className="relative max-w-2xl mx-auto flex flex-col items-center gap-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-brand-lavender" />
              <span className="text-caption font-semibold text-white">
                {locale === "ar" ? "ابدئي اليوم" : "Start Today"}
              </span>
            </div>
            <h2 className="text-h1 font-display font-semibold tracking-tight text-white text-balance">
              {t("ctaTitle")}
            </h2>
            <p className="text-body-lg text-white/85 max-w-xl text-pretty">{t("ctaSubtitle")}</p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              <Button asChild size="lg" className="rounded-full gap-2 bg-white text-brand-purple hover:bg-brand-cream px-8 h-12 text-body font-semibold shadow-purple">
                <Link href={`/${locale}/booking`}>
                  <Calendar className="h-5 w-5" />
                  {t("ctaBtn")}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full gap-2 bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white px-8 h-12 text-body font-medium">
                <Link href={`/${locale}/services`}>
                  {t("heroSecondary")}
                  <Arrow className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
