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
} from "lucide-react";
import { TelemetryTicker } from "./telemetry-ticker";
import { TerrafluxLogo } from "./terraflux-logo";

const navigation = [
  { href: "/", label: "Beranda", icon: Globe2 },
  { href: "/risk-map", label: "1. Pemantauan", icon: MapPin },
  { href: "/intelligence", label: "2. Diagnosis AI", icon: BrainCircuit },
  { href: "/simulator", label: "3. Simulator", icon: SlidersHorizontal },
  { href: "/recommendations", label: "4. SOP Aksi", icon: FileCheck2 },
  { href: "/dashboard", label: "Dashboard Data", icon: BarChart3 },
  { href: "/about", label: "Metodologi", icon: Info },
];

function HeaderNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <TerrafluxLogo size={34} />
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-slate-900">
                TERRAFLUX
              </span>
              <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action */}
          <div className="hidden lg:flex items-center gap-2.5">
            <Link
              href="/dashboard"
              className="rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
            >
              Command Center
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="inline-flex rounded-lg border border-slate-200 p-2 text-slate-600 lg:hidden hover:bg-slate-50"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="border-t border-slate-200 py-3 lg:hidden">
            <div className="grid grid-cols-2 gap-1 pb-3">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="h-4 w-4 text-slate-400" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center rounded-lg bg-blue-600 py-2.5 text-xs font-semibold text-white"
              >
                Buka Command Center
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <TelemetryTicker />
      <HeaderNav />

      <div className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 w-full">
        {children}
      </div>

      <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <TerrafluxLogo size={24} />
                <span>TERRAFLUX AI</span>
              </div>
              <p className="mt-2 text-slate-500 leading-relaxed text-xs">
                Platform intelijen geospasial berbasis AI untuk deteksi dini, pemodelan risiko, dan simulasi mitigasi banjir di 34 provinsi Indonesia.
              </p>
            </div>

            <div>
              <div className="font-semibold text-slate-900 text-xs mb-2">Navigasi Utama</div>
              <ul className="space-y-1.5 text-slate-500">
                {navigation.slice(0, 4).map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-blue-600 transition">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="font-semibold text-slate-900 text-xs mb-2">Analisis & Simulasi</div>
              <ul className="space-y-1.5 text-slate-500">
                {navigation.slice(4).map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-blue-600 transition">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="font-semibold text-slate-900 text-xs mb-2">Transparansi Data</div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Purwarupa sistem pendukung keputusan (decision support system) berbasis data telemetri hidrometeorologi demonstratif.
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400">
            <div>© 2026 TERRAFLUX AI — Sistem Pemantauan Risiko Banjir Indonesia.</div>
            <div className="flex items-center gap-3 font-mono text-slate-500">
              <span>Arsitektur: Geospasial AI</span>
              <span>•</span>
              <span>Status: Operasional</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
