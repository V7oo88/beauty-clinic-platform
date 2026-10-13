import { requireRole, getCurrentUser } from "@/lib/server-utils";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login?callbackUrl=/${locale}/admin`);
  if (user.role !== "ADMIN") redirect(`/${locale}`);
  return <AdminShell user={JSON.parse(JSON.stringify(user))}>{children}</AdminShell>;
}
