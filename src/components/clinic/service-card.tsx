"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ArrowLeft, Clock, Tag } from "lucide-react";
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
    <Card className="group overflow-hidden border-brand bg-white hover:shadow-luxury transition-all duration-300 hover:-translate-y-1.5 rounded-2xl">
      <Link href={`/${locale}/services/${service.slug}`} className="block">
        <div className="aspect-[4/3] overflow-hidden bg-brand-beige/40 relative">
          <img
            src={service.image}
            alt={
              locale === "ar"
                ? `صورة توضّح إجراء ${service.name} — ${service.shortDesc}`
                : `Image depicting ${service.nameEn} procedure — ${service.shortDescEn}`
            }
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/${service.slug}/1200/800`;
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-plum/20 via-transparent to-transparent" />
          {service.category && (
            <span className="absolute top-3 start-3 text-caption font-semibold text-brand-purple bg-white/85 backdrop-blur-sm px-3 py-1 rounded-full border border-brand-border">
              {service.category}
            </span>
          )}
        </div>
        <CardContent className="p-6">
          <h3 className="text-h3 font-display font-semibold tracking-tight text-brand-plum mb-2">
            {locale === "ar" ? service.name : service.nameEn}
          </h3>
          <p className="text-body text-brand-secondary line-clamp-2 leading-relaxed">
            {locale === "ar" ? service.shortDesc : service.shortDescEn}
          </p>
          <div className="flex items-center justify-between mt-5 pt-5 border-t border-brand-border">
            <div className="flex items-center gap-2 text-caption text-brand-secondary">
              <Clock className="h-4 w-4 text-brand-purple" />
              <span className="font-medium">{service.durationMin} {t("minutes")}</span>
            </div>
            <div className="text-end">
              <span className="block text-overline text-brand-secondary">{t("from")}</span>
              <span className="text-h3 font-display font-bold text-purple-gradient">
                {new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", { maximumFractionDigits: 0 }).format(service.price)} {locale === "ar" ? "ر.س" : "SAR"}
              </span>
            </div>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full rounded-full gap-2 bg-brand-purple hover:bg-brand-purple/90 text-white h-11 text-body font-medium shadow-purple">
          <Link href={`/${locale}/booking?service=${service.slug}`}>
            {tHome("bookNow")}
            <Arrow className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
