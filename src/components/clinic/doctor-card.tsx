"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ArrowLeft, Star, Award } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const locale = useLocale();
  const t = useTranslations("Doctors");
  const tHome = useTranslations("Home");
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <Card className="group overflow-hidden border-brand bg-white hover:shadow-luxury transition-all duration-300 hover:-translate-y-1.5 rounded-2xl">
      <Link href={`/${locale}/doctors/${doctor.id}`} className="block">
        <div className="aspect-[4/5] overflow-hidden bg-brand-beige/40 relative">
          <img
            src={doctor.image}
            alt={
              locale === "ar"
                ? `صورة ${doctor.name} — ${doctor.title}، ${doctor.specialty}`
                : `Photo of ${doctor.nameEn} — ${doctor.titleEn}, ${doctor.specialtyEn}`
            }
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/doc-${doctor.id}/600/750`;
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-plum/40 via-transparent to-transparent" />

          {/* Rating badge */}
          <div className="absolute top-3 end-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-brand-border shadow-soft">
            <Star className="h-3.5 w-3.5 fill-brand-purple text-brand-purple" />
            <span className="text-caption font-bold text-brand-plum">{doctor.rating.toFixed(1)}</span>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="text-h3 font-display font-semibold tracking-tight text-brand-plum">
                {locale === "ar" ? doctor.name : doctor.nameEn}
              </h3>
              <p className="text-body-sm text-brand-purple font-medium mt-1">
                {locale === "ar" ? doctor.title : doctor.titleEn}
              </p>
            </div>
            {doctor.experienceYears >= 12 && (
              <div className="h-9 w-9 rounded-xl bg-brand-lavender flex items-center justify-center shrink-0">
                <Award className="h-5 w-5 text-brand-purple" />
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center gap-2 text-caption text-brand-secondary">
            <span className="inline-block w-2 h-2 rounded-full bg-brand-purple" />
            <span className="font-medium">{locale === "ar" ? doctor.specialty : doctor.specialtyEn}</span>
            <span className="text-brand-border">·</span>
            <span>{doctor.experienceYears} {locale === "ar" ? "سنة خبرة" : "yrs"}</span>
          </div>
          <div className="text-caption text-brand-secondary mt-2">
            <span className="font-bold text-brand-plum">{doctor.reviewCount}</span> {t("reviews")}
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full rounded-full gap-2 bg-brand-purple hover:bg-brand-purple/90 text-white h-11 text-body font-medium shadow-purple">
          <Link href={`/${locale}/booking?doctor=${doctor.id}`}>
            {t("bookNow")}
            <Arrow className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
