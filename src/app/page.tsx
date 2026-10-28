"use client";

import React, { useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Waves,
  Cpu,
  Layers,
  MapPin,
  CheckCircle2,
  FileCheck2,
  Zap,
  Flame,
  Wind,
  Droplets,
  SunMedium,
  ShieldCheck,
  Camera,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { HeroRadarCommand } from "@/components/hero-radar-command";
import { LiveAiDiagnosisCard } from "@/components/live-ai-diagnosis-card";
import { QuickMitigationSandbox } from "@/components/quick-mitigation-sandbox";
import { demoAreas } from "@/lib/demo-data";
import { useHazardControl } from "@/lib/realtime-telemetry";
import { getWildfireMetrics } from "@/lib/wildfire-data";

const floodPillars = [
  {
    title: "Geospatial Multi-Sensor Mesh",
    desc: "Menggabungkan citra radar presipitasi BMKG, model elevasi digital (DEM), dan sensor hidrometri pintu air dalam satu jaringan data terpadu.",
    icon: Layers,
    badge: "Input Geospasial",
    accent: "from-cyan-500/20 to-blue-500/20",
    border: "border-cyan-400/30",
  },
  {
    title: "Explainable Hydro-Neural Screening",
    desc: "AI mendeteksi risiko genangan dengan formula transparan berbasis koefisien limpasan, defisit drainase, dan observasi hidrologis.",
    icon: Cpu,
    badge: "Explainable AI",
    accent: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-400/30",
  },
  {
    title: "What-If Engineering Sandbox",
    desc: "Simulasikan intervensi tata air perkotaan seperti pompa polder, kolam retensi, dan sponge city dengan kalkulasi dampak instan.",
    icon: Waves,
    badge: "Mitigation Engine",
    accent: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-400/30",
  },
  {
    title: "Actionable Multi-Agency Playbooks",
    desc: "Menerjemahkan probabilitas risiko teknis ke dalam protokol kesiapsiagaan terstandarisasi untuk BPBD, Dinas PUPR, dan relawan warga.",
    icon: FileCheck2,
    badge: "SOP Kesiapsiagaan",
    accent: "from-purple-500/20 to-indigo-500/20",
    border: "border-purple-400/30",
  },
];

const wildfirePillars = [
  {
    title: "Satellite Thermal Mesh Ingestion",
    desc: "Menggabungkan deteksi termal satelit MODIS & VIIRS, sensor muka air tanah gambut BRGM, dan stasiun cuaca angin permukaan.",
    icon: Layers,
    badge: "Input Geospasial",
    accent: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-400/30",
  },
  {
    title: "Explainable Fire Weather Index",
    desc: "AI memodelkan potensi perambatan api dari dekomposisi Keetch-Byram Drought Index (KBDI), kelembapan bahan bakar, dan arah angin.",
    icon: Cpu,
    badge: "Explainable AI",
    accent: "from-rose-500/20 to-orange-500/20",
    border: "border-rose-400/30",
  },
  {
    title: "What-If Peat & Firebreak Sandbox",
    desc: "Uji coba efektivitas sekat bakar (firebreaks), penutupan sekat kanal (canal blocking), dan kesiapan water bombing BNPB secara real-time.",
    icon: Flame,
    badge: "Mitigation Engine",
    accent: "from-amber-500/20 to-yellow-500/20",
    border: "border-amber-400/30",
  },
  {
    title: "Manggala Agni & TRC Playbooks",
    desc: "Merumuskan alur komando darurat terintegrasi untuk BPBD, Manggala Agni, KLHK, dan Satgas Udara pencegah karhutla.",
    icon: FileCheck2,
    badge: "SOP Kesiapsiagaan",
    accent: "from-purple-500/20 to-indigo-500/20",
    border: "border-purple-400/30",
  },
];

/* ═══ Scroll-Reveal Hook ═══ */
function useScrollReveal() {
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.02, rootMargin: "150px 0px 50px 0px" }
    );

    refs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const setRef = (index: number) => (el: HTMLElement | null) => {
    refs.current[index] = el;
  };

  return setRef;
}

export default function HomePage() {
  const { setSelectedProvinceId, hazardMode } = useHazardControl();
  const isWildfire = hazardMode === "wildfire";
  const setRef = useScrollReveal();

  // Dynamic ranking based on active hazard
  const priorityAreas = useMemo(() => {
    if (isWildfire) {
      return [...demoAreas]
        .sort((a, b) => {
          const wfA = getWildfireMetrics(a.id);
          const wfB = getWildfireMetrics(b.id);
          return (
            wfB.hotspotSignals * 3 + wfB.drynessIndex -
            (wfA.hotspotSignals * 3 + wfA.drynessIndex)
          );
        })
        .slice(0, 6);
    }
    return demoAreas.slice(0, 6);
  }, [isWildfire]);

  const kpiStats = useMemo(() => {
    if (isWildfire) {
      return [
        { label: "Cakupan Satelit Termal", value: "34", unit: "Provinsi", detail: "MODIS & VIIRS" },
        { label: "Stasiun Cuaca & Gambut", value: "140+", unit: "Sensor AWS/BRGM", detail: "Update periodik" },
        { label: "Kecepatan Inferensi FWI", value: "<1.1", unit: "Detik", detail: "Screening instan" },
        { label: "Potensi Hambat Karhutla", value: "Up to 52%", unit: "Efisiensi", detail: "Simulasi sekat kanal" },
      ];
    }
    return [
      { label: "Cakupan Wilayah Nasional", value: "34", unit: "Provinsi", detail: "Seluruh Indonesia" },
      { label: "Stasiun Telemetri Aktif", value: "170+", unit: "Sensor IoT & TMA", detail: "Update real-time" },
      { label: "Kecepatan Inferensi AI", value: "<1.2", unit: "Detik", detail: "Komputasi latensi rendah" },
      { label: "Potensi Reduksi Risiko", value: "Up to 48%", unit: "Efisiensi", detail: "Simulasi intervensi" },
    ];
  }, [isWildfire]);

  const activePillars = isWildfire ? wildfirePillars : floodPillars;

  return (
    <AppShell>
      <main className="space-y-10 sm:space-y-12 lg:space-y-14">
        {/* HERO SECTION WITH DYNAMIC DISASTER BACKGROUND — 120fps GPU Composited */}
        <section
          style={{ contain: "layout paint" }}
          className={`relative overflow-hidden rounded-[32px] sm:rounded-[36px] border border-white/15 px-5 sm:px-8 lg:px-10 py-8 sm:py-12 shadow-2xl h-scanline anim-reveal-up transform-gpu ${
            isWildfire ? "breathe-border-amber" : "breathe-border-cyan"
          }`}
        >
          {/* Dynamic Photographic Backdrop — 120fps GPU Isolated with Ken Burns */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" style={{ contain: "strict" }}>
            {/* Deep foundation background color to prevent flash */}
            <div className="absolute inset-0 bg-slate-950" />

            {/* Flood Backdrop — Render only when active to avoid dual-GPU overhead */}
            {!isWildfire && (
              <div
                className="absolute inset-0 bg-cover bg-right sm:bg-center ken-burns-bg pointer-events-none"
                style={{
                  backgroundImage: "url('/images/flood-hero-bg.jpg')",
                }}
              />
            )}
            {/* Wildfire Backdrop — Render only when active to avoid dual-GPU overhead */}
            {isWildfire && (
              <div
                className="absolute inset-0 bg-cover bg-right sm:bg-center ken-burns-bg pointer-events-none"
                style={{
                  backgroundImage: "url('/images/wildfire-hero-bg.jpg')",
                }}
              />
            )}

            {/* Smart Gradient Overlays — Text readability on left, crystal clear photo on right */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-950/55 to-slate-950/15 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20 pointer-events-none" />
            <div
              className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
                isWildfire
                  ? "bg-[radial-gradient(ellipse_at_85%_40%,rgba(249,115,22,0.2),transparent_65%)]"
                  : "bg-[radial-gradient(ellipse_at_85%_40%,rgba(56,189,248,0.18),transparent_65%)]"
              }`}
            />
            {/* High-tech telemetry grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20 pointer-events-none" />

            {/* RESTORED ANIMATED FLOATING PARTICLES & DATA RAIN (120fps GPU Isolated) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ contain: "strict" }}>
              <div className={`floating-particle w-2.5 h-2.5 top-[15%] left-[22%] ${isWildfire ? 'bg-amber-400/60 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'bg-cyan-400/60 shadow-[0_0_8px_rgba(56,189,248,0.8)]'}`} />
              <div className={`floating-particle w-1.5 h-1.5 top-[35%] left-[72%] ${isWildfire ? 'bg-orange-400/50 shadow-[0_0_6px_rgba(249,115,22,0.8)]' : 'bg-teal-400/50 shadow-[0_0_6px_rgba(45,212,191,0.8)]'}`} style={{ animationDelay: '1s' }} />
              <div className={`floating-particle-slow w-3 h-3 top-[55%] left-[45%] ${isWildfire ? 'bg-rose-400/40 shadow-[0_0_10px_rgba(244,63,94,0.7)]' : 'bg-emerald-400/40 shadow-[0_0_10px_rgba(52,211,153,0.7)]'}`} style={{ animationDelay: '2s' }} />
              <div className={`floating-particle w-2 h-2 top-[22%] left-[60%] ${isWildfire ? 'bg-yellow-400/70 shadow-[0_0_8px_rgba(250,204,21,0.9)]' : 'bg-sky-400/70 shadow-[0_0_8px_rgba(56,189,248,0.9)]'}`} style={{ animationDelay: '3s' }} />
              <div className={`floating-particle-slow w-2.5 h-2.5 top-[70%] left-[82%] ${isWildfire ? 'bg-amber-300/45 shadow-[0_0_8px_rgba(252,211,77,0.8)]' : 'bg-cyan-300/45 shadow-[0_0_8px_rgba(103,232,249,0.8)]'}`} style={{ animationDelay: '4s' }} />
              <div className={`floating-particle w-1.5 h-1.5 top-[52%] left-[12%] ${isWildfire ? 'bg-orange-300/50 shadow-[0_0_6px_rgba(253,186,116,0.8)]' : 'bg-teal-300/50 shadow-[0_0_6px_rgba(94,234,212,0.8)]'}`} style={{ animationDelay: '1.5s' }} />

              {/* RESTORED DATA STREAM RAIN LINES */}
              <div className={`data-rain-line left-[14%] top-0 ${isWildfire ? '!bg-[linear-gradient(to_bottom,transparent,rgba(251,191,36,0.7),transparent)]' : ''}`} style={{ animationDelay: '0s', animationDuration: '4s' }} />
              <div className={`data-rain-line left-[32%] top-0 ${isWildfire ? '!bg-[linear-gradient(to_bottom,transparent,rgba(249,115,22,0.6),transparent)]' : ''}`} style={{ animationDelay: '1.2s', animationDuration: '3.5s' }} />
              <div className={`data-rain-line left-[58%] top-0 ${isWildfire ? '!bg-[linear-gradient(to_bottom,transparent,rgba(245,158,11,0.7),transparent)]' : ''}`} style={{ animationDelay: '2.4s', animationDuration: '4.5s' }} />
              <div className={`data-rain-line left-[76%] top-0 ${isWildfire ? '!bg-[linear-gradient(to_bottom,transparent,rgba(251,146,60,0.6),transparent)]' : ''}`} style={{ animationDelay: '0.8s', animationDuration: '3.8s' }} />
              <div className={`data-rain-line left-[90%] top-0 ${isWildfire ? '!bg-[linear-gradient(to_bottom,transparent,rgba(251,191,36,0.7),transparent)]' : ''}`} style={{ animationDelay: '3s', animationDuration: '4.2s' }} />
            </div>
          </div>

          {/* Clean Background Photo Label Tag */}
          <div className="absolute top-4 right-5 hidden sm:flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/90 px-3.5 py-1.5 font-mono text-[11px] text-slate-200 shadow-lg z-20">
            <Camera className={`h-3.5 w-3.5 ${isWildfire ? "text-amber-400" : "text-cyan-400"}`} />
            <span className="text-slate-400 font-sans">Foto Dokumentasi Latar:</span>
            <span className="font-semibold text-white">
              {isWildfire
                ? "Garis Api Karhutla & Asap Tajuk Hutan"
                : "Banjir Lahar Dingin & Sedimentasi DAS (Sumatera Barat)"}
            </span>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Left Hero Content */}
            <div className="max-w-2xl space-y-6">
              {/* Status Badge */}
              <div className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold shadow-sm ${
                isWildfire
                  ? "border-amber-400/40 bg-amber-500/10 text-amber-200 shadow-amber-500/20"
                  : "border-cyan-400/30 bg-cyan-500/10 text-cyan-200 shadow-cyan-500/20"
              }`}>
                <span className="relative flex h-2 w-2">
                  <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${isWildfire ? "bg-amber-400" : "bg-cyan-400"}`}></span>
                  <span className={`relative inline-flex h-2 w-2 rounded-full ${isWildfire ? "bg-amber-500" : "bg-cyan-500"}`}></span>
                </span>
                <span className="tracking-wide uppercase font-mono text-[11px]">
                  TERRAFLUX AI · {isWildfire ? "SISTEM INTELIJEN KARHUTLA & GAMBUT" : "SISTEM INTELIJEN BANJIR & HIDROLOGI"}
                </span>
              </div>

              {/* Main Headline — Animated Gradient */}
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.12] anim-reveal-up anim-delay-2">
                {isWildfire
                  ? "Deteksi Dini, Prediksi Cerdas, & Mitigasi Karhutla "
                  : "Deteksi Dini, Prediksi Akurat, & Mitigasi Banjir "}
                <span className={`animated-gradient-text ${
                  isWildfire
                    ? "bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400"
                    : "bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400"
                }`}>
                  Seluruh Indonesia.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed anim-reveal-up anim-delay-3">
                {isWildfire
                  ? "Platform geospasial mutakhir untuk memantau anomali titik panas satelit, mengevaluasi indeks kekeringan vegetasi, memantau kubah gambut kritis, dan menguji skenario mitigasi berbasis data sains."
                  : "Platform geospasial mutakhir untuk menganalisis presipitasi curah hujan, memantau dinamika muka air sungai, memetakan defisit drainase perkotaan, dan menyimulasikan intervensi mitigasi secara presisi."}
              </p>

              {/* Background Photo Context Badge — 120fps Solid Dark Tech Panel */}
              <div className="inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-slate-950/90 px-3.5 py-2 text-xs text-slate-200 anim-reveal-up anim-delay-3 shadow-md">
                <Camera className={`h-4 w-4 shrink-0 ${isWildfire ? "text-amber-400" : "text-cyan-400"}`} />
                <span className="leading-snug">
                  {isWildfire
                    ? "Foto latar menampilkan kondisi riil garis api aktif (flame front) membakar tajuk kanopi vegetasi & kepulan asap pekat karhutla."
                    : "Foto latar menampilkan kondisi riil genangan sedimentasi pekat & banjir lahar dingin yang melanda permukiman DAS Sumatera Barat."}
                </span>
              </div>

              {/* 3 Core Hazard Indicators — Staggered Animation */}
              <div className="grid gap-3 sm:grid-cols-3 anim-reveal-up anim-delay-4">
                {isWildfire ? (
                  <>
                    <div className="rounded-2xl border border-amber-400/20 bg-slate-900/70 p-3.5 text-left">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-amber-300 font-bold">
                        <Flame className="h-3.5 w-3.5 text-rose-400" />
                        DETEKSI TERMAL AKTIF
                      </div>
                      <div className="mt-1 text-xs text-slate-300">Sensor satelit MODIS & VIIRS</div>
                    </div>
                    <div className="rounded-2xl border border-amber-400/20 bg-slate-900/70 p-3.5 text-left">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-amber-300 font-bold">
                        <SunMedium className="h-3.5 w-3.5 text-amber-400" />
                        INDEKS KEKERINGAN & GAMBUT
                      </div>
                      <div className="mt-1 text-xs text-slate-300">Kalkulasi KBDI & Muka Air Gambut</div>
                    </div>
                    <div className="rounded-2xl border border-amber-400/20 bg-slate-900/70 p-3.5 text-left">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-amber-300 font-bold">
                        <Wind className="h-3.5 w-3.5 text-cyan-400" />
                        DINAMIKA VEKTOR ANGIN
                      </div>
                      <div className="mt-1 text-xs text-slate-300">Proyeksi sebaran asap kabut</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-2xl border border-cyan-400/20 bg-slate-900/70 p-3.5 text-left">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-cyan-300 font-bold">
                        <Waves className="h-3.5 w-3.5 text-cyan-400" />
                        PRESIPITASI RADAR CUACA
                      </div>
                      <div className="mt-1 text-xs text-slate-300">Intensitas & akumulasi presipitasi</div>
                    </div>
                    <div className="rounded-2xl border border-cyan-400/20 bg-slate-900/70 p-3.5 text-left">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-cyan-300 font-bold">
                        <Droplets className="h-3.5 w-3.5 text-emerald-400" />
                        HIDROMETRI & MUKA AIR
                      </div>
                      <div className="mt-1 text-xs text-slate-300">Sensor hidrometri & pintu air</div>
                    </div>
                    <div className="rounded-2xl border border-cyan-400/20 bg-slate-900/70 p-3.5 text-left">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-cyan-300 font-bold">
                        <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                        KAPASITAS TATA AIR
                      </div>
                      <div className="mt-1 text-xs text-slate-300">Analisis defisit saluran & limpasan</div>
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons — Staggered */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2 anim-reveal-up anim-delay-5">
                <Link
                  href="/risk-map"
                  className={`flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:brightness-110 shadow-lg ${
                    isWildfire
                      ? "bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 shadow-orange-500/25"
                      : "bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 shadow-cyan-500/25"
                  }`}
                >
                  <span>Buka Peta Risiko Interaktif</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/simulator"
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 hover:border-cyan-400/40"
                >
                  <Zap className={`h-4 w-4 ${isWildfire ? "text-amber-400" : "text-cyan-400"}`} />
                  <span>Uji Simulator Mitigasi</span>
                </Link>
              </div>
            </div>

            {/* Right Hero KPI Matrix — 120fps GPU Composited */}
            <div className="grid grid-cols-2 gap-3.5 w-full max-w-md anim-reveal-right anim-delay-3">
              {kpiStats.map((kpi, idx) => (
                <div
                  key={kpi.label}
                  className={`rounded-2xl border bg-slate-900/90 p-4.5 shadow-lg card-hover-lift ${
                    isWildfire ? "border-amber-500/25 shadow-amber-950/20" : "border-cyan-500/25 shadow-cyan-950/20"
                  }`}
                  style={{ animationDelay: `${0.4 + idx * 0.15}s` }}
                >
                  <div className="text-[11px] text-slate-400 font-medium">{kpi.label}</div>
                  <div className={`mt-2 text-3xl font-extrabold font-mono tracking-tight ${
                    isWildfire ? "text-amber-300" : "text-cyan-300"
                  }`}>
                    {kpi.value} <span className="text-xs font-normal text-slate-400">{kpi.unit}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{kpi.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HERO CENTERPIECE: ARCHIPELAGO RADAR COMMAND CENTER — Rock-solid 120fps Static GPU Layer */}
        <section className="relative" style={{ contain: "layout paint" }}>
          <HeroRadarCommand />
        </section>

        {/* DUAL REAL-TIME INTERACTIVE STUDIOS */}
        <section ref={setRef(0)} className="space-y-6 section-animate">
          <div className="text-center max-w-2xl mx-auto">
            <div className={`inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-widest ${
              isWildfire ? "text-amber-400" : "text-cyan-400"
            }`}>
              <Zap className="h-3.5 w-3.5" />
              <span>STUDIO INTERAKTIF WAKTU NYATA</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {isWildfire
                ? "Eksplorasi Algoritma Deteksi Karhutla & Simulator Mitigasi"
                : "Eksplorasi Algoritma Screening Hidrologi & Simulator Drainase"}
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Akses langsung instrumen diagnosis berbasis AI untuk menganalisis faktor risiko lingkungan dan uji skenario intervensi mitigasi secara real-time.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 items-stretch">
            {/* Live AI Diagnosis */}
            <LiveAiDiagnosisCard />

            {/* Quick Mitigation Sandbox */}
            <QuickMitigationSandbox />
          </div>
        </section>

        {/* 4 CORE PLATFORM PILLARS */}
        <section ref={setRef(1)} className="rounded-[32px] border border-white/10 bg-gradient-to-b from-slate-900/60 to-slate-950/80 p-6 sm:p-10 section-animate">
          <div className="max-w-2xl">
            <div className={`text-xs font-mono uppercase tracking-widest ${isWildfire ? "text-amber-400" : "text-cyan-300"}`}>
              KEUNGGULAN INOVASI MULTI-BAHAYA
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Arsitektur Intelijen Bencana yang Akuntabel & Explainable
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Menghadirkan pemodelan komprehensif dari sensor satelit dan IoT hingga formulasi aksi nyata bagi BPBD, Dinas Terkait, dan masyarakat.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {activePillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className={`group rounded-2xl border ${pillar.border} bg-slate-950/70 p-5 card-hover-lift shimmer-overlay`}
                  style={{ animationDelay: `${idx * 0.12}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                      isWildfire
                        ? "bg-amber-500/10 text-amber-300 border-amber-400/30"
                        : "bg-cyan-500/10 text-cyan-300 border-cyan-400/30"
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-mono text-slate-300 border border-white/10">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-white">{pillar.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* NATIONAL RISK LEADERBOARD TABLE */}
        <section ref={setRef(2)} className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 sm:p-8 section-animate">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className={`text-xs font-mono uppercase tracking-widest ${isWildfire ? "text-amber-400" : "text-cyan-300"}`}>
                MATRIKS PRIORITAS NASIONAL
              </div>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
                {isWildfire
                  ? "Klaster Wilayah Prioritas Kerawanan Karhutla"
                  : "Klaster Wilayah Prioritas Kerawanan Banjir"}
              </h2>
            </div>
            <Link
              href="/risk-map"
              className={`inline-flex items-center gap-1.5 text-xs font-bold transition ${
                isWildfire ? "text-amber-300 hover:text-amber-200" : "text-cyan-300 hover:text-cyan-200"
              }`}
            >
              Lihat Seluruh 34 Provinsi di Peta <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-white/10 font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="pb-3 pr-4">Provinsi / Wilayah</th>
                  <th className="pb-3 pr-4">Wilayah Urban / Target</th>
                  <th className="pb-3 pr-4">
                    {isWildfire ? "Titik Panas Satelit" : "Curah Hujan (1 Jam)"}
                  </th>
                  <th className="pb-3 pr-4">
                    {isWildfire ? "Indeks Kekeringan (KBDI)" : "Kapasitas Drainase"}
                  </th>
                  <th className="pb-3 pr-4">
                    {isWildfire ? "Kecepatan & Arah Angin" : "Limpasan Permukaan"}
                  </th>
                  <th className="pb-3 pr-4">Tingkat Risiko</th>
                  <th className="pb-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {priorityAreas.map((area) => {
                  const wf = getWildfireMetrics(area.id);
                  const riskLvl = isWildfire ? wf.riskLevel : area.riskLevel;

                  return (
                    <tr key={area.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 pr-4 font-semibold text-white flex items-center gap-2">
                        <MapPin className={`h-3.5 w-3.5 ${isWildfire ? "text-amber-400" : "text-cyan-400"}`} />
                        {area.name}
                      </td>
                      <td className="py-3.5 pr-4 text-slate-400">{area.district}</td>
                      <td className={`py-3.5 pr-4 font-mono font-bold ${isWildfire ? "text-amber-300" : "text-cyan-300"}`}>
                        {isWildfire ? `${wf.hotspotSignals} Sinyal` : `${area.rainfallToday} mm/jam`}
                      </td>
                      <td className="py-3.5 pr-4 font-mono text-slate-200">
                        {isWildfire ? `${wf.drynessIndex} / 100` : `${area.drainageIndex} / 100`}
                      </td>
                      <td className="py-3.5 pr-4 font-mono text-slate-300">
                        {isWildfire ? `${wf.windSpeed} km/j · ${wf.windDirection}` : `${area.surfaceRunoff}%`}
                      </td>
                      <td className="py-3.5 pr-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            riskLvl === "very-high"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                              : riskLvl === "high"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          }`}
                        >
                          {riskLvl === "very-high" ? "Sangat Tinggi" : riskLvl === "high" ? "Tinggi" : "Sedang"}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          href="/risk-map"
                          onClick={() => setSelectedProvinceId(area.id)}
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
                            isWildfire
                              ? "border-amber-400/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20"
                              : "border-cyan-400/30 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20"
                          }`}
                        >
                          <span>Fokuskan</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* SDG ALIGNMENT & CLOSING BANNER */}
        <section ref={setRef(3)} className="grid gap-6 lg:grid-cols-2 section-animate">
          {/* SDG Impact Box */}
          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 sm:p-8">
            <div className="text-xs font-mono uppercase tracking-widest text-emerald-300">
              UN SDG 11, SDG 13, & SDG 15 COMPLIANCE
            </div>
            <h3 className="mt-2 text-2xl font-bold text-white">
              Akselerasi Ketahanan Kota & Konservasi Lahan Berkelanjutan
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              TERRAFLUX AI secara eksplisit mendukung agenda Pembangunan Berkelanjutan melalui sinergi penanganan multi-bencana: adaptasi ketahanan banjir perkotaan (SDG 11), aksi peringatan dini iklim ekstrem (SDG 13), serta perlindungan kubah gambut dan ekosistem hutan dari degradasi kebakaran (SDG 15).
            </p>
            <div className="mt-5 flex gap-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition"
              >
                Pelajari Metodologi Lengkap →
              </Link>
            </div>
          </div>

          {/* Championship Call to Action Box */}
          <div className={`rounded-[28px] border p-6 sm:p-8 flex flex-col justify-between ${
            isWildfire
              ? "border-amber-400/30 bg-gradient-to-br from-amber-950/40 via-slate-900/80 to-rose-950/40"
              : "border-cyan-400/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-emerald-950/40"
          }`}>
            <div>
              <div className={`text-xs font-mono uppercase tracking-widest ${isWildfire ? "text-amber-300" : "text-cyan-300"}`}>
                OPERASIONALISASI MULTI-BAHAYA TERPADU
              </div>
              <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
                Akselerasi Mitigasi Risiko Bencana di Indonesia
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Akses kapabilitas terintegrasi antara mitigasi Banjir dan Karhutla dalam satu ekosistem: mulai dari analisis geospasial, simulator tata air, hingga rekomendasi SOP operasional.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold text-slate-950 transition hover:brightness-110 shadow-md ${
                  isWildfire ? "bg-amber-400" : "bg-cyan-400"
                }`}
              >
                Buka Command Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/risk-map"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-xs font-semibold text-white hover:bg-white/10 transition"
              >
                Eksplorasi Peta Geospasial
              </Link>
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
