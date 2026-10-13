"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarDays,
  Stethoscope,
  Sparkles,
  Users,
  CreditCard,
  Clock,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";

type User = { id: string; email: string; name?: string | null; role: string };

const navItems = [
  { href: "", key: "dashboard", Icon: LayoutDashboard },
  { href: "/appointments", key: "appointments", Icon: CalendarDays },
  { href: "/doctors", key: "doctors", Icon: Stethoscope },
  { href: "/services", key: "services", Icon: Sparkles },
  { href: "/customers", key: "customers", Icon: Users },
  { href: "/payments", key: "payments", Icon: CreditCard },
  { href: "/schedules", key: "schedules", Icon: Clock },
  { href: "/settings", key: "settings", Icon: Settings },
] as const;

export function AdminShell({ user, children }: { user: User; children: React.ReactNode }) {
  const locale = useLocale();
  const t = useTranslations("Admin");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const base = `/${locale}/admin`;

  const Sidebar = (
    <div className="flex h-full flex-col bg-secondary/40 border-e border-border">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-background" />
        </div>
        <div>
          <p className="font-display text-sm font-semibold">{t("title")}</p>
          <p className="text-[10px] text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <nav className="flex-1 p-2 overflow-y-auto">
        {navItems.map((it) => {
          const href = `${base}${it.href}`;
          const active = it.href === "" ? pathname === base : pathname.startsWith(href);
          return (
            <Link
              key={it.href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium mb-1 transition",
                active ? "bg-primary text-primary-foreground shadow-soft" : "text-foreground/80 hover:bg-accent/15"
              )}
            >
              <it.Icon className="h-4 w-4" />
              {t(it.key)}
            </Link>
          );
        })}
      </nav>
      <div className="p-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start rounded-lg gap-2"
          onClick={() => signOut({ callbackUrl: `/${locale}` })}
        >
          <LogOut className="h-4 w-4" />
          {locale === "ar" ? "تسجيل الخروج" : "Logout"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">{Sidebar}</aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={locale === "ar" ? "right" : "left"} className="p-0 w-72">
              <SheetTitle className="sr-only">{t("title")}</SheetTitle>
              {Sidebar}
            </SheetContent>
          </Sheet>
          <span className="font-display text-sm font-semibold">{t("title")}</span>
          <Button asChild variant="ghost" size="icon" className="rounded-full">
            <Link href={`/${locale}`}><X className="h-4 w-4" /></Link>
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
