"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Search } from "lucide-react";
import { ServiceCard } from "./service-card";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  faqs?: { id: string }[];
};

export function ServicesListClient({ services }: { services: Service[] }) {
  const t = useTranslations("Services");
  const locale = useLocale();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("ALL");

  const categories = useMemo(() => {
    const set = new Set<string>();
    services.forEach((s) => s.category && set.add(s.category));
    return Array.from(set);
  }, [services]);

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const name = (locale === "ar" ? s.name : s.nameEn).toLowerCase();
      const desc = (locale === "ar" ? s.shortDesc : s.shortDescEn).toLowerCase();
      const matchesQ = !q || name.includes(q.toLowerCase()) || desc.includes(q.toLowerCase());
      const matchesC = cat === "ALL" || s.category === cat;
      return matchesQ && matchesC;
    });
  }, [services, q, cat, locale]);

  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">
            {locale === "ar" ? "خدماتنا" : "Our Services"}
          </span>
          <h1 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight text-balance">
            {t("title")}
          </h1>
          <p className="text-muted-foreground mt-3 max-w-xl text-balance">{t("subtitle")}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto mb-8">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("search")}
              className="ps-10 rounded-full bg-card"
            />
          </div>
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="sm:w-48 rounded-full bg-card">
              <SelectValue placeholder={t("filterCategory")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("all")}</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            {locale === "ar" ? "لا توجد نتائج مطابقة." : "No matching results."}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <ServiceCard service={s} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
