"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { ChevronRight, ChevronLeft, Home } from "lucide-react";

type Item = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Item[] }) {
  const locale = useLocale();
  const Arrow = locale === "ar" ? ChevronLeft : ChevronRight;

  return (
    <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Link href={`/${locale}`} className="hover:text-accent flex items-center gap-1">
        <Home className="h-3 w-3" />
        {locale === "ar" ? "الرئيسية" : "Home"}
      </Link>
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <Arrow className="h-3 w-3" />
          {it.href ? (
            <Link href={it.href} className="hover:text-accent">{it.label}</Link>
          ) : (
            <span className="text-foreground font-medium">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
