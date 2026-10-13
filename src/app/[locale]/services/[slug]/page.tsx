import { db } from "@/lib/db";
import { getSettings } from "@/lib/public-settings";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Breadcrumbs } from "@/components/clinic/breadcrumbs";
import { ServiceDetailClient } from "@/components/clinic/service-detail";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const service = await db.service.findUnique({
    where: { slug },
    include: {
      faqs: { orderBy: { order: "asc" } },
      doctors: { include: { doctor: true } },
    },
  });
  if (!service || !service.isActive) notFound();
  const settings = await getSettings();

  const doctors = service.doctors.map((d) => d.doctor);

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 pt-6">
          <Breadcrumbs
            items={[
              { label: locale === "ar" ? "الخدمات" : "Services", href: `/${locale}/services` },
              { label: locale === "ar" ? service.name : service.nameEn },
            ]}
          />
        </div>
        <ServiceDetailClient service={service} doctors={doctors} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
