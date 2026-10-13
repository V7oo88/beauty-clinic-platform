"use client";

import { useTranslations } from "next-intl";

export function LegalContent({ type }: { type: "privacy" | "terms" }) {
  const t = useTranslations(type === "privacy" ? "Privacy" : "Terms");
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1 className="font-display text-3xl lg:text-4xl font-semibold mb-6 tracking-tight">{t("title")}</h1>
      <p className="text-muted-foreground leading-relaxed">{t("body")}</p>
    </div>
  );
}
