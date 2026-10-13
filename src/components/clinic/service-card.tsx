"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ArrowLeft, Clock } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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

export function ServiceCard({ service }: { service: Service }) {
  const locale = useLocale();
  const t = useTranslations("Services");
  const tHome = useTranslations("Home");
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <Card className="group overflow-hidden border-border/60 hover:shadow-luxury transition-all duration-300 hover:-translate-y-1 bg-card">
      <Link href={`/${locale}/services/${service.slug}`} className="block">
        <div className="aspect-[4/3] overflow-hidden bg-secondary/40">
          <img
            src={service.image}
            alt={locale === "ar" ? service.name : service.nameEn}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-lg font-semibold tracking-tight">
              {locale === "ar" ? service.name : service.nameEn}
            </h3>
            {service.category && (
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground bg-accent/15 px-2 py-0.5 rounded-full">
                {service.category}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {locale === "ar" ? service.shortDesc : service.shortDescEn}
          </p>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{service.durationMin} {t("minutes")}</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-muted-foreground">{t("from")}</span>
              <span className="font-display text-lg font-semibold text-gold-gradient">
                {new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", { maximumFractionDigits: 0 }).format(service.price)} {t("minutes") === "دقيقة" ? "ر.س" : "SAR"}
              </span>
            </div>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full rounded-full gap-2 bg-primary hover:bg-primary/90">
          <Link href={`/${locale}/booking?service=${service.slug}`}>
            {tHome("bookNow")}
            <Arrow className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
