"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Radio,
  MapPin,
  Waves,
  CloudRain,
  ArrowRight,
  ShieldCheck,
  Zap,
  Gauge,
  Compass,
  Flame,
  SunMedium,
  Wind,
  TreePine,
} from "lucide-react";
import { demoAreas, type DemoArea } from "@/lib/demo-data";
import { useRealtimeTelemetry } from "@/lib/realtime-telemetry";
import { getWildfireMetrics } from "@/lib/wildfire-data";

const riskColors: Record<DemoArea["riskLevel"], string> = {
  low: "#34d399",
  moderate: "#fbbf24",
  high: "#f97316",
  "very-high": "#f43f5e",
};

const riskLabels: Record<DemoArea["riskLevel"], string> = {
  low: "Rendah",
  moderate: "Sedang",
  high: "Tinggi",
  "very-high": "Sangat Tinggi",
};

// Coordinate mapping for Indonesian archipelago
const longitudeBounds = { min: 94, max: 142 };
const latitudeBounds = { min: -11.5, max: 6.5 };

function getPlotPosition([longitude, latitude]: DemoArea["center"]) {
  const x = ((longitude - longitudeBounds.min) / (longitudeBounds.max - longitudeBounds.min)) * 100;
  const y = ((latitudeBounds.max - latitude) / (latitudeBounds.max - latitudeBounds.min)) * 100;
  return { left: `${Math.max(2, Math.min(96, x))}%`, top: `${Math.max(4, Math.min(94, y))}%` };
}

export function HeroRadarCommand() {
  const {
    selectedProvinceId,
    setSelectedProvinceId,
    selectedProvince,
    liveRainfall,
    liveWaterLevel,
    liveRunoff,
    liveHotspots,
    liveDryness,
    liveWindSpeed,
    scenario,
    currentTimeWIB,
    hazardMode,
  } = useRealtimeTelemetry();

  const isWildfire = hazardMode === "wildfire";

  const [hoveredProvince, setHoveredProvince] = useState<DemoArea | null>(null);
  const activeArea = hoveredProvince || selectedProvince;

  const activeWildfire = useMemo(() => {
    return getWildfireMetrics(activeArea.id);
  }, [activeArea.id]);

  const activeRiskLevel = isWildfire ? activeWildfire.riskLevel : activeArea.riskLevel;
  const activeColor = riskColors[activeRiskLevel];

  // Radar scanning animation
  const [pulseActive, setPulseActive] = useState(false);

  const triggerSonarPing = () => {
    setPulseActive(true);
    setTimeout(() => setPulseActive(false), 1200);
  };

  return (
    <div
      style={{ contain: "layout paint", transform: "translateZ(0)" }}
      className={`relative overflow-hidden rounded-[32px] border p-5 sm:p-7 lg:p-8 shadow-2xl h-scanline ${
        isWildfire
          ? "border-amber-500/35 bg-gradient-to-b from-[#1c1007] via-[#0f0905] to-[#040811] shadow-[0_0_35px_-8px_rgba(251,191,36,0.25)]"
          : "border-cyan-500/30 bg-gradient-to-b from-[#091528] via-[#060c18] to-[#040811] shadow-[0_0_35px_-8px_rgba(56,189,248,0.2)]"
      }`}
    >
      {/* Background Cyber Grid & Radar Lines */}
      <div className="absolute inset-0 hud-grid-bg opacity-35 pointer-events-none" />

      {/* Header HUD Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border shadow-lg ${
            isWildfire
              ? "border-amber-400/50 bg-amber-500/10 text-amber-300 shadow-amber-500/20"
              : "border-cyan-400/40 bg-cyan-500/10 text-cyan-300 shadow-cyan-500/20"
          }`}>
            {isWildfire ? <Flame className="h-5 w-5" /> : <Radio className="h-5 w-5" />}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${isWildfire ? "bg-amber-400" : "bg-cyan-400"}`}></span>
              <span className={`relative inline-flex h-3 w-3 rounded-full ${isWildfire ? "bg-amber-500" : "bg-cyan-500"}`}></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs uppercase font-mono tracking-widest font-bold ${isWildfire ? "text-amber-400" : "text-cyan-300"}`}>
                {isWildfire ? "Pusat Komando Termal & Karhutla" : "Pusat Komando Radar Hidrometeorologi"}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono border ${
                isWildfire
                  ? "bg-amber-500/15 border-amber-400/30 text-amber-200"
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
              }`}>
                {isWildfire ? "DETEKSI TERMAL" : "RADAR HIDROLOGI"}
              </span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl mt-0.5">
              {isWildfire
                ? "Pemantauan Kerawanan Kebakaran Hutan & Lahan Indonesia"
                : "Pemantauan Risiko Banjir & Limpasan Air Indonesia"}
            </h2>
          </div>
        </div>

        {/* Quick controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={triggerSonarPing}
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
              isWildfire
                ? "border-amber-400/40 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20"
                : "border-cyan-400/30 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20"
            }`}
            title={isWildfire ? "Kirim gelombang pemindaian anomali termal satelit" : "Kirim gelombang sonar radar presipitasi"}
          >
            <Zap className={`h-3.5 w-3.5 ${isWildfire ? "text-amber-400" : "text-cyan-400"} ${pulseActive ? "animate-spin" : ""}`} />
            <span>{isWildfire ? "Pindai Termal Satelit" : "Pindai Radar Presipitasi"}</span>
          </button>

          {/* Fast province selector */}
          <select
            value={selectedProvinceId}
            onChange={(e) => setSelectedProvinceId(e.target.value)}
            className="rounded-full border border-white/15 bg-slate-900/90 px-3.5 py-1.5 text-xs font-semibold text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
            aria-label="Pilih provinsi untuk analisis"
          >
            {demoAreas.map((area) => (
              <option key={area.id} value={area.id} className="bg-slate-950 text-white">
                {area.name} ({area.district})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Radar Screen + Telemetry Panel */}
      <div className="relative z-10 mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.9fr] items-stretch">
        {/* LEFT: Interactive Archipelago Radar Screen — 120fps GPU Isolated */}
        <div
          style={{ contain: "paint", transform: "translateZ(0)" }}
          className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 p-4 min-h-[380px] sm:min-h-[430px]"
        >
          {/* Radar range rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className={`h-64 w-64 rounded-full border ${isWildfire ? "border-amber-400" : "border-cyan-400"}`} />
            <div className={`absolute h-96 w-96 rounded-full border ${isWildfire ? "border-amber-400/60" : "border-cyan-400/60"}`} />
            <div className={`absolute h-[500px] w-[500px] rounded-full border border-dashed ${isWildfire ? "border-amber-400/40" : "border-cyan-400/40"}`} />
          </div>

          {/* Rotating conical radar sweep — 120fps Hardware Isolated */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-35" style={{ contain: "strict" }}>
            <div className={`h-[420px] w-[420px] rounded-full ${isWildfire ? "radar-sweep-cone-amber" : "radar-sweep-cone"}`} />
          </div>

          {/* Top HUD stats on map */}
          <div className="relative z-20 flex items-center justify-between text-[11px] font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <Compass className={`h-3.5 w-3.5 ${isWildfire ? "text-amber-400" : "text-cyan-400"}`} />
              <span className="font-bold">
                CAKUPAN RADAR: 94° BT - 142° BT · 6° LU - 11° LS
              </span>
            </div>
            <div className="hidden sm:block text-slate-400 font-mono">
              TELEMETRI: <span className="text-white">{currentTimeWIB}</span>
            </div>
          </div>

          {/* Interactive Plot Nodes for 34 Indonesian Provinces */}
          <div className="relative z-20 my-auto h-[270px] sm:h-[310px] w-full">
            {/* SVG stylized archipelago connection arcs */}
            <svg
              className="absolute inset-0 h-full w-full pointer-events-none opacity-25"
              viewBox="0 0 800 350"
              preserveAspectRatio="none"
            >
              <path
                d="M50 180 Q180 140, 260 170 T480 200 T680 150 T750 160"
                fill="none"
                stroke={isWildfire ? "#fbbf24" : "#38bdf8"}
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <path
                d="M120 120 Q300 90, 420 140 T620 120"
                fill="none"
                stroke={isWildfire ? "#f97316" : "#34d399"}
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              <path
                d="M200 240 Q380 220, 520 230"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            </svg>

            {demoAreas.map((area) => {
              const isSelected = area.id === activeArea.id;
              const pos = getPlotPosition(area.center);
              const wf = getWildfireMetrics(area.id);
              const riskLvl = isWildfire ? wf.riskLevel : area.riskLevel;
              const color = riskColors[riskLvl];

              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => setSelectedProvinceId(area.id)}
                  onMouseEnter={() => setHoveredProvince(area)}
                  onMouseLeave={() => setHoveredProvince(null)}
                  style={{ left: pos.left, top: pos.top }}
                  className={`group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 focus:outline-none ${
                    isSelected ? "scale-125 z-30" : "hover:scale-110 z-20"
                  }`}
                  aria-label={`${area.name}, risiko ${riskLabels[riskLvl]}`}
                  title={`${area.name} · ${isWildfire ? `${wf.hotspotSignals} Titik Panas` : `${area.rainfallToday}mm/jam`}`}
                >
                  <div className="relative flex items-center justify-center">
                    {isSelected && (
                      <span
                        className="absolute h-6 w-6 rounded-full animate-ping opacity-75 pointer-events-none"
                        style={{ backgroundColor: color }}
                      />
                    )}
                    <span
                      className="relative h-3.5 w-3.5 rounded-full border-2 border-slate-950 shadow-md"
                      style={{
                        backgroundColor: color,
                        boxShadow: isSelected ? `0 0 14px 4px ${color}` : "none",
                      }}
                    />

                    {/* Popover label on hover or select — 120fps solid panel without backdrop-blur */}
                    {isSelected && (
                      <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border bg-slate-950 px-2.5 py-1 text-[11px] font-semibold text-white shadow-xl ${
                        isWildfire ? "border-amber-400/60 shadow-amber-950/80" : "border-cyan-400/60 shadow-cyan-950/80"
                      }`}>
                        <span className={isWildfire ? "text-amber-300 font-bold" : "text-cyan-300 font-bold"}>
                          {area.name}
                        </span>
                        <span className="mx-1 text-slate-500">·</span>
                        <span style={{ color }}>{riskLabels[riskLvl]}</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom legend on map */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-300">Level Risiko:</span>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Rendah</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span>Sedang</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                <span>Tinggi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                <span>Sangat Tinggi</span>
              </div>
            </div>
            <span className="font-mono text-slate-400 hidden sm:inline">
              Klik titik mana pun untuk mengunci telemetri
            </span>
          </div>
        </div>

        {/* RIGHT: High-Tech Telemetry HUD Card Tailored to Hazard */}
        <div
          style={{ contain: "layout paint" }}
          className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/90 p-5 shadow-xl shadow-black/40"
        >
          <div>
            {/* Target Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <MapPin className={`h-3.5 w-3.5 ${isWildfire ? "text-amber-400" : "text-cyan-400"}`} />
                  <span className={isWildfire ? "text-amber-300 font-bold" : "text-cyan-300 font-bold"}>
                    TARGET TELEMETRI TERPILIH
                  </span>
                </div>
                <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-white">{activeArea.name}</h3>
                <p className="text-xs text-slate-400">
                  {activeArea.district} · {activeArea.region}
                </p>
              </div>

              <div
                className="rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase shadow-sm border"
                style={{
                  backgroundColor: `${activeColor}18`,
                  borderColor: `${activeColor}55`,
                  color: activeColor,
                }}
              >
                {riskLabels[activeRiskLevel]}
              </div>
            </div>

            {/* Live Metrics Grid Tailored to Hazard Mode */}
            {isWildfire ? (
              /* WILDFIRE 4 CORE INDICATORS */
              <div className="mt-4 grid grid-cols-2 gap-3">
                {/* 1. Titik Panas (Hotspots) */}
                <div className="rounded-xl border border-amber-500/25 bg-amber-950/20 p-3.5">
                  <div className="flex items-center justify-between text-xs text-amber-300">
                    <span className="font-medium">Titik Panas</span>
                    <Flame className="h-4 w-4 text-rose-400" />
                  </div>
                  <div className="mt-2 text-2xl font-bold font-mono text-white">
                    {activeArea.id === selectedProvince.id ? liveHotspots : activeWildfire.hotspotSignals}{" "}
                    <span className="text-xs font-normal text-slate-400">sinyal</span>
                  </div>
                  <div className="mt-1 text-[11px] text-amber-200/80">
                    Satelit MODIS & VIIRS
                  </div>
                </div>

                {/* 2. Indeks Kekeringan (KBDI / FWI) */}
                <div className="rounded-xl border border-orange-500/25 bg-orange-950/20 p-3.5">
                  <div className="flex items-center justify-between text-xs text-orange-300">
                    <span className="font-medium">Indeks Kekeringan</span>
                    <SunMedium className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="mt-2 text-2xl font-bold font-mono text-white">
                    {activeArea.id === selectedProvince.id ? liveDryness : activeWildfire.drynessIndex}{" "}
                    <span className="text-xs font-normal text-slate-400">/100</span>
                  </div>
                  <div className="mt-1 text-[11px] text-orange-200/80">
                    FWI: {activeWildfire.fwiScore}
                  </div>
                </div>

                {/* 3. Tutupan Lahan & Gambut */}
                <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3.5">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Tutupan Hutan</span>
                    <TreePine className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="mt-2 text-2xl font-bold font-mono text-white">
                    {activeWildfire.forestCover}%
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400">
                    Gambut: {activeWildfire.peatlandIndex}/100
                  </div>
                </div>

                {/* 4. Arah & Kecepatan Angin */}
                <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3.5">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Kecepatan Angin</span>
                    <Wind className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="mt-2 text-2xl font-bold font-mono text-white">
                    {activeArea.id === selectedProvince.id ? liveWindSpeed : activeWildfire.windSpeed}{" "}
                    <span className="text-xs font-normal text-slate-400">km/jam</span>
                  </div>
                  <div className="mt-1 text-[11px] text-cyan-300 truncate">
                    {activeWildfire.windDirection}
                  </div>
                </div>
              </div>
            ) : (
              /* FLOOD 4 CORE INDICATORS */
              <div className="mt-4 grid grid-cols-2 gap-3">
                {/* 1. Curah Hujan */}
                <div className="rounded-xl border border-cyan-400/20 bg-cyan-950/20 p-3.5">
                  <div className="flex items-center justify-between text-xs text-cyan-300">
                    <span>Curah Hujan</span>
                    <CloudRain className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="mt-2 text-2xl font-bold font-mono text-white">
                    {activeArea.id === selectedProvince.id ? liveRainfall : activeArea.rainfallToday}{" "}
                    <span className="text-xs font-normal text-slate-400">mm/jam</span>
                  </div>
                  <div className="mt-1 text-[11px] text-cyan-200/80">
                    {scenario === "cyclone" ? "Badai Ekstrem Aktif" : "Radar Presipitasi"}
                  </div>
                </div>

                {/* 2. Tinggi Muka Air */}
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-950/20 p-3.5">
                  <div className="flex items-center justify-between text-xs text-emerald-300">
                    <span>Debit/Tinggi Air</span>
                    <Waves className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="mt-2 text-2xl font-bold font-mono text-white">
                    {activeArea.id === selectedProvince.id ? liveWaterLevel : (activeArea.rainfallToday / 35).toFixed(2)}{" "}
                    <span className="text-xs font-normal text-slate-400">meter</span>
                  </div>
                  <div className="mt-1 text-[11px] text-emerald-200/80">
                    {activeArea.floodObservations} laporan genangan
                  </div>
                </div>

                {/* 3. Limpasan Permukaan (Wilayah Rawan) */}
                <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3.5">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Limpasan (Runoff)</span>
                    <Gauge className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="mt-2 text-2xl font-bold font-mono text-white">
                    {activeArea.id === selectedProvince.id ? liveRunoff : activeArea.surfaceRunoff}%
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400">Wilayah Cekungan Rawan</div>
                </div>

                {/* 4. Kapasitas Drainase */}
                <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3.5">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Indeks Drainase</span>
                    <ShieldCheck className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="mt-2 text-2xl font-bold font-mono text-white">
                    {activeArea.drainageIndex}{" "}
                    <span className="text-xs font-normal text-slate-400">/100</span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400">Ruang Resapan: {activeArea.greenCoverage}%</div>
                </div>
              </div>
            )}

            {/* Context Insight Box */}
            <div className="mt-4 rounded-xl border border-white/10 bg-slate-900/40 p-3.5 text-xs text-slate-300">
              <span className={`font-semibold ${isWildfire ? "text-amber-300" : "text-cyan-300"}`}>
                {isWildfire ? "Karakteristik Lahan & Kerentanan: " : "Karakteristik Hidrologis & Medan: "}
              </span>
              {isWildfire ? activeWildfire.terrainContext : activeArea.terrain}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-5 space-y-2.5 pt-4 border-t border-white/10">
            <Link
              href="/risk-map"
              className={`flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:brightness-110 shadow-md ${
                isWildfire
                  ? "bg-gradient-to-r from-amber-400 to-orange-400 shadow-orange-500/25"
                  : "bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-cyan-500/25"
              }`}
            >
              Buka Peta Tematik {activeArea.name} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <div className="flex gap-2">
              <Link
                href="/simulator"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
              >
                Uji Simulator
              </Link>
              <Link
                href="/intelligence"
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                  isWildfire
                    ? "border-amber-400/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20"
                    : "border-cyan-400/30 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20"
                }`}
              >
                Diagnosis AI
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
