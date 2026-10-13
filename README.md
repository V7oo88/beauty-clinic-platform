# عيادة الجمال — Beauty Clinic Platform

منصة ويب متكاملة واحترافية لعيادة تجميل فاخرة، مبنية بأحدث التقنيات وجاهزة للإنتاج.

![Home](home-ar.png)

## 📑 الفهرس

1. [نظرة عامة](#نظرة-عامة)
2. [التقنيات المستخدمة](#التقنيات-المستخدمة)
3. [بنية المشروع](#بنية-المشروع)
4. [تعليمات التشغيل](#تعليمات-التشغيل)
5. [قاعدة البيانات و Migrations و Seed](#قاعدة-البيانات)
6. [بيانات الدخول التجريبية](#بيانات-الدخول-التجريبية)
7. [بناء المشروع للإنتاج](#بناء-المشروع-للإنتاج)
8. [النشر على الإنترنت](#النشر-على-الإنترنت)
9. [تثبيت كتطبيق PWA](#تثبيت-كتطبيق-pwa)
10. [الميزات الكاملة](#الميزات-الكاملة)
11. [قائمة الصفحات](#قائمة-الصفحات)

## نظرة عامة

المنصة عبارة عن تطبيق ويب متكامل لعيادة تجميل يوفر:

- **7 خدمات طبية وتجميلية**: ليزر، بوتوكس، فيلر، إبر نضارة، شد جسم، نحت جسم، تجميل أنف.
- **5 أطباء متخصصين** ببيانات تجريبية قابلة للتعديل.
- **نظام حجز كامل بـ 9 خطوات**: خدمة → طبيب → تاريخ → وقت → بيانات → دفع → مراجعة → تأكيد.
- **نظام دفع تجريبي** (Cash / Credit Card) جاهز للربط ببوابة حقيقية.
- **حسابات للعملاء** (Dashboard + المواعيد + الإشعارات + Profile).
- **لوحة تحكم Admin متكاملة** (Dashboard + Appointments + Doctors + Services + Customers + Payments + Schedules + Settings).
- **PWA** (Progressive Web App) قابل للتثبيت على Android/iOS/Desktop مع Service Worker و Offline fallback.
- **ثنائي اللغة** عربي (RTL) + إنجليزي (LTR).
- **Responsive 100%** (Mobile-first).
- **SEO كامل**: sitemap, robots.txt, Open Graph, structured metadata.

## التقنيات المستخدمة

| الطبقة | التقنية |
|---|---|
| Framework | Next.js 16 (App Router) + Turbopack |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui (New York) |
| UI Library | Radix UI + Lucide Icons + Framer Motion |
| Database | Prisma ORM + SQLite |
| Auth | NextAuth.js (Credentials + JWT + bcrypt) |
| i18n | next-intl (AR/EN + RTL/LTR) |
| Forms | react-hook-form + Zod |
| Tables | TanStack Table |
| Toasts | sonner |
| PWA | Service Worker + Web Manifest |

## بنية المشروع

```
my-project/
├── prisma/
│   ├── schema.prisma          # Database schema (13+ models)
│   └── seed.ts                 # Seed data (doctors, services, appointments, etc.)
├── messages/
│   ├── ar.json                 # Arabic translations
│   └── en.json                 # English translations
├── public/
│   ├── manifest.webmanifest    # PWA manifest
│   ├── sw.js                   # Service Worker
│   ├── offline.html           # Offline fallback page
│   ├── robots.txt              # SEO
│   └── icons/                  # PWA icons (192/512 + apple-touch)
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (html/body + providers)
│   │   ├── page.tsx            # / → redirects to /ar
│   │   ├── robots.ts           # SEO robots
│   │   ├── sitemap.ts          # SEO sitemap
│   │   ├── api/
│   │   │   └── auth/[...nextauth]/route.ts
│   │   └── [locale]/           # All localized routes
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── not-found.tsx
│   │       ├── services/page.tsx + [slug]/page.tsx
│   │       ├── doctors/page.tsx + [id]/page.tsx
│   │       ├── booking/page.tsx
│   │       ├── login/page.tsx
│   │       ├── register/page.tsx
│   │       ├── dashboard/page.tsx + appointments + profile
│   │       ├── about/page.tsx
│   │       ├── contact/page.tsx
│   │       ├── privacy/page.tsx
│   │       ├── terms/page.tsx
│   │       └── admin/          # All admin routes
│   │           ├── layout.tsx (with admin sidebar)
│   │           ├── page.tsx (dashboard)
│   │           ├── appointments/page.tsx
│   │           ├── doctors/page.tsx
│   │           ├── services/page.tsx
│   │           ├── customers/page.tsx
│   │           ├── payments/page.tsx
│   │           ├── schedules/page.tsx
│   │           └── settings/page.tsx
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── layout/             # Header, Footer, LanguageSwitcher
│   │   ├── clinic/             # ServiceCard, DoctorCard, HomeHero, etc.
│   │   ├── booking/            # BookingFlow
│   │   ├── admin/              # AdminShell, dashboard, doctors, etc.
│   │   ├── pwa/                # ServiceWorkerRegister
│   │   └── providers.tsx      # SessionProvider
│   ├── lib/
│   │   ├── db.ts               # Prisma client
│   │   ├── auth.ts             # NextAuth config
│   │   ├── server-utils.ts     # Auth helpers, locale, currency, slots
│   │   ├── public-settings.ts  # Cached settings
│   │   └── utils.ts            # cn() and shared utilities
│   ├── hooks/                  # use-toast, use-mobile
│   ├── i18n/
│   │   ├── routing.ts          # locale routing config
│   │   └── request.ts          # next-intl request config
│   ├── server-actions/
│   │   ├── booking.ts          # registerUser, createBooking, cancelBooking, etc.
│   │   └── admin.ts            # Doctor/Service/Schedule CRUD, setAppointmentStatus
│   ├── types/                  # TypeScript types
│   └── middleware.ts           # next-intl middleware (with proxy convention)
├── .env                        # DATABASE_URL + NEXTAUTH_SECRET + NEXTAUTH_URL
├── next.config.ts              # withNextIntl + images + PWA headers
├── package.json                # All scripts
└── tailwind.config.ts
```

## تعليمات التشغيل

### المتطلبات (Requirements)
- Node.js 18+ أو Bun 1.1+
- npm/bun

### التشغيل السريع

```bash
# 1. تثبيت الـ dependencies
bun install   # أو npm install

# 2. تطبيق الـ schema على قاعدة البيانات
bun run db:push

# 3. تشغيل الـ seed لملء البيانات التجريبية
bun x tsx prisma/seed.ts

# 4. تشغيل الـ dev server
bun run dev   # أو npm run dev
```

ثم افتح المتصفح على `http://localhost:3000` — سيتم تحويلك تلقائياً إلى `/ar`.

### الـ Scripts المتوفرة

| Script | الوصف |
|---|---|
| `bun run dev` | تشغيل خادم التطوير على المنفذ 3000 |
| `bun run build` | بناء نسخة الإنتاج |
| `bun run start` | تشغيل نسخة الإنتاج |
| `bun run lint` | فحص الكود بـ ESLint |
| `bun run db:push` | تطبيق الـ schema على قاعدة البيانات |
| `bun run db:generate` | توليد Prisma Client |
| `bun run db:migrate` | إنشاء migration جديد |
| `bun run db:reset` | إعادة ضبط قاعدة البيانات (يحذف كل البيانات) |

## قاعدة البيانات

### Schema Overview

قاعدة البيانات تحتوي على 13 نموذج (model):

- `User` — حساب المصادقة (email + passwordHash + role)
- `Customer` — ملف العميل المرتبط بـ User
- `Doctor` — بيانات الطبيب
- `Service` — الخدمات الطبية والتجميلية
- `DoctorService` — جدول وصل many-to-many بين الأطباء والخدمات
- `ServiceFaq` — الأسئلة الشائعة لكل خدمة
- `Schedule` — جدول مواعيد كل طبيب (يوم + ساعات)
- `Appointment` — الحجوزات (مع unique constraint يمنع double-booking)
- `Payment` — سجلات الدفع (مرتبط 1-1 مع Appointment)
- `Notification` — إشعارات لكل مستخدم
- `Review` — مراجعات الخدمات والأطباء
- `Setting` — إعدادات العيادة (key-value)
- `GalleryItem` — معرض قبل/بعد
- `Testimonial` — آراء العملاء

### إنشاء قاعدة البيانات من الصفر

```bash
# 1. تأكد من ملف .env
cat .env
# DATABASE_URL=file:/home/z/my-project/db/custom.db
# NEXTAUTH_SECRET=<your-secret>
# NEXTAUTH_URL=http://localhost:3000

# 2. تطبيق الـ schema
bun run db:push

# 3. (اختياري) إذا كانت قاعدة البيانات قديمة وتريد إعادة بنائها
bun run db:reset

# 4. تشغيل الـ seed
bun x tsx prisma/seed.ts
```

### Migrations (Production)

لإنشاء migrations فعلية (للإنتاج):

```bash
# إنشاء migration من التغييرات في schema.prisma
bun x prisma migrate dev --name init

# تطبيق migrations على بيئة الإنتاج
bun x prisma migrate deploy
```

## بيانات الدخول التجريبية

بعد تشغيل الـ seed، تتوفر 3 حسابات تجريبية:

### Admin (مشرف)
- **Email:** `admin@clinic.com`
- **Password:** `Admin@2026`
- **الوصول:** `/ar/admin` — لوحة التحكم الكاملة

### Customer (عميلة)
- **Email:** `client@clinic.com`
- **Password:** `Client@2026`
- **الوصول:** `/ar/dashboard` — حساب العميل

### Doctor (طبيبة)
- **Email:** `sara@clinic.com`
- **Password:** `Doctor@2026`
- **الوصول:** حساب بطبيبة

> ⚠️ **تنبيه**: بيانات تجريبية فقط. في الإنتاج استبدلها ببيانات حقيقية وأضف تشفيرًا أقوى.

## بناء المشروع للإنتاج

```bash
# 1. بناء نسخة الإنتاج (standalone output)
bun run build

# 2. (اختياري) تشغيل نسخة الإنتاج محلياً للتحقق
bun run start
```

سيتم إنشاء مجلد `.next/standalone/` يحتوي على نسخة قابلة للنشر مباشرة.

### متغيرات بيئة الإنتاج المطلوبة

```env
DATABASE_URL="file:/path/to/production.db"   # أو postgresql://...
NEXTAUTH_SECRET="super-long-random-secret"   # استخدم openssl rand -base64 32
NEXTAUTH_URL="https://your-domain.com"
```

## النشر على الإنترنت

### Vercel (الأسهل)

1. ارفع المشروع إلى GitHub.
2. اذهب إلى [vercel.com](https://vercel.com) وأضف المشروع.
3. أضف متغيرات البيئة (NEXTAUTH_SECRET, NEXTAUTH_URL, DATABASE_URL).
4. للإنتاج، يُنصح باستخدام PostgreSQL بدلاً من SQLite:

   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

5. اضغط Deploy — سيتم بناء المشروع ونشره تلقائياً.

### VPS / Docker

```bash
# 1. استنساخ المشروع
git clone <your-repo>
cd clinic

# 2. تثبيت الـ deps
bun install

# 3. بناء
bun run build

# 4. تشغيل migrations
bun x prisma migrate deploy

# 5. seed (اختياري للبيانات الأولية)
bun x tsx prisma/seed.ts

# 6. تشغيل
bun run start
```

### Docker Compose (موصى به للإنتاج)

```yaml
# docker-compose.yml
version: '3.8'
services:
  web:
    build: .
    ports: ['3000:3000']
    environment:
      - DATABASE_URL=file:/app/db/clinic.db
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=https://your-domain.com
    volumes:
      - ./db:/app/db
    restart: unless-stopped
```

## تثبيت كتطبيق PWA

المنصة Progressive Web App — يمكن تثبيتها كتطبيق أصلي على:

### Android (Chrome)
1. افتح الموقع في Chrome.
2. اضغط على زر القائمة (⋮) في الأعلى.
3. اختر **"تثبيت التطبيق"** أو **"Add to Home screen"**.
4. اضغط **"تثبيت"**.

### iPhone / iPad (Safari)
1. افتح الموقع في Safari.
2. اضغط زر المشاركة (□↑).
3. اختر **"إضافة إلى الشاشة الرئيسية"**.
4. اضغط **"إضافة"**.

### Desktop (Chrome/Edge)
1. افتح الموقع في Chrome أو Edge.
2. ستظهر أيقونة تثبيت (⊕) في شريط العنوان.
3. اضغط عليها ثم **"تثبيت"**.

### مميزات PWA في المشروع
- ✅ Web App Manifest (`/manifest.webmanifest`)
- ✅ Service Worker (`/sw.js`) مع caching استراتيجي
- ✅ Offline fallback (`/offline.html`)
- ✅ App icons (192/512 + apple-touch)
- ✅ Splash screen ألوان الهوية
- ✅ Standalone display mode
- ✅ Shortcuts (Book/Services/Doctors)

## الميزات الكاملة

### الواجهة الأمامية (Frontend)
- ✅ Homepage مع Hero + Stats + Services + Doctors + Why Us + Gallery + Testimonials + CTA
- ✅ صفحة Services مع بحث + filter
- ✅ صفحة Service Detail مع FAQ + Doctors
- ✅ صفحة Doctors مع بحث
- ✅ صفحة Doctor Detail مع Schedule + Services
- ✅ Booking Flow كامل بـ 9 خطوات
- ✅ Login + Register مع validation
- ✅ Customer Dashboard (upcoming/past/notifications)
- ✅ Profile editing
- ✅ About + Contact + Privacy + Terms
- ✅ Custom 404

### لوحة التحكم (Admin)
- ✅ Dashboard مع إحصائيات (total/today/upcoming/revenue/customers/doctors) + top services + recent bookings
- ✅ Appointments management مع filters + status changes (confirm/complete/cancel/no-show)
- ✅ Doctors CRUD كامل (إضافة/تعديل/حذف + ربط بالخدمات)
- ✅ Services CRUD كامل
- ✅ Customers list
- ✅ Payments overview مع totals (paid/pending)
- ✅ Schedules management (إضافة/حذف فترات)
- ✅ Settings (معلومات العيادة + سوشيال)

### النظام (System)
- ✅ Authentication مع JWT + bcrypt
- ✅ Authorization Role-based (ADMIN/DOCTOR/CUSTOMER)
- ✅ منع double-booking عبر Prisma unique constraint
- ✅ Notifications system تجريبي
- ✅ Mock payment system (جاهز لاستبداله ببوابة حقيقية)
- ✅ i18n AR/EN مع RTL/LTR كامل
- ✅ Responsive mobile-first
- ✅ SEO (sitemap + robots + metadata + Open Graph)
- ✅ PWA (installable + offline)
- ✅ Sticky booking CTA على الجوال
- ✅ Loading states + Empty states + Error states + Toast notifications

### الأمان
- ✅ Password hashing (bcrypt, 10 rounds)
- ✅ JWT session tokens (30 يوم)
- ✅ Role-based access control
- ✅ Server-side validation
- ✅ NextAuth CSRF protection
- ✅ No sensitive data in frontend
- ✅ Environment variables for secrets
- ✅ No credit card data storage (mock only)

## قائمة الصفحات

### صفحات العميل
| Route | الوصف |
|---|---|
| `/ar` أو `/en` | الصفحة الرئيسية |
| `/ar/services` | قائمة الخدمات |
| `/ar/services/[slug]` | تفاصيل خدمة |
| `/ar/doctors` | قائمة الأطباء |
| `/ar/doctors/[id]` | تفاصيل طبيب |
| `/ar/booking` | حجز موعد (9 خطوات) |
| `/ar/login` | تسجيل الدخول |
| `/ar/register` | إنشاء حساب |
| `/ar/dashboard` | حساب العميل |
| `/ar/dashboard/appointments` | مواعيد العميل |
| `/ar/dashboard/profile` | بيانات العميل |
| `/ar/about` | من نحن |
| `/ar/contact` | تواصل معنا |
| `/ar/privacy` | سياسة الخصوصية |
| `/ar/terms` | الشروط والأحكام |

### صفحات الإدارة
| Route | الوصف |
|---|---|
| `/ar/admin` | نظرة عامة + إحصائيات |
| `/ar/admin/appointments` | إدارة الحجوزات |
| `/ar/admin/doctors` | إدارة الأطباء |
| `/ar/admin/services` | إدارة الخدمات |
| `/ar/admin/customers` | قائمة العملاء |
| `/ar/admin/payments` | المدفوعات |
| `/ar/admin/schedules` | جداول الأطباء |
| `/ar/admin/settings` | إعدادات العيادة |

## ربط بوابة دفع حقيقية

النظام الحالي Mock. لربط بوابة حقيقية (مثل Stripe, Tap, HyperPay):

1. عدّل ملف `src/server-actions/booking.ts` في قسم `createBooking` عند الـ credit card branch.
2. استبدل منطق الـ mock بالاتصال بـ API بوابة الدفع الحقيقية.
3. أضف المفاتيح في `.env` (مثل `STRIPE_SECRET_KEY`).
4. لا تخزّن بيانات البطاقات — فقط tokens/charges.

مثال لـ Stripe:

```typescript
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(service.price * 100), // SAR to halalas
  currency: "sar",
  metadata: { appointmentId: appointment.id, bookingRef: appointment.bookingRef },
});
```

## ربط إشعارات حقيقية

النظام الحالي يخزن الإشعارات في قاعدة البيانات. للربط بـ Email/WhatsApp/SMS:

1. أضف service provider (مثل SendGrid للبريد, Twilio للـ SMS, WhatsApp Business API).
2. عدّل `src/server-actions/booking.ts` و `admin.ts` لإرسال الإشعار الفعلي بعد إنشاء السجل.
3. أضف المفاتيح في `.env`.

## License

هذا المشروع تجريبي للأغراض التعليمية. يمكنك استخدامه وتعديله بحرية.

---

**© 2026 Beauty Clinic — All rights reserved.**
