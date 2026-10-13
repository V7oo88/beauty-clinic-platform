"use server";

import { db } from "@/lib/db";
import { requireUser, getOrCreateCustomer, generateBookingRef, generateTxnRef, buildAppointmentDate, generateSlots, getDayOfWeek } from "@/lib/server-utils";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// ============== REGISTER ==============
export async function registerUser(input: {
  email: string;
  password: string;
  name: string;
  phone?: string;
}) {
  const email = input.email.toLowerCase().trim();
  const exists = await db.user.findUnique({ where: { email } });
  if (exists) return { ok: false, error: "EMAIL_EXISTS" };
  if (input.password.length < 6) return { ok: false, error: "WEAK_PASSWORD" };

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await db.user.create({
    data: { email, passwordHash, name: input.name, role: "CUSTOMER", phone: input.phone },
  });
  await db.customer.create({
    data: {
      userId: user.id,
      firstName: input.name.split(" ")[0] ?? input.name,
      lastName: input.name.split(" ").slice(1).join(" "),
      phone: input.phone ?? "",
    },
  });
  // welcome notification
  await db.notification.create({
    data: {
      userId: user.id,
      type: "BOOKING_CREATED",
      title: "أهلًا بكِ",
      message: "تم إنشاء حسابكِ بنجاح. ابدئي حجز أول موعد لكِ.",
      isRead: false,
    },
  }).catch(() => {});
  return { ok: true, userId: user.id };
}

// ============== BOOKING: list available slots ==============
export async function getAvailableSlots(doctorId: string, dateStr: string) {
  const day = getDayOfWeek(dateStr);
  const schedule = await db.schedule.findFirst({
    where: { doctorId, dayOfWeek: day, isWorking: true },
  });
  if (!schedule) return [];
  const allSlots = generateSlots(schedule.startTime, schedule.endTime, 30);
  const existing = await db.appointment.findMany({
    where: {
      doctorId,
      date: {
        gte: new Date(`${dateStr}T00:00:00Z`),
        lte: new Date(`${dateStr}T23:59:59Z`),
      },
      status: { in: ["PENDING", "CONFIRMED"] },
    },
    select: { timeSlot: true },
  });
  const taken = new Set(existing.map((e) => e.timeSlot));
  return allSlots.filter((s) => !taken.has(s));
}

// ============== BOOKING: create ==============
export async function createBooking(input: {
  serviceId: string;
  doctorId: string;
  dateStr: string;
  timeSlot: string;
  notes?: string;
  paymentMethod: "CASH" | "CREDIT_CARD";
  // optional card fields (mock)
  cardName?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  // customer info fallback for guests (we still require login)
  customerInfo?: { firstName?: string; lastName?: string; phone?: string };
}) {
  const user = await requireUser();
  const service = await db.service.findUnique({ where: { id: input.serviceId } });
  if (!service) return { ok: false, error: "INVALID_SERVICE" };
  const doctor = await db.doctor.findUnique({ where: { id: input.doctorId } });
  if (!doctor) return { ok: false, error: "INVALID_DOCTOR" };

  // double-booking prevention via unique constraint
  const date = buildAppointmentDate(input.dateStr, input.timeSlot);
  // Check not in past
  if (date.getTime() < Date.now()) return { ok: false, error: "PAST_DATE" };

  const customer = await getOrCreateCustomer(user.id, input.customerInfo);

  let appointment;
  try {
    appointment = await db.appointment.create({
      data: {
        bookingRef: generateBookingRef(),
        customerId: customer.id,
        doctorId: doctor.id,
        serviceId: service.id,
        date,
        timeSlot: input.timeSlot,
        status: "PENDING",
        notes: input.notes,
      },
    });
  } catch (e) {
    const msg = String(e);
    if (msg.includes("Unique")) return { ok: false, error: "ALREADY_BOOKED" };
    throw e;
  }

  // Create payment record (mock for credit card; PENDING for cash)
  let payment;
  if (input.paymentMethod === "CASH") {
    payment = await db.payment.create({
      data: {
        appointmentId: appointment.id,
        customerId: customer.id,
        userId: user.id,
        amount: service.price,
        method: "CASH",
        status: "PENDING",
      },
    });
    // mark appointment as confirmed for cash (pending till clinic receipt)
    await db.appointment.update({
      where: { id: appointment.id },
      data: { status: "CONFIRMED" },
    });
  } else {
    // Mock credit card — validate basic shape only (test mode)
    if (!input.cardNumber || input.cardNumber.replace(/\s/g, "").length < 12) {
      // rollback appointment
      await db.appointment.delete({ where: { id: appointment.id } });
      return { ok: false, error: "INVALID_CARD" };
    }
    payment = await db.payment.create({
      data: {
        appointmentId: appointment.id,
        customerId: customer.id,
        userId: user.id,
        amount: service.price,
        method: "CREDIT_CARD",
        status: "PAID",
        txnRef: generateTxnRef(),
        paidAt: new Date(),
      },
    });
    await db.appointment.update({
      where: { id: appointment.id },
      data: { status: "CONFIRMED" },
    });
  }

  // Notification
  await db.notification.create({
    data: {
      userId: user.id,
      type: "BOOKING_CREATED",
      title: "تم استلام طلب حجزكِ",
      message: `تم تأكيد حجزكِ لخدمة ${service.name} مع ${doctor.name} بتاريخ ${input.dateStr} الساعة ${input.timeSlot}.`,
      isRead: false,
      data: JSON.stringify({ appointmentId: appointment.id, bookingRef: appointment.bookingRef }),
    },
  });

  // Notification: confirmed
  await db.notification.create({
    data: {
      userId: user.id,
      type: "BOOKING_CONFIRMED",
      title: "تم تأكيد موعدكِ",
      message: `رقم الحجز: ${appointment.bookingRef}. نتطلع لرؤيتكِ في العيادة.`,
      isRead: false,
    },
  });

  revalidatePath("/api/admin/stats");
  return { ok: true, bookingRef: appointment.bookingRef, appointmentId: appointment.id };
}

// ============== CANCEL BOOKING ==============
export async function cancelBooking(bookingRef: string, reason?: string) {
  const user = await requireUser();
  const appt = await db.appointment.findUnique({ where: { bookingRef } });
  if (!appt) return { ok: false, error: "NOT_FOUND" };
  const customer = await db.customer.findUnique({ where: { id: appt.customerId } });
  if (!customer || customer.userId !== user.id) return { ok: false, error: "FORBIDDEN" };
  if (appt.status === "CANCELLED" || appt.status === "COMPLETED") return { ok: false, error: "INVALID_STATUS" };

  await db.appointment.update({
    where: { id: appt.id },
    data: { status: "CANCELLED", cancelReason: reason },
  });
  await db.notification.create({
    data: {
      userId: user.id,
      type: "BOOKING_CANCELLED",
      title: "تم إلغاء موعدكِ",
      message: `تم إلغاء حجزكِ ${bookingRef}${reason ? ` بسبب: ${reason}` : ""}.`,
      isRead: false,
    },
  });
  revalidatePath("/ar/dashboard");
  return { ok: true };
}

// ============== UPDATE PROFILE ==============
export async function updateProfile(input: { firstName: string; lastName: string; phone: string }) {
  const user = await requireUser();
  const customer = await getOrCreateCustomer(user.id);
  await db.customer.update({
    where: { id: customer.id },
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
    },
  });
  await db.user.update({
    where: { id: user.id },
    data: { name: `${input.firstName} ${input.lastName}`.trim() },
  });
  return { ok: true };
}

// ============== MARK NOTIFICATIONS READ ==============
export async function markNotificationsRead() {
  const user = await requireUser();
  await db.notification.updateMany({
    where: { userId: user.id, isRead: false },
    data: { isRead: true },
  });
  return { ok: true };
}
