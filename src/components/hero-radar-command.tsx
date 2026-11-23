"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Waves,
  CloudRain,
  ArrowRight,
  ShieldCheck,
  Gauge,
  Compass,
} from "lucide-react";
import { demoAreas, type DemoArea } from "@/lib/demo-data";
import { useRealtimeTelemetry } from "@/lib/realtime-telemetry";

const riskColors: Record<DemoArea["riskLevel"], string> = {
  low: "#059669",
  moderate: "#d97706",
  high: "#ea580c",
  "very-high": "#dc2626",
};

const riskLabels: Record<DemoArea["riskLevel"], string> = {
  low: "Rendah",
  moderate: "Sedang",
  high: "Tinggi",
  "very-high": "Sangat Tinggi",
};

const longitudeBounds = { min: 94, max: 142 };
const latitudeBounds = { min: -11.5, max: 6.5 };

function getPlotPosition([longitude, latitude]: DemoArea["center"]) {
  const x = ((longitude - longitudeBounds.min) / (longitudeBounds.max - longitudeBounds.min)) * 100;
  const y = ((latitudeBounds.max - latitude) / (latitudeBounds.max - latitudeBounds.min)) * 100;
  return { left: `${Math.max(3, Math.min(95, x))}%`, top: `${Math.max(5, Math.min(92, y))}%` };
}

export function HeroRadarCommand() {
  const {
    selectedProvinceId,
    setSelectedProvinceId,
    selectedProvince,
    liveRainfall,
    liveWaterLevel,
    liveRunoff,
    currentTimeWIB,
  } = useRealtimeTelemetry();

  const [hoveredProvince, setHoveredProvince] = useState<DemoArea | null>(null);
  const activeArea = hoveredProvince || selectedProvince;
  const activeColor = riskColors[activeArea.riskLevel];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
            <Waves className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-wider font-semibold text-blue-600">
                Pusat Pemantauan Hidrologi Nasional
              </span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200">
                Data Aktif
              </span>
            </div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl mt-0.5">
              Pemantauan Risiko Banjir & Limpasan Permukaan
            </h2>
          </div>
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Pilih Wilayah:</span>
          <select
            value={selectedProvinceId}
            onChange={(e) => setSelectedProvinceId(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none cursor-pointer"
            aria-label="Pilih provinsi"
          >
            {demoAreas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name} ({area.district})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Map + Panel Grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.9fr] items-stretch">
        {/* LEFT: Clean Dot Map */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4 min-h-[380px]">
          {/* Header on map */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5 font-medium">
              <Compass className="h-3.5 w-3.5 text-blue-600" />
              <span>Cakupan 34 Provinsi Nusantara</span>
            </div>
            <div className="font-mono text-[11px] text-slate-400">
              Pembaruan: <span className="text-slate-700 font-medium">{currentTimeWIB}</span>
            </div>
          </div>

          {/* Interactive Plot Nodes */}
          <div className="relative z-10 my-auto h-[260px] sm:h-[290px] w-full">
            {/* Subtle archipelago connection lines */}
            <svg
              className="absolute inset-0 h-full w-full pointer-events-none opacity-20"
              viewBox="0 0 800 350"
              preserveAspectRatio="none"
            >
              <path
                d="M50 180 Q180 140, 260 170 T480 200 T680 150 T750 160"
                fill="none"
                stroke="#2563eb"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <path
                d="M120 120 Q300 90, 420 140 T620 120"
                fill="none"
                stroke="#059669"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
            </svg>

            {demoAreas.map((area) => {
              const isSelected = area.id === activeArea.id;
              const pos = getPlotPosition(area.center);
              const color = riskColors[area.riskLevel];

              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => setSelectedProvinceId(area.id)}
                  onMouseEnter={() => setHoveredProvince(area)}
                  onMouseLeave={() => setHoveredProvince(null)}
                  style={{ left: pos.left, top: pos.top }}
                  className={`group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform focus:outline-none ${
                    isSelected ? "scale-125 z-30" : "hover:scale-110 z-20"
                  }`}
                  aria-label={`${area.name}, risiko ${riskLabels[area.riskLevel]}`}
                  title={`${area.name} · Curah Hujan ${area.rainfallToday}mm/jam`}
                >
                  <div className="relative flex items-center justify-center">
                    <span
                      className={`h-3 w-3 rounded-full border-2 border-white shadow-sm ${
                        isSelected ? "ring-2 ring-blue-500 ring-offset-1" : ""
                      }`}
                      style={{ backgroundColor: color }}
                    />

                    {/* Popover on select */}
                    {isSelected && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-800 shadow-md">
                        <span>{area.name}</span>
                        <span className="mx-1 text-slate-300">·</span>
                        <span style={{ color }}>{riskLabels[area.riskLevel]}</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Legend */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3 text-[11px] text-slate-500">
            <div className="flex items-center gap-3">
              <span className="font-medium text-slate-700">Tingkat Risiko:</span>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                <span>Rendah</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-600" />
                <span>Sedang</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-orange-600" />
                <span>Tinggi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-600" />
                <span>Sangat Tinggi</span>
              </div>
            </div>
            <span className="text-slate-400">Klik titik untuk mengunci telemetri</span>
          </div>
        </div>

        {/* RIGHT: Detail Telemetry Panel */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            {/* Header Area */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>WILAYAH TERPILIH</span>
                </div>
                <h3 className="mt-1 text-xl font-bold text-slate-900">{activeArea.name}</h3>
                <p className="text-xs text-slate-500">
                  {activeArea.district} · Wilayah {activeArea.region}
                </p>
              </div>

              <span
                className="rounded-full px-2.5 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: `${activeColor}15`,
                  color: activeColor,
                }}
              >
                {riskLabels[activeArea.riskLevel]}
              </span>
            </div>

            {/* 4 Core Flood Metrics */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Curah Hujan</span>
                  <CloudRain className="h-4 w-4 text-blue-600" />
                </div>
                <div className="mt-1 text-xl font-bold font-mono text-slate-900">
                  {activeArea.id === selectedProvince.id ? liveRainfall : activeArea.rainfallToday}{" "}
                  <span className="text-xs font-normal text-slate-500">mm/jam</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Radar Presipitasi</div>
              </div>

              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Muka Air</span>
                  <Waves className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="mt-1 text-xl font-bold font-mono text-slate-900">
                  {activeArea.id === selectedProvince.id ? liveWaterLevel : (activeArea.rainfallToday / 35).toFixed(2)}{" "}
                  <span className="text-xs font-normal text-slate-500">meter</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{activeArea.floodObservations} laporan genangan</div>
              </div>

              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Limpasan (Runoff)</span>
                  <Gauge className="h-4 w-4 text-amber-600" />
                </div>
                <div className="mt-1 text-xl font-bold font-mono text-slate-900">
                  {activeArea.id === selectedProvince.id ? liveRunoff : activeArea.surfaceRunoff}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Area Cekungan</div>
              </div>

              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Indeks Drainase</span>
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                </div>
                <div className="mt-1 text-xl font-bold font-mono text-slate-900">
                  {activeArea.drainageIndex}{" "}
                  <span className="text-xs font-normal text-slate-500">/100</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Resapan Hijau: {activeArea.greenCoverage}%</div>
              </div>
            </div>

            {/* Context Info Box */}
            <div className="mt-3.5 rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-800">Karakteristik Medan: </span>
              {activeArea.terrain}
            </div>
          </div>

          {/* Action Links */}
          <div className="mt-5 space-y-2 pt-4 border-t border-slate-100">
            <Link
              href="/risk-map"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
            >
              <span>Buka Peta Tematik {activeArea.name}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <div className="flex gap-2">
              <Link
                href="/simulator"
                className="flex flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                Uji Simulator
              </Link>
              <Link
                href="/intelligence"
                className="flex flex-1 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition"
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
