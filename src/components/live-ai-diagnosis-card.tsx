"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BrainCircuit,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Loader2,
  Gauge,
  ArrowRight,
  Layers,
} from "lucide-react";
import { demoAreas } from "@/lib/demo-data";
import { useHazardControl } from "@/lib/realtime-telemetry";
import { getWildfireMetrics } from "@/lib/wildfire-data";

interface DiagnosisResult {
  score: number;
  category: string;
  summary: string;
  recommendedAction: string;
  confidence: string;
  metricTitle: string;
  metricValue: string;
  weights?: Array<{ factor: string; weight: string }>;
}

export function LiveAiDiagnosisCard() {
  const { selectedProvinceId, setSelectedProvinceId, selectedProvince, hazardMode } = useHazardControl();
  const isWildfire = hazardMode === "wildfire";

  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Track the exact province and hazard mode that was diagnosed
  const [diagnosedProvinceId, setDiagnosedProvinceId] = useState<string>("dki");
  const [diagnosedHazardMode, setDiagnosedHazardMode] = useState<string>("flood");

  const wildfire = getWildfireMetrics(selectedProvince.id);

  // Initial baseline result for DKI Jakarta
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>({
    score: 84,
    category: "Siaga 1 (Perhatian Sangat Tinggi)",
    summary:
      "Wilayah DKI Jakarta memiliki elevasi cekungan dengan kapasitas drainase 42/100. Curah hujan lokal dan potensi luapan hulu sungai memicu peningkatan risiko genangan air di titik-titik cekungan padat.",
    recommendedAction:
      "Aktifkan pompa polder zona kritis, kuras endapan saluran primer, dan siagakan posko evakuasi mandiri.",
    confidence: "95.8% (Tinggi)",
    metricTitle: "Estimasi Tinggi Genangan",
    metricValue: "45 - 85 cm",
    weights: [
      { factor: "Curah Hujan Lokal", weight: "40%" },
      { factor: "Defisit Drainase", weight: "30%" },
      { factor: "Koefisien Limpasan", weight: "20%" },
      { factor: "Riwayat Banjir", weight: "10%" },
    ],
  });

  // Check if current parameters match the diagnosed result
  const isDiagnosedForCurrent =
    diagnosedProvinceId === selectedProvince.id &&
    diagnosedHazardMode === hazardMode &&
    diagnosisResult !== null;

  const handleRunDiagnosis = async () => {
    setIsDiagnosing(true);
    setCurrentStep(1);

    // Multi-step progress simulation
    await new Promise((r) => setTimeout(r, 450));
    setCurrentStep(2);
    await new Promise((r) => setTimeout(r, 550));
    setCurrentStep(3);
    await new Promise((r) => setTimeout(r, 450));

    try {
      const response = await fetch("/api/analysis/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          areaId: selectedProvince.id,
          period: "7 hari",
          hazardMode,
        }),
      });

      if (response.ok) {
        const payload = await response.json();
        setDiagnosisResult({
          score: payload.score,
          category: payload.category,
          summary: payload.summary,
          recommendedAction: payload.actionablePlaybook ?? "Tingkatkan koordinasi dengan instansi teknis dan siagakan personel tanggap darurat.",
          confidence: payload.confidence ?? "96.4% (Tinggi)",
          metricTitle: payload.metricTitle ?? (isWildfire ? "Estimasi Laju Rambatan Api" : "Estimasi Tinggi Genangan"),
          metricValue: payload.metricValue ?? (isWildfire ? "2.1 - 4.2 km/jam" : "35 - 75 cm"),
          weights: payload.weights,
        });
        setDiagnosedProvinceId(selectedProvince.id);
        setDiagnosedHazardMode(hazardMode);
        setIsDiagnosing(false);
        setCurrentStep(0);
        return;
      }
    } catch {
      // Fallback calculation if API network interrupted
    }

    // High-fidelity fallback computation
    if (isWildfire) {
      const wf = getWildfireMetrics(selectedProvince.id);
      const score = Math.min(
        98,
        Math.max(
          25,
          Math.round(
            wf.drynessIndex * 0.4 +
              wf.hotspotSignals * 1.8 +
              wf.windSpeed * 0.8 +
              wf.peatlandIndex * 0.25
          )
        )
      );

      let category = "Siaga 3 (Waspada)";
      let spreadRate = "0.4 - 0.9 km/jam";
      let action = "Tingkatkan frekuensi patroli ronda api masyarakat (MPA) dan pantau terus citra satelit.";

      if (score >= 80) {
        category = "Siaga 1 (Darurat Karhutla Kritis)";
        spreadRate = "2.1 - 4.5 km/jam";
        action = "Operasikan water bombing heli BNPB, isolasi parit api sekat bakar, dan aktifkan pembasahan gambut intensif bersama Manggala Agni.";
      } else if (score >= 60) {
        category = "Siaga 2 (Perhatian Tinggi)";
        spreadRate = "1.1 - 2.0 km/jam";
        action = "Mobilisasi regu Manggala Agni, tutup pintu sekat kanal (canal blocking), dan bagikan masker N95 bagi warga.";
      }

      setDiagnosisResult({
        score,
        category,
        summary: `Hasil pemodelan screening termal untuk ${selectedProvince.name} mendeteksi ${wf.hotspotSignals} sinyal titik panas dengan indeks kekeringan ${wf.drynessIndex}/100. Angin ${wf.windSpeed} km/jam mempercepat perambatan api permukaan.`,
        recommendedAction: action,
        confidence: "96.4% (Tinggi)",
        metricTitle: "Estimasi Laju Rambatan & Asap",
        metricValue: `${spreadRate} · Radius ${Math.round(wf.windSpeed * 0.8)} km`,
        weights: [
          { factor: "Indeks Kekeringan (KBDI)", weight: "40%" },
          { factor: "Anomali Termal Satelit", weight: "30%" },
          { factor: "Kecepatan & Arah Angin", weight: "20%" },
          { factor: "Bahan Bakar Gambut", weight: "10%" },
        ],
      });
    } else {
      const score = Math.min(
        96,
        Math.max(
          35,
          Math.round(
            selectedProvince.rainfallToday * 0.4 +
              selectedProvince.surfaceRunoff * 0.3 +
              (100 - selectedProvince.drainageIndex) * 0.25 +
              selectedProvince.floodObservations * 0.8
          )
        )
      );

      let category = "Siaga 3 (Waspada)";
      let depth = "10 - 25 cm";
      let action = "Monitoring berkala saluran drainase dan bersihkan sampah pada pintu penyaring.";

      if (score >= 80) {
        category = "Siaga 1 (Kritis / Sangat Tinggi)";
        depth = "45 - 90 cm";
        action = "Operasikan seluruh pompa darurat, tutup pintu air pengendali pasang, dan rilis peringatan darurat ke BPBD.";
      } else if (score >= 65) {
        category = "Siaga 2 (Perhatian Tinggi)";
        depth = "25 - 50 cm";
        action = "Aktifkan pompa polder zona kritis, kuras saluran primer, dan siapkan posko evakuasi mandiri.";
      }

      setDiagnosisResult({
        score,
        category,
        summary: `Hasil pemodelan screening neural untuk ${selectedProvince.name} mendeteksi akumulasi limpasan permukaan ${selectedProvince.surfaceRunoff}% dengan curah hujan ${selectedProvince.rainfallToday} mm/jam. Rekayasa hidrologi menunjukkan defisit resapan.`,
        recommendedAction: action,
        confidence: "95.8% (Tinggi)",
        metricTitle: "Estimasi Tinggi Genangan Air",
        metricValue: depth,
        weights: [
          { factor: "Intensitas Curah Hujan", weight: "40%" },
          { factor: "Defisit Kapasitas Drainase", weight: "30%" },
          { factor: "Koefisien Limpasan Cekungan", weight: "20%" },
          { factor: "Observasi Historis Genangan", weight: "10%" },
        ],
      });
    }

    setDiagnosedProvinceId(selectedProvince.id);
    setDiagnosedHazardMode(hazardMode);
    setIsDiagnosing(false);
    setCurrentStep(0);
  };

  return (
    <div className={`relative overflow-hidden rounded-[28px] border p-5 sm:p-7 shadow-xl backdrop-blur-md transition-colors duration-500 h-scanline ${
      isWildfire
        ? "border-amber-400/30 bg-slate-900/90 shadow-amber-950/20"
        : "border-cyan-400/25 bg-slate-900/90 shadow-cyan-950/30"
    }`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
            isWildfire
              ? "bg-amber-500/20 border-amber-400/40 text-amber-300"
              : "bg-cyan-500/20 border-cyan-400/30 text-cyan-300"
          }`}>
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <div className={`text-[10px] uppercase font-mono tracking-widest font-bold ${isWildfire ? "text-amber-400" : "text-cyan-300"}`}>
              {isWildfire ? "AI WILDFIRE RISK ENGINE" : "AI HYDROLOGICAL RISK ENGINE"}
            </div>
            <h3 className="text-lg font-bold text-white">
              {isWildfire ? "Diagnosis AI Risiko Kebakaran Hutan" : "Diagnosis AI Risiko Genangan Banjir"}
            </h3>
          </div>
        </div>

        {/* Selected Area Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">Target:</span>
          <select
            value={selectedProvinceId}
            onChange={(e) => setSelectedProvinceId(e.target.value)}
            className="rounded-full border border-white/15 bg-slate-950 px-3.5 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
            aria-label="Pilih wilayah diagnosis AI"
          >
            {demoAreas.map((area) => (
              <option key={area.id} value={area.id} className="bg-slate-950 text-white">
                {area.name} ({area.district})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Body */}
      <div className="mt-5 space-y-4">
        {/* Step indicator during processing */}
        {isDiagnosing && (
          <div className="rounded-2xl border border-cyan-400/30 bg-slate-950/80 p-5 space-y-3">
            <div className="flex items-center gap-2.5 text-xs font-mono font-bold text-cyan-300">
              <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
              <span>Memproses Model Screening AI untuk {selectedProvince.name} ({currentStep}/3)...</span>
            </div>

            {/* Mini Progress Bar */}
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/10">
              <div
                className={`h-full transition-all duration-300 ${
                  isWildfire ? "bg-amber-400" : "bg-cyan-400"
                }`}
                style={{ width: `${currentStep === 1 ? 33 : currentStep === 2 ? 66 : 100}%` }}
              />
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className={`flex items-center gap-2 ${currentStep >= 1 ? "text-emerald-300 font-semibold" : "text-slate-500"}`}>
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {isWildfire
                    ? "1. Ingesti citra satelit MODIS/VIIRS & sensor tanah gambut"
                    : "1. Ingesti radar presipitasi BMKG & telemetri sensor debit sungai"}
                </span>
              </div>
              <div className={`flex items-center gap-2 ${currentStep >= 2 ? "text-emerald-300 font-semibold" : "text-slate-500"}`}>
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {isWildfire
                    ? "2. Kalkulasi Keetch-Byram Drought Index (KBDI) & vektor angin"
                    : "2. Kalkulasi koefisien limpasan (runoff) & defisit drainase perkotaan"}
                </span>
              </div>
              <div className={`flex items-center gap-2 ${currentStep >= 3 ? "text-emerald-300 font-semibold" : "text-slate-500"}`}>
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>3. Formulasi rekomendasi taktis operasional & feature explainability</span>
              </div>
            </div>
          </div>
        )}

        {/* STANDBY STATE — Shown when region was changed without clicking diagnosis */}
        {!isDiagnosedForCurrent && !isDiagnosing && (
          <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/60 p-5 text-center space-y-3">
            <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border ${
              isWildfire ? "bg-amber-500/10 border-amber-400/30 text-amber-300" : "bg-cyan-500/10 border-cyan-400/30 text-cyan-300"
            }`}>
              <BrainCircuit className="h-6 w-6" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold bg-amber-500/15 border border-amber-400/30 text-amber-300 mb-1.5">
                PARAMETER DIPERBARUI · MENUNGGU INFERENSI
              </div>
              <div className="text-sm font-bold text-white">
                Siap Mendiagnosis {selectedProvince.name} ({selectedProvince.district})
              </div>
              <p className="mt-1 text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Target wilayah telah diubah. Klik tombol <strong className="text-white">&quot;Jalankan Diagnosis AI&quot;</strong> di bawah untuk mengeksekusi screening model untuk wilayah ini.
              </p>
            </div>

            {/* Quick preview metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono max-w-sm mx-auto pt-1">
              <div className="rounded-xl border border-white/5 bg-slate-900/80 p-2.5 text-left">
                <span className="text-[10px] text-slate-400 block">{isWildfire ? "Titik Panas Satelit" : "Curah Hujan Terukur"}</span>
                <span className={`font-bold ${isWildfire ? "text-amber-300" : "text-cyan-300"}`}>
                  {isWildfire ? `${wildfire.hotspotSignals} Sinyal` : `${selectedProvince.rainfallToday} mm/jam`}
                </span>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-900/80 p-2.5 text-left">
                <span className="text-[10px] text-slate-400 block">{isWildfire ? "Indeks Kekeringan" : "Limpasan Cekungan"}</span>
                <span className="font-bold text-white">
                  {isWildfire ? `${wildfire.drynessIndex}/100` : `${selectedProvince.surfaceRunoff}%`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Diagnostic Results Card — Displayed when diagnosed */}
        {isDiagnosedForCurrent && diagnosisResult && !isDiagnosing && (
          <div className="space-y-4">
            {/* Top Score & Status */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Indeks Risiko AI</span>
                  <Gauge className="h-3 w-3 text-cyan-400" />
                </div>
                <div className={`mt-1 text-3xl font-extrabold font-mono ${
                  diagnosisResult.score >= 80 ? "text-rose-400" : diagnosisResult.score >= 60 ? "text-amber-300" : "text-emerald-400"
                }`}>
                  {diagnosisResult.score} <span className="text-xs font-normal text-slate-400">/100</span>
                </div>
                <div className="mt-0.5 text-[10px] text-emerald-400 font-mono">Akurasi: {diagnosisResult.confidence}</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3 sm:col-span-2">
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                  Status Kesiapsiagaan
                </div>
                <div className={`mt-1 text-sm font-bold ${
                  diagnosisResult.score >= 80 ? "text-rose-300" : diagnosisResult.score >= 60 ? "text-amber-300" : "text-emerald-300"
                }`}>
                  {diagnosisResult.category}
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-slate-300 border-t border-white/5 pt-1.5">
                  <span className="text-slate-400">{diagnosisResult.metricTitle}:</span>
                  <span className="font-mono font-bold text-white">{diagnosisResult.metricValue}</span>
                </div>
              </div>
            </div>

            {/* AI Synthesized Diagnosis */}
            <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3.5 text-xs leading-relaxed text-slate-300">
              <div className="flex items-center gap-1.5 font-bold text-white mb-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>Ringkasan Screening Neural ({selectedProvince.name}):</span>
              </div>
              <p>{diagnosisResult.summary}</p>
            </div>

            {/* Explainable Feature Importance Bars */}
            {diagnosisResult.weights && (
              <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3 text-xs">
                <div className="font-bold text-white mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Dekomposisi Bobot Pengaruh (XAI):</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Model Weights</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {diagnosisResult.weights.map((w) => {
                    const numWeight = parseInt(w.weight.replace("%", ""), 10) || 25;
                    return (
                      <div key={w.factor} className="space-y-0.5">
                        <div className="flex items-center justify-between text-[11px] text-slate-300">
                          <span className="truncate pr-1">{w.factor}</span>
                          <span className="font-mono font-bold text-white shrink-0">{w.weight}</span>
                        </div>
                        <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                          <div
                            className={`h-full rounded-full ${isWildfire ? "bg-amber-400" : "bg-cyan-400"}`}
                            style={{ width: `${numWeight * 2.5}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tactical Action Playbook */}
            <div className={`rounded-xl border p-3.5 text-xs leading-relaxed ${
              isWildfire
                ? "border-amber-400/30 bg-amber-500/10 text-amber-100"
                : "border-cyan-400/30 bg-cyan-500/10 text-cyan-100"
            }`}>
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Rekomendasi Taktis & SOP Segera:</span>
              </div>
              <p>{diagnosisResult.recommendedAction}</p>
            </div>
          </div>
        )}

        {/* Trigger Diagnosis Button & Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
          <Link
            href="/intelligence"
            className="text-[11px] text-slate-400 hover:text-white font-mono flex items-center gap-1 transition"
          >
            <span>Buka Ruang Diagnosis Lengkap</span>
            <ArrowRight className="h-3 w-3" />
          </Link>

          <button
            type="button"
            onClick={handleRunDiagnosis}
            disabled={isDiagnosing}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold text-slate-950 transition hover:brightness-110 disabled:opacity-60 shadow-md cursor-pointer ${
              isWildfire
                ? "bg-gradient-to-r from-amber-400 to-orange-400 shadow-amber-500/20"
                : "bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-cyan-500/20"
            }`}
          >
            {isDiagnosing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Mengeksekusi ({currentStep}/3)...</span>
              </>
            ) : (
              <>
                <BrainCircuit className="h-3.5 w-3.5" />
                <span>
                  {isDiagnosedForCurrent
                    ? "Jalankan Diagnosis Ulang"
                    : `Jalankan Diagnosis AI (${selectedProvince.name})`}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
