import type { Metadata } from "next";
import "./globals.css";
import { RealtimeProvider } from "@/lib/realtime-telemetry";

export const metadata: Metadata = {
  title: "TERRAFLUX AI — Intelijen Risiko Banjir & Kebakaran Hutan",
  description: "Platform demonstrasi intelijen geospasial multi-bahaya untuk eksplorasi risiko banjir dan kebakaran hutan di Indonesia.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full bg-[#060b14] text-white selection:bg-cyan-500/30 selection:text-white font-sans">
        <RealtimeProvider>{children}</RealtimeProvider>
      </body>
    </html>
  );
}
