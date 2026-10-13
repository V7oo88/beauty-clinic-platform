"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Sparkles, Phone, Mail, MapPin, Instagram, Twitter, Facebook, MessageCircle } from "lucide-react";

type Settings = Record<string, string>;

export function Footer({ settings }: { settings?: Partial<Settings> }) {
  const tFooter = useTranslations("Footer");
  const tNav = useTranslations("Nav");
  const locale = useLocale();

  const s = settings;
  const phone = s?.["clinic.phone"] ?? "+966 11 200 0000";
  const email = s?.["clinic.email"] ?? "info@clinic.com";
  const address = locale === "ar" ? (s?.["clinic.address"] ?? tFooter("addressValue")) : (s?.["clinic.addressEn"] ?? "Riyadh, Al Olaya, King Fahd Road");
  const instagram = s?.["clinic.instagram"] ?? "#";
  const twitter = s?.["clinic.twitter"] ?? "#";
  const facebook = s?.["clinic.facebook"] ?? "#";
  const whatsapp = s?.["clinic.whatsapp"] ?? "+9665600000000";

  return (
    <footer className="mt-auto bg-secondary/60 border-t border-border">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-background" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl font-semibold">
                  {locale === "ar" ? "جمال" : "Beauty"}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  {locale === "ar" ? "عيادة التجميل" : "Aesthetic Clinic"}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {tFooter("about")}
            </p>
            <div className="flex items-center gap-2">
              <a href={instagram} aria-label="Instagram" className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent/30 transition">
                <Instagram className="h-4 w-4" />
              </a>
              <a href={twitter} aria-label="Twitter" className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent/30 transition">
                <Twitter className="h-4 w-4" />
              </a>
              <a href={facebook} aria-label="Facebook" className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent/30 transition">
                <Facebook className="h-4 w-4" />
              </a>
              <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`} aria-label="WhatsApp" className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent/30 transition">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4">{tFooter("quickLinks")}</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: tNav("home") },
                { href: "/about", label: tNav("about") },
                { href: "/contact", label: tNav("contact") },
                { href: "/booking", label: tFooter("booking") },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={`/${locale}${l.href === "/" ? "" : l.href}`} className="text-muted-foreground hover:text-accent-foreground hover:text-accent transition">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services + Doctors */}
          <div>
            <h3 className="font-semibold text-sm mb-4">{tFooter("ourServices")}</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/services/laser", labelAr: "الليزر", labelEn: "Laser" },
                { href: "/services/botox", labelAr: "البوتوكس", labelEn: "Botox" },
                { href: "/services/fillers", labelAr: "الفيلر", labelEn: "Fillers" },
                { href: "/services/rhinoplasty", labelAr: "تجميل الأنف", labelEn: "Rhinoplasty" },
                { href: "/doctors", labelAr: "أطباؤنا", labelEn: "Our Doctors" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={`/${locale}${l.href}`} className="text-muted-foreground hover:text-accent transition">
                    {locale === "ar" ? l.labelAr : l.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm mb-4">{tFooter("contact")}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 text-accent shrink-0" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent" />
                <a href={`tel:${phone}`} className="hover:text-accent transition">{phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent" />
                <a href={`mailto:${email}`} className="hover:text-accent transition">{email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>{tFooter("rights")}</p>
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/privacy`} className="hover:text-accent transition">{tFooter("privacy")}</Link>
            <Link href={`/${locale}/terms`} className="hover:text-accent transition">{tFooter("terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
