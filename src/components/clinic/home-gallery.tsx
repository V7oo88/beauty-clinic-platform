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
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-14">
          <span className="text-overline text-brand-purple font-semibold mb-4">
            {locale === "ar" ? "نتائج" : "Results"}
          </span>
          <h2 className="text-h1 max-w-3xl text-balance text-brand-plum">
            {t("galleryTitle")}
          </h2>
          <p className="text-body-lg text-brand-secondary mt-4 max-w-2xl text-pretty">{t("gallerySubtitle")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {items.map((it, i) => (
            <motion.div
              key={it.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group rounded-3xl overflow-hidden border border-brand bg-white shadow-soft hover:shadow-luxury transition-all"
            >
              <div className="grid grid-cols-2 gap-1 bg-brand-plum/10">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    src={it.beforeImage}
                    alt={
                      locale === "ar"
                        ? `${it.title} — حالة قبل العلاج`
                        : `${it.titleEn} — before treatment`
                    }
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute top-3 start-3 px-3 py-1.5 text-caption font-bold uppercase tracking-widest bg-white/90 backdrop-blur-sm rounded-full border border-brand-border text-brand-secondary">
                    {locale === "ar" ? "قبل" : "Before"}
                  </span>
                </div>
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    src={it.afterImage}
                    alt={
                      locale === "ar"
                        ? `${it.title} — النتيجة بعد العلاج`
                        : `${it.titleEn} — after treatment`
                    }
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute top-3 start-3 px-3 py-1.5 text-caption font-bold uppercase tracking-widest bg-brand-purple text-white rounded-full shadow-purple">
                    {locale === "ar" ? "بعد" : "After"}
                  </span>
                </div>
              </div>
              <div className="p-5 text-center">
                <p className="text-h4 font-display font-semibold text-brand-plum">{locale === "ar" ? it.title : it.titleEn}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-10">
          <Alert className="bg-brand-lavender/40 border-brand-border rounded-2xl">
            <Info className="h-5 w-5 text-brand-purple" />
            <AlertDescription className="text-body-sm text-brand-secondary">
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
