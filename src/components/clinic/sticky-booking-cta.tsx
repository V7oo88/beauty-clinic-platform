"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StickyBookingCta() {
  const locale = useLocale();
  const t = useTranslations("Home");

  return (
    <div className="lg:hidden fixed bottom-4 inset-x-4 z-40">
      <Button asChild className="w-full rounded-full gap-2 shadow-luxury h-12 bg-primary text-primary-foreground">
        <Link href={`/${locale}/booking`}>
          <Calendar className="h-4 w-4" />
          {t("ctaBtn")}
        </Link>
      </Button>
    </div>
  );
}
