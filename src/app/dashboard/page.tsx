"use client";

import React, { useMemo } from "react";
import {
  Activity,
  Clock3,
  Gauge,
  MapPinned,
  Radio,
  CloudRain,
  ShieldAlert,
  ArrowRight,
  Waves,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { demoAreas, observations, rainfallTrend, regionalComparison } from "@/lib/demo-data";
import { useRealtimeTelemetry } from "@/lib/realtime-telemetry";

export default function DashboardPage() {
  const {
    currentTimeWIB,
    scenario,
    selectedProvinceId,
    setSelectedProvinceId,
    selectedProvince,
    liveRainfall,
    liveWaterLevel,
    liveRunoff,
  } = useRealtimeTelemetry();

  const dynamicMetricCards = useMemo(() => {
    return [
      {
        label: `Curah Hujan (${selectedProvince.name})`,
        value: `${liveRainfall} mm/jam`,
        unit: scenario === "cyclone" ? "Badai Ekstrem" : "Intensitas Terukur",
        source: "Radar Presipitasi BMKG",
        updated: currentTimeWIB,
        type: "Real-Time Telemetry",
        highlight: scenario === "cyclone",
        icon: CloudRain,
      },
      {
        label: "Tinggi Muka Air / Limpasan",
        value: `${liveWaterLevel} m`,
        unit: `Limpasan: ${liveRunoff}%`,
        source: "Sensor IoT Pintu Air",
        updated: "Interval 1 detik",
        type: "Hidrometri",
        highlight: liveWaterLevel > 2.5,
        icon: Waves,
      },
      {
        label: "Laporan Genangan Terverifikasi",
        value: `${selectedProvince.floodObservations}`,
        unit: "Titik Observasi",
        source: "Laporan Warga & BPBD",
        updated: "7 hari terakhir",
        type: "Data Terverifikasi",
        highlight: false,
        icon: Gauge,
      },
      {
        label: "Status Kesiapsiagaan Wilayah",
        value:
          selectedProvince.riskLevel === "very-high"
            ? "Siaga 1 (Kritis)"
            : selectedProvince.riskLevel === "high"
            ? "Siaga 2 (Waspada)"
            : "Siaga 3 (Aman)",
        unit: `Drainase: ${selectedProvince.drainageIndex}/100`,
        source: "Neural Risk Screening",
        updated: "Status Komando",
        type: "Status Komando",
        highlight: selectedProvince.riskLevel === "very-high",
        icon: ShieldAlert,
      },
    ];
  }, [selectedProvince, liveRainfall, liveWaterLevel, liveRunoff, scenario, currentTimeWIB]);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <header className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-wider font-semibold text-blue-600">
                <Radio className="h-3.5 w-3.5" />
                <span>Pusat Kendali Operasional Hidrologi</span>
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Dashboard Pemantauan Risiko Banjir & Drainase
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              {/* Province dropdown */}
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
                <MapPinned className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-slate-500 font-medium">Wilayah:</span>
                <select
                  value={selectedProvinceId}
                  onChange={(e) => setSelectedProvinceId(e.target.value)}
                  className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
                  aria-label="Pilih provinsi dashboard"
                >
                  {demoAreas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name} ({area.district})
                    </option>
                  ))}
                </select>
              </div>

              {/* Status indicator */}
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-800 font-mono text-[11px]">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>MONITORING AKTIF • {currentTimeWIB}</span>
              </div>

              <Link
                href="/risk-map"
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 font-semibold text-white shadow-sm hover:bg-blue-700 transition"
              >
                <span>Buka Peta</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </header>

        {/* 4 Dynamic Metric Cards */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dynamicMetricCards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`rounded-xl border p-5 shadow-sm bg-white ${
                  item.highlight ? "border-red-300 ring-1 ring-red-200" : "border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between text-slate-500 text-xs">
                  <span>{item.label}</span>
                  <Icon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="mt-2 text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
                  {item.value}
                </div>
                <div className="mt-1 text-xs font-semibold text-blue-600">
                  {item.unit}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                  <span>{item.source}</span>
                  <span className="text-slate-600 font-medium">{item.type}</span>
                </div>
              </div>
            );
          })}
        </section>

        {/* Selected Area Deep Dive + Provincial Grid */}
        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          {/* Provincial Quick Cards */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase font-mono tracking-wider font-semibold text-blue-600">
                  Monitoring Wilayah Nasional (34 Provinsi)
                </div>
                <h2 className="mt-0.5 text-lg font-bold text-slate-900">
                  Sebaran Curah Hujan & Status Risiko Banjir Provinsi
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-medium">Klik untuk fokus</span>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4 max-h-[350px] overflow-y-auto pr-1">
              {demoAreas.map((area) => {
                const isSelected = area.id === selectedProvince.id;
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => setSelectedProvinceId(area.id)}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/60 ring-1 ring-blue-500 shadow-sm"
                        : "border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                      <span className="truncate pr-1">{area.name}</span>
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            area.riskLevel === "very-high"
                              ? "#dc2626"
                              : area.riskLevel === "high"
                              ? "#ea580c"
                              : "#059669",
                        }}
                      />
                    </div>
                    <div className="mt-1 text-[10px] text-slate-500">{area.district}</div>
                    <div className="mt-1 text-base font-bold font-mono text-blue-700">
                      {area.id === selectedProvince.id ? liveRainfall : area.rainfallToday} mm
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Province Profile Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between shadow-sm">
            <div>
              <div className="text-xs uppercase font-mono tracking-wider font-semibold text-blue-600">
                Profil Hidrologis Daerah
              </div>
              <h2 className="mt-1 text-2xl font-extrabold text-slate-900">{selectedProvince.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedProvince.district} · Wilayah {selectedProvince.region}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-slate-600">
                {selectedProvince.terrain}
              </p>

              {/* Metric Breakdown */}
              <div className="mt-4 space-y-2 text-xs text-slate-700">
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                  <span className="text-slate-500">Kapasitas Drainase</span>
                  <strong className="font-mono text-blue-700">{selectedProvince.drainageIndex} / 100</strong>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                  <span className="text-slate-500">Cakupan Ruang Terbuka Hijau</span>
                  <strong className="font-mono text-emerald-700">{selectedProvince.greenCoverage}%</strong>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                  <span className="text-slate-500">Limpasan Permukaan (Runoff)</span>
                  <strong className="font-mono text-amber-700">{liveRunoff}%</strong>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex gap-2">
              <Link
                href="/intelligence"
                className="flex-1 text-center rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
              >
                Analisis AI Wilayah
              </Link>
              <Link
                href="/simulator"
                className="flex-1 text-center rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Simulasi Mitigasi
              </Link>
            </div>
          </div>
        </section>

        {/* Charts Section */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Chart 1: Trend over 7 days */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-1 text-xs uppercase font-mono tracking-wider font-semibold text-blue-600">
              Tren Curah Hujan Pekanan
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Fluktuasi Presipitasi Hujan 7 Hari Terakhir
            </h3>
            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={rainfallTrend}>
                  <defs>
                    <linearGradient id="cleanTrendGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e2e8f0",
                      borderRadius: "8px",
                      color: "#0f172a",
                      fontSize: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="rainfall"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fill="url(#cleanTrendGradient)"
                    name="Curah Hujan (mm)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Regional Comparison */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-1 text-xs uppercase font-mono tracking-wider font-semibold text-blue-600">
              Komparasi Indikator Regional
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Perbandingan Indeks Risiko Banjir Antar Pulau
            </h3>
            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e2e8f0",
                      borderRadius: "8px",
                      color: "#0f172a",
                      fontSize: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Bar dataKey="score" fill="#059669" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Observations & Tactical Insights */}
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-xs uppercase font-mono tracking-wider font-semibold text-slate-700">
              <Clock3 className="h-4 w-4 text-blue-600" />
              <span>Log Telemetri & Observasi Lapangan</span>
            </div>
            <div className="space-y-2">
              {observations.map((obs) => (
                <div
                  key={obs.id}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-800">{obs.label}</div>
                    <div className="text-[11px] text-slate-400">{obs.source}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-blue-700">
                      {obs.value}
                    </div>
                    <div className="text-[10px] text-slate-400">{obs.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-xs uppercase font-mono tracking-wider font-semibold text-slate-700">
              <Activity className="h-4 w-4 text-blue-600" />
              <span>Sintesis Taktis Kesiapsiagaan (BPBD & PUPR)</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="rounded-lg border border-slate-100 bg-slate-50 p-3 leading-relaxed">
                <span className="font-semibold text-slate-900">1. Saluran Primer & Polder: </span>
                Curah hujan di wilayah {selectedProvince.name} membutuhkan peningkatan frekuensi pembersihan pintu air dan inspeksi kesiapan pompa darurat cadangan.
              </li>
              <li className="rounded-lg border border-slate-100 bg-slate-50 p-3 leading-relaxed">
                <span className="font-semibold text-slate-900">2. Sponge City & Retensi: </span>
                Indeks resapan hijau yang berada di level {selectedProvince.greenCoverage}% membuktikan perlunya penambahan sumur resapan modular di kawasan perumahan padat.
              </li>
              <li className="rounded-lg border border-slate-100 bg-slate-50 p-3 leading-relaxed">
                <span className="font-semibold text-slate-900">3. Validasi Sensor IoT: </span>
                Integrasikan laporan visual masyarakat dengan pos hidrometri terdekat untuk memverifikasi genangan secara instan.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
