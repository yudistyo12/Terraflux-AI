"use client";

import React, { useState, useMemo } from "react";
import {
  SlidersHorizontal,
  TrendingDown,
  ArrowRight,
  RotateCcw,
  Sparkles,
  TreePine,
  Waves,
  Building2,
  Wind,
  Shield,
  Droplets,
} from "lucide-react";
import Link from "next/link";
import { useHazardControl } from "@/lib/realtime-telemetry";
import { getWildfireMetrics } from "@/lib/wildfire-data";

export function QuickMitigationSandbox() {
  const { selectedProvince, hazardMode } = useHazardControl();
  const isWildfire = hazardMode === "wildfire";

  const wildfire = getWildfireMetrics(selectedProvince.id);

  // FLOOD SLIDERS
  const [drainage, setDrainage] = useState<number>(38);
  const [greenCoverage, setGreenCoverage] = useState<number>(22);
  const [retention, setRetention] = useState<number>(20);
  const [rainfall, setRainfall] = useState<number>(85);

  // WILDFIRE SLIDERS
  const [firebreak, setFirebreak] = useState<number>(45); // Lebar sekat bakar & parit api
  const [canalBlocking, setCanalBlocking] = useState<number>(40); // Pembasahan gambut & sekat kanal
  const [patrolResponse, setPatrolResponse] = useState<number>(35); // Kesiapan tim darat/udara
  const [windSimulation, setWindSimulation] = useState<number>(22); // Kecepatan angin uji coba

  const handleReset = () => {
    if (isWildfire) {
      setFirebreak(45);
      setCanalBlocking(40);
      setPatrolResponse(35);
      setWindSimulation(wildfire.windSpeed);
    } else {
      setDrainage(38);
      setGreenCoverage(22);
      setRetention(20);
      setRainfall(85);
    }
  };

  const simulationMetrics = useMemo(() => {
    if (isWildfire) {
      // Baseline Wildfire risk
      const baseline = Math.min(
        100,
        Math.max(
          10,
          wildfire.drynessIndex * 0.42 +
            wildfire.hotspotSignals * 1.5 +
            windSimulation * 0.8 +
            wildfire.peatlandIndex * 0.2
        )
      );

      // Mitigated with user's interventions
      const mitigated = Math.min(
        100,
        Math.max(
          10,
          baseline -
            (firebreak * 0.28 + canalBlocking * 0.32 + patrolResponse * 0.22)
        )
      );

      const delta = Number(Math.max(0, baseline - mitigated).toFixed(1));
      const reductionPercent = Math.max(0, Math.round((delta / baseline) * 100));

      return {
        baseline: Number(baseline.toFixed(1)),
        mitigated: Number(mitigated.toFixed(1)),
        delta,
        reductionPercent,
      };
    }

    // Baseline Flood risk
    const baseline = Math.min(
      100,
      Math.max(
        0,
        rainfall * 0.42 +
          (100 - selectedProvince.drainageIndex) * 0.28 +
          (100 - selectedProvince.greenCoverage) * 0.18 +
          selectedProvince.surfaceRunoff * 0.12
      )
    );

    // Mitigated with flood interventions
    const mitigated = Math.min(
      100,
      Math.max(
        0,
        rainfall * 0.42 +
          (100 - drainage) * 0.28 +
          (100 - greenCoverage) * 0.18 +
          (100 - retention) * 0.12
      )
    );

    const delta = Number((baseline - mitigated).toFixed(1));
    const reductionPercent = Math.max(0, Math.round((delta / baseline) * 100));

    return {
      baseline: Number(baseline.toFixed(1)),
      mitigated: Number(mitigated.toFixed(1)),
      delta,
      reductionPercent,
    };
  }, [
    isWildfire,
    wildfire,
    firebreak,
    canalBlocking,
    patrolResponse,
    windSimulation,
    drainage,
    greenCoverage,
    retention,
    rainfall,
    selectedProvince,
  ]);

  return (
    <div className={`relative overflow-hidden rounded-[28px] border p-5 sm:p-7 shadow-xl transition-colors duration-500 shimmer-overlay h-scanline ${
      isWildfire
        ? "border-amber-400/30 bg-slate-900/90 shadow-amber-950/20"
        : "border-emerald-400/25 bg-slate-900/90 shadow-emerald-950/20"
    }`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
            isWildfire
              ? "bg-amber-500/20 border-amber-400/30 text-amber-300"
              : "bg-emerald-500/20 border-emerald-400/30 text-emerald-300"
          }`}>
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <div>
            <div className={`text-[10px] uppercase font-mono tracking-widest font-bold ${isWildfire ? "text-amber-400" : "text-emerald-300"}`}>
              {isWildfire ? "WHAT-IF WILDFIRE SANDBOX" : "WHAT-IF HYDROLOGICAL SANDBOX"}
            </div>
            <h3 className="text-lg font-bold text-white">
              {isWildfire ? "Simulator Intervensi Mitigasi Karhutla" : "Simulator Intervensi Mitigasi Banjir"}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 hover:text-white transition"
          title="Reset ke parameter default"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-center">
        {/* LEFT: 4 Interactive Sliders Tailored to Hazard */}
        {isWildfire ? (
          /* WILDFIRE SLIDERS */
          <div className="space-y-3.5">
            {/* Slider 1: Sekat Bakar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-amber-400" />
                  Sekat Bakar Komunal & Buffer Zone
                </span>
                <span className="font-mono text-amber-300 font-bold">{firebreak} meter</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={firebreak}
                onChange={(e) => setFirebreak(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-1.5 rounded-lg bg-slate-800"
                aria-label="Lebar sekat bakar"
              />
              <div className="text-[10px] text-slate-400">Pemisah bahan bakar vegetasi darat</div>
            </div>

            {/* Slider 2: Pembasahan Gambut (Canal Blocking) */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Droplets className="h-3.5 w-3.5 text-cyan-400" />
                  Pembasahan Gambut & Sekat Kanal
                </span>
                <span className="font-mono text-cyan-300 font-bold">{canalBlocking}% kapasitas</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={canalBlocking}
                onChange={(e) => setCanalBlocking(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 rounded-lg bg-slate-800"
                aria-label="Kapasitas sekat kanal"
              />
              <div className="text-[10px] text-slate-400">Menaikkan tinggi muka air tanah gambut</div>
            </div>

            {/* Slider 3: Kesiapan Regu & Water Bombing */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-orange-400" />
                  Kesiapan Patroli Manggala Agni & Heli
                </span>
                <span className="font-mono text-orange-300 font-bold">{patrolResponse}% respon</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={patrolResponse}
                onChange={(e) => setPatrolResponse(Number(e.target.value))}
                className="w-full accent-orange-400 cursor-pointer h-1.5 rounded-lg bg-slate-800"
                aria-label="Kesiapan regu darat dan udara"
              />
              <div className="text-[10px] text-slate-400">Kecepatan intervensi pemadaman dini</div>
            </div>

            {/* Slider 4: Kecepatan Angin Uji Coba */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Wind className="h-3.5 w-3.5 text-rose-400" />
                  Kecepatan Angin Skenario
                </span>
                <span className="font-mono text-rose-300 font-bold">{windSimulation} km/jam</span>
              </div>
              <input
                type="range"
                min="5"
                max="45"
                value={windSimulation}
                onChange={(e) => setWindSimulation(Number(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer h-1.5 rounded-lg bg-slate-800"
                aria-label="Kecepatan angin simulasi"
              />
              <div className="text-[10px] text-slate-400">Tekanan angin pemicu perambatan api</div>
            </div>
          </div>
        ) : (
          /* FLOOD SLIDERS */
          <div className="space-y-3.5">
            {/* Slider 1: Kapasitas Drainase */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Waves className="h-3.5 w-3.5 text-cyan-400" />
                  Kapasitas Drainase & Pompa Polder
                </span>
                <span className="font-mono text-cyan-300 font-bold">{drainage}/100</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={drainage}
                onChange={(e) => setDrainage(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 rounded-lg bg-slate-800"
                aria-label="Kapasitas drainase"
              />
              <div className="text-[10px] text-slate-400">Pelebaran saluran primer & pompa air</div>
            </div>

            {/* Slider 2: Ruang Terbuka Hijau */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <TreePine className="h-3.5 w-3.5 text-emerald-400" />
                  Ruang Terbuka Hijau & Sponge City
                </span>
                <span className="font-mono text-emerald-300 font-bold">{greenCoverage}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                value={greenCoverage}
                onChange={(e) => setGreenCoverage(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer h-1.5 rounded-lg bg-slate-800"
                aria-label="Cakupan ruang hijau"
              />
              <div className="text-[10px] text-slate-400">Taman resapan & bioswale perkotaan</div>
            </div>

            {/* Slider 3: Kolam Retensi */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-amber-400" />
                  Kapasitas Kolam Retensi & Danau
                </span>
                <span className="font-mono text-amber-300 font-bold">{retention}% kapasitas</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={retention}
                onChange={(e) => setRetention(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-1.5 rounded-lg bg-slate-800"
                aria-label="Kapasitas kolam retensi"
              />
              <div className="text-[10px] text-slate-400">Penampungan debit puncak limpasan</div>
            </div>

            {/* Slider 4: Intensitas Hujan */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Waves className="h-3.5 w-3.5 text-rose-400" />
                  Intensitas Hujan Skenario Uji
                </span>
                <span className="font-mono text-rose-300 font-bold">{rainfall} mm/jam</span>
              </div>
              <input
                type="range"
                min="40"
                max="120"
                value={rainfall}
                onChange={(e) => setRainfall(Number(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer h-1.5 rounded-lg bg-slate-800"
                aria-label="Intensitas hujan simulasi"
              />
              <div className="text-[10px] text-slate-400">Beban hidrologi dari hujan ekstrem</div>
            </div>
          </div>
        )}

        {/* RIGHT: Live Impact Output Gauge */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-center">
          <div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
              {isWildfire ? "HASIL REDUKSI PERAMBATAN API" : "HASIL REDUKSI RISIKO BANJIR"}
            </div>

            {/* Big Reduction Callout */}
            <div className="mt-3">
              <div className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${
                isWildfire ? "text-amber-300" : "text-emerald-300"
              }`}>
                -{simulationMetrics.reductionPercent}%
              </div>
              <div className="mt-1 text-xs text-slate-300 flex items-center justify-center gap-1 font-semibold">
                <TrendingDown className="h-4 w-4" />
                <span>
                  {isWildfire ? "Penurunan Probabilitas Karhutla" : "Penurunan Kerawanan Genangan"}
                </span>
              </div>
            </div>

            {/* Score Comparison */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-white/5 bg-slate-900/60 p-2.5">
                <div className="text-[10px] text-slate-400">Indeks Baseline:</div>
                <div className="mt-1 text-lg font-bold font-mono text-rose-300">
                  {simulationMetrics.baseline}
                </div>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-900/60 p-2.5">
                <div className="text-[10px] text-slate-400">Setelah Intervensi:</div>
                <div className={`mt-1 text-lg font-bold font-mono ${isWildfire ? "text-amber-300" : "text-emerald-300"}`}>
                  {simulationMetrics.mitigated}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10">
            <Link
              href="/simulator"
              className={`inline-flex items-center justify-center gap-1.5 w-full rounded-full py-2 text-xs font-bold text-slate-950 transition hover:brightness-110 ${
                isWildfire
                  ? "bg-gradient-to-r from-amber-400 to-orange-400"
                  : "bg-gradient-to-r from-cyan-400 to-emerald-400"
              }`}
            >
              <span>Buka Simulator Lengkap</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
