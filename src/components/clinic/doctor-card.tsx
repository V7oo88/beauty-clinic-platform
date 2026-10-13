"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ArrowLeft, Star, Award } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <Card className="group overflow-hidden border-border/60 hover:shadow-luxury transition-all duration-300 hover:-translate-y-1 bg-card">
      <Link href={`/${locale}/doctors/${doctor.id}`} className="block">
        <div className="aspect-[4/5] overflow-hidden bg-secondary/40">
          <img
            src={doctor.image}
            alt={locale === "ar" ? doctor.name : doctor.nameEn}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-display text-lg font-semibold tracking-tight">
                {locale === "ar" ? doctor.name : doctor.nameEn}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {locale === "ar" ? doctor.title : doctor.titleEn}
              </p>
            </div>
            {doctor.experienceYears >= 12 && (
              <Award className="h-5 w-5 text-accent shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-3 mt-3 text-xs">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              <span className="font-semibold">{doctor.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({doctor.reviewCount} {t("reviews")})</span>
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
            {locale === "ar" ? doctor.specialty : doctor.specialtyEn}
            <span>· {doctor.experienceYears} {locale === "ar" ? "سنة خبرة" : "yrs"}</span>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full rounded-full gap-2 bg-primary hover:bg-primary/90">
          <Link href={`/${locale}/booking?doctor=${doctor.id}`}>
            {t("bookNow")}
            <Arrow className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
