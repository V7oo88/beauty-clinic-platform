"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type T = {
  id: string;
  name: string;
  nameEn: string;
  role?: string | null;
  roleEn?: string | null;
  avatar?: string | null;
  rating: number;
  comment: string;
  commentEn?: string | null;
};

export function HomeTestimonials({ testimonials }: { testimonials: T[] }) {
  const t = useTranslations("Home");
  const locale = useLocale();

  return (
    <section className="py-20 lg:py-28 bg-brand-cream relative">
      <div className="absolute inset-0 pattern-dots opacity-25" />
      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col items-center text-center mb-14">
          <span className="text-overline text-brand-purple font-semibold mb-4">
            {locale === "ar" ? "آراء" : "Testimonials"}
          </span>
          <h2 className="text-h1 max-w-3xl text-balance text-brand-plum">
            {t("testimonialsTitle")}
          </h2>
          <p className="text-body-lg text-brand-secondary mt-4 max-w-2xl text-pretty">{t("testimonialsSubtitle")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {testimonials.map((ts, i) => (
            <motion.div
              key={ts.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="h-full border-brand bg-white p-7 relative hover:shadow-luxury transition-all rounded-2xl">
                <Quote className="absolute top-5 end-5 h-10 w-10 text-brand-lavender" />
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: ts.rating }).map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 fill-brand-purple text-brand-purple" />
                    ))}
                  </div>
                  <p className="text-body text-brand-secondary leading-relaxed flex-1 italic">
                    &ldquo;{locale === "ar" ? ts.comment : ts.commentEn ?? ts.comment}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-brand-border">
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-brand-lavender border-2 border-brand-border shrink-0 flex items-center justify-center">
                      {ts.avatar ? (
                        <img
                          src={ts.avatar}
                          alt={
                            locale === "ar"
                              ? `صورة ${ts.name}، ${ts.role ?? "عميلة عيادة التجميل"}`
                              : `Photo of ${ts.nameEn}, ${ts.roleEn ?? "clinic client"}`
                          }
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-body font-semibold text-brand-purple">
                          {ts.nameEn.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-h4 font-display font-semibold text-brand-plum">{locale === "ar" ? ts.name : ts.nameEn}</p>
                      <p className="text-caption text-brand-secondary mt-0.5">{locale === "ar" ? ts.role : ts.roleEn ?? ts.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
