"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Sparkles, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeCta() {
  const t = useTranslations("Home");
  const locale = useLocale();

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-[oklch(0.30_0.03_55)] p-8 lg:p-14 text-center"
        >
          {/* Decorative */}
          <div className="absolute -top-20 -end-20 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute -bottom-20 -start-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative max-w-2xl mx-auto flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-medium text-primary-foreground">
                {locale === "ar" ? "ابدئي اليوم" : "Start Today"}
              </span>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight text-primary-foreground text-balance">
              {t("ctaTitle")}
            </h2>
            <p className="text-primary-foreground/80 max-w-lg text-balance">{t("ctaSubtitle")}</p>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <Button asChild size="lg" className="rounded-full gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-7">
                <Link href={`/${locale}/booking`}>
                  <Calendar className="h-4 w-4" />
                  {t("ctaBtn")}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full gap-2 bg-transparent border-white/30 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground px-7">
                <Link href={`/${locale}/services`}>
                  {t("heroSecondary")}
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
