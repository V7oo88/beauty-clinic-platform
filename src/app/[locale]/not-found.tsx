import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const t = useTranslations("NotFound");
  const locale = useLocale();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
      <p className="font-display text-7xl font-bold text-gold-gradient">404</p>
      <h1 className="font-display text-2xl font-semibold">{t("title")}</h1>
      <p className="text-muted-foreground text-center max-w-sm">{t("desc")}</p>
      <Button asChild className="rounded-full gap-2 bg-primary hover:bg-primary/90">
        <Link href={`/${locale}`}>{t("home")}</Link>
      </Button>
    </div>
  );
}
