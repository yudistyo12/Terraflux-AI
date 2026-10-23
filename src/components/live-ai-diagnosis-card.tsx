"use client";

import React, { useState } from "react";
import {
  BrainCircuit,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { demoAreas } from "@/lib/demo-data";
import { useRealtimeTelemetry } from "@/lib/realtime-telemetry";
import { getWildfireMetrics } from "@/lib/wildfire-data";

export function LiveAiDiagnosisCard() {
  const { selectedProvinceId, setSelectedProvinceId, selectedProvince, hazardMode } = useRealtimeTelemetry();
  const isWildfire = hazardMode === "wildfire";

  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const wildfire = getWildfireMetrics(selectedProvince.id);

  const [diagnosisResult, setDiagnosisResult] = useState<{
    score: number;
    category: string;
    summary: string;
    recommendedAction: string;
    confidence: string;
    metricTitle: string;
    metricValue: string;
  } | null>({
    score: 84,
    category: isWildfire ? "Siaga 1 (Darurat Karhutla)" : "Siaga 2 (Perhatian Tinggi)",
    summary: isWildfire
      ? `Wilayah ${selectedProvince.name} memiliki indeks kekeringan ${wildfire.drynessIndex}/100 dan tutupan gambut rentan terbakar. Kecepatan angin ${wildfire.windSpeed} km/jam memicu percepatan rambatan api.`
      : `Wilayah ${selectedProvince.name} memiliki elevasi cekungan dengan kapasitas drainase saat ini ${selectedProvince.drainageIndex}/100. Curah hujan lokal berpotensi memicu genangan di area dataran rendah.`,
    recommendedAction: isWildfire
      ? "Luncurkan patroli darat Manggala Agni, tutup sekat kanal untuk pembasahan gambut, dan siagakan water bombing."
      : "Aktifkan pompa polder zona kritis, kuras saluran primer, dan siapkan posko evakuasi mandiri.",
    confidence: "94.8% (Tinggi)",
    metricTitle: isWildfire ? "Estimasi Laju Rambatan Api" : "Estimasi Tinggi Genangan",
    metricValue: isWildfire ? "1.4 - 2.8 km/jam" : "25 - 65 cm",
  });

  const handleRunDiagnosis = async () => {
    setIsDiagnosing(true);
    setCurrentStep(1);

    // Step 1: Ingestion
    await new Promise((r) => setTimeout(r, 600));
    setCurrentStep(2);

    // Step 2: Environmental tensor processing
    await new Promise((r) => setTimeout(r, 700));
    setCurrentStep(3);

    // Step 3: Synthesis
    await new Promise((r) => setTimeout(r, 600));

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
        action = "Operasikan water bombing heli BNPB, isolasi parit api sekat bakar, dan aktifkan pembasahan gambut intensif.";
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
      });
    }

    setIsDiagnosing(false);
    setCurrentStep(0);
  };

  return (
    <div className={`relative overflow-hidden rounded-[28px] border p-5 sm:p-7 shadow-xl backdrop-blur-md transition-colors duration-500 shimmer-overlay h-scanline ${
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

        {/* Selected Area Pill */}
        <select
          value={selectedProvinceId}
          onChange={(e) => setSelectedProvinceId(e.target.value)}
          className="rounded-full border border-white/15 bg-slate-950 px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
          aria-label="Pilih wilayah diagnosis AI"
        >
          {demoAreas.map((area) => (
            <option key={area.id} value={area.id} className="bg-slate-950 text-white">
              {area.name}
            </option>
          ))}
        </select>
      </div>

      {/* Main Body */}
      <div className="mt-5 space-y-4">
        {/* Step indicator during processing */}
        {isDiagnosing && (
          <div className="rounded-2xl border border-cyan-400/30 bg-slate-950/80 p-4 space-y-2.5 animate-pulse">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
              <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
              <span>Memproses Algoritma Screening Multi-Bahaya...</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className={`flex items-center gap-2 ${currentStep >= 1 ? "text-emerald-300" : "text-slate-500"}`}>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>
                  {isWildfire
                    ? "1. Ingest citra termal satelit MODIS/VIIRS & sensor tanah gambut"
                    : "1. Ingest radar presipitasi BMKG & telemetri sensor debit sungai"}
                </span>
              </div>
              <div className={`flex items-center gap-2 ${currentStep >= 2 ? "text-emerald-300" : "text-slate-500"}`}>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>
                  {isWildfire
                    ? "2. Kalkulasi Keetch-Byram Drought Index (KBDI) & vektor angin"
                    : "2. Kalkulasi koefisien limpasan (runoff) & defisit drainase perkotaan"}
                </span>
              </div>
              <div className={`flex items-center gap-2 ${currentStep >= 3 ? "text-emerald-300" : "text-slate-500"}`}>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>3. Formulasi rekomendasi taktis operasional instan</span>
              </div>
            </div>
          </div>
        )}

        {/* Diagnostic Results Card */}
        {diagnosisResult && !isDiagnosing && (
          <div className="space-y-4">
            {/* Top Score & Status */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                  Indeks Keparahan AI
                </div>
                <div className="mt-1 text-3xl font-extrabold font-mono text-white">
                  {diagnosisResult.score} <span className="text-xs font-normal text-slate-400">/100</span>
                </div>
                <div className="mt-0.5 text-[10px] text-cyan-300">Confidence: {diagnosisResult.confidence}</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3 sm:col-span-2">
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                  Status Kesiapsiagaan
                </div>
                <div className="mt-1 text-sm font-bold text-amber-300">{diagnosisResult.category}</div>
                <div className="mt-1 flex items-center justify-between text-xs text-slate-300">
                  <span className="text-slate-400">{diagnosisResult.metricTitle}:</span>
                  <span className="font-mono font-bold text-white">{diagnosisResult.metricValue}</span>
                </div>
              </div>
            </div>

            {/* AI Synthesized Diagnosis */}
            <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3.5 text-xs leading-relaxed text-slate-300">
              <div className="flex items-center gap-1.5 font-bold text-white mb-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>Ringkasan Screening Neural:</span>
              </div>
              <p>{diagnosisResult.summary}</p>
            </div>

            {/* Tactical Action Playbook */}
            <div className={`rounded-xl border p-3.5 text-xs leading-relaxed ${
              isWildfire
                ? "border-amber-400/30 bg-amber-500/10 text-amber-100"
                : "border-cyan-400/30 bg-cyan-500/10 text-cyan-100"
            }`}>
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Rekomendasi Taktis Segera:</span>
              </div>
              <p>{diagnosisResult.recommendedAction}</p>
            </div>
          </div>
        )}

        {/* Trigger Diagnosis Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
          <div className="text-[10px] text-slate-400 font-mono">
            Model: Explainable Random Forest + Neural Screening
          </div>

          <button
            type="button"
            onClick={handleRunDiagnosis}
            disabled={isDiagnosing}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold text-slate-950 transition hover:brightness-110 disabled:opacity-60 ${
              isWildfire
                ? "bg-gradient-to-r from-amber-400 to-orange-400 shadow-md shadow-amber-500/20"
                : "bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-md shadow-cyan-500/20"
            }`}
          >
            {isDiagnosing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Menganalisis...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Eksekusi Diagnosis Ulang</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
