"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { DoctorCard } from "./doctor-card";
import { Button } from "@/components/ui/button";

type Doctor = {
  id: string;
  name: string;
  nameEn: string;
  title: string;
  titleEn: string;
  specialty: string;
  specialtyEn: string;
  image: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
};

export function HomeDoctors({ doctors }: { doctors: Doctor[] }) {
  const t = useTranslations("Home");
  const locale = useLocale();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <section id="doctors" className="py-16 lg:py-24 bg-secondary/40">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">
            {locale === "ar" ? "فريقنا" : "Our Team"}
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight text-balance max-w-2xl">
            {t("doctorsTitle")}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl text-balance">{t("doctorsSubtitle")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <DoctorCard doctor={d} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button asChild variant="outline" size="lg" className="rounded-full gap-2">
            <Link href={`/${locale}/doctors`}>
              {t("viewAll")}
              <Arrow className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
