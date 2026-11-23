"use client";

import { AppShell } from "@/components/app-shell";
import { FloodMap } from "@/components/flood-map";
import { StepGuideBanner } from "@/components/step-guide-banner";
import { Waves } from "lucide-react";

export default function RiskMapPage() {
  return (
    <AppShell>
      <div className="space-y-4">
        {/* Step Guide Banner */}
        <StepGuideBanner currentStep={1} />

        {/* Clean Header Bar */}
        <header className="rounded-2xl border border-slate-200 bg-white px-5 py-3.5 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
              <Waves className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Peta Interaktif Risiko Banjir & Jaringan Hidrologi
                </h1>
                <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[10px] font-mono font-bold uppercase">
                  34 PROVINSI
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
                Titik rawan genangan, radar presipitasi BMKG, tinggi muka air (TMA), dan kapasitas drainase polder perkotaan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-800 text-[11px] font-mono font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>RADAR AKTIF</span>
            </div>
          </div>
        </header>

        {/* Map & Detail Container */}
        <FloodMap />
      </div>
    </AppShell>
  );
}
