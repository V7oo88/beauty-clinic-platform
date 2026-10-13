"use client";

import { useSession, signOut } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Menu,
  X,
  User,
  Calendar,
  LayoutDashboard,
  Shield,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LanguageSwitcher } from "./language-switcher";
import { cn } from "@/lib/utils";

export function Header() {
  const tNav = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    const full = `/${locale}${href === "/" ? "" : href}`;
    if (href === "/") {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(full);
  };

  const links: { href: string; label: string }[] = [
    { href: "/", label: tNav("home") },
    { href: "/services", label: tNav("services") },
    { href: "/doctors", label: tNav("doctors") },
    { href: "/about", label: tNav("about") },
    { href: "/contact", label: tNav("contact") },
  ];

  const isAdmin = session?.user?.role === "ADMIN";
  const isDoctor = session?.user?.role === "DOCTOR";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all",
        scrolled ? "glass shadow-soft border-b border-border" : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 lg:h-20 items-center justify-between gap-4 px-4">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-accent/30 blur-md group-hover:bg-accent/50 transition" />
            <div className="relative h-9 w-9 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-background" />
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold tracking-tight">
              {locale === "ar" ? "جمال" : "Beauty"}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
              {locale === "ar" ? "عيادة التجميل" : "Aesthetic Clinic"}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={`/${locale}${l.href === "/" ? "" : l.href}`}
              className={cn(
                "px-3 py-2 rounded-full text-sm font-medium transition-all hover:bg-accent/20",
                isActive(l.href) ? "text-accent-foreground bg-accent/30" : "text-foreground/80"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {status === "loading" ? null : !session ? (
            <div className="hidden sm:flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="rounded-full">
                <Link href={`/${locale}/login`}>{tNav("login")}</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full bg-primary hover:bg-primary/90">
                <Link href={`/${locale}/booking`}>{tNav("booking")}</Link>
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              {isAdmin && (
                <Button asChild variant="ghost" size="sm" className="rounded-full gap-1">
                  <Link href={`/${locale}/admin`}>
                    <Shield className="h-3.5 w-3.5" /> {tNav("admin")}
                  </Link>
                </Button>
              )}
              <Button asChild variant="ghost" size="sm" className="rounded-full gap-1">
                <Link href={`/${locale}/dashboard`}>
                  <User className="h-3.5 w-3.5" /> {tNav("dashboard")}
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full gap-1"
                onClick={() => signOut({ callbackUrl: `/${locale}` })}
              >
                <LogOut className="h-3.5 w-3.5" /> {tNav("logout")}
              </Button>
            </div>
          )}

          {/* Mobile burger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-full">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side={locale === "ar" ? "right" : "left"} className="w-[300px] sm:w-[360px] p-0">
              <SheetHeader className="border-b border-border p-4 flex flex-row items-center justify-between">
                <SheetTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  {locale === "ar" ? "عيادة الجمال" : "Beauty Clinic"}
                </SheetTitle>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </SheetHeader>
              <div className="flex flex-col gap-1 p-4">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={`/${locale}${l.href === "/" ? "" : l.href}`}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-medium hover:bg-accent/20 transition",
                      isActive(l.href) && "bg-accent/30 text-accent-foreground"
                    )}
                  >
                    {l.label}
                  </Link>
                ))}

                <div className="my-2 h-px bg-border" />

                {!session ? (
                  <>
                    <Link
                      href={`/${locale}/login`}
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 rounded-xl text-sm font-medium hover:bg-accent/20 transition flex items-center gap-2"
                    >
                      <User className="h-4 w-4" /> {tNav("login")}
                    </Link>
                    <Link
                      href={`/${locale}/booking`}
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4" /> {tNav("booking")}
                    </Link>
                  </>
                ) : (
                  <>
                    {isAdmin && (
                      <Link
                        href={`/${locale}/admin`}
                        onClick={() => setOpen(false)}
                        className="px-4 py-3 rounded-xl text-sm font-medium hover:bg-accent/20 transition flex items-center gap-2"
                      >
                        <Shield className="h-4 w-4" /> {tNav("admin")}
                      </Link>
                    )}
                    <Link
                      href={`/${locale}/dashboard`}
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 rounded-xl text-sm font-medium hover:bg-accent/20 transition flex items-center gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4" /> {tNav("dashboard")}
                    </Link>
                    <button
                      onClick={() => {
                        setOpen(false);
                        signOut({ callbackUrl: `/${locale}` });
                      }}
                      className="px-4 py-3 rounded-xl text-sm font-medium hover:bg-accent/20 transition flex items-center gap-2 text-start"
                    >
                      <LogOut className="h-4 w-4" /> {tNav("logout")}
                    </button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
