// Minimal root layout - just the html/body shell with the globals.
// Per-locale rendering happens in [locale]/layout.tsx (which sets lang/dir).
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { ServiceWorkerRegister } from "@/components/pwa/register-sw";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground min-h-screen flex flex-col">
        <Providers>{children}</Providers>
        <ServiceWorkerRegister />
        <Toaster />
        <SonnerToaster richColors position="top-center" />
      </body>
    </html>
  );
}
