"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Users, Stethoscope, Sparkles, Clock } from "lucide-react";

export function HomeStats() {
  const t = useTranslations("Home");
  const locale = useLocale();

  const stats = [
    { value: "5000+", label: t("statsClients"), Icon: Users },
    { value: "10+", label: t("statsDoctors"), Icon: Stethoscope },
    { value: "7+", label: t("statsServices"), Icon: Sparkles },
    { value: "8+", label: t("statsYears"), Icon: Clock },
  ];

  return (
    <section className="border-y border-border bg-secondary/40">
      <div className="container mx-auto px-4 py-12">
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
              <p className="font-display text-3xl lg:text-4xl font-semibold text-gold-gradient">
                {s.value}
              </p>
              <p className="text-xs lg:text-sm text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
