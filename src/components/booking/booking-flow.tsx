"use client";

import { useState, useEffect, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Check,
  CreditCard,
  Wallet,
  User,
  Lock,
  PartyPopper,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { createBooking, getAvailableSlots } from "@/server-actions/booking";

type Service = { id: string; slug: string; name: string; nameEn: string; shortDesc: string; shortDescEn: string; image: string; durationMin: number; price: number; category?: string | null };
type Doctor = { id: string; name: string; nameEn: string; title: string; titleEn: string; specialty: string; specialtyEn: string; image: string; services: { serviceId: string }[] };

const STEPS = [
  "selectService",
  "selectDoctor",
  "selectDate",
  "selectTime",
  "yourInfo",
  "payment",
  "review",
  "confirm",
] as const;

export function BookingFlowClient({
  services,
  doctors,
  initialServiceId,
  initialDoctorId,
}: {
  services: Service[];
  doctors: Doctor[];
  initialServiceId: string | null;
  initialDoctorId: string | null;
}) {
  const t = useTranslations("Booking");
  const tNav = useTranslations("Nav");
  const locale = useLocale();
  const router = useRouter();
  const { data: session } = useSession();

  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState<string | null>(initialServiceId);
  const [doctorId, setDoctorId] = useState<string | null>(initialDoctorId);
  const [dateStr, setDateStr] = useState<string | null>(null);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CREDIT_CARD">("CASH");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [customerInfo, setCustomerInfo] = useState({ firstName: "", lastName: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  const service = useMemo(() => services.find((s) => s.id === serviceId), [services, serviceId]);
  const doctor = useMemo(() => doctors.find((d) => d.id === doctorId), [doctors, doctorId]);

  const availableDoctors = useMemo(() => {
    if (!serviceId) return doctors;
    return doctors.filter((d) => d.services.some((s) => s.serviceId === serviceId));
  }, [doctors, serviceId]);

  // Pre-fill customer info from session
  useEffect(() => {
    if (session?.user?.name) {
      const parts = session.user.name.split(" ");
      setCustomerInfo({
        firstName: parts[0] ?? "",
        lastName: parts.slice(1).join(" "),
        phone: "",
      });
    }
  }, [session]);

  // Set step from initial
  useEffect(() => {
    if (initialServiceId && initialDoctorId) setStep(2);
    else if (initialServiceId) setStep(1);
  }, [initialServiceId, initialDoctorId]);

  // Load slots when date changes
  useEffect(() => {
    if (!doctorId || !dateStr) return;
    setSlotsLoading(true);
    setTimeSlot(null);
    getAvailableSlots(doctorId, dateStr).then((s) => {
      setSlots(s);
      setSlotsLoading(false);
    });
  }, [doctorId, dateStr]);

  // ---------------- STEP RENDERERS ----------------
  const Arrow = locale === "ar" ? ChevronLeft : ChevronRight;
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const canGoNext = (() => {
    switch (STEPS[step]) {
      case "selectService": return !!serviceId;
      case "selectDoctor": return !!doctorId;
      case "selectDate": return !!dateStr;
      case "selectTime": return !!timeSlot;
      case "yourInfo": return true;
      case "payment": return true;
      case "review": return true;
      default: return false;
    }
  })();

  const submit = async () => {
    if (!serviceId || !doctorId || !dateStr || !timeSlot) return;
    if (!session) {
      toast.error(t("loginToBook"));
      return;
    }
    setSubmitting(true);
    try {
      const r = await createBooking({
        serviceId,
        doctorId,
        dateStr,
        timeSlot,
        notes,
        paymentMethod,
        cardName: paymentMethod === "CREDIT_CARD" ? cardName : undefined,
        cardNumber: paymentMethod === "CREDIT_CARD" ? cardNumber : undefined,
        expiry: paymentMethod === "CREDIT_CARD" ? expiry : undefined,
        cvv: paymentMethod === "CREDIT_CARD" ? cvv : undefined,
        customerInfo,
      });
      setSubmitting(false);
      if (!r.ok) {
        if (r.error === "ALREADY_BOOKED") toast.error(t("alreadyBooked"));
        else if (r.error === "PAST_DATE") toast.error(locale === "ar" ? "هذا التاريخ قديم" : "Past date");
        else if (r.error === "INVALID_CARD") toast.error(locale === "ar" ? "بيانات البطاقة غير صالحة" : "Invalid card");
        else if (r.error === "UNAUTHORIZED") {
          toast.error(t("loginToBook"));
          router.push(`/${locale}/login?callbackUrl=/${locale}/booking`);
        } else toast.error(locale === "ar" ? "حدث خطأ" : "Error");
        return;
      }
      setBookingRef(r.bookingRef!);
      setStep(STEPS.length - 1);
      toast.success(t("bookingConfirmed"));
    } catch (e) {
      setSubmitting(false);
      toast.error(locale === "ar" ? "حدث خطأ" : "Error");
    }
  };

  // ---------------- RENDER ----------------
  if (bookingRef) {
    return <BookingConfirmation ref={bookingRef} service={service!} doctor={doctor!} dateStr={dateStr!} timeSlot={timeSlot!} paymentMethod={paymentMethod} amount={service!.price} />;
  }

  return (
    <section className="py-8 lg:py-12 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-6">
          <h1 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight">{t("title")}</h1>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-8">
          {STEPS.map((s, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <div key={s} className="flex items-center gap-2">
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition border",
                  done ? "bg-accent/30 text-accent-foreground border-accent/50"
                    : current ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border"
                )}>
                  <span className="h-5 w-5 rounded-full flex items-center justify-center text-[10px]">
                    {done ? <Check className="h-3 w-3" /> : i + 1}
                  </span>
                  <span className="hidden sm:inline">{t(s)}</span>
                </div>
                {i < STEPS.length - 1 && <span className="h-px w-4 bg-border" />}
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <Card className="border-border shadow-soft">
          <CardContent className="p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: locale === "ar" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: locale === "ar" ? 20 : -20 }}
                transition={{ duration: 0.25 }}
              >
                {/* STEP 0: Service */}
                {STEPS[step] === "selectService" && (
                  <div>
                    <h2 className="font-display text-xl font-semibold mb-4">{t("selectService")}</h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {services.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => { setServiceId(s.id); setDoctorId(null); setTimeSlot(null); next(); }}
                          className={cn(
                            "text-start rounded-xl border p-3 flex gap-3 hover:bg-accent/15 transition",
                            serviceId === s.id ? "border-accent bg-accent/20" : "border-border bg-card"
                          )}
                        >
                          <img src={s.image} alt="" className="h-16 w-16 rounded-lg object-cover shrink-0" />
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate">{locale === "ar" ? s.name : s.nameEn}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{locale === "ar" ? s.shortDesc : s.shortDescEn}</p>
                            <p className="text-xs font-semibold text-accent mt-1">
                              {new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US").format(s.price)} {locale === "ar" ? "ر.س" : "SAR"}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 1: Doctor */}
                {STEPS[step] === "selectDoctor" && (
                  <div>
                    <h2 className="font-display text-xl font-semibold mb-4">{t("selectDoctor")}</h2>
                    {availableDoctors.length === 0 ? (
                      <p className="text-sm text-muted-foreground">{t("selectServiceFirst")}</p>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-3">
                        {availableDoctors.map((d) => (
                          <button
                            key={d.id}
                            onClick={() => { setDoctorId(d.id); setTimeSlot(null); next(); }}
                            className={cn(
                              "text-start rounded-xl border p-3 flex gap-3 hover:bg-accent/15 transition",
                              doctorId === d.id ? "border-accent bg-accent/20" : "border-border bg-card"
                            )}
                          >
                            <img src={d.image} alt="" className="h-16 w-16 rounded-full object-cover shrink-0" />
                            <div className="min-w-0">
                              <p className="font-semibold text-sm">{locale === "ar" ? d.name : d.nameEn}</p>
                              <p className="text-xs text-muted-foreground">{locale === "ar" ? d.title : d.titleEn}</p>
                              <p className="text-xs text-accent mt-1">{locale === "ar" ? d.specialty : d.specialtyEn}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 2: Date */}
                {STEPS[step] === "selectDate" && (
                  <div>
                    <h2 className="font-display text-xl font-semibold mb-4">{t("selectDate")}</h2>
                    <div className="flex justify-center">
                      <CalendarPicker
                        mode="single"
                        dir={locale === "ar" ? "rtl" : "ltr"}
                        disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0)) || d > new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)}
                        selected={dateStr ? new Date(dateStr) : undefined}
                        onSelect={(d) => {
                          if (d) {
                            const y = d.getFullYear();
                            const m = String(d.getMonth() + 1).padStart(2, "0");
                            const day = String(d.getDate()).padStart(2, "0");
                            setDateStr(`${y}-${m}-${day}`);
                          }
                        }}
                        className="rounded-xl border border-border"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 3: Time */}
                {STEPS[step] === "selectTime" && (
                  <div>
                    <h2 className="font-display text-xl font-semibold mb-4">{t("selectTime")}</h2>
                    {slotsLoading ? (
                      <div className="flex justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : slots.length === 0 ? (
                      <p className="text-center text-muted-foreground py-12">{t("noAvailableSlots")}</p>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {slots.map((s) => (
                          <button
                            key={s}
                            onClick={() => { setTimeSlot(s); next(); }}
                            className={cn(
                              "py-2 rounded-lg text-sm font-medium border transition",
                              timeSlot === s ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-accent/15"
                            )}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 4: Customer info */}
                {STEPS[step] === "yourInfo" && (
                  <div className="space-y-4">
                    <h2 className="font-display text-xl font-semibold mb-2">{t("yourInfo")}</h2>
                    {!session && (
                      <div className="rounded-xl bg-accent/15 border border-accent/40 p-3 text-xs text-muted-foreground flex items-center justify-between">
                        <span>{t("loginToBook")}</span>
                        <Button asChild size="sm" className="rounded-full h-7 text-xs">
                          <Link href={`/${locale}/login?callbackUrl=/${locale}/booking`}>{tNav("login")}</Link>
                        </Button>
                      </div>
                    )}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">{t("fullName")}</Label>
                        <Input id="firstName" value={customerInfo.firstName} onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })} required className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">{locale === "ar" ? "اللقب" : "Last name"}</Label>
                        <Input id="lastName" value={customerInfo.lastName} onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })} required className="rounded-xl" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone2">{t("phone")}</Label>
                      <Input id="phone2" type="tel" value={customerInfo.phone} onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })} required className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">{t("notes")}</Label>
                      <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="rounded-xl" />
                    </div>
                  </div>
                )}

                {/* STEP 5: Payment */}
                {STEPS[step] === "payment" && (
                  <div className="space-y-4">
                    <h2 className="font-display text-xl font-semibold mb-2">{t("paymentMethod")}</h2>
                    <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "CASH" | "CREDIT_CARD")}>
                      <div className="space-y-2">
                        <label htmlFor="CASH" className={cn("flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition", paymentMethod === "CASH" ? "border-accent bg-accent/15" : "border-border")}>
                          <RadioGroupItem value="CASH" id="CASH" className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Wallet className="h-4 w-4 text-accent" />
                              <span className="font-semibold">{t("cash")}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{t("cashDesc")}</p>
                          </div>
                        </label>

                        <label htmlFor="CREDIT_CARD" className={cn("flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition", paymentMethod === "CREDIT_CARD" ? "border-accent bg-accent/15" : "border-border")}>
                          <RadioGroupItem value="CREDIT_CARD" id="CREDIT_CARD" className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-accent" />
                              <span className="font-semibold">{t("creditCard")}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{t("creditCardDesc")}</p>
                          </div>
                        </label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === "CREDIT_CARD" && (
                      <div className="rounded-xl border border-border p-4 space-y-3 bg-muted/30">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Lock className="h-3 w-3" />
                          {locale === "ar" ? "نظام دفع تجريبي — لا تستخدمي بيانات بطاقة حقيقية." : "Mock payment system — do not use real card data."}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardName">{t("cardName")}</Label>
                          <Input id="cardName" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="John Doe" className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">{t("cardNumber")}</Label>
                          <Input id="cardNumber" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="4242 4242 4242 4242" className="rounded-xl" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">{t("expiry")}</Label>
                            <Input id="expiry" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" className="rounded-xl" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">{t("cvv")}</Label>
                            <Input id="cvv" value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="123" className="rounded-xl" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 6: Review */}
                {STEPS[step] === "review" && (
                  <div className="space-y-4">
                    <h2 className="font-display text-xl font-semibold mb-2">{t("review")}</h2>
                    <div className="rounded-xl border border-border divide-y divide-border overflow-hidden">
                      <Row label={t("service")} value={service ? (locale === "ar" ? service.name : service.nameEn) : "—"} />
                      <Row label={t("doctor")} value={doctor ? (locale === "ar" ? doctor.name : doctor.nameEn) : "—"} />
                      <Row label={t("date")} value={dateStr ?? "—"} />
                      <Row label={t("time")} value={timeSlot ?? "—"} />
                      <Row label={t("paymentMethod")} value={paymentMethod === "CASH" ? t("cash") : t("creditCard")} />
                      <Row label={t("totalAmount")} value={
                        <span className="font-semibold text-accent">
                          {service ? new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US").format(service.price) : "0"} {locale === "ar" ? "ر.س" : "SAR"}
                        </span>
                      } />
                    </div>
                  </div>
                )}

                {/* STEP 7: Confirm */}
                {STEPS[step] === "confirm" && (
                  <div className="text-center py-6">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-accent mb-4" />
                    <h2 className="font-display text-2xl font-semibold mb-2">{t("confirm")}</h2>
                    <p className="text-sm text-muted-foreground">{locale === "ar" ? "اضغطي تأكيد الحجز لإتمام العملية." : "Click confirm to finalize."}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {STEPS[step] !== "confirm" && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <Button variant="ghost" onClick={prev} disabled={step === 0} className="rounded-full gap-1">
                  <Arrow className="h-4 w-4 rotate-180" />
                  {t("previous")}
                </Button>
                {step < STEPS.length - 2 ? (
                  <Button onClick={next} disabled={!canGoNext} className="rounded-full gap-1 bg-primary hover:bg-primary/90">
                    {t("next")}
                    <Arrow className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={submit} disabled={submitting} className="rounded-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    {t("confirmBooking")}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between p-3 text-sm bg-card">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function BookingConfirmation({
  ref,
  service,
  doctor,
  dateStr,
  timeSlot,
  paymentMethod,
  amount,
}: {
  ref: string;
  service: Service;
  doctor: Doctor;
  dateStr: string;
  timeSlot: string;
  paymentMethod: "CASH" | "CREDIT_CARD";
  amount: number;
}) {
  const t = useTranslations("Booking");
  const locale = useLocale();
  const router = useRouter();

  return (
    <section className="py-12 lg:py-20">
      <div className="container mx-auto px-4 max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-accent/40 bg-card shadow-luxury p-8 text-center"
        >
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent/20 mb-4">
            <PartyPopper className="h-8 w-8 text-accent" />
          </div>
          <h1 className="font-display text-2xl font-semibold mb-2">{t("bookingConfirmed")}</h1>
          <p className="text-sm text-muted-foreground mb-6">{locale === "ar" ? "احتفظي برقم الحجز للمتابعة." : "Keep your booking ref for follow-up."}</p>

          <div className="rounded-2xl bg-accent/15 border border-accent/30 p-4 mb-6">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{t("bookingRef")}</p>
            <p className="font-mono font-semibold text-lg">{ref}</p>
          </div>

          <div className="rounded-2xl border border-border divide-y divide-border text-sm overflow-hidden">
            <Row label={t("service")} value={locale === "ar" ? service.name : service.nameEn} />
            <Row label={t("doctor")} value={locale === "ar" ? doctor.name : doctor.nameEn} />
            <Row label={t("date")} value={dateStr} />
            <Row label={t("time")} value={timeSlot} />
            <Row label={t("paymentMethod")} value={paymentMethod === "CASH" ? t("cash") : t("creditCard")} />
            <Row label={t("totalAmount")} value={`${new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US").format(amount)} ${locale === "ar" ? "ر.س" : "SAR"}`} />
          </div>

          <div className="flex flex-col gap-2 mt-6">
            <Button asChild className="rounded-full bg-primary hover:bg-primary/90">
              <Link href={`/${locale}/dashboard/appointments`}>{t("viewBooking")}</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href={`/${locale}`}>{t("backToHome")}</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
