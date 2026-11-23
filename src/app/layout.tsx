import type { Metadata } from "next";
import "./globals.css";
import { RealtimeProvider } from "@/lib/realtime-telemetry";

export const metadata: Metadata = {
  title: "TERRAFLUX AI — Intelijen Risiko Banjir",
  description:
    "Platform intelijen geospasial untuk analisis dan eksplorasi risiko banjir di Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full bg-white text-slate-900 selection:bg-blue-600/20 selection:text-blue-900 font-sans">
        <RealtimeProvider>{children}</RealtimeProvider>
      </body>
    </html>
  );
}
