"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Users, Stethoscope, Sparkles, Clock } from "lucide-react";

export function HomeStats() {
  const t = useTranslations("Home");
  const locale = useLocale();

  const stats = [
    { value: "5000+", label: t("statsClients"), Icon: Users, gradient: "from-brand-purple to-brand-purple-soft" },
    { value: "10+", label: t("statsDoctors"), Icon: Stethoscope, gradient: "from-brand-purple-soft to-brand-purple" },
    { value: "7+", label: t("statsServices"), Icon: Sparkles, gradient: "from-brand-purple to-brand-purple-soft" },
    { value: "8+", label: t("statsYears"), Icon: Clock, gradient: "from-brand-purple-soft to-brand-purple" },
  ];

  return (
    <section className="relative border-y border-brand bg-brand-cream">
      {/* Subtle decorative pattern */}
      <div className="absolute inset-0 pattern-dots opacity-30" />

      <div className="container mx-auto px-4 py-16 lg:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className={`inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br ${s.gradient} mb-4 shadow-purple`}>
                <s.Icon className="h-6 w-6 text-white" />
              </div>
              <p className="text-display text-purple-gradient mb-2">
                {s.value}
              </p>
              <p className="text-body text-brand-secondary font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
