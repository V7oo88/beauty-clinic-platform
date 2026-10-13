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
    <section id="doctors" className="py-20 lg:py-28 bg-brand-cream relative">
      {/* Decorative pattern */}
      <div className="absolute inset-0 pattern-dots opacity-25" />

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col items-center text-center mb-14">
          <span className="text-overline text-brand-purple font-semibold mb-4">
            {locale === "ar" ? "فريقنا" : "Our Team"}
          </span>
          <h2 className="text-h1 max-w-3xl text-balance text-brand-plum">
            {t("doctorsTitle")}
          </h2>
          <p className="text-body-lg text-brand-secondary mt-4 max-w-2xl text-pretty">{t("doctorsSubtitle")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {doctors.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <DoctorCard doctor={d} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="rounded-full gap-2 h-12 px-7 text-body border-brand-border bg-white hover:bg-brand-lavender/40">
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
