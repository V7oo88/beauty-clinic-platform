"use server";

import { db } from "@/lib/db";
import { requireRole, generateBookingRef } from "@/lib/server-utils";
import { revalidatePath } from "next/cache";

// ============== ADMIN: update appointment status ==============
export async function setAppointmentStatus(appointmentId: string, status: string) {
  await requireRole(["ADMIN"]);
  const appt = await db.appointment.update({
    where: { id: appointmentId },
    data: { status },
    include: { customer: true, service: true },
  });
  // Notify customer
  const customer = appt.customer;
  if (customer) {
    await db.notification.create({
      data: {
        userId: customer.userId,
        type:
          status === "CONFIRMED" ? "BOOKING_CONFIRMED"
            : status === "CANCELLED" ? "BOOKING_CANCELLED"
            : status === "COMPLETED" ? "BOOKING_CONFIRMED"
            : "BOOKING_CREATED",
        title: `تم تحديث حجزكِ ${appt.bookingRef}`,
        message: `حالة الحجز أصبحت: ${status}.`,
        isRead: false,
      },
    }).catch(() => {});
  }
  revalidatePath("/ar/admin/appointments");
  return { ok: true };
}

// ============== ADMIN: reschedule ==============
export async function rescheduleBooking(appointmentId: string, dateStr: string, timeSlot: string) {
  await requireRole(["ADMIN"]);
  const old = await db.appointment.findUnique({ where: { id: appointmentId } });
  if (!old) return { ok: false, error: "NOT_FOUND" };
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeSlot.split(":").map(Number);
  const newDate = new Date(Date.UTC(y, m - 1, d, hh, mm));
  newDate.setUTCHours(newDate.getUTCHours() - 3);
  await db.appointment.update({
    where: { id: appointmentId },
    data: { date: newDate, timeSlot, status: "CONFIRMED" },
  });
  revalidatePath("/ar/admin/appointments");
  return { ok: true };
}

// ============== ADMIN: doctors CRUD ==============
export async function createDoctor(input: {
  name: string; nameEn: string;
  title: string; titleEn: string;
  specialty: string; specialtyEn: string;
  bio: string; bioEn: string;
  image: string;
  experienceYears: number;
  serviceIds: string[];
}) {
  await requireRole(["ADMIN"]);
  const doc = await db.doctor.create({
    data: {
      name: input.name,
      nameEn: input.nameEn,
      title: input.title,
      titleEn: input.titleEn,
      specialty: input.specialty,
      specialtyEn: input.specialtyEn,
      bio: input.bio,
      bioEn: input.bioEn,
      image: input.image,
      experienceYears: input.experienceYears,
      rating: 5.0,
      reviewCount: 0,
    },
  });
  for (const sid of input.serviceIds) {
    await db.doctorService.create({
      data: { doctorId: doc.id, serviceId: sid },
    }).catch(() => {});
  }
  revalidatePath("/ar/admin/doctors");
  return { ok: true, id: doc.id };
}

export async function updateDoctor(id: string, input: Partial<{
  name: string; nameEn: string;
  title: string; titleEn: string;
  specialty: string; specialtyEn: string;
  bio: string; bioEn: string;
  image: string; experienceYears: number;
  isActive: boolean; rating: number;
}>) {
  await requireRole(["ADMIN"]);
  await db.doctor.update({ where: { id }, data: input });
  revalidatePath("/ar/admin/doctors");
  return { ok: true };
}

export async function deleteDoctor(id: string) {
  await requireRole(["ADMIN"]);
  await db.doctor.delete({ where: { id } });
  revalidatePath("/ar/admin/doctors");
  return { ok: true };
}

// ============== ADMIN: services CRUD ==============
export async function createService(input: {
  slug: string; name: string; nameEn: string;
  shortDesc: string; shortDescEn: string;
  fullDesc: string; fullDescEn: string;
  image: string; durationMin: number; price: number;
  category: string;
}) {
  await requireRole(["ADMIN"]);
  const svc = await db.service.create({ data: input });
  revalidatePath("/ar/admin/services");
  return { ok: true, id: svc.id };
}

export async function updateService(id: string, input: Partial<{
  slug: string; name: string; nameEn: string;
  shortDesc: string; shortDescEn: string;
  fullDesc: string; fullDescEn: string;
  image: string; durationMin: number; price: number;
  category: string; isActive: boolean;
}>) {
  await requireRole(["ADMIN"]);
  await db.service.update({ where: { id }, data: input });
  revalidatePath("/ar/admin/services");
  return { ok: true };
}

export async function deleteService(id: string) {
  await requireRole(["ADMIN"]);
  await db.service.delete({ where: { id } });
  revalidatePath("/ar/admin/services");
  return { ok: true };
}

// ============== ADMIN: schedules ==============
export async function addSchedule(input: { doctorId: string; dayOfWeek: number; startTime: string; endTime: string; isWorking: boolean }) {
  await requireRole(["ADMIN"]);
  await db.schedule.create({ data: input });
  revalidatePath("/ar/admin/schedules");
  return { ok: true };
}

export async function deleteSchedule(id: string) {
  await requireRole(["ADMIN"]);
  await db.schedule.delete({ where: { id } });
  revalidatePath("/ar/admin/schedules");
  return { ok: true };
}

export async function updateSchedule(id: string, input: Partial<{ startTime: string; endTime: string; isWorking: boolean }>) {
  await requireRole(["ADMIN"]);
  await db.schedule.update({ where: { id }, data: input });
  revalidatePath("/ar/admin/schedules");
  return { ok: true };
}

// ============== ADMIN: update settings ==============
export async function updateSetting(key: string, value: string) {
  await requireRole(["ADMIN"]);
  await db.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  revalidatePath("/ar/admin/settings");
  return { ok: true };
}

export async function updateSettingsMany(items: { key: string; value: string }[]) {
  await requireRole(["ADMIN"]);
  for (const it of items) {
    await db.setting.upsert({
      where: { key: it.key },
      update: { value: it.value },
      create: { key: it.key, value: it.value },
    });
  }
  revalidatePath("/ar/admin/settings");
  return { ok: true };
}
