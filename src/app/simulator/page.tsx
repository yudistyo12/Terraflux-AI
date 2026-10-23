"use client";

import { useState, useMemo } from "react";
import {
  CheckCircle2,
  Gauge,
  LoaderCircle,
  Play,
  RotateCcw,
  SlidersHorizontal,
  Flame,
  Waves,
  TrendingDown,
  ShieldAlert,
  TreePine,
  Wind,
  Shield,
  Droplets,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { demoAreas } from "@/lib/demo-data";
import { getWildfireMetrics } from "@/lib/wildfire-data";
import { useRealtimeTelemetry } from "@/lib/realtime-telemetry";

type SimulationResult = {
  area: string;
  hazardMode?: string;
  baseline: number;
  modified: number;
  delta: number;
  reductionPercent?: number;
  label: string;
  assumptions: string[];
};

export default function SimulatorPage() {
  const { selectedProvinceId, setSelectedProvinceId, hazardMode, setHazardMode } = useRealtimeTelemetry();
  const isWildfire = hazardMode === "wildfire";

  const [selectedAreaId, setSelectedAreaId] = useState(selectedProvinceId || "dki");

  // Flood parameters
  const [drainageCapacity, setDrainageCapacity] = useState(38);
  const [greenCoverage, setGreenCoverage] = useState(19);
  const [retentionCapacity, setRetentionCapacity] = useState(24);
  const [rainfallIntensity, setRainfallIntensity] = useState(82);

  // Wildfire parameters
  const [firebreak, setFirebreak] = useState(45);
  const [canalBlocking, setCanalBlocking] = useState(40);
  const [patrolResponse, setPatrolResponse] = useState(35);
  const [windSimulation, setWindSimulation] = useState(20);

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const area = useMemo(
    () => demoAreas.find((a) => a.id === selectedAreaId) || demoAreas[0],
    [selectedAreaId]
  );
  const wildfire = useMemo(() => getWildfireMetrics(area.id), [area.id]);

  const resetScenario = () => {
    const targetArea = demoAreas.find((a) => a.id === selectedAreaId) || demoAreas[0];
    if (isWildfire) {
      const wf = getWildfireMetrics(targetArea.id);
      setFirebreak(45);
      setCanalBlocking(40);
      setPatrolResponse(35);
      setWindSimulation(wf.windSpeed);
    } else {
      setDrainageCapacity(targetArea.drainageIndex);
      setGreenCoverage(targetArea.greenCoverage);
      setRetentionCapacity(25);
      setRainfallIntensity(targetArea.rainfallToday);
    }
    setResult(null);
    setErrorMessage("");
  };


  const handleAreaChange = (id: string) => {
    setSelectedAreaId(id);
    setSelectedProvinceId(id);
    const target = demoAreas.find((a) => a.id === id);
    if (target) {
      if (isWildfire) {
        const wf = getWildfireMetrics(target.id);
        setWindSimulation(wf.windSpeed);
      } else {
        setDrainageCapacity(target.drainageIndex);
        setGreenCoverage(target.greenCoverage);
        setRainfallIntensity(target.rainfallToday);
      }
    }
    setResult(null);
    setErrorMessage("");
  };

  const runSimulation = async () => {
    setIsRunning(true);
    setErrorMessage("");

    try {
      const body = isWildfire
        ? {
            areaId: selectedAreaId,
            hazardMode: "wildfire",
            firebreak,
            canalBlocking,
            patrolResponse,
            windSimulation,
          }
        : {
            areaId: selectedAreaId,
            hazardMode: "flood",
            drainageCapacity,
            greenCoverage,
            retentionCapacity,
            rainfallIntensity,
          };

      const response = await fetch("/api/simulation/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Simulasi gagal dievaluasi.");
      }

      setResult(payload);
    } catch {
      // Fallback calculation for reliable offline presentation
      if (isWildfire) {
        const baseline = Math.round(wildfire.drynessIndex * 0.42 + wildfire.hotspotSignals * 1.5 + windSimulation * 0.8 + wildfire.peatlandIndex * 0.2);
        const reduced = Math.round(baseline - (firebreak * 0.28 + canalBlocking * 0.34 + patrolResponse * 0.22));
        const delta = Math.max(0, baseline - reduced);
        setResult({
          area: area.name,
          baseline,
          modified: reduced,
          delta,
          reductionPercent: Math.round((delta / baseline) * 100),
          label: "Simulasi konseptual mitigasi karhutla",
          assumptions: [
            `Sekat bakar ${firebreak}m memutus perambatan bahan bakar semak.`,
            `Sekat kanal ${canalBlocking}% mempertahankan kelembapan kubah gambut.`,
            `Patroli respon ${patrolResponse}% menekan durasi perambatan api awal.`,
          ],
        });
      } else {
        const baseline = Math.round(rainfallIntensity * 0.42 + (100 - area.drainageIndex) * 0.29 + (100 - area.greenCoverage) * 0.18 + area.surfaceRunoff * 0.12);
        const reduced = Math.round(rainfallIntensity * 0.42 + (100 - drainageCapacity) * 0.29 + (100 - greenCoverage) * 0.18 + (100 - retentionCapacity) * 0.12);
        const delta = Math.max(0, baseline - reduced);
        setResult({
          area: area.name,
          baseline,
          modified: reduced,
          delta,
          reductionPercent: Math.round((delta / baseline) * 100),
          label: "Simulasi konseptual mitigasi banjir",
          assumptions: [
            "Peningkatan kapasitas saluran menurunkan hambatan aliran permukaan.",
            "Ruang terbuka hijau menyerap limpasan di wilayah tangkapan air.",
          ],
        });
      }
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-5 sm:space-y-6">
        {/* Header HUD */}
        <header className="rounded-[24px] border border-white/10 bg-slate-900/80 p-4 sm:p-5 shadow-xl backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-slate-400">
                {isWildfire ? <Flame className="h-4 w-4 text-amber-400" /> : <SlidersHorizontal className="h-4 w-4 text-cyan-400" />}
                <span className={isWildfire ? "text-amber-300 font-bold" : "text-cyan-300 font-bold"}>
                  WHAT-IF MITIGATION SIMULATION ENGINE
                </span>
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
                {isWildfire
                  ? "Simulator Rekayasa Mitigasi Karhutla & Gambut"
                  : "Simulator Rekayasa Tata Air & Mitigasi Banjir"}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-300">
                {isWildfire
                  ? "Uji efektivitas sekat bakar, sekat kanal (canal blocking), dan kesiagaan regu pemadam terhadap probabilitas kebakaran."
                  : "Uji dampak normalisasi drainase, sponge city, dan kolam retensi terhadap reduksi genangan air perkotaan."}
              </p>
            </div>

            {/* In-Page Mode Switcher */}
            <div className="flex rounded-full border border-white/15 bg-slate-950 p-1">
              <button
                type="button"
                onClick={() => setHazardMode("flood")}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                  !isWildfire ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/25" : "text-slate-400 hover:text-white"
                }`}
              >
                <Waves className="h-3.5 w-3.5" />
                <span>Simulasi Banjir</span>
              </button>
              <button
                type="button"
                onClick={() => setHazardMode("wildfire")}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                  isWildfire ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-500/25" : "text-slate-400 hover:text-white"
                }`}
              >
                <Flame className="h-3.5 w-3.5" />
                <span>Simulasi Karhutla</span>
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          {/* LEFT: Interactive Parameters */}
          <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className={`text-xs uppercase font-mono tracking-widest font-bold ${isWildfire ? "text-amber-400" : "text-cyan-300"}`}>
                  PARAMETER INTERVENSI REKAYASA
                </div>
                <div className="text-sm font-semibold text-white mt-0.5">
                  Target: {area.name} ({area.district})
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedAreaId}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  className="rounded-full border border-white/15 bg-slate-950 px-3 py-1.5 text-xs text-white focus:outline-none"
                  aria-label="Pilih wilayah target simulasi"
                >
                  {demoAreas.map((entry) => (
                    <option key={entry.id} value={entry.id} className="bg-slate-950 text-white">
                      {entry.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={resetScenario}
                  className="rounded-full border border-white/10 p-2 text-slate-300 hover:bg-white/10"
                  title="Reset parameter ke default"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Sliders tailored to hazard */}
            <div className="mt-6 space-y-5">
              {isWildfire ? (
                /* WILDFIRE SLIDERS */
                <>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-200 font-medium flex items-center gap-1.5">
                        <Shield className="h-4 w-4 text-amber-400" />
                        Lebar Sekat Bakar Komunal & Parit Api
                      </span>
                      <strong className="font-mono text-amber-300">{firebreak} meter</strong>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={firebreak}
                      onChange={(e) => { setFirebreak(Number(e.target.value)); setResult(null); }}
                      className="w-full accent-amber-400 cursor-pointer h-2 rounded-lg bg-slate-800"
                    />
                    <div className="text-[11px] text-slate-400 mt-1">
                      Menghentikan perambatan api permukaan antar blok tegakan hutan
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-200 font-medium flex items-center gap-1.5">
                        <Droplets className="h-4 w-4 text-cyan-400" />
                        Pembasahan Gambut & Sekat Kanal (Canal Blocking)
                      </span>
                      <strong className="font-mono text-cyan-300">{canalBlocking}% kapasitas</strong>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={canalBlocking}
                      onChange={(e) => { setCanalBlocking(Number(e.target.value)); setResult(null); }}
                      className="w-full accent-cyan-400 cursor-pointer h-2 rounded-lg bg-slate-800"
                    />
                    <div className="text-[11px] text-slate-400 mt-1">
                      Mencegah pengeringan kubah gambut bawah tanah dengan retensi muka air
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-200 font-medium flex items-center gap-1.5">
                        <Flame className="h-4 w-4 text-orange-400" />
                        Kesiapsiagaan Manggala Agni & Water Bombing
                      </span>
                      <strong className="font-mono text-orange-300">{patrolResponse}% kesiapan</strong>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={patrolResponse}
                      onChange={(e) => { setPatrolResponse(Number(e.target.value)); setResult(null); }}
                      className="w-full accent-orange-400 cursor-pointer h-2 rounded-lg bg-slate-800"
                    />
                    <div className="text-[11px] text-slate-400 mt-1">
                      Waktu respon pemadaman cepat saat titik api pertama kali terdeteksi
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-200 font-medium flex items-center gap-1.5">
                        <Wind className="h-4 w-4 text-rose-400" />
                        Parameter Kecepatan Angin Uji Coba
                      </span>
                      <strong className="font-mono text-rose-300">{windSimulation} km/jam</strong>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={windSimulation}
                      onChange={(e) => { setWindSimulation(Number(e.target.value)); setResult(null); }}
                      className="w-full accent-rose-400 cursor-pointer h-2 rounded-lg bg-slate-800"
                    />
                    <div className="text-[11px] text-slate-400 mt-1">
                      Tekanan atmosferik hembusan angin yang mempercepat sebaran api
                    </div>
                  </div>
                </>
              ) : (
                /* FLOOD SLIDERS */
                <>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-200 font-medium flex items-center gap-1.5">
                        <Waves className="h-4 w-4 text-cyan-400" />
                        Kapasitas Drainase & Pompa Polder
                      </span>
                      <strong className="font-mono text-cyan-300">{drainageCapacity}/100</strong>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={drainageCapacity}
                      onChange={(e) => { setDrainageCapacity(Number(e.target.value)); setResult(null); }}
                      className="w-full accent-cyan-400 cursor-pointer h-2 rounded-lg bg-slate-800"
                    />
                    <div className="text-[11px] text-slate-400 mt-1">
                      Pelebaran kapasitas gorong-gorong dan penguatan pompa stasioner
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-200 font-medium flex items-center gap-1.5">
                        <TreePine className="h-4 w-4 text-emerald-400" />
                        Ruang Terbuka Hijau & Sponge City
                      </span>
                      <strong className="font-mono text-emerald-300">{greenCoverage}%</strong>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="80"
                      value={greenCoverage}
                      onChange={(e) => { setGreenCoverage(Number(e.target.value)); setResult(null); }}
                      className="w-full accent-emerald-400 cursor-pointer h-2 rounded-lg bg-slate-800"
                    />
                    <div className="text-[11px] text-slate-400 mt-1">
                      Taman resapan perkotaan, sumur resapan modular, dan bioswale
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-200 font-medium flex items-center gap-1.5">
                        <Gauge className="h-4 w-4 text-amber-400" />
                        Kapasitas Waduk Retensi & Embung
                      </span>
                      <strong className="font-mono text-amber-300">{retentionCapacity}%</strong>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={retentionCapacity}
                      onChange={(e) => { setRetentionCapacity(Number(e.target.value)); setResult(null); }}
                      className="w-full accent-amber-400 cursor-pointer h-2 rounded-lg bg-slate-800"
                    />
                    <div className="text-[11px] text-slate-400 mt-1">
                      Penampungan volume air limpasan puncak sebelum dilepas ke hilir
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-200 font-medium flex items-center gap-1.5">
                        <Waves className="h-4 w-4 text-rose-400" />
                        Intensitas Hujan Skenario Ekstrem
                      </span>
                      <strong className="font-mono text-rose-300">{rainfallIntensity} mm/jam</strong>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="120"
                      value={rainfallIntensity}
                      onChange={(e) => { setRainfallIntensity(Number(e.target.value)); setResult(null); }}
                      className="w-full accent-rose-400 cursor-pointer h-2 rounded-lg bg-slate-800"
                    />
                    <div className="text-[11px] text-slate-400 mt-1">
                      Uji stres kapasitas hidrologi saat terjadi badai ekstrem
                    </div>
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={runSimulation}
                disabled={isRunning}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-bold text-slate-950 transition hover:brightness-110 disabled:opacity-60 shadow-md ${
                  isWildfire
                    ? "bg-gradient-to-r from-amber-400 to-orange-400 shadow-amber-500/25"
                    : "bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-cyan-500/25"
                }`}
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

              {errorMessage && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-950/40 p-2.5 text-xs text-rose-200">
                  {errorMessage}
                </div>
              )}
            </div>
          </section>

          {/* RIGHT: Results & Impact Gauges */}
          <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className={`text-xs uppercase font-mono tracking-widest font-bold ${isWildfire ? "text-amber-400" : "text-cyan-300"}`}>
                HASIL EVALUASI WHAT-IF
              </div>

              {result ? (
                <div className="mt-4 space-y-5">
                  {/* Big Impact Callout */}
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 text-center">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                      {isWildfire ? "Efisiensi Reduksi Perambatan Api" : "Efisiensi Reduksi Risiko Genangan"}
                    </div>
                    <div className={`mt-2 text-5xl font-black font-mono tracking-tight ${
                      isWildfire ? "text-amber-300" : "text-emerald-300"
                    }`}>
                      -{result.reductionPercent ?? Math.round((result.delta / result.baseline) * 100)}%
                    </div>
                    <div className="mt-1 text-xs text-slate-300 font-semibold flex items-center justify-center gap-1">
                      <TrendingDown className="h-4 w-4" />
                      <span>{isWildfire ? "Penurunan Risiko Karhutla" : "Penurunan Beban Drainase"}</span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400">Skor Awal (Baseline):</div>
                        <div className="mt-0.5 text-2xl font-bold font-mono text-rose-300">
                          {result.baseline}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Setelah Intervensi:</div>
                        <div className={`mt-0.5 text-2xl font-bold font-mono ${isWildfire ? "text-amber-300" : "text-emerald-300"}`}>
                          {result.modified}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assumptions & Mechanism */}
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-xs text-slate-300 space-y-2">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Mekanisme Kalkulasi Simulasi:</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-slate-300">
                      {result.assumptions.map((asm, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-slate-500">•</span>
                          <span>{asm}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Honest Disclosure Label */}
                  <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-3 text-xs text-amber-200 flex items-start gap-2">
                    <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-relaxed">
                      {result.label}. Model ini menggunakan simplifikasi parameter fisika untuk keperluan demonstrasi perumusan kebijakan mitigasi.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="my-auto py-16 text-center text-slate-400 text-xs">
                  Atur slider parameter intervensi di sebelah kiri dan klik &quot;Jalankan Simulasi Intervensi&quot;.
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>Status Engine: Siap Kalkulasi</span>
              <span className="font-mono text-cyan-300/80">Latensi: 12ms</span>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
