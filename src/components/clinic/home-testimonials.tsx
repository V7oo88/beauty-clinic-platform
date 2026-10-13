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
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">
            {locale === "ar" ? "آراء" : "Testimonials"}
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight text-balance max-w-2xl">
            {t("testimonialsTitle")}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl text-balance">{t("testimonialsSubtitle")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((ts, i) => (
            <motion.div
              key={ts.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="h-full border-border/60 bg-card p-6 relative">
                <Quote className="absolute top-4 end-4 h-6 w-6 text-accent/30" />
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: ts.rating }).map((_, idx) => (
                      <Star key={idx} className="h-3.5 w-3.5 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic">
                    &ldquo;{locale === "ar" ? ts.comment : ts.commentEn ?? ts.comment}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-accent/20">
                      {ts.avatar && <img src={ts.avatar} alt={ts.nameEn} className="h-full w-full object-cover" />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{locale === "ar" ? ts.name : ts.nameEn}</p>
                      <p className="text-[11px] text-muted-foreground">{locale === "ar" ? ts.role : ts.roleEn ?? ts.role}</p>
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
