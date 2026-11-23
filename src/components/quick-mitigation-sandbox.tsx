"use client";

import React, { useState, useMemo } from "react";
import {
  SlidersHorizontal,
  TrendingDown,
  ArrowRight,
  RotateCcw,
  TreePine,
  Waves,
  Building2,
  CloudRain,
} from "lucide-react";
import Link from "next/link";
import { useHazardControl } from "@/lib/realtime-telemetry";

export function QuickMitigationSandbox() {
  const { selectedProvince } = useHazardControl();

  // FLOOD SLIDERS
  const [drainage, setDrainage] = useState<number>(38);
  const [greenCoverage, setGreenCoverage] = useState<number>(22);
  const [retention, setRetention] = useState<number>(20);
  const [rainfall, setRainfall] = useState<number>(85);

  const handleReset = () => {
    setDrainage(38);
    setGreenCoverage(22);
    setRetention(20);
    setRainfall(85);
  };

  const simulationMetrics = useMemo(() => {
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
  }, [drainage, greenCoverage, retention, rainfall, selectedProvince]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider font-semibold text-emerald-700">
              What-If Hydrological Sandbox
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Simulator Intervensi Mitigasi Banjir
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
          title="Reset parameter"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-center">
        {/* LEFT: 4 Clean Sliders */}
        <div className="space-y-3.5">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-700 font-medium flex items-center gap-1.5">
                <Waves className="h-3.5 w-3.5 text-blue-600" />
                Kapasitas Drainase & Pompa Polder
              </span>
              <span className="font-mono text-blue-600 font-bold">{drainage}/100</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={drainage}
              onChange={(e) => setDrainage(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-1.5 rounded-lg bg-slate-200"
              aria-label="Kapasitas drainase"
            />
            <div className="text-[10px] text-slate-400 mt-0.5">Normalisasi saluran primer & aktivasi pompa</div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-700 font-medium flex items-center gap-1.5">
                <TreePine className="h-3.5 w-3.5 text-emerald-600" />
                Ruang Terbuka Hijau & Sponge City
              </span>
              <span className="font-mono text-emerald-600 font-bold">{greenCoverage}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="80"
              value={greenCoverage}
              onChange={(e) => setGreenCoverage(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-1.5 rounded-lg bg-slate-200"
              aria-label="Cakupan ruang hijau"
            />
            <div className="text-[10px] text-slate-400 mt-0.5">Taman resapan & bioswale perkotaan</div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-700 font-medium flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-amber-600" />
                Kapasitas Kolam Retensi
              </span>
              <span className="font-mono text-amber-600 font-bold">{retention}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={retention}
              onChange={(e) => setRetention(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer h-1.5 rounded-lg bg-slate-200"
              aria-label="Kapasitas kolam retensi"
            />
            <div className="text-[10px] text-slate-400 mt-0.5">Penampungan limpasan debit puncak</div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-700 font-medium flex items-center gap-1.5">
                <CloudRain className="h-3.5 w-3.5 text-slate-500" />
                Simulasi Curah Hujan Uji
              </span>
              <span className="font-mono text-slate-700 font-bold">{rainfall} mm/jam</span>
            </div>
            <input
              type="range"
              min="40"
              max="120"
              value={rainfall}
              onChange={(e) => setRainfall(Number(e.target.value))}
              className="w-full accent-slate-600 cursor-pointer h-1.5 rounded-lg bg-slate-200"
              aria-label="Intensitas curah hujan simulasi"
            />
            <div className="text-[10px] text-slate-400 mt-0.5">Beban hidrologi hujan ekstrem</div>
          </div>
        </div>

        {/* RIGHT: Live Impact Output Gauge */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500">
              Hasil Reduksi Risiko Genangan
            </div>

            {/* Big Reduction Callout */}
            <div className="mt-3">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-emerald-600">
                -{simulationMetrics.reductionPercent}%
              </div>
              <div className="mt-1 text-xs text-slate-600 flex items-center justify-center gap-1 font-semibold">
                <TrendingDown className="h-4 w-4 text-emerald-600" />
                <span>Penurunan Kerawanan Banjir</span>
              </div>
            </div>

            {/* Score Comparison */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                <div className="text-[10px] text-slate-400">Baseline Awal:</div>
                <div className="mt-1 text-lg font-bold font-mono text-slate-700">
                  {simulationMetrics.baseline}
                </div>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-2.5">
                <div className="text-[10px] text-emerald-700">Setelah Rekayasa:</div>
                <div className="mt-1 text-lg font-bold font-mono text-emerald-700">
                  {simulationMetrics.mitigated}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200">
            <Link
              href="/simulator"
              className="inline-flex items-center justify-center gap-1.5 w-full rounded-lg bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
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
