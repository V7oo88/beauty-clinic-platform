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
    <footer className="mt-auto bg-brand-plum text-white">
      <div className="container mx-auto px-4 py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-5 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl purple-gradient flex items-center justify-center shadow-purple">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-h3 font-display font-bold text-white">
                  {locale === "ar" ? "جمال" : "Beauty"}
                </span>
                <span className="text-overline text-brand-lavender/80">
                  {locale === "ar" ? "عيادة التجميل" : "Aesthetic Clinic"}
                </span>
              </div>
            </div>
            <p className="text-body-sm text-white/70 leading-relaxed max-w-xs">
              {tFooter("about")}
            </p>
            <div className="flex items-center gap-2.5">
              <a href={instagram} aria-label="Instagram" className="h-10 w-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-brand-lavender hover:text-brand-plum transition">
                <Instagram className="h-4 w-4" />
              </a>
              <a href={twitter} aria-label="Twitter" className="h-10 w-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-brand-lavender hover:text-brand-plum transition">
                <Twitter className="h-4 w-4" />
              </a>
              <a href={facebook} aria-label="Facebook" className="h-10 w-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-brand-lavender hover:text-brand-plum transition">
                <Facebook className="h-4 w-4" />
              </a>
              <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`} aria-label="WhatsApp" className="h-10 w-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-brand-lavender hover:text-brand-plum transition">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-h4 font-display font-semibold mb-5 text-white">{tFooter("quickLinks")}</h3>
            <ul className="space-y-3 text-body-sm">
              {[
                { href: "/", label: tNav("home") },
                { href: "/about", label: tNav("about") },
                { href: "/contact", label: tNav("contact") },
                { href: "/booking", label: tFooter("booking") },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={`/${locale}${l.href === "/" ? "" : l.href}`} className="text-white/70 hover:text-brand-lavender transition">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services + Doctors */}
          <div>
            <h3 className="text-h4 font-display font-semibold mb-5 text-white">{tFooter("ourServices")}</h3>
            <ul className="space-y-3 text-body-sm">
              {[
                { href: "/services/laser", labelAr: "الليزر", labelEn: "Laser" },
                { href: "/services/botox", labelAr: "البوتوكس", labelEn: "Botox" },
                { href: "/services/fillers", labelAr: "الفيلر", labelEn: "Fillers" },
                { href: "/services/rhinoplasty", labelAr: "تجميل الأنف", labelEn: "Rhinoplasty" },
                { href: "/doctors", labelAr: "أطباؤنا", labelEn: "Our Doctors" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={`/${locale}${l.href}`} className="text-white/70 hover:text-brand-lavender transition">
                    {locale === "ar" ? l.labelAr : l.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-h4 font-display font-semibold mb-5 text-white">{tFooter("contact")}</h3>
            <ul className="space-y-4 text-body-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 text-brand-lavender shrink-0" />
                <span className="leading-relaxed">{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-brand-lavender shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-brand-lavender transition">{phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-brand-lavender shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-brand-lavender transition">{email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-caption text-white/60">
          <p>{tFooter("rights")}</p>
          <div className="flex items-center gap-5">
            <Link href={`/${locale}/privacy`} className="hover:text-brand-lavender transition">{tFooter("privacy")}</Link>
            <Link href={`/${locale}/terms`} className="hover:text-brand-lavender transition">{tFooter("terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
