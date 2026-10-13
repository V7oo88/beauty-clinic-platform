"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { ServiceCard } from "./service-card";
import { Button } from "@/components/ui/button";

type Service = {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  shortDesc: string;
  shortDescEn: string;
  image: string;
  durationMin: number;
  price: number;
  category?: string | null;
};

export function HomeServices({ services }: { services: Service[] }) {
  const t = useTranslations("Home");
  const locale = useLocale();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <section id="services" className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">
            {locale === "ar" ? "خدماتنا" : "Our Services"}
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight text-balance max-w-2xl">
            {t("servicesTitle")}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl text-balance">{t("servicesSubtitle")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <ServiceCard service={s} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button asChild variant="outline" size="lg" className="rounded-full gap-2">
            <Link href={`/${locale}/services`}>
              {t("viewAll")}
              <Arrow className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
