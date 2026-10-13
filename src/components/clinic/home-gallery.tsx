"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

type GalleryItem = {
  id: string;
  title: string;
  titleEn: string;
  beforeImage: string;
  afterImage: string;
  description?: string | null;
  descriptionEn?: string | null;
};

export function HomeGallery({ items }: { items: GalleryItem[] }) {
  const t = useTranslations("Home");
  const locale = useLocale();

  return (
    <section className="py-16 lg:py-24 bg-secondary/40">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">
            {locale === "ar" ? "نتائج" : "Results"}
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight text-balance max-w-2xl">
            {t("galleryTitle")}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl text-balance">{t("gallerySubtitle")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <motion.div
              key={it.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl overflow-hidden border border-border/60 bg-card shadow-soft"
            >
              <div className="grid grid-cols-2 gap-1">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img src={it.beforeImage} alt={`Before - ${it.title}`} className="h-full w-full object-cover" loading="lazy" />
                  <span className="absolute top-2 start-2 px-2 py-1 text-[10px] uppercase tracking-widest bg-background/80 backdrop-blur-sm rounded-full">
                    {locale === "ar" ? "قبل" : "Before"}
                  </span>
                </div>
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img src={it.afterImage} alt={`After - ${it.title}`} className="h-full w-full object-cover" loading="lazy" />
                  <span className="absolute top-2 start-2 px-2 py-1 text-[10px] uppercase tracking-widest bg-accent text-accent-foreground rounded-full">
                    {locale === "ar" ? "بعد" : "After"}
                  </span>
                </div>
              </div>
              <div className="p-4 text-center">
                <p className="font-display text-sm font-semibold">{locale === "ar" ? it.title : it.titleEn}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-8">
          <Alert className="bg-accent/10 border-accent/30 rounded-xl">
            <Info className="h-4 w-4 text-accent" />
            <AlertDescription className="text-xs text-muted-foreground">
              {locale === "ar"
                ? "هذه صور تجريبية لأغراض العرض فقط ولا تمثّل حالات حقيقية."
                : "These are sample images for demonstration only and do not represent real cases."}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </section>
  );
}
