"use client";

import { AppShell } from "@/components/app-shell";
import { FloodMap } from "@/components/flood-map";
import { useRealtimeTelemetry } from "@/lib/realtime-telemetry";
import { Flame, Waves } from "lucide-react";

export default function RiskMapPage() {
  const { hazardMode } = useRealtimeTelemetry();
  const isWildfire = hazardMode === "wildfire";

  return (
    <AppShell>
      <div className="space-y-3">
        {/* Sleek, Compact Executive HUD Strip */}
        <header className="rounded-2xl border border-white/10 bg-slate-900/85 px-4 py-2.5 shadow-lg backdrop-blur-md flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-xl border ${
              isWildfire
                ? "bg-amber-500/15 border-amber-400/30 text-amber-300"
                : "bg-cyan-500/15 border-cyan-400/30 text-cyan-300"
            }`}>
              {isWildfire ? <Flame className="h-4 w-4" /> : <Waves className="h-4 w-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                  {isWildfire
                    ? "Peta Sebaran Titik Panas & Kerawanan Karhutla"
                    : "Peta Interaktif Risiko Banjir & Jaringan Hidrologi"}
                </h1>
                <span className={`rounded-full px-2 py-0.2 text-[9.5px] font-mono font-bold uppercase border ${
                  isWildfire
                    ? "bg-amber-500/20 text-amber-300 border-amber-400/30"
                    : "bg-cyan-500/20 text-cyan-300 border-cyan-400/30"
                }`}>
                  34 PROVINSI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none mt-0.5 hidden sm:block">
                {isWildfire
                  ? "Sinyal titik panas satelit MODIS/VIIRS, indeks kekeringan tanah gambut (KBDI/FWI), dan vektor arah angin perambatan api."
                  : "Titik rawan genangan, radar presipitasi BMKG, tinggi muka air (TMA), dan kapasitas drainase polder perkotaan."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-300 text-[10.5px] font-mono font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>RADAR AKTIF</span>
            </div>
            <div className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] text-cyan-200 font-mono flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span className="hidden md:inline">TELEMETRI TERPADU</span>
            </div>
          </div>
        </header>

        {/* Map & Detail Container */}
        <FloodMap />
      </div>
    </AppShell>
  );
}
