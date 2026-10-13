"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Target, Eye, Heart, Users, Stethoscope, Sparkles, Clock } from "lucide-react";

export function AboutClient() {
  const t = useTranslations("About");
  const tHome = useTranslations("Home");
  const locale = useLocale();

  const stats = [
    { value: "5000+", label: tHome("statsClients"), Icon: Users },
    { value: "10+", label: tHome("statsDoctors"), Icon: Stethoscope },
    { value: "7+", label: tHome("statsServices"), Icon: Sparkles },
    { value: "8+", label: tHome("statsYears"), Icon: Clock },
  ];

  return (
    <>
      <section className="py-16 lg:py-24 luxury-gradient">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">
            {locale === "ar" ? "من نحن" : "About Us"}
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold tracking-tight text-balance mb-4">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-lg text-balance">{t("subtitle")}</p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-4xl space-y-12">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid lg:grid-cols-[auto_1fr] gap-6 items-start">
            <div className="h-14 w-14 rounded-2xl bg-accent/20 flex items-center justify-center shrink-0">
              <Target className="h-7 w-7 text-accent" />
            </div>
            <div>
              <h2 className="font-display text-2xl lg:text-3xl font-semibold mb-3">{t("missionTitle")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("missionBody")}</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid lg:grid-cols-[auto_1fr] gap-6 items-start">
            <div className="h-14 w-14 rounded-2xl bg-accent/20 flex items-center justify-center shrink-0">
              <Eye className="h-7 w-7 text-accent" />
            </div>
            <div>
              <h2 className="font-display text-2xl lg:text-3xl font-semibold mb-3">{t("visionTitle")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("visionBody")}</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid lg:grid-cols-[auto_1fr] gap-6 items-start">
            <div className="h-14 w-14 rounded-2xl bg-accent/20 flex items-center justify-center shrink-0">
              <Heart className="h-7 w-7 text-accent" />
            </div>
            <div>
              <h2 className="font-display text-2xl lg:text-3xl font-semibold mb-3">{t("valuesTitle")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("valuesBody")}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 border-y border-border bg-secondary/40">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl font-semibold text-center mb-8">{t("statsTitle")}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-accent/20 mb-3">
                  <s.Icon className="h-4 w-4 text-accent" />
                </div>
                <p className="font-display text-3xl lg:text-4xl font-semibold text-gold-gradient">{s.value}</p>
                <p className="text-xs lg:text-sm text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
