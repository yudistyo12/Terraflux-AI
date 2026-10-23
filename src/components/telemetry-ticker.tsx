"use client";

import React from "react";
import { Radio, AlertTriangle, ShieldCheck, Activity, CloudRain, Flame, SunMedium } from "lucide-react";
import { useRealtimeTelemetry, type WeatherScenario } from "@/lib/realtime-telemetry";

export function TelemetryTicker() {
  const {
    currentTimeWIB,
    scenario,
    setScenario,
    activeSensorsCount,
    alerts,
    hazardMode,
  } = useRealtimeTelemetry();

  const isWildfire = hazardMode === "wildfire";

  const scenarioItems = isWildfire
    ? ([
        { id: "normal", label: "Normal Lembap", icon: ShieldCheck, color: "text-emerald-300" },
        { id: "monsoon", label: "Musim Kemarau", icon: SunMedium, color: "text-amber-300" },
        { id: "cyclone", label: "Anomali El Niño", icon: Flame, color: "text-rose-400" },
      ] as const)
    : ([
        { id: "normal", label: "Normal", icon: ShieldCheck, color: "text-emerald-300" },
        { id: "monsoon", label: "Monsun Basah", icon: CloudRain, color: "text-cyan-300" },
        { id: "cyclone", label: "Siklon Ekstrem", icon: AlertTriangle, color: "text-rose-400" },
      ] as const);

  return (
    <div className="relative z-40 border-b border-cyan-500/20 bg-slate-950/95 text-[11px] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2 px-3 py-1 sm:px-4 lg:px-6">
        {/* Left: Live status & simulation scenario buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-semibold tracking-wide uppercase text-[9.5px]">
              TELEMETRI · {isWildfire ? "KARHUTLA" : "BANJIR"}
            </span>
          </div>

          <div className="hidden items-center gap-1.5 text-slate-400 md:flex text-[10.5px]">
            <Radio className="h-3 w-3 text-cyan-400" />
            <span>{activeSensorsCount} Node {isWildfire ? "Termal" : "Radar"}</span>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-cyan-300 font-bold">{currentTimeWIB}</span>
          </div>

          {/* Scenario Selector */}
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-slate-900/80 p-0.5">
            <span className="px-1.5 text-[10px] uppercase font-semibold text-slate-400 hidden lg:inline">
              Simulasi:
            </span>
            {scenarioItems.map((item) => {
              const Icon = item.icon;
              const isActive = scenario === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setScenario(item.id as WeatherScenario)}
                  className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10.5px] font-medium transition-all ${
                    isActive
                      ? isWildfire
                        ? "bg-amber-500/25 text-amber-200 shadow-sm shadow-amber-500/30 border border-amber-400/40"
                        : "bg-cyan-500/20 text-cyan-200 shadow-sm shadow-cyan-500/30 border border-cyan-400/40"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title={`Ganti skenario simulasi ke ${item.label}`}
                >
                  <Icon className={`h-3 w-3 ${item.color}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden 2xl:inline-flex items-center rounded-full bg-slate-900 border border-amber-400/30 px-2 py-0.5 text-[9px] font-mono text-amber-300/90">
            DEMO DATASET · BUKAN REAL-TIME RESMI
          </div>
        </div>

        {/* Right: Live scrolling alerts marquee */}
        <div className="flex-1 max-w-md lg:max-w-xl overflow-hidden relative h-6 rounded-md bg-slate-900/60 border border-white/5 px-2">
          <div className="marquee-content items-center gap-6">
            {alerts.concat(alerts).map((alert, idx) => (
              <div key={`${alert.id}-${idx}`} className="flex items-center gap-2 shrink-0">
                {alert.type === "danger" ? (
                  isWildfire ? (
                    <Flame className="h-3 w-3 text-rose-400 animate-pulse" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 text-rose-400 animate-pulse" />
                  )
                ) : (
                  <Activity className="h-3 w-3 text-cyan-400" />
                )}
                <span className="font-semibold text-slate-200">{alert.location}:</span>
                <span
                  className={
                    alert.type === "danger"
                      ? "text-rose-300 font-medium"
                      : alert.type === "warning"
                      ? "text-amber-300 font-medium"
                      : "text-slate-300"
                  }
                >
                  {alert.message}
                </span>
                <span className="font-mono text-[10px] text-cyan-300/80">({alert.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
