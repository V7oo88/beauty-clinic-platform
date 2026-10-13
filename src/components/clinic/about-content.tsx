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
      <section className="py-20 lg:py-28 luxury-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -top-32 -end-32 h-96 w-96 rounded-full bg-brand-lavender/40 blur-3xl" />
        <div className="container mx-auto px-4 max-w-5xl text-center relative">
          <span className="text-overline text-brand-purple font-semibold mb-4 inline-block">
            {locale === "ar" ? "من نحن" : "About Us"}
          </span>
          <h1 className="text-display mb-5 text-balance text-brand-plum">
            {t("title")}
          </h1>
          <p className="text-body-lg text-brand-secondary max-w-2xl mx-auto text-pretty">{t("subtitle")}</p>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid gap-12 lg:gap-16 items-center">
            {/* Mission with illustration */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid lg:grid-cols-[auto_1fr] gap-6 lg:gap-10 items-start">
              <div className="relative">
                <div className="h-20 w-20 rounded-3xl purple-gradient flex items-center justify-center shrink-0 shadow-purple relative">
                  <Target className="h-9 w-9 text-white" />
                </div>
                {/* Decorative blob */}
                <div className="absolute -inset-3 rounded-3xl bg-brand-lavender/40 blur-md -z-10" />
              </div>
              <div>
                <h2 className="text-h1 mb-4 text-brand-plum">{t("missionTitle")}</h2>
                <p className="text-body-lg text-brand-secondary leading-relaxed">{t("missionBody")}</p>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="grid lg:grid-cols-[auto_1fr] gap-6 lg:gap-10 items-start">
              <div className="relative">
                <div className="h-20 w-20 rounded-3xl purple-gradient flex items-center justify-center shrink-0 shadow-purple relative">
                  <Eye className="h-9 w-9 text-white" />
                </div>
                <div className="absolute -inset-3 rounded-3xl bg-brand-lavender/40 blur-md -z-10" />
              </div>
              <div>
                <h2 className="text-h1 mb-4 text-brand-plum">{t("visionTitle")}</h2>
                <p className="text-body-lg text-brand-secondary leading-relaxed">{t("visionBody")}</p>
              </div>
            </motion.div>

            {/* Values */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="grid lg:grid-cols-[auto_1fr] gap-6 lg:gap-10 items-start">
              <div className="relative">
                <div className="h-20 w-20 rounded-3xl purple-gradient flex items-center justify-center shrink-0 shadow-purple relative">
                  <Heart className="h-9 w-9 text-white" />
                </div>
                <div className="absolute -inset-3 rounded-3xl bg-brand-lavender/40 blur-md -z-10" />
              </div>
              <div>
                <h2 className="text-h1 mb-4 text-brand-plum">{t("valuesTitle")}</h2>
                <p className="text-body-lg text-brand-secondary leading-relaxed">{t("valuesBody")}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-brand bg-brand-cream relative">
        <div className="absolute inset-0 pattern-dots opacity-25" />
        <div className="container mx-auto px-4 relative">
          <h2 className="text-h2 font-display font-semibold text-center mb-10 text-brand-plum">{t("statsTitle")}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl purple-gradient mb-3 shadow-purple">
                  <s.Icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-h1 text-purple-gradient">{s.value}</p>
                <p className="text-body-sm text-brand-secondary mt-1 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
