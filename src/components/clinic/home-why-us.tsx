"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { UserCheck, Cpu, ShieldCheck, CalendarClock, Headset, RefreshCw } from "lucide-react";

export function HomeWhyUs() {
  const t = useTranslations("Home");
  const locale = useLocale();

  const items = [
    { title: t("why1Title"), desc: t("why1Desc"), Icon: UserCheck },
    { title: t("why2Title"), desc: t("why2Desc"), Icon: Cpu },
    { title: t("why3Title"), desc: t("why3Desc"), Icon: ShieldCheck },
    { title: t("why4Title"), desc: t("why4Desc"), Icon: CalendarClock },
    { title: t("why5Title"), desc: t("why5Desc"), Icon: Headset },
    { title: t("why6Title"), desc: t("why6Desc"), Icon: RefreshCw },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">
            {locale === "ar" ? "مميزاتنا" : "Our Advantages"}
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight text-balance max-w-2xl">
            {t("whyTitle")}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl text-balance">{t("whySubtitle")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group rounded-2xl border border-border/60 bg-card p-6 hover:shadow-luxury transition-all"
            >
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-accent/15 group-hover:bg-accent/25 transition mb-4">
                <it.Icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{it.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
