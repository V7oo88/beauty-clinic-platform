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
    <section id="services" className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-14">
          <span className="text-overline text-brand-purple font-semibold mb-4">
            {locale === "ar" ? "خدماتنا" : "Our Services"}
          </span>
          <h2 className="text-h1 max-w-3xl text-balance text-brand-plum">
            {t("servicesTitle")}
          </h2>
          <p className="text-body-lg text-brand-secondary mt-4 max-w-2xl text-pretty">{t("servicesSubtitle")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <ServiceCard service={s} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="rounded-full gap-2 h-12 px-7 text-body border-brand-border hover:bg-brand-lavender/40">
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
