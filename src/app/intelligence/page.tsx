"use client";

import { useMemo, useState, useEffect } from "react";
import { BrainCircuit, ShieldAlert, Sparkles, Flame, Waves, Layers, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { analysisInputs, demoAreas } from "@/lib/demo-data";
import { wildfireAnalysisInputs, getWildfireMetrics } from "@/lib/wildfire-data";
import { useRealtimeTelemetry } from "@/lib/realtime-telemetry";

const periods = ["1 hari", "3 hari", "7 hari", "14 hari"];

interface AnalysisResult {
  analysisId: string;
  category: string;
  score: number;
  summary: string;
  method?: string;
  indicators: Array<{ label: string; value: string }>;
  weights?: Array<{ factor: string; weight: string }>;
  warning: string;
}

export default function IntelligencePage() {
  const { selectedProvinceId, setSelectedProvinceId, hazardMode, setHazardMode } = useRealtimeTelemetry();
  const isWildfire = hazardMode === "wildfire";

  const [selectedAreaId, setSelectedAreaId] = useState(selectedProvinceId || demoAreas[0].id);
  const [period, setPeriod] = useState("7 hari");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const area = useMemo(
    () => demoAreas.find((entry) => entry.id === selectedAreaId) ?? demoAreas[0],
    [selectedAreaId]
  );

  const activeInputs = isWildfire ? wildfireAnalysisInputs : analysisInputs;

  // Run initial or auto analysis when province or hazard mode changes
  useEffect(() => {
    runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAreaId, hazardMode]);

  async function runAnalysis() {
    setIsRunning(true);
    try {
      const response = await fetch("/api/analysis/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          areaId: selectedAreaId,
          period,
          hazardMode,
        }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const payload = await response.json();
      setResult(payload);
    } catch {
      // Conservative fallback
      const wf = getWildfireMetrics(area.id);
      if (isWildfire) {
        setResult({
          analysisId: `WF-${area.id.toUpperCase()}-DEMO`,
          category: wf.riskLevel === "very-high" ? "Siaga 1 (Darurat Karhutla)" : "Siaga 2 (Perhatian Tinggi)",
          score: wf.riskLevel === "very-high" ? 88 : 68,
          summary: `Pemodelan screening Karhutla untuk ${area.name} mendeteksi ${wf.hotspotSignals} titik panas aktif dengan indeks kekeringan ${wf.drynessIndex}/100 dan angin ${wf.windSpeed} km/jam.`,
          indicators: [
            { label: "Titik Panas", value: `${wf.hotspotSignals} Sinyal` },
            { label: "Kekeringan (KBDI)", value: `${wf.drynessIndex}/100` },
            { label: "Angin", value: `${wf.windSpeed} km/jam` },
            { label: "Gambut", value: `${wf.peatlandIndex}/100` },
          ],
          weights: [
            { factor: "Kekeringan Lahan", weight: "40%" },
            { factor: "Titik Panas Satelit", weight: "30%" },
            { factor: "Kecepatan Angin", weight: "20%" },
            { factor: "Bahan Bakar Gambut", weight: "10%" },
          ],
          warning: "Data simulasi demonstrasi akademis, bukan penetapan status darurat resmi BMKG/KLHK.",
        });
      } else {
        setResult({
          analysisId: `FL-${area.id.toUpperCase()}-DEMO`,
          category: area.riskLevel === "very-high" ? "Siaga 1 (Perhatian Sangat Tinggi)" : "Siaga 2 (Perhatian Menengah)",
          score: area.riskLevel === "very-high" ? 85 : 65,
          summary: `Wilayah ${area.name} menunjukkan konsentrasi limpasan ${area.surfaceRunoff}% dengan curah hujan ${area.rainfallToday} mm/jam dan defisit drainase.`,
          indicators: [
            { label: "Curah Hujan", value: `${area.rainfallToday} mm/jam` },
            { label: "Drainase", value: `${area.drainageIndex}/100` },
            { label: "Limpasan", value: `${area.surfaceRunoff}%` },
            { label: "Resapan Hijau", value: `${area.greenCoverage}%` },
          ],
          weights: [
            { factor: "Intensitas Hujan", weight: "40%" },
            { factor: "Defisit Drainase", weight: "30%" },
            { factor: "Koefisien Limpasan", weight: "20%" },
            { factor: "Observasi Historis", weight: "10%" },
          ],
          warning: "Hasil screening berbasis data demonstrasi untuk studi kesiapsiagaan.",
        });
      }
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <AppShell>
      <div className="space-y-5 sm:space-y-6">
        {/* Header HUD */}
        <header className="rounded-[24px] border border-white/10 bg-slate-900/80 p-4 sm:p-5 shadow-xl backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-slate-400">
                {isWildfire ? <Flame className="h-4 w-4 text-amber-400" /> : <BrainCircuit className="h-4 w-4 text-cyan-400" />}
                <span className={isWildfire ? "text-amber-300 font-bold" : "text-cyan-300 font-bold"}>
                  AI INTELLIGENCE & EXPLAINABLE RISK SCREENING
                </span>
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
                {isWildfire
                  ? "Analisis AI Risiko Karhutla & Dekomposisi Model"
                  : "Analisis AI Risiko Banjir & Dekomposisi Hidrologi"}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-300">
                Transparansi penuh formulasi penentuan skor risiko dengan dekomposisi bobot faktor hidrologi dan lingkungan secara akuntabel.
              </p>
            </div>

            {/* In-page quick hazard toggle */}
            <div className="flex rounded-full border border-white/15 bg-slate-950 p-1">
              <button
                type="button"
                onClick={() => setHazardMode("flood")}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                  !isWildfire ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/25" : "text-slate-400 hover:text-white"
                }`}
              >
                <Waves className="h-3.5 w-3.5" />
                <span>Banjir</span>
              </button>
              <button
                type="button"
                onClick={() => setHazardMode("wildfire")}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                  isWildfire ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-500/25" : "text-slate-400 hover:text-white"
                }`}
              >
                <Flame className="h-3.5 w-3.5" />
                <span>Karhutla</span>
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          {/* LEFT: Input Configuration */}
          <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-xl">
            <div className={`mb-4 text-xs uppercase font-mono tracking-widest font-bold ${isWildfire ? "text-amber-400" : "text-cyan-300"}`}>
              KONFIGURASI PARAMETER INPUT AI
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">Target Wilayah</span>
                <select
                  value={selectedAreaId}
                  onChange={(event) => {
                    setSelectedAreaId(event.target.value);
                    setSelectedProvinceId(event.target.value);
                  }}
                  className="w-full rounded-2xl border border-white/15 bg-slate-950 px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none"
                  aria-label="Pilih wilayah target analisis AI"
                >
                  {demoAreas.map((entry) => (
                    <option key={entry.id} value={entry.id} className="bg-slate-950 text-white">
                      {entry.name} ({entry.district})
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">Jendela Observasi Model</span>
                <select
                  value={period}
                  onChange={(event) => setPeriod(event.target.value)}
                  className="w-full rounded-2xl border border-white/15 bg-slate-950 px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none"
                  aria-label="Pilih periode observasi"
                >
                  {periods.map((item) => (
                    <option key={item} value={item} className="bg-slate-950 text-white">
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div className="mb-2 text-xs font-bold text-white flex items-center gap-1.5">
                  <Layers className={`h-3.5 w-3.5 ${isWildfire ? "text-amber-400" : "text-cyan-300"}`} />
                  <span>Fitur Masukan ({isWildfire ? "Karhutla" : "Banjir"}):</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {activeInputs.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${isWildfire ? "bg-amber-400" : "bg-cyan-400"}`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={runAnalysis}
                disabled={isRunning}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-bold text-slate-950 transition hover:brightness-110 disabled:opacity-60 shadow-md ${
                  isWildfire
                    ? "bg-gradient-to-r from-amber-400 to-orange-400 shadow-amber-500/25"
                    : "bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-cyan-500/25"
                }`}
              >
                <BrainCircuit className="h-4 w-4" />
                {isRunning ? "Mengeksekusi Model Screening..." : "Jalankan Diagnosis AI"}
              </button>
            </div>
          </section>

          {/* RIGHT: Model Output & Explainability */}
          <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div className={`flex items-center gap-2 text-xs uppercase font-mono tracking-widest font-bold ${
                isWildfire ? "text-amber-400" : "text-cyan-300"
              }`}>
                <Sparkles className="h-4 w-4" />
                OUTPUT EVALUASI & EXPLAINABILITY
              </div>
              {result && (
                <span className="font-mono text-[10px] text-slate-400">
                  ID: {result.analysisId}
                </span>
              )}
            </div>

            {result ? (
              <div className="space-y-4">
                {/* Score Card */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3.5">
                    <div className="text-[10px] uppercase font-mono text-slate-400">
                      Indeks Risiko AI
                    </div>
                    <div className="mt-1 text-4xl font-extrabold font-mono text-white">
                      {result.score}
                    </div>
                    <div className="mt-1 text-[10px] text-slate-400">Skala 0 - 100</div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3.5 sm:col-span-2">
                    <div className="text-[10px] uppercase font-mono text-slate-400">
                      Klasifikasi Kesiapsiagaan
                    </div>
                    <div className="mt-1 text-base font-bold text-amber-300">
                      {result.category}
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      Target Wilayah: <span className="text-white font-medium">{area.name}</span> ({period})
                    </div>
                  </div>
                </div>

                {/* AI Summary */}
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-xs leading-relaxed text-slate-300">
                  <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Sintesis Evaluasi AI:</span>
                  </div>
                  <p>{result.summary}</p>
                </div>

                {/* 4 Core Observed Indicators */}
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {result.indicators.map((indicator) => (
                    <div key={indicator.label} className="rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-xs">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        {indicator.label}
                      </div>
                      <div className={`mt-1 text-lg font-bold font-mono ${isWildfire ? "text-amber-300" : "text-cyan-300"}`}>
                        {indicator.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Explainable Factor Weights */}
                {result.weights && (
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3.5">
                    <div className="text-xs font-bold text-white mb-2 flex items-center justify-between">
                      <span>Dekomposisi Bobot Faktor Risiko:</span>
                      <span className="text-[10px] font-mono text-slate-400">Feature Importance</span>
                    </div>
                    <div className="space-y-1.5">
                      {result.weights.map((w) => (
                        <div key={w.factor} className="flex items-center justify-between text-xs text-slate-300">
                          <span>{w.factor}</span>
                          <span className="font-mono font-bold text-slate-100">{w.weight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Honest Warning Box */}
                <div className="rounded-2xl border border-amber-400/25 bg-amber-500/10 p-3.5 text-xs text-amber-200">
                  <div className="mb-1 flex items-center gap-1.5 font-bold">
                    <ShieldAlert className="h-4 w-4 text-amber-400" />
                    <span>Transparansi & Pembatasan Klaim:</span>
                  </div>
                  <p className="leading-relaxed">{result.warning}</p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Klik tombol &quot;Jalankan Diagnosis AI&quot; untuk memulai evaluasi model.
              </div>
            )}
          </section>
        </div>
      </div>
    </AppShell>
  );
}
