"use client";

import React, { useState, useEffect } from "react";
import {
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  X,
  Award,
  Globe2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useRealtimeTelemetry } from "@/lib/realtime-telemetry";

export function OpeningIntroModal() {
  const { isPresentationMode, setIsPresentationMode } = useRealtimeTelemetry();
  const [showAutoIntro, setShowAutoIntro] = useState(() => {
    if (typeof window !== "undefined") {
      const hasSeen = sessionStorage.getItem("terraflux_intro_seen");
      if (!hasSeen) {
        sessionStorage.setItem("terraflux_intro_seen", "true");
        return true;
      }
    }
    return false;
  });
  const [progress, setProgress] = useState(0);

  // Automated progress bar when intro is showing
  useEffect(() => {
    if (!showAutoIntro) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowAutoIntro(false), 500);
          return 100;
        }
        return prev + 4;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [showAutoIntro]);

  const introSteps = [
    { title: "Koneksi Jaringan Satelit & Radar BMKG", desc: "Sinkronisasi 38 stasiun provinsi dan citra radar presipitasi" },
    { title: "Neural Hydro-Topographic Screening", desc: "Model pembelajaran mesin memproses limpasan air & topografi cekungan" },
    { title: "Inisialisasi Sandbox Simulasi Mitigasi", desc: "Kapasitas drainase, penyerapan hijau, dan retensi air aktif" },
    { title: "TERRAFLUX AI Siap Digunakan", desc: "Platform siap diuji secara interaktif oleh dewan juri" },
  ];

  const competitiveAdvantages = [
    {
      title: "1. Pemrosesan Real-Time Multi-Sensor",
      desc: "Menghubungkan data curah hujan, elevasi digital DEM, dan telemetri pintu air dalam satu antarmuka responsif tanpa jeda.",
      icon: Globe2,
      badge: "Real-Time Ingestion",
    },
    {
      title: "2. AI Screening & Explainable Risk",
      desc: "Setiap nilai risiko dijelaskan secara transparan dengan dekomposisi faktor (drainase, tutupan hijau, limpasan, curah hujan).",
      icon: Cpu,
      badge: "Explainable AI",
    },
    {
      title: "3. Interactive What-If Mitigation Sandbox",
      desc: "Juri dapat langsung menggeser parameter (kapasitas pompa, sponge city, kolam retensi) dan melihat kalkulasi penurunan risiko seketika.",
      icon: Layers,
      badge: "Decision Simulator",
    },
    {
      title: "4. Keselarasan SDG 11 & SDG 13",
      desc: "Mendukung kota tangguh bencana berkelanjutan dengan rekomendasi tindakan multi-pihak berbasis prioritas risiko terukur.",
      icon: Award,
      badge: "UN SDG Aligned",
    },
  ];

  return (
    <>
      {/* 1. Cinematic Opening Animation on First Entry */}
      {showAutoIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl p-4 transition-all duration-700 animate-in fade-in">
          <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-cyan-400/30 bg-slate-900/95 p-6 shadow-2xl shadow-cyan-500/20 sm:p-8">
            <div className="scanline-bar" />

            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/40 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 text-cyan-200">
                  <Sparkles className="h-5 w-5 animate-spin" style={{ animationDuration: "6s" }} />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-widest text-cyan-300">
                    SISTEM INISIALISASI HYDRO-AI
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-white">TERRAFLUX COMMAND</h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAutoIntro(false)}
                className="rounded-full border border-white/10 p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
                title="Lewati inisialisasi"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Step animation checklist */}
            <div className="my-6 space-y-3 font-mono text-xs">
              {introSteps.map((s, idx) => {
                const isPassed = progress > (idx + 1) * 23;
                return (
                  <div
                    key={s.title}
                    className={`flex items-start gap-3 rounded-xl p-3 transition-all ${
                      isPassed
                        ? "border border-emerald-500/20 bg-emerald-500/5 text-emerald-200"
                        : "border border-white/5 bg-slate-950/50 text-slate-400"
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-slate-600 shrink-0 mt-0.5 animate-pulse" />
                    )}
                    <div>
                      <div className={`font-semibold ${isPassed ? "text-emerald-300" : "text-slate-300"}`}>
                        {s.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{s.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-cyan-300">
                <span>Sinkronisasi Satelit & Sensor:</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-300 transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Mode Presentasi Juri Nasional</span>
              <button
                type="button"
                onClick={() => setShowAutoIntro(false)}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-2 text-xs font-bold text-slate-950 transition hover:brightness-110"
              >
                Masuk ke Platform <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Full Presentation Mode Modal (Triggered by user/judge button) */}
      {isPresentationMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl p-4 animate-in fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-cyan-400/30 bg-slate-900/95 p-6 shadow-2xl shadow-cyan-500/20 sm:p-8">
            <div className="flex items-start justify-between border-b border-white/10 pb-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                  <Award className="h-3.5 w-3.5" />
                  PANDUAN & RINGKASAN DEWAN JURI
                </div>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Mengapa TERRAFLUX AI Layak Menjadi Juara?
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                  Arsitektur kecerdasan banjir perkotaan berstandar kompetisi dengan validasi real-time dan model yang dapat diuji langsung.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPresentationMode(false)}
                className="rounded-full border border-white/10 p-2 text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 4 Pillars of Excellence */}
            <div className="my-6 grid gap-4 sm:grid-cols-2">
              {competitiveAdvantages.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="group rounded-2xl border border-white/10 bg-slate-950/60 p-5 transition-all hover:border-cyan-400/40 hover:bg-slate-950/80"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-mono text-cyan-300 border border-white/5">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="mt-4 font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-300">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Quick Demo Action Steps for Judges */}
            <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-emerald-950/40 p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-3">
                🎯 Rekomendasi Rute Pengujian Juri:
              </div>
              <div className="grid gap-3 sm:grid-cols-3 text-xs">
                <Link
                  href="/risk-map"
                  onClick={() => setIsPresentationMode(false)}
                  className="flex flex-col justify-between rounded-xl border border-white/10 bg-slate-950/60 p-3 hover:border-cyan-400/50 hover:bg-slate-900 transition"
                >
                  <span className="font-semibold text-white">1. Peta Interaktif 38 Provinsi</span>
                  <span className="text-slate-400 mt-1">Uji klik marker kota, zoom peta, dan toggle layer curah hujan & risiko.</span>
                  <span className="text-cyan-300 font-semibold mt-2 inline-flex items-center gap-1">Buka Peta →</span>
                </Link>
                <Link
                  href="/simulator"
                  onClick={() => setIsPresentationMode(false)}
                  className="flex flex-col justify-between rounded-xl border border-white/10 bg-slate-950/60 p-3 hover:border-cyan-400/50 hover:bg-slate-900 transition"
                >
                  <span className="font-semibold text-white">2. Simulator Mitigasi (What-If)</span>
                  <span className="text-slate-400 mt-1">Geser slider kapasitas drainase & retensi air untuk memvalidasi algoritma.</span>
                  <span className="text-cyan-300 font-semibold mt-2 inline-flex items-center gap-1">Buka Simulator →</span>
                </Link>
                <Link
                  href="/intelligence"
                  onClick={() => setIsPresentationMode(false)}
                  className="flex flex-col justify-between rounded-xl border border-white/10 bg-slate-950/60 p-3 hover:border-cyan-400/50 hover:bg-slate-900 transition"
                >
                  <span className="font-semibold text-white">3. Studio Intelijen AI</span>
                  <span className="text-slate-400 mt-1">Jalankan screening risiko berbasis model AI dengan penjelasan faktor terperinci.</span>
                  <span className="text-cyan-300 font-semibold mt-2 inline-flex items-center gap-1">Buka AI Intelijen →</span>
                </Link>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
              <div className="text-xs text-slate-400">
                Teknologi: Next.js 16 (Turbopack), Tailwind CSS, Recharts, MapLibre GL, WebGL Radar Engine
              </div>
              <button
                type="button"
                onClick={() => setIsPresentationMode(false)}
                className="rounded-full bg-cyan-400 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition"
              >
                Mulai Uji Langsung
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
