"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Clock, Tag, Calendar, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DoctorCard } from "./doctor-card";

type Service = {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  shortDesc: string;
  shortDescEn: string;
  fullDesc: string;
  fullDescEn: string;
  image: string;
  durationMin: number;
  price: number;
  category?: string | null;
  faqs?: { id: string; question: string; answer: string; questionEn?: string | null; answerEn?: string | null }[];
};

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

export function ServiceDetailClient({ service, doctors }: { service: Service; doctors: Doctor[] }) {
  const locale = useLocale();
  const t = useTranslations("Services");
  const tBooking = useTranslations("Booking");

  return (
    <section className="py-10 lg:py-14">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="grid gap-8 lg:grid-cols-2 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-luxury"
          >
            <img src={service.image} alt={locale === "ar" ? service.name : service.nameEn} className="h-full w-full object-cover" />
            {service.category && (
              <span className="absolute top-4 start-4 text-[10px] uppercase tracking-widest bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
                {service.category}
              </span>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-5"
          >
            <div>
              <h1 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight">
                {locale === "ar" ? service.name : service.nameEn}
              </h1>
              <p className="text-muted-foreground mt-3 leading-relaxed">
                {locale === "ar" ? service.shortDesc : service.shortDescEn}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border p-4 bg-card">
                <Clock className="h-5 w-5 text-accent mb-1" />
                <p className="text-xs text-muted-foreground">{t("duration")}</p>
                <p className="font-semibold">{service.durationMin} {t("minutes")}</p>
              </div>
              <div className="rounded-2xl border border-border p-4 bg-card">
                <Tag className="h-5 w-5 text-accent mb-1" />
                <p className="text-xs text-muted-foreground">{t("price")}</p>
                <p className="font-semibold text-gold-gradient">
                  {new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US").format(service.price)} {locale === "ar" ? "ر.س" : "SAR"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border p-5 bg-card">
              <p className="text-sm leading-relaxed">
                {locale === "ar" ? service.fullDesc : service.fullDescEn}
              </p>
            </div>

            <Button asChild size="lg" className="rounded-full gap-2 bg-primary hover:bg-primary/90 px-7">
              <Link href={`/${locale}/booking?service=${service.slug}`}>
                <Calendar className="h-4 w-4" />
                {t("bookNow")}
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Doctors */}
        {doctors.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl lg:text-3xl font-semibold mb-6 text-center">
              {t("doctorsForService")}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {doctors.map((d) => (
                <DoctorCard key={d.id} doctor={d} />
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        {service.faqs && service.faqs.length > 0 && (
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="font-display text-2xl lg:text-3xl font-semibold mb-6 text-center">
              {t("faqTitle")}
            </h2>
            <Accordion type="single" className="w-full">
              {service.faqs.map((f) => (
                <AccordionItem key={f.id} value={f.id} className="border-border">
                  <AccordionTrigger className="font-medium text-start">
                    {locale === "ar" ? f.question : (f.questionEn ?? f.question)}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {locale === "ar" ? f.answer : (f.answerEn ?? f.answer)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </section>
  );
}
