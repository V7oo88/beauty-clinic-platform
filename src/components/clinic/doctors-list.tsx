"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Search } from "lucide-react";
import { DoctorCard } from "./doctor-card";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

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
  services?: { service: { id: string; name: string; nameEn: string } }[];
};

export function DoctorsListClient({ doctors }: { doctors: Doctor[] }) {
  const t = useTranslations("Doctors");
  const locale = useLocale();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      const name = (locale === "ar" ? d.name : d.nameEn).toLowerCase();
      const specialty = (locale === "ar" ? d.specialty : d.specialtyEn).toLowerCase();
      return !q || name.includes(q.toLowerCase()) || specialty.includes(q.toLowerCase());
    });
  }, [doctors, q, locale]);

  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">
            {locale === "ar" ? "فريقنا الطبي" : "Our Medical Team"}
          </span>
          <h1 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight text-balance">
            {t("title")}
          </h1>
          <p className="text-muted-foreground mt-3 max-w-xl text-balance">{t("subtitle")}</p>
        </div>

        <div className="relative max-w-xl mx-auto mb-8">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search")}
            className="ps-10 rounded-full bg-card"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">{t("noDoctors")}</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <DoctorCard doctor={d} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
