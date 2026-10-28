"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  MapPin,
  BarChart3,
  BrainCircuit,
  SlidersHorizontal,
  FileCheck2,
  History,
  Info,
  Globe2,
  Waves,
  Flame,
} from "lucide-react";
import { useHazardControl } from "@/lib/realtime-telemetry";
import { TelemetryTicker } from "./telemetry-ticker";
import { TerrafluxLogo } from "./terraflux-logo";

const navigation = [
  { href: "/", label: "Beranda", icon: Globe2 },
  { href: "/risk-map", label: "Peta Risiko", icon: MapPin },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/intelligence", label: "AI Intelijen", icon: BrainCircuit },
  { href: "/simulator", label: "Simulator", icon: SlidersHorizontal },
  { href: "/recommendations", label: "Rekomendasi", icon: FileCheck2 },
  { href: "/history", label: "Riwayat", icon: History },
  { href: "/about", label: "Metodologi", icon: Info },
];

function HeaderNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { hazardMode, setHazardMode } = useHazardControl();
  const isWildfire = hazardMode === "wildfire";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-slate-950/95 backdrop-blur-md">
        <div className="mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-6">
          <div className="flex h-16 items-center justify-between gap-2 xl:gap-3">
            {/* Logo & Brand — Professional Custom Emblem & Clean Brand Name */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <TerrafluxLogo size={38} isWildfire={isWildfire} />
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white font-sans">
                  TERRAFLUX
                </span>
                <span className={`font-mono text-[11px] sm:text-xs px-1.5 py-0.5 rounded font-extrabold tracking-wider ${
                  isWildfire
                    ? "bg-amber-500/20 text-amber-300 border border-amber-400/35"
                    : "bg-cyan-500/20 text-cyan-300 border border-cyan-400/35"
                }`}>
                  AI
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden items-center gap-0.5 xl:gap-1 lg:flex">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 rounded-full px-2.5 xl:px-3 py-1.5 text-[11.5px] font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? isWildfire
                          ? "bg-amber-500/20 text-amber-200 ring-1 ring-amber-400/40 shadow-sm shadow-amber-500/20"
                          : "bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-400/40 shadow-sm shadow-cyan-500/20"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? (isWildfire ? "text-amber-300" : "text-cyan-300") : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons: Executive Hazard Switcher & Tools */}
            <div className="hidden items-center gap-2 lg:flex shrink-0">
              {/* PRIMARY MULTI-HAZARD MODE SWITCHER */}
              <div
                role="group"
                aria-label="Pilih Mode Bahaya Intelijen"
                className="flex items-center rounded-full border border-white/15 bg-slate-950/90 p-0.5 shadow-inner shadow-black/60 shrink-0"
              >
                {/* Mode 1: Banjir */}
                <button
                  type="button"
                  aria-pressed={hazardMode === "flood"}
                  onClick={() => setHazardMode("flood")}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all duration-200 ${
                    hazardMode === "flood"
                      ? "bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 shadow-md shadow-cyan-500/30"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                  title="Aktifkan Intelijen Risiko Banjir: Curah Hujan, Muka Air, & Drainase"
                >
                  <Waves className={`h-3.5 w-3.5 ${hazardMode === "flood" ? "text-slate-950" : "text-cyan-400"}`} />
                  <span>Banjir</span>
                </button>

                {/* Mode 2: Karhutla */}
                <button
                  type="button"
                  aria-pressed={hazardMode === "wildfire"}
                  onClick={() => setHazardMode("wildfire")}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all duration-200 ${
                    hazardMode === "wildfire"
                      ? "bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md shadow-orange-500/30"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                  title="Aktifkan Intelijen Kebakaran Hutan & Lahan Gambut (Karhutla): Titik Panas, Kekeringan, & Angin"
                >
                  <Flame className={`h-3.5 w-3.5 ${hazardMode === "wildfire" ? "text-slate-950" : "text-amber-400"}`} />
                  <span>Karhutla</span>
                </button>
              </div>
            </div>

            {/* Mobile Hamburger */}
            <button
              type="button"
              className="inline-flex rounded-xl border border-white/10 p-2 text-slate-300 lg:hidden hover:bg-white/5"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Drawer */}
          {mobileOpen && (
            <div className="border-t border-cyan-500/20 py-4 lg:hidden animate-in fade-in">
              {/* Hazard Mode Mobile Selector */}
              <div className="mb-4 rounded-2xl border border-white/15 bg-slate-900/90 p-2">
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-2 px-1">
                  PILIH INTELIJEN BENCANA:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    aria-pressed={hazardMode === "flood"}
                    onClick={() => setHazardMode("flood")}
                    className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
                      hazardMode === "flood"
                        ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/25"
                        : "bg-slate-950 text-slate-300 border border-white/10"
                    }`}
                  >
                    <Waves className="h-4 w-4" />
                    <span>Risiko Banjir</span>
                  </button>
                  <button
                    type="button"
                    aria-pressed={hazardMode === "wildfire"}
                    onClick={() => setHazardMode("wildfire")}
                    className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
                      hazardMode === "wildfire"
                        ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-500/25"
                        : "bg-slate-950 text-slate-300 border border-white/10"
                    }`}
                  >
                    <Flame className="h-4 w-4" />
                    <span>Kebakaran Hutan</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pb-3">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                        isActive
                          ? isWildfire
                            ? "bg-amber-500/20 text-amber-200 border border-amber-400/30"
                            : "bg-cyan-500/20 text-cyan-200 border border-cyan-400/30"
                          : "text-slate-300 hover:bg-white/5"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isWildfire ? "text-amber-400" : "text-cyan-400"}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-center rounded-xl py-2.5 text-xs font-bold text-slate-950 ${
                    isWildfire ? "bg-amber-400" : "bg-cyan-400"
                  }`}
                >
                  Buka Command Center
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { hazardMode } = useHazardControl();
  const isWildfire = hazardMode === "wildfire";

  return (
    <div className="min-h-screen bg-[#050913] text-slate-100 flex flex-col selection:bg-cyan-500/30">
      {/* Real-time Ticker Header */}
      <TelemetryTicker />

      {/* Navigation Bar */}
      <HeaderNav />

      {/* Main Content Area */}
      <div className="flex-1 mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-6 py-4 sm:py-5 w-full">{children}</div>

      {/* High-Tech Championship Footer */}
      <footer className="border-t border-cyan-500/20 bg-[#03060c] text-slate-400 text-xs mt-12">
        <div className="mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-6 py-8">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand Col */}
            <div>
              <div className="flex items-center gap-2.5 text-white font-bold text-base">
                <TerrafluxLogo size={30} isWildfire={isWildfire} />
                <span className="font-extrabold tracking-tight">TERRAFLUX AI</span>
              </div>
              <p className="mt-3 text-slate-400 leading-relaxed text-xs">
                Platform intelijen geospasial terpadu untuk analisis risiko multi-bencana: banjir perkotaan dan kebakaran hutan & lahan di Indonesia.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Multi-Hazard Engine · Mode {isWildfire ? "Kebakaran Hutan" : "Banjir"} Aktif</span>
              </div>
            </div>

            {/* Modules Col */}
            <div>
              <div className="font-semibold uppercase font-mono tracking-wider text-[11px] mb-3 text-cyan-300">
                Modul Intelijen
              </div>
              <ul className="space-y-2">
                {navigation.slice(0, 4).map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-cyan-300 transition">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Features Col */}
            <div>
              <div className="font-semibold uppercase font-mono tracking-wider text-[11px] mb-3 text-cyan-300">
                Simulasi & Analisis
              </div>
              <ul className="space-y-2">
                {navigation.slice(4).map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-cyan-300 transition">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* SDG & Standards */}
            <div>
              <div className="font-semibold uppercase font-mono tracking-wider text-[11px] mb-3 text-cyan-300">
                Keselarasan Global UN SDG
              </div>
              <div className="space-y-2">
                <div className="rounded-lg border border-white/10 bg-slate-900/60 p-2">
                  <div className="font-bold text-white text-[11px]">UN SDG 11: Kota Tangguh Bencana</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Adaptasi drainase, sponge city, & mitigasi banjir perkotaan</div>
                </div>
                <div className="rounded-lg border border-white/10 bg-slate-900/60 p-2">
                  <div className="font-bold text-white text-[11px]">UN SDG 13: Aksi Penanganan Iklim</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Peringatan dini curah hujan ekstrem & kekeringan</div>
                </div>
                <div className="rounded-lg border border-white/10 bg-slate-900/60 p-2">
                  <div className="font-bold text-white text-[11px]">UN SDG 15: Ekosistem Daratan & Gambut</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Restorasi gambut, sekat kanal, & proteksi tutupan hutan</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-4 rounded-xl bg-slate-950/40 p-3 text-[11px] text-slate-400 flex items-start gap-2 border border-white/5">
            <span className="font-mono text-amber-300 font-bold shrink-0">DISCLAIMER KEJUJURAN DATA:</span>
            <span>
              TERRAFLUX AI menyajikan model screening multi-bahaya terpadu dengan data simulasi dan indikator konseptual untuk keperluan demonstrasi akademik dan eksplorasi kesiapsiagaan bencana. Data ini bukan instrumen pemantauan operasional resmi BMKG/KLHK/BNPB.
            </span>
          </div>

          <div className="mt-6 border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4 text-[11px]">
            <div>
              © 2026 TERRAFLUX AI — Platform Intelijen Risiko Multi-Bahaya (Banjir & Kebakaran Hutan).
            </div>
            <div className="flex items-center gap-4 text-cyan-300/80 font-mono">
              <span>Arsitektur: Dual-Hazard Geo-AI</span>
              <span>•</span>
              <span>Protokol: WebGL + Turbopack</span>
              <span>•</span>
              <span>Status: Terverifikasi</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
