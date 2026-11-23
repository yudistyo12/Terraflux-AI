"use client";

import { useState, useMemo } from "react";
import {
  CheckCircle2,
  Gauge,
  LoaderCircle,
  Play,
  RotateCcw,
  SlidersHorizontal,
  Waves,
  TrendingDown,
  ShieldAlert,
  TreePine,
  Building2,
  CloudRain,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StepGuideBanner } from "@/components/step-guide-banner";
import { demoAreas } from "@/lib/demo-data";
import { useHazardControl } from "@/lib/realtime-telemetry";

type SimulationResult = {
  area: string;
  baseline: number;
  modified: number;
  delta: number;
  reductionPercent?: number;
  label: string;
  assumptions: string[];
};

export default function SimulatorPage() {
  const { selectedProvinceId, setSelectedProvinceId } = useHazardControl();

  const [selectedAreaId, setSelectedAreaId] = useState(selectedProvinceId || "dki");

  // Flood parameters
  const [drainageCapacity, setDrainageCapacity] = useState(38);
  const [greenCoverage, setGreenCoverage] = useState(19);
  const [retentionCapacity, setRetentionCapacity] = useState(24);
  const [rainfallIntensity, setRainfallIntensity] = useState(82);

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const area = useMemo(
    () => demoAreas.find((a) => a.id === selectedAreaId) || demoAreas[0],
    [selectedAreaId]
  );

  const resetScenario = () => {
    const targetArea = demoAreas.find((a) => a.id === selectedAreaId) || demoAreas[0];
    setDrainageCapacity(targetArea.drainageIndex);
    setGreenCoverage(targetArea.greenCoverage);
    setRetentionCapacity(25);
    setRainfallIntensity(targetArea.rainfallToday);
    setResult(null);
    setErrorMessage("");
  };

  const handleAreaChange = (id: string) => {
    setSelectedAreaId(id);
    setSelectedProvinceId(id);
    const target = demoAreas.find((a) => a.id === id);
    if (target) {
      setDrainageCapacity(target.drainageIndex);
      setGreenCoverage(target.greenCoverage);
      setRainfallIntensity(target.rainfallToday);
    }
    setResult(null);
    setErrorMessage("");
  };

  const runSimulation = async () => {
    setIsRunning(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/simulation/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          areaId: selectedAreaId,
          hazardMode: "flood",
          drainageCapacity,
          greenCoverage,
          retentionCapacity,
          rainfallIntensity,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Simulasi gagal dievaluasi.");
      }

      setResult(payload);
    } catch {
      // Fallback calculation for reliable offline presentation
      const baseline = Math.round(
        rainfallIntensity * 0.42 +
          (100 - area.drainageIndex) * 0.29 +
          (100 - area.greenCoverage) * 0.18 +
          area.surfaceRunoff * 0.12
      );
      const reduced = Math.round(
        rainfallIntensity * 0.42 +
          (100 - drainageCapacity) * 0.29 +
          (100 - greenCoverage) * 0.18 +
          (100 - retentionCapacity) * 0.12
      );
      const delta = Math.max(0, baseline - reduced);
      setResult({
        area: area.name,
        baseline,
        modified: reduced,
        delta,
        reductionPercent: Math.round((delta / baseline) * 100),
        label: "Simulasi konseptual mitigasi tata air",
        assumptions: [
          "Peningkatan kapasitas saluran menurunkan hambatan aliran permukaan secara langsung.",
          "Ruang terbuka hijau menyerap limpasan di wilayah tangkapan air dan menurunkan koefisien limpasan.",
          "Kolam retensi menampung debit puncak sebelum mengalir ke alur sungai utama.",
        ],
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Step Guide Banner */}
        <StepGuideBanner currentStep={3} />

        {/* Header Bar */}
        <header className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-wider font-semibold text-blue-600">
              <SlidersHorizontal className="h-4 w-4" />
              <span>What-If Mitigation Simulation Engine</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Simulator Rekayasa Tata Air & Mitigasi Banjir
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Uji dampak intervensi rekayasa drainase, sponge city, dan kolam retensi terhadap potensi reduksi genangan air perkotaan.
            </p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* LEFT: Interactive Parameters */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="text-xs uppercase font-mono tracking-wider font-semibold text-blue-600">
                  Parameter Intervensi Rekayasa
                </div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  Target: {area.name} ({area.district})
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedAreaId}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm cursor-pointer"
                  aria-label="Pilih wilayah target simulasi"
                >
                  {demoAreas.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={resetScenario}
                  className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50 shadow-sm"
                  title="Reset parameter ke default"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Sliders */}
            <div className="mt-5 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium flex items-center gap-1.5">
                    <Waves className="h-4 w-4 text-blue-600" />
                    Kapasitas Drainase & Pompa Polder
                  </span>
                  <strong className="font-mono text-blue-700">{drainageCapacity}/100</strong>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={drainageCapacity}
                  onChange={(e) => { setDrainageCapacity(Number(e.target.value)); setResult(null); }}
                  className="w-full accent-blue-600 cursor-pointer h-1.5 rounded-lg bg-slate-200"
                />
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Pelebaran saluran primer dan penguatan pompa stasioner
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium flex items-center gap-1.5">
                    <TreePine className="h-4 w-4 text-emerald-600" />
                    Ruang Terbuka Hijau & Sponge City
                  </span>
                  <strong className="font-mono text-emerald-700">{greenCoverage}%</strong>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  value={greenCoverage}
                  onChange={(e) => { setGreenCoverage(Number(e.target.value)); setResult(null); }}
                  className="w-full accent-emerald-600 cursor-pointer h-1.5 rounded-lg bg-slate-200"
                />
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Taman resapan perkotaan, sumur resapan modular, dan bioswale
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-amber-600" />
                    Kapasitas Kolam Retensi & Embung
                  </span>
                  <strong className="font-mono text-amber-700">{retentionCapacity}%</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={retentionCapacity}
                  onChange={(e) => { setRetentionCapacity(Number(e.target.value)); setResult(null); }}
                  className="w-full accent-amber-600 cursor-pointer h-1.5 rounded-lg bg-slate-200"
                />
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Penampungan volume air limpasan puncak sebelum dilepas ke hilir
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium flex items-center gap-1.5">
                    <CloudRain className="h-4 w-4 text-slate-600" />
                    Intensitas Hujan Skenario Ekstrem
                  </span>
                  <strong className="font-mono text-slate-900">{rainfallIntensity} mm/jam</strong>
                </div>
                <input
                  type="range"
                  min="40"
                  max="120"
                  value={rainfallIntensity}
                  onChange={(e) => { setRainfallIntensity(Number(e.target.value)); setResult(null); }}
                  className="w-full accent-slate-600 cursor-pointer h-1.5 rounded-lg bg-slate-200"
                />
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Uji beban hidrologi saat terjadi hujan lebat atau cuaca ekstrem
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={runSimulation}
                  disabled={isRunning}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 transition cursor-pointer"
                >
                  {isRunning ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      <span>Mengevaluasi Skenario Rekayasa...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      <span>Jalankan Simulasi Intervensi</span>
                    </>
                  )}
                </button>
              </div>

              {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
                  {errorMessage}
                </div>
              )}
            </div>
          </section>

          {/* RIGHT: Results & Impact Gauges */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase font-mono tracking-wider font-semibold text-blue-600 border-b border-slate-100 pb-3">
                Hasil Evaluasi What-If
              </div>

              {result ? (
                <div className="mt-4 space-y-4">
                  {/* Big Impact Callout */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500">
                      Efisiensi Reduksi Risiko Genangan
                    </div>
                    <div className="mt-2 text-5xl font-black font-mono tracking-tight text-emerald-600">
                      -{result.reductionPercent ?? Math.round((result.delta / result.baseline) * 100)}%
                    </div>
                    <div className="mt-1 text-xs text-slate-600 font-semibold flex items-center justify-center gap-1">
                      <TrendingDown className="h-4 w-4 text-emerald-600" />
                      <span>Penurunan Beban Drainase & Risiko Genangan</span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400">Skor Awal (Baseline):</div>
                        <div className="mt-0.5 text-2xl font-bold font-mono text-slate-700">
                          {result.baseline}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-emerald-700">Setelah Intervensi:</div>
                        <div className="mt-0.5 text-2xl font-bold font-mono text-emerald-700">
                          {result.modified}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assumptions & Mechanism */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 space-y-2">
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Mekanisme Kalkulasi Simulasi:</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-slate-600">
                      {result.assumptions.map((asm, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-blue-600">•</span>
                          <span>{asm}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Disclosure Label */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500 flex items-start gap-2">
                    <ShieldAlert className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-relaxed">
                      {result.label}. Model ini menggunakan simplifikasi parameter hidrologi untuk keperluan analisis kebijakan mitigasi.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="my-auto py-16 text-center text-slate-400 text-xs">
                  Atur slider parameter intervensi di sebelah kiri dan klik &quot;Jalankan Simulasi Intervensi&quot;.
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Engine Status: Operasional</span>
              <span className="text-blue-700">Latensi: &lt;15ms</span>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
