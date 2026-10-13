import { db } from "@/lib/db";
import { AdminSettingsClient } from "@/components/admin/settings";
import { setRequestLocale } from "next-intl/server";

export default async function AdminSettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const rows = await db.setting.findMany();
  const settings: Record<string, string> = {};
  for (const r of rows) settings[r.key] = r.value;
  return <AdminSettingsClient settings={settings} />;
}
