import { db } from "@/lib/db";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { headers } from "next/headers";
import { routing } from "@/i18n/routing";

export async function getSession(): Promise<Session | null> {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user as { id: string; email: string; name?: string | null; role: string };
}

export async function requireRole(roles: ("ADMIN" | "DOCTOR" | "CUSTOMER")[]) {
  const user = await requireUser();
  if (!roles.includes(user.role as "ADMIN" | "DOCTOR" | "CUSTOMER")) {
    throw new Error("FORBIDDEN");
  }
  return user as { id: string; email: string; name?: string | null; role: "ADMIN" | "DOCTOR" | "CUSTOMER" };
}

/** Resolve locale from headers (set by next-intl middleware). */
export async function getLocale(): Promise<"ar" | "en"> {
  const h = await headers();
  const ln = h.get("x-next-intl-locale");
  if (ln && routing.locales.includes(ln as "ar" | "en")) return ln as "ar" | "en";
  return routing.defaultLocale as "ar" | "en";
}

/** Get or create Customer row for the user. */
export async function getOrCreateCustomer(userId: string, fallback?: { firstName?: string; lastName?: string; phone?: string }) {
  const existing = await db.customer.findUnique({ where: { userId } });
  if (existing) return existing;
  return db.customer.create({
    data: {
      userId,
      firstName: fallback?.firstName ?? "Guest",
      lastName: fallback?.lastName ?? "",
      phone: fallback?.phone ?? "",
    },
  });
}

export function generateBookingRef() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CLN-${ymd}-${rnd}`;
}

export function generateTxnRef() {
  const d = new Date().getTime().toString(36);
  const r = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `TXN-${d}-${r}`;
}

export function currency(amount: number, locale: "ar" | "en" = "ar") {
  const v = new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 0,
  }).format(amount);
  return v;
}

export function fmtDate(d: Date, locale: "ar" | "en" = "ar") {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function fmtTime(d: Date, locale: "ar" | "en" = "ar") {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

/** Build a UTC date from YYYY-MM-DD + HH:MM in clinic local timezone (Asia/Riyadh = +3). */
export function buildAppointmentDate(dateStr: string, timeStr: string) {
  // dateStr: YYYY-MM-DD, timeStr: HH:mm
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  // Treat as Asia/Riyadh (+3) UTC approximation
  const local = new Date(Date.UTC(y, m - 1, d, hh, mm));
  local.setUTCHours(local.getUTCHours() - 3);
  return local;
}

/** Generate 30-min slots between start and end excluding existing appointments. */
export function generateSlots(startTime: string, endTime: string, durationMin = 30) {
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  const slots: string[] = [];
  for (let t = startMin; t + durationMin <= endMin; t += durationMin) {
    const hh = String(Math.floor(t / 60)).padStart(2, "0");
    const mm = String(t % 60).padStart(2, "0");
    slots.push(`${hh}:${mm}`);
  }
  return slots;
}

export function isPastDate(dateStr: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d < today;
}

export function getDayOfWeek(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.getDay();
}
