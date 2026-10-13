"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { UserCheck, Cpu, ShieldCheck, CalendarClock, Headset, RefreshCw } from "lucide-react";

export function HomeWhyUs() {
  const t = useTranslations("Home");
  const locale = useLocale();

  const items = [
    { title: t("why1Title"), desc: t("why1Desc"), Icon: UserCheck, gradient: "from-brand-purple to-brand-purple-soft" },
    { title: t("why2Title"), desc: t("why2Desc"), Icon: Cpu, gradient: "from-brand-purple-soft to-brand-purple" },
    { title: t("why3Title"), desc: t("why3Desc"), Icon: ShieldCheck, gradient: "from-brand-purple to-brand-purple-soft" },
    { title: t("why4Title"), desc: t("why4Desc"), Icon: CalendarClock, gradient: "from-brand-purple-soft to-brand-purple" },
    { title: t("why5Title"), desc: t("why5Desc"), Icon: Headset, gradient: "from-brand-purple to-brand-purple-soft" },
    { title: t("why6Title"), desc: t("why6Desc"), Icon: RefreshCw, gradient: "from-brand-purple-soft to-brand-purple" },
  ];

  return (
    <section className="py-20 lg:py-28 bg-brand-beige/40">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-14">
          <span className="text-overline text-brand-purple font-semibold mb-4">
            {locale === "ar" ? "مميزاتنا" : "Our Advantages"}
          </span>
          <h2 className="text-h1 max-w-3xl text-balance text-brand-plum">
            {t("whyTitle")}
          </h2>
          <p className="text-body-lg text-brand-secondary mt-4 max-w-2xl text-pretty">{t("whySubtitle")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative rounded-3xl border border-brand bg-white p-7 hover:shadow-luxury transition-all overflow-hidden"
            >
              {/* Subtle decoration */}
              <div className="absolute -top-12 -end-12 h-32 w-32 rounded-full bg-brand-lavender/40 group-hover:bg-brand-lavender/70 transition" />

              <div className={`relative inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br ${it.gradient} shadow-purple mb-5`}>
                <it.Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="relative text-h3 font-display font-semibold mb-3 text-brand-plum">{it.title}</h3>
              <p className="relative text-body text-brand-secondary leading-relaxed">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
