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
  Flame,
  SunMedium,
  Wind,
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
import {
  getWildfireMetrics,
  wildfireTrend,
  wildfireRegionalComparison,
  wildfireObservations,
} from "@/lib/wildfire-data";

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
    liveHotspots,
    liveDryness,
    liveWindSpeed,
    liveFireSpread,
    hazardMode,
  } = useRealtimeTelemetry();

  const isWildfire = hazardMode === "wildfire";
  const wildfire = getWildfireMetrics(selectedProvince.id);

  // Dynamic 4 metric cards reacting in real time
  const dynamicMetricCards = useMemo(() => {
    if (isWildfire) {
      return [
        {
          label: `Titik Panas Satelit (${selectedProvince.name})`,
          value: `${liveHotspots} Sinyal`,
          unit: scenario === "cyclone" ? "Anomali Termal Tinggi" : "Satelit MODIS/VIIRS",
          source: "Sensor Antariksa",
          updated: currentTimeWIB,
          type: "Deteksi Termal",
          highlight: wildfire.riskLevel === "very-high" || liveHotspots >= 15,
          icon: Flame,
        },
        {
          label: "Indeks Kekeringan (KBDI)",
          value: `${liveDryness}/100`,
          unit: `FWI Score: ${wildfire.fwiScore}`,
          source: "Model FWI & AWS",
          updated: "Kondisi Lahan Kering",
          type: "Indikator Iklim",
          highlight: liveDryness >= 80,
          icon: SunMedium,
        },
        {
          label: "Kecepatan & Arah Angin",
          value: `${liveWindSpeed} km/j`,
          unit: wildfire.windDirection,
          source: "Stasiun Meteorologi AWS",
          updated: "Vektor Permukaan",
          type: "Faktor Sebaran",
          highlight: liveWindSpeed >= 20,
          icon: Wind,
        },
        {
          label: "Status Kesiapsiagaan Karhutla",
          value:
            wildfire.riskLevel === "very-high"
              ? "Siaga 1 (Darurat)"
              : wildfire.riskLevel === "high"
              ? "Siaga 2 (Waspada)"
              : "Siaga 3 (Aman)",
          unit: `Gambut: ${wildfire.peatlandIndex}/100`,
          source: "Neural Risk Screening",
          updated: "Status Komando",
          type: "Rekomendasi Satgas",
          highlight: wildfire.riskLevel === "very-high",
          icon: ShieldAlert,
        },
      ];
    }

    return [
      {
        label: `Curah Hujan (${selectedProvince.name})`,
        value: `${liveRainfall} mm/jam`,
        unit: scenario === "cyclone" ? "Badai Ekstrem" : "Intensitas Terukur",
        source: "Radar Satelit BMKG",
        updated: currentTimeWIB,
        type: "Real-Time Telemetry",
        highlight: scenario === "cyclone",
        icon: CloudRain,
      },
      {
        label: "Tinggi Muka Air / Limpasan",
        value: `${liveWaterLevel} m`,
        unit: `Limpasan: ${liveRunoff}%`,
        source: "IoT Sensor Pintu Air",
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
        type: "Terverifikasi",
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
  }, [
    isWildfire,
    selectedProvince,
    wildfire,
    liveHotspots,
    liveDryness,
    liveWindSpeed,
    liveRainfall,
    liveWaterLevel,
    liveRunoff,
    scenario,
    currentTimeWIB,
  ]);

  const activeObservations = isWildfire ? wildfireObservations : observations;
  const activeTrendData = useMemo(() => {
    if (isWildfire) {
      return wildfireTrend.map((item) => ({
        name: item.name,
        val: item.hotspots,
        baseline: item.baseline,
      }));
    }
    return rainfallTrend.map((item) => ({
      name: item.name,
      val: item.rainfall,
      baseline: item.baseline,
    }));
  }, [isWildfire]);
  const activeRegionalData = isWildfire ? wildfireRegionalComparison : regionalComparison;

  return (
    <AppShell>
      <div className="space-y-5 sm:space-y-6">
        {/* Header HUD */}
        <header className="rounded-[24px] border border-white/10 bg-slate-900/85 p-4 sm:p-5 shadow-xl backdrop-blur-md">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-slate-300">
                <Radio className={`h-3.5 w-3.5 animate-pulse ${isWildfire ? "text-amber-400" : "text-cyan-400"}`} />
                <span className={isWildfire ? "text-amber-300 font-bold" : "text-cyan-300 font-bold"}>
                  PUSAT KENDALI OPERASIONAL · {isWildfire ? "KARHUTLA COMMAND" : "FLOOD COMMAND"}
                </span>
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {isWildfire
                  ? "Dashboard Intelijen Kerawanan Kebakaran Hutan & Lahan"
                  : "Dashboard Intelijen Risiko Banjir & Limpasan Air"}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              {/* Province dropdown */}
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/80 px-3 py-1.5">
                <MapPinned className={`h-3.5 w-3.5 ${isWildfire ? "text-amber-400" : "text-cyan-300"}`} />
                <span className="text-slate-400">Wilayah:</span>
                <select
                  value={selectedProvinceId}
                  onChange={(e) => setSelectedProvinceId(e.target.value)}
                  className="bg-transparent font-bold text-white focus:outline-none cursor-pointer"
                  aria-label="Pilih provinsi dashboard"
                >
                  {demoAreas.map((area) => (
                    <option key={area.id} value={area.id} className="bg-slate-950 text-white">
                      {area.name} ({area.district})
                    </option>
                  ))}
                </select>
              </div>

              {/* Live status pill */}
              <div className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-300 font-mono">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                <span>MONITORING AKTIF • {currentTimeWIB}</span>
              </div>

              <Link
                href="/risk-map"
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-bold text-slate-950 transition hover:brightness-110 shadow-md ${
                  isWildfire ? "bg-amber-400" : "bg-cyan-400"
                }`}
              >
                <span>Buka Peta</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </header>

        {/* 4 Dynamic Metric Cards */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dynamicMetricCards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`rounded-[24px] border p-5 shadow-lg backdrop-blur-md transition-all duration-200 ${
                  item.highlight
                    ? "border-rose-500/40 bg-gradient-to-br from-rose-950/30 to-slate-900/90 shadow-rose-950/30"
                    : "border-white/10 bg-slate-900/80 shadow-slate-950/30"
                }`}
              >
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>{item.label}</span>
                  <Icon className={`h-4 w-4 ${isWildfire ? "text-amber-400" : "text-cyan-300"}`} />
                </div>
                <div className="mt-3 text-3xl font-extrabold font-mono text-white tracking-tight">
                  {item.value}
                </div>
                <div className={`mt-1 text-xs font-semibold ${isWildfire ? "text-amber-300" : "text-cyan-300"}`}>
                  {item.unit}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-slate-400">
                  <span>{item.source}</span>
                  <span className="text-slate-300 font-mono">{item.type}</span>
                </div>
                <div className="mt-1 text-[10px] text-slate-500 font-mono">{item.updated}</div>
              </div>
            );
          })}
        </section>

        {/* Selected-area deep dive + Provincial Grid */}
        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          {/* Provincial Quick Cards */}
          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className={`text-xs uppercase font-mono tracking-widest ${isWildfire ? "text-amber-400" : "text-cyan-300"}`}>
                  MONITORING WILAYAH NASIONAL (34 PROVINSI)
                </div>
                <h2 className="mt-1 text-xl font-bold text-white">
                  {isWildfire
                    ? "Sebaran Indikator Titik Panas & Kerawanan Karhutla"
                    : "Sebaran Curah Hujan & Status Risiko Banjir Provinsi"}
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">Pilih kartu untuk fokus</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar-thin">
              {demoAreas.map((area) => {
                const isSelected = area.id === selectedProvince.id;
                const wf = getWildfireMetrics(area.id);
                const riskLvl = isWildfire ? wf.riskLevel : area.riskLevel;

                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => setSelectedProvinceId(area.id)}
                    className={`rounded-2xl border p-3.5 text-left transition-all ${
                      isSelected
                        ? isWildfire
                          ? "border-amber-400 bg-amber-950/30 shadow-md shadow-amber-500/20"
                          : "border-cyan-400 bg-cyan-950/30 shadow-md shadow-cyan-500/20"
                        : "border-white/10 bg-slate-950/60 hover:border-white/20 hover:bg-slate-950/90"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-white">
                      <span>{area.name}</span>
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            riskLvl === "very-high"
                              ? "#f43f5e"
                              : riskLvl === "high"
                              ? "#f97316"
                              : "#34d399",
                        }}
                      />
                    </div>
                    <div className="mt-2 text-[10px] text-slate-400">{area.district}</div>
                    <div className={`mt-1 text-lg font-bold font-mono ${isWildfire ? "text-amber-300" : "text-cyan-300"}`}>
                      {isWildfire
                        ? `${wf.hotspotSignals} Sinyal`
                        : `${area.id === selectedProvince.id ? liveRainfall : area.rainfallToday} mm`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Province Detailed Profile Card */}
          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 flex flex-col justify-between">
            <div>
              <div className={`text-xs uppercase font-mono tracking-widest ${isWildfire ? "text-amber-400" : "text-cyan-300"}`}>
                {isWildfire ? "PROFIL EKOLOGI & KERAWANAN" : "PROFIL HIDROLOGIS DAERAH"}
              </div>
              <h2 className="mt-1 text-2xl font-extrabold text-white">{selectedProvince.name}</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedProvince.district} · {selectedProvince.region}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-slate-300">
                {isWildfire ? wildfire.terrainContext : selectedProvince.terrain}
              </p>

              {/* Metric Breakdown Table */}
              {isWildfire ? (
                <div className="mt-4 space-y-2.5 text-xs text-slate-200">
                  <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3 border border-white/5">
                    <span className="text-slate-400">Kerentanan Lahan Gambut</span>
                    <strong className="font-mono text-amber-300">{wildfire.peatlandIndex} / 100</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3 border border-white/5">
                    <span className="text-slate-400">Tutupan Hutan & Vegetasi</span>
                    <strong className="font-mono text-emerald-300">{wildfire.forestCover}%</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3 border border-white/5">
                    <span className="text-slate-400">Potensi Perambatan Api</span>
                    <strong className="font-mono text-rose-300">{liveFireSpread}%</strong>
                  </div>
                </div>
              ) : (
                <div className="mt-4 space-y-2.5 text-xs text-slate-200">
                  <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3 border border-white/5">
                    <span className="text-slate-400">Indeks Kapasitas Drainase</span>
                    <strong className="font-mono text-cyan-300">{selectedProvince.drainageIndex} / 100</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3 border border-white/5">
                    <span className="text-slate-400">Cakupan Ruang Terbuka Hijau</span>
                    <strong className="font-mono text-emerald-300">{selectedProvince.greenCoverage}%</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3 border border-white/5">
                    <span className="text-slate-400">Limpasan Permukaan (Runoff)</span>
                    <strong className="font-mono text-amber-300">{liveRunoff}%</strong>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex gap-2">
              <Link
                href="/intelligence"
                className={`flex-1 text-center rounded-full py-2 text-xs font-bold text-slate-950 transition hover:brightness-110 ${
                  isWildfire ? "bg-amber-400" : "bg-cyan-400"
                }`}
              >
                Analisis AI Wilayah
              </Link>
              <Link
                href="/simulator"
                className="flex-1 text-center rounded-full border border-white/10 bg-slate-950 py-2 text-xs font-semibold text-white hover:bg-white/10 transition"
              >
                Simulasi Mitigasi
              </Link>
            </div>
          </div>
        </section>

        {/* Charts Section: Mode-Aware Recharts */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Chart 1: Trend over 7 days */}
          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5">
            <div className={`mb-3 text-xs uppercase font-mono tracking-widest ${isWildfire ? "text-amber-400" : "text-cyan-300"}`}>
              {isWildfire ? "TREN TITIK PANAS 7 HARI" : "TREN CURAH HUJAN HISTORIS"}
            </div>
            <h3 className="text-lg font-bold text-white">
              {isWildfire ? "Fluktuasi Sinyal Titik Panas Sepekan" : "Fluktuasi Curah Hujan Pekanan"}
            </h3>
            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeTrendData}>
                  <defs>
                    <linearGradient id="trendGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={isWildfire ? "#f97316" : "#38bdf8"} stopOpacity={0.8} />
                      <stop offset="100%" stopColor={isWildfire ? "#f97316" : "#38bdf8"} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#091528",
                      borderColor: isWildfire ? "rgba(249, 115, 22, 0.4)" : "rgba(56, 189, 248, 0.3)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="val"
                    stroke={isWildfire ? "#f97316" : "#38bdf8"}
                    strokeWidth={3}
                    fill="url(#trendGradient)"
                    name={isWildfire ? "Titik Panas Satelit" : "Curah Hujan (mm)"}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Regional Comparison */}
          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5">
            <div className={`mb-3 text-xs uppercase font-mono tracking-widest ${isWildfire ? "text-amber-400" : "text-cyan-300"}`}>
              {isWildfire ? "KOMPARASI KERAWANAN REGIONAL" : "KOMPARASI INDIKATOR REGIONAL"}
            </div>
            <h3 className="text-lg font-bold text-white">
              {isWildfire ? "Perbandingan Titik Panas & Risiko Wilayah" : "Perbandingan Indeks Risiko Antar Pulau"}
            </h3>
            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeRegionalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#091528",
                      borderColor: isWildfire ? "rgba(251, 191, 36, 0.4)" : "rgba(52, 211, 153, 0.3)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="score" fill={isWildfire ? "#f59e0b" : "#34d399"} radius={[8, 8, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Observations & Tactical Insights */}
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5">
            <div className="mb-4 flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-slate-300">
              <Clock3 className="h-4 w-4" />
              <span>{isWildfire ? "LOG OBSERVASI SATELIT & SENSOR GAMBUT" : "LOG TELEMETRI & OBSERVASI HIDROLOGI"}</span>
            </div>
            <div className="space-y-2.5">
              {activeObservations.map((obs) => (
                <div
                  key={obs.id}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-950/60 p-3 text-xs"
                >
                  <div>
                    <div className="font-semibold text-white">{obs.label}</div>
                    <div className="text-[11px] text-slate-400">{obs.source}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-mono font-bold ${isWildfire ? "text-amber-300" : "text-cyan-300"}`}>
                      {obs.value}
                    </div>
                    <div className="text-[10px] text-slate-400">{obs.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5">
            <div className="mb-4 flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-slate-300">
              <Activity className="h-4 w-4" />
              <span>{isWildfire ? "SINTESIS TAKTIS SATGAS KARHUTLA" : "SINTESIS TAKTIS KESIAPSIAGAAN (BPBD & PUPR)"}</span>
            </div>
            {isWildfire ? (
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="rounded-xl border border-white/5 bg-slate-950/60 p-3 leading-relaxed">
                  <span className="font-semibold text-amber-300">1. Sekat Kanal & Pembasahan Gambut: </span>
                  Ketinggian air gambut di wilayah {selectedProvince.name} harus dipertahankan di atas -40 cm dengan menutup pintu sekat kanal secara serentak.
                </li>
                <li className="rounded-xl border border-white/5 bg-slate-950/60 p-3 leading-relaxed">
                  <span className="font-semibold text-orange-300">2. Water Bombing & Posko Darat: </span>
                  Koordinasikan helikopter water bombing BNPB untuk memadamkan klaster hotspot di area yang tidak terjangkau jalur darat.
                </li>
                <li className="rounded-xl border border-white/5 bg-slate-950/60 p-3 leading-relaxed">
                  <span className="font-semibold text-rose-300">3. Perlindungan Kualitas Udara (ISPU): </span>
                  Distribusikan masker N95 dan aktifkan posko kesehatan jika ISPU melebihi batas 150 AQI (Kategori Tidak Sehat).
                </li>
              </ul>
            ) : (
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="rounded-xl border border-white/5 bg-slate-950/60 p-3 leading-relaxed">
                  <span className="font-semibold text-cyan-300">1. Saluran Primer & Polder: </span>
                  Curah hujan di wilayah {selectedProvince.name} membutuhkan peningkatan frekuensi pembersihan pintu air dan inspeksi pompa darurat cadangan.
                </li>
                <li className="rounded-xl border border-white/5 bg-slate-950/60 p-3 leading-relaxed">
                  <span className="font-semibold text-emerald-300">2. Sponge City & Retensi: </span>
                  Indeks resapan hijau yang berada di level {selectedProvince.greenCoverage}% membuktikan perlunya penambahan sumur resapan modular di kawasan perumahan padat.
                </li>
                <li className="rounded-xl border border-white/5 bg-slate-950/60 p-3 leading-relaxed">
                  <span className="font-semibold text-amber-300">3. Validasi Sensor IoT: </span>
                  Integrasikan laporan visual masyarakat dengan pos hidrometri terdekat untuk memverifikasi genangan secara instan.
                </li>
              </ul>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
