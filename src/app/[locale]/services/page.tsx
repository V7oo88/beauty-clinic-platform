import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ServicesListClient } from "@/components/clinic/services-list";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/public-settings";
import { setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/clinic/breadcrumbs";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const settings = await getSettings();
  const services = await db.service.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    include: { faqs: true },
  });

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 pt-6">
          <Breadcrumbs items={[{ label: locale === "ar" ? "الخدمات" : "Services" }]} />
        </div>
        <ServicesListClient services={services} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
