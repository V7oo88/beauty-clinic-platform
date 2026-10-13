"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Star, Award, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "./service-card";

type Doctor = {
  id: string;
  name: string;
  nameEn: string;
  title: string;
  titleEn: string;
  specialty: string;
  specialtyEn: string;
  bio: string;
  bioEn: string;
  image: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  services: { service: { id: string; slug: string; name: string; nameEn: string; shortDesc: string; shortDescEn: string; image: string; durationMin: number; price: number; category?: string | null } }[];
  schedules: { id: string; dayOfWeek: number; startTime: string; endTime: string; isWorking: boolean }[];
};

const dayNames = (locale: "ar" | "en", day: number) =>
  locale === "ar"
    ? ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"][day]
    : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][day];

export function DoctorDetailClient({ doctor }: { doctor: Doctor }) {
  const locale = useLocale();
  const t = useTranslations("Doctors");

  const services = doctor.services.map((s) => s.service);

  return (
    <section className="py-10 lg:py-14">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-[400px_1fr] items-start">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="aspect-[4/5] rounded-3xl overflow-hidden shadow-luxury mx-auto lg:mx-0 w-full max-w-sm"
          >
            <img src={doctor.image} alt={doctor.name} className="h-full w-full object-cover" />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            <div>
              <h1 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight">
                {locale === "ar" ? doctor.name : doctor.nameEn}
              </h1>
              <p className="text-accent font-medium mt-1">{locale === "ar" ? doctor.title : doctor.titleEn}</p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-semibold">{doctor.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({doctor.reviewCount} {t("reviews")})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-accent" />
                <span>{doctor.experienceYears} {locale === "ar" ? "سنة خبرة" : "years experience"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-accent" />
                <span>{locale === "ar" ? doctor.specialty : doctor.specialtyEn}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border p-5 bg-card">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {locale === "ar" ? doctor.bio : doctor.bioEn}
              </p>
            </div>

            {/* Schedule */}
            <div className="rounded-2xl border border-border p-5 bg-card">
              <h3 className="font-display text-lg font-semibold mb-4">{t("schedule")}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {doctor.schedules
                  .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                  .map((sch) => (
                    <div key={sch.id} className={`flex items-center justify-between p-2 rounded-lg ${sch.isWorking ? "bg-accent/10" : "bg-muted/30 line-through text-muted-foreground"}`}>
                      <span className="font-medium">{dayNames(locale as "ar" | "en", sch.dayOfWeek)}</span>
                      <span className="text-muted-foreground">
                        {sch.isWorking ? `${sch.startTime} - ${sch.endTime}` : (locale === "ar" ? "إجازة" : "Off")}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <Button asChild size="lg" className="rounded-full gap-2 bg-primary hover:bg-primary/90 px-7 self-start">
              <Link href={`/${locale}/booking?doctor=${doctor.id}`}>
                <Calendar className="h-4 w-4" />
                {t("bookNow")}
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Services */}
        {services.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl lg:text-3xl font-semibold mb-6 text-center">
              {locale === "ar" ? "الخدمات التي يقدّمها" : "Services provided"}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <ServiceCard
                  key={s.id}
                  service={{
                    ...s,
                    shortDesc: s.shortDesc,
                    shortDescEn: s.shortDescEn,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
