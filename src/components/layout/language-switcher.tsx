"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("Nav");
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const switchTo = (newLocale: "ar" | "en") => {
    if (newLocale === locale) {
      setOpen(false);
      return;
    }
    // strip leading /ar or /en from pathname and re-add
    const segments = pathname.split("/");
    if (segments.length > 1 && (segments[1] === "ar" || segments[1] === "en")) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const newPath = segments.join("/") || `/${newLocale}`;
    startTransition(() => {
      router.replace(newPath);
      setOpen(false);
    });
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 rounded-full"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("language")}
        disabled={isPending}
      >
        <Languages className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase">{locale}</span>
      </Button>
      {open && (
        <div className="absolute end-0 mt-2 w-32 rounded-xl border border-border bg-card shadow-luxury overflow-hidden z-50">
          {(["ar", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => switchTo(l)}
              className={`flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-accent/50 transition ${
                l === locale ? "bg-accent/30 font-semibold" : ""
              }`}
            >
              {l === "ar" ? "العربية" : "English"}
              {l === locale && <span className="text-xs text-muted-foreground">●</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
