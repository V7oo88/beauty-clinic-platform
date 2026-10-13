import { db } from "@/lib/db";
import { getSettings } from "@/lib/public-settings";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HomeHero } from "@/components/clinic/home-hero";
import { HomeStats } from "@/components/clinic/home-stats";
import { HomeServices } from "@/components/clinic/home-services";
import { HomeDoctors } from "@/components/clinic/home-doctors";
import { HomeWhyUs } from "@/components/clinic/home-why-us";
import { HomeGallery } from "@/components/clinic/home-gallery";
import { HomeTestimonials } from "@/components/clinic/home-testimonials";
import { HomeCta } from "@/components/clinic/home-cta";
import { StickyBookingCta } from "@/components/clinic/sticky-booking-cta";
import { setRequestLocale } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const settings = await getSettings();
  const services = await db.service.findMany({
    where: { isActive: true },
    take: 6,
    orderBy: { createdAt: "asc" },
  });
  const doctors = await db.doctor.findMany({
    where: { isActive: true },
    take: 4,
    orderBy: { rating: "desc" },
  });
  const gallery = await db.galleryItem.findMany({ take: 6, orderBy: { createdAt: "asc" } });
  const testimonials = await db.testimonial.findMany({
    where: { isApproved: true },
    take: 3,
    orderBy: { rating: "desc" },
  });

  return (
    <>
      <Header />
      <main className="flex-1">
        <HomeHero settings={settings} />
        <HomeStats />
        <HomeServices services={services} />
        <HomeDoctors doctors={doctors} />
        <HomeWhyUs />
        <HomeGallery items={gallery} />
        <HomeTestimonials testimonials={testimonials} />
        <HomeCta />
      </main>
      <Footer settings={settings} />
      <StickyBookingCta />
    </>
  );
}
