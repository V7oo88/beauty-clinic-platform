/**
 * Seed data for Beauty Clinic — sample/dummy data only.
 * Run via: `bun run seed` (or `npx tsx prisma/seed.ts`)
 */
import { PrismaClient, type Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

function pickImage(seed: string, w = 800, h = 600) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

function doctorAvatar(seed: string) {
  // Professional placeholder — abstract face-free portrait via picsum
  return `https://picsum.photos/seed/${encodeURIComponent("doc-" + seed)}/600/750`;
}

async function main() {
  console.log("🌱 Seeding Beauty Clinic DB...");

  // ================= USERS =================
  const adminPassword = await bcrypt.hash("Admin@2026", 10);
  const customerPassword = await bcrypt.hash("Client@2026", 10);
  const doctorPassword = await bcrypt.hash("Doctor@2026", 10);

  const adminUser = await db.user.upsert({
    where: { email: "admin@clinic.com" },
    update: {},
    create: {
      email: "admin@clinic.com",
      passwordHash: adminPassword,
      name: "Admin",
      role: "ADMIN" as Role,
    },
  });

  const doctorUser1 = await db.user.upsert({
    where: { email: "sara@clinic.com" },
    update: {},
    create: {
      email: "sara@clinic.com",
      passwordHash: doctorPassword,
      name: "د. سارة العتيبي",
      role: "DOCTOR" as Role,
    },
  });

  const customerUser = await db.user.upsert({
    where: { email: "client@clinic.com" },
    update: {},
    create: {
      email: "client@clinic.com",
      passwordHash: customerPassword,
      name: "نورة",
      role: "CUSTOMER" as Role,
    },
  });

  console.log(`  ✓ users (${adminUser.email}, ${doctorUser1.email}, ${customerUser.email})`);

  // ================= CUSTOMERS =================
  const customers = [
    { userId: customerUser.id, firstName: "نورة", lastName: "العمري", phone: "+966560000011", gender: "FEMALE", notes: "" },
  ];
  for (const c of customers) {
    await db.customer.upsert({
      where: { userId: c.userId },
      update: {},
      create: c,
    });
  }
  const customer = await db.customer.findUnique({ where: { userId: customerUser.id } });
  console.log("  ✓ customers (1)");

  // ================= SERVICES =================
  const services = [
    {
      slug: "laser",
      name: "الليزر",
      nameEn: "Laser Hair Removal",
      shortDesc: "إزالة الشعر بالليزر بأحدث الأجهزة ولبشرة ناعمة بلا تشقير.",
      shortDescEn: "State-of-the-art laser hair removal for smooth, long-lasting results.",
      fullDesc:
        "تقنية ليزر متطورة تستهدف بصيلات الشعر بدقة وأمان تام، تناسب مختلف أنواع البشرة. نستخدم أجهزة معتمدة عالميًا تقلل الألم وتحسن النتائج من جلسة لأخرى. الجلسة تشمل تنظيف البشرة وتحديد المنطقة وعملية الليزر ومستحضرات مهدئة بعدها.",
      fullDescEn:
        "Advanced laser technology targets hair follicles with precision and full safety for all skin types. We use globally certified devices that minimize discomfort and improve results session after session. Each session includes skin cleansing, area mapping, the laser procedure, and soothing after-care products.",
      image: pickImage("laser-skin", 1200, 800),
      durationMin: 45,
      price: 600,
      category: "Skin",
    },
    {
      slug: "botox",
      name: "البوتوكس",
      nameEn: "Botox",
      shortDesc: "حقن البوتوكس لتنعيم التجاعيد وإطلالة أكثر شبابًا.",
      shortDescEn: "Botox injections to soften wrinkles and restore a youthful look.",
      fullDesc:
        "حقن البوتولينوم توكسين بمقادير مضبوطة لمعالجة خطوط الجبهة، محيط العين، وما بين الحاجبين. إجراء سريع وآمن يقوم به طبيب مختص بعد تقييم حالة البشرة وتحديد النقاط الأمثل للحفاظ على تعبيرات الوجه الطبيعية.",
      fullDescEn:
        "Botulinum toxin injections in carefully measured doses to treat forehead lines, crow's feet, and glabellar lines. A quick, safe procedure performed by a specialist after assessing the skin and marking optimal points to preserve natural facial expressions.",
      image: pickImage("botox", 1200, 800),
      durationMin: 30,
      price: 1200,
      category: "Face",
    },
    {
      slug: "fillers",
      name: "الفيلر",
      nameEn: "Dermal Fillers",
      shortDesc: "فيلر حمض الهيالورونيك لنحت الوجه وملء التجاعيد.",
      shortDescEn: "Hyaluronic acid fillers for facial contouring and wrinkle filling.",
      fullDesc:
        "حقن الفيلر بحمض الهيالورونيك لمزيد من الامتلاء في الشفاه، الخدود، وتصحيح التجاويف والخطوط العميقة. نستخدم منتجات معتمدة من وكالات الأدوية العالمية، وتتم العملية على يد طبيب مختص بمهارة عالية لضمان نتيجة طبيعية ومتناسقة.",
      fullDescEn:
        "Hyaluronic acid filler injections to add volume to lips, cheeks, and correct hollow areas and deep lines. We use only products approved by global regulatory bodies. The procedure is performed by a specialist physician with high skill to ensure natural, harmonious results.",
      image: pickImage("fillers", 1200, 800),
      durationMin: 45,
      price: 1500,
      category: "Face",
    },
    {
      slug: "skin-boosters",
      name: "إبر النضارة",
      nameEn: "Skin Boosters",
      shortDesc: "إبر النضارة لترطيب عميق ولمعان طبيعي للبشرة.",
      shortDescEn: "Skin booster injections for deep hydration and a natural glow.",
      fullDesc:
        "حقن متعددة لطبقات الجلد السطحية بمزيج من حمض الهيالورونيك والفيتامينات والمعادن لترطيب عميق وتغذية البشرة من الداخل. ينصح بها للبشرة الباهتة والجافة وللحصول على نضارة طبيعية دون فترة نقاهة طويلة.",
      fullDescEn:
        "Multiple micro-injections into the superficial dermis with a blend of hyaluronic acid, vitamins, and minerals for deep hydration and inner nourishment. Recommended for dull, dry skin and to restore natural glow with minimal downtime.",
      image: pickImage("skin-booster", 1200, 800),
      durationMin: 30,
      price: 900,
      category: "Skin",
    },
    {
      slug: "body-tightening",
      name: "شد الجسم",
      nameEn: "Body Tightening",
      shortDesc: "تقنيات حديثة لشد الجلد المترهل وتحسين الملمس.",
      shortDescEn: "Advanced technologies to tighten lax skin and improve texture.",
      fullDesc:
        "جلسات تستخدم تقنيات موجات راديوية أو أولترا ساوند لشد الجلد وتحفيز الكولاجين، مناسبة لمناطق البطن، الذراعين، الفخذين، والرقبة. إجراء غير جراحي بإشراف طبي مختص.",
      fullDescEn:
        "Sessions that use radiofrequency or ultrasound technology to tighten skin and stimulate collagen. Suitable for abdomen, arms, thighs, and neck. A non-surgical procedure supervised by a specialist.",
      image: pickImage("body-tightening", 1200, 800),
      durationMin: 60,
      price: 1100,
      category: "Body",
    },
    {
      slug: "body-contouring",
      name: "نحت الجسم",
      nameEn: "Body Contouring",
      shortDesc: "تقنيات إذابة الدهون ونحت القوام دون جراحة.",
      shortDescEn: "Fat-dissolving technologies to sculpt the body without surgery.",
      fullDesc:
        "استخدام تقنيات الكرايوليبوليسس أو الليزر لإذابة الدهون الموضعية التي لا تستجيب للحمية والرياضة. مناسبة لمناطق الكرش، الجوانب، الظهر، والفخذين. نتائج تظهر تدريجيًا خلال أسابيع.",
      fullDescEn:
        "Using cryolipolysis or laser technologies to dissolve localized fat that doesn't respond to diet and exercise. Suitable for belly, flanks, back, and thighs. Results appear gradually over weeks.",
      image: pickImage("body-contouring", 1200, 800),
      durationMin: 60,
      price: 1800,
      category: "Body",
    },
    {
      slug: "rhinoplasty",
      name: "تجميل الأنف",
      nameEn: "Rhinoplasty / Nose Aesthetics",
      shortDesc: "تجميل الأنف بالفيلر أو التنعيم غير الجراحي.",
      shortDescEn: "Non-surgical nose aesthetic refinement with fillers.",
      fullDesc:
        "تعديل ملامح الأنف بالفيلر لتنعيم الحدبة، رفع مقدمة الأنف، وتحسين التناسب الوجهي دون جراحة أو نقاهة طويلة. إجراء يتطلب خبيرًا متخصصًا في تشريح الوجه.",
      fullDescEn:
        "Refining nose profile with dermal fillers to smooth humps, lift the tip, and improve facial balance without surgery or long downtime. A procedure that requires a face anatomy expert.",
      image: pickImage("rhinoplasty", 1200, 800),
      durationMin: 30,
      price: 2200,
      category: "Face",
    },
  ];

  const serviceRecords = [];
  for (const s of services) {
    const r = await db.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
    serviceRecords.push(r);
  }
  console.log(`  ✓ services (${serviceRecords.length})`);

  // ================= FAQs =================
  const faqs = [
    { slug: "laser", q: "هل مناسب لجميع أنواع البشرة؟", a: "نعم، نستخدم أجهزة ليزر تدعم مختلف درجات البشرة من الفاتحة للداكنة بأمان." },
    { slug: "laser", q: "كم عدد الجلسات المطلوبة؟", a: "غالبًا من 6 إلى 8 جلسات بفاصل 4 إلى 6 أسابيع للحصول على نتائج مثالية." },
    { slug: "botox", q: "متى تظهر النتيجة؟", a: "تبدأ النتائج خلال 3 إلى 7 أيام وتستمر من 4 إلى 6 أشهر." },
    { slug: "botox", q: "هل يوجد فترة نقاهة؟", a: "لا توجد فترة نقاهة حقيقية، يمكن العودة للنشاط اليومي مباشرة." },
    { slug: "fillers", q: "هل المادة آمنة؟", a: "نستخدم فيلرات حمض هيالورونيك معتمدة من FDA وأحماض طبيعية تذوب تدريجيًا." },
    { slug: "skin-boosters", q: "هل يحتاج إعادة؟", a: "يُنصح بـ 3 جلسات شهرية ثم جلسة صيانة كل 4 إلى 6 أشهر." },
    { slug: "rhinoplasty", q: "هل النتيجة دائمة؟", a: "النتيجة تستمر من 9 إلى 12 شهرًا ثم تحتاج للتجديد." },
  ];
  for (const f of faqs) {
    const s = serviceRecords.find((x) => x.slug === f.slug);
    if (s) {
      await db.serviceFaq.upsert({
        where: { id: "faq-" + s.slug },
        update: {},
        create: { serviceId: s.id, question: f.q, answer: f.a, order: 0 },
      }).catch(() => {});
    }
  }
  console.log(`  ✓ faqs (${faqs.length})`);

  // ================= DOCTORS =================
  const doctors = [
    {
      name: "د. سارة العتيبي",
      nameEn: "Dr. Sara Al-Otaibi",
      title: "أخصائية الجلدية والليزر",
      titleEn: "Dermatologist & Laser Specialist",
      specialty: "جلدية وليزر",
      specialtyEn: "Dermatology & Laser",
      bio: "خبرة 12 عامًا في علاج مشاكل البشرة وعمليات الليزر التجميلي، عضو الجمعية السعودية للأمراض الجلدية.",
      bioEn: "12 years of experience in dermatology and aesthetic laser procedures, member of the Saudi Dermatology Society.",
      image: doctorAvatar("sara"),
      experienceYears: 12,
      rating: 4.9,
      reviewCount: 248,
      serviceSlugs: ["laser", "skin-boosters"],
    },
    {
      name: "د. ليان القحطاني",
      nameEn: "Dr. Layan Al-Qahtani",
      title: "أخصائية التجميل والحقن",
      titleEn: "Aesthetic & Injections Specialist",
      specialty: "تجميل وحقن",
      specialtyEn: "Aesthetics & Injections",
      bio: "متخصصة في حقن البوتوكس والفيلر وتجميل الوجه غير الجراحي، حاصلة على شهادات دولية في الطب التجميلي.",
      bioEn: "Specialized in Botox and dermal fillers and non-surgical facial aesthetics, holding international certifications in aesthetic medicine.",
      image: doctorAvatar("layan"),
      experienceYears: 9,
      rating: 4.8,
      reviewCount: 192,
      serviceSlugs: ["botox", "fillers", "rhinoplasty"],
    },
    {
      name: "د. نورة الشمري",
      nameEn: "Dr. Noura Al-Shamri",
      title: "أخصائية البشرة والنضارة",
      titleEn: "Skin & Glow Specialist",
      specialty: "بشرة ونضارة",
      specialtyEn: "Skin & Glow",
      bio: "خبيرة في علاج البشرة وإبر النضارة والميزوثيرابي، تركّز على العناية الفائقة بالبشرة الداكنة والباهتة.",
      bioEn: "Expert in skincare, skin boosters, and mesotherapy, focused on premium care for dull and tired skin.",
      image: doctorAvatar("noura"),
      experienceYears: 8,
      rating: 4.9,
      reviewCount: 156,
      serviceSlugs: ["skin-boosters", "laser"],
    },
    {
      name: "د. خالد العبدالله",
      nameEn: "Dr. Khaled Al-Abdullah",
      title: "استشاري جراحة وتجميل الأنف",
      titleEn: "Consultant Rhinoplasty & Facial Surgery",
      specialty: "جراحة وتجميل الأنف",
      specialtyEn: "Rhinoplasty & Facial Surgery",
      bio: "استشاري جراحة تجميل الوجه والأنف بخبرة تتجاوز 15 عامًا، عضو الجمعية الدولية لجراحة التجميل.",
      bioEn: "Consultant for facial and nose plastic surgery with 15+ years, ISAPS member.",
      image: doctorAvatar("khaled"),
      experienceYears: 15,
      rating: 5.0,
      reviewCount: 312,
      serviceSlugs: ["rhinoplasty", "fillers", "botox"],
    },
    {
      name: "د. ريم الحربي",
      nameEn: "Dr. Reem Al-Harbi",
      title: "أخصائية شد ونحت الجسم",
      titleEn: "Body Contouring & Tightening Specialist",
      specialty: "شد ونحت الجسم",
      specialtyEn: "Body Contouring & Tightening",
      bio: "متخصصة في تقنيات نحت وشد الجسم بالأجهزة الحديثة وبروتوكولات مخصصة لكل عميلة.",
      bioEn: "Specialized in body contouring and tightening with modern devices and tailored protocols per client.",
      image: doctorAvatar("reem"),
      experienceYears: 10,
      rating: 4.7,
      reviewCount: 124,
      serviceSlugs: ["body-tightening", "body-contouring"],
    },
  ];

  const doctorRecords = [];
  for (const d of doctors) {
    const r = await db.doctor.upsert({
      where: { name: d.name },
      update: {},
      create: {
        name: d.name,
        nameEn: d.nameEn,
        title: d.title,
        titleEn: d.titleEn,
        specialty: d.specialty,
        specialtyEn: d.specialtyEn,
        bio: d.bio,
        bioEn: d.bioEn,
        image: d.image,
        experienceYears: d.experienceYears,
        rating: d.rating,
        reviewCount: d.reviewCount,
      },
    });
    // link services
    for (const slug of d.serviceSlugs) {
      const s = serviceRecords.find((x) => x.slug === slug);
      if (s) {
        await db.doctorService.upsert({
          where: { doctorId_serviceId: { doctorId: r.id, serviceId: s.id } },
          update: {},
          create: { doctorId: r.id, serviceId: s.id },
        }).catch(() => {});
      }
    }
    doctorRecords.push(r);
  }
  console.log(`  ✓ doctors (${doctorRecords.length})`);

  // ================= SCHEDULES =================
  // Working days Sunday–Thursday, off Friday & Saturday
  for (const doc of doctorRecords) {
    for (let day = 0; day <= 6; day++) {
      const isWorking = day !== 5; // Friday off
      const start = day === 2 || day === 4 ? "13:00" : "10:00"; // Tue/Thu afternoon start
      const end = day === 2 || day === 4 ? "20:00" : "17:00";
      await db.schedule.create({
        data: { doctorId: doc.id, dayOfWeek: day, startTime: start, endTime: end, isWorking },
      }).catch(() => {});
    }
  }
  console.log("  ✓ schedules");

  // ================= NOTIFICATIONS =================
  if (customerUser) {
    await db.notification.create({
      data: {
        userId: customerUser.id,
        type: "BOOKING_CREATED",
        title: "أهلًا بكِ في عيادتنا",
        message: "أهلًا بكِ في عائلة العيادة، نحن متحمّسون لرؤيتكِ قريبًا.",
        isRead: false,
      },
    }).catch(() => {});
  }
  console.log("  ✓ notifications");

  // ================= REVIEWS =================
  const reviewData = [
    { name: "أمل", nameEn: "Amal", rating: 5, comment: "تجربة رائعة من أول استقبال للنتيجة النهائية، أنصح به بشدة.", commentEn: "Wonderful experience from reception to final result, highly recommend.", serviceSlug: "laser" },
    { name: "ريم", nameEn: "Reem", rating: 5, comment: "الطاقم محترف ودكتور سارة ممتازة، البشرة صارت أنعم.", commentEn: "Professional staff, Dr. Sara is excellent, skin feels smoother.", serviceSlug: "laser" },
    { name: "سارة", nameEn: "Sarah", rating: 5, comment: "نتيجة البوتوكس فاقت توقعاتي بدون أي ألم.", commentEn: "Botox results exceeded expectations with no pain.", serviceSlug: "botox" },
    { name: "لمى", nameEn: "Lama", rating: 4, comment: "تجربة جيدة والنتيجة مرضية، أنصح به.", commentEn: "Good experience and satisfying result, recommend.", serviceSlug: "fillers" },
    { name: "هند", nameEn: "Hind", rating: 5, comment: "إبر النضارة غيّرت ملمس بشرتي تمامًا.", commentEn: "Skin boosters completely transformed my skin texture.", serviceSlug: "skin-boosters" },
    { name: "ندى", nameEn: "Nada", rating: 5, comment: "النحت كان سلسًا والنتائج رائعة.", commentEn: "Contouring was smooth and results are amazing.", serviceSlug: "body-contouring" },
    { name: "منيرة", nameEn: "Munira", rating: 5, comment: "تجميل الأنف بالفيلر غيّر شكل وجهي بدون جراحة.", commentEn: "Nose filler changed my face shape without surgery.", serviceSlug: "rhinoplasty" },
  ];

  for (const r of reviewData) {
    const s = serviceRecords.find((x) => x.slug === r.serviceSlug);
    await db.testimonial.upsert({
      where: { id: "tst-" + r.nameEn },
      update: {},
      create: {
        id: "tst-" + r.nameEn,
        name: r.name,
        nameEn: r.nameEn,
        role: "عميلة",
        roleEn: "Client",
        avatar: pickImage("avatar-" + r.nameEn, 200, 200),
        rating: r.rating,
        comment: r.comment,
        commentEn: r.commentEn,
        isApproved: true,
      },
    }).catch(() => {});
    if (s && customerUser) {
      await db.review.create({
        data: {
          userId: customerUser.id,
          customerId: customer?.id,
          serviceId: s.id,
          rating: r.rating,
          comment: r.comment,
          isApproved: true,
        },
      }).catch(() => {});
    }
  }
  console.log(`  ✓ testimonials (${reviewData.length})`);

  // ================= BEFORE/AFTER GALLERY =================
  const galleryItems = [
    { title: "نتيجة الليزر", titleEn: "Laser Result", serviceSlug: "laser" },
    { title: "نتيجة البوتوكس", titleEn: "Botox Result", serviceSlug: "botox" },
    { title: "نتيجة الفيلر", titleEn: "Filler Result", serviceSlug: "fillers" },
    { title: "نضارة البشرة", titleEn: "Skin Glow", serviceSlug: "skin-boosters" },
    { title: "شد البطن", titleEn: "Tummy Tightening", serviceSlug: "body-tightening" },
    { title: "نحت الجسم", titleEn: "Body Contouring", serviceSlug: "body-contouring" },
  ];
  for (const g of galleryItems) {
    const s = serviceRecords.find((x) => x.slug === g.serviceSlug);
    await db.galleryItem.create({
      data: {
        title: g.title,
        titleEn: g.titleEn,
        serviceId: s?.id,
        beforeImage: pickImage("before-" + g.serviceSlug, 800, 800),
        afterImage: pickImage("after-" + g.serviceSlug, 800, 800),
      },
    }).catch(() => {});
  }
  console.log(`  ✓ gallery items (${galleryItems.length})`);

  // ================= SAMPLE APPOINTMENTS =================
  const sa = doctorRecords[0];
  const sb = serviceRecords[0];
  if (customer && sa && sb) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(11, 0, 0, 0);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(13, 30, 0, 0);
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 14);
    pastDate.setHours(10, 0, 0, 0);

    for (const [i, dt] of [tomorrow, nextWeek, pastDate].entries()) {
      const ref = `CLN-SEED-${i}`;
      try {
        const appt = await db.appointment.create({
          data: {
            bookingRef: ref,
            customerId: customer.id,
            doctorId: i === 0 ? sa.id : doctorRecords[i % doctorRecords.length].id,
            serviceId: serviceRecords[i % serviceRecords.length].id,
            date: dt,
            timeSlot: `${String(dt.getHours()).padStart(2, "0")}:00`,
            status: i === 2 ? "COMPLETED" : "CONFIRMED",
            notes: "",
          },
        });
        await db.payment.create({
          data: {
            appointmentId: appt.id,
            customerId: customer.id,
            userId: customerUser.id,
            amount: serviceRecords[i % serviceRecords.length].price,
            method: i === 0 ? "CASH" : "CREDIT_CARD",
            status: i === 2 ? "PAID" : "PAID",
            txnRef: "TXN-SEED-" + i,
            paidAt: new Date(),
          },
        }).catch(() => {});
      } catch (e) {
        // unique constraint may skip duplicates
      }
    }
    console.log("  ✓ sample appointments");
  }

  // ================= SETTINGS =================
  const settings = [
    { key: "clinic.name", value: "عيادة الجمال" },
    { key: "clinic.nameEn", value: "Beauty Clinic" },
    { key: "clinic.phone", value: "+966 11 200 0000" },
    { key: "clinic.email", value: "info@clinic.com" },
    { key: "clinic.address", value: "الرياض، حي العليا، طريق الملك فهد" },
    { key: "clinic.addressEn", value: "Riyadh, Al Olaya, King Fahd Road" },
    { key: "clinic.hours", value: "الأحد - الخميس: 10ص - 9م، الجمعة: مغلق" },
    { key: "clinic.hoursEn", value: "Sun–Thu: 10AM–9PM, Fri: Closed" },
    { key: "clinic.facebook", value: "#" },
    { key: "clinic.instagram", value: "#" },
    { key: "clinic.twitter", value: "#" },
    { key: "clinic.whatsapp", value: "+9665600000000" },
  ];
  for (const s of settings) {
    await db.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log("  ✓ settings");

  console.log("✅ Seeding complete");
  console.log("  Admin credentials: admin@clinic.com / Admin@2026");
  console.log("  Customer credentials: client@clinic.com / Client@2026");
  console.log("  Doctor credentials: sara@clinic.com / Doctor@2026");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
