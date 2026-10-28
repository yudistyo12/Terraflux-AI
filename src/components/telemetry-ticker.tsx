"use client";

import React from "react";
import { Radio, AlertTriangle, Activity, Flame } from "lucide-react";
import { useRealtimeTelemetry } from "@/lib/realtime-telemetry";

export function TelemetryTicker() {
  const {
    currentTimeWIB,
    activeSensorsCount,
    alerts,
    hazardMode,
  } = useRealtimeTelemetry();

  const isWildfire = hazardMode === "wildfire";

  return (
    <div className="relative z-40 border-b border-cyan-500/20 bg-slate-950/95 text-[11px] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-3 py-1 sm:px-4 lg:px-6">
        {/* Left: Live status & active telemetry node count + time */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-semibold tracking-wide uppercase text-[9.5px]">
              TELEMETRI · {isWildfire ? "KARHUTLA" : "BANJIR"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 text-[10.5px]">
            <Radio className="h-3 w-3 text-cyan-400" />
            <span>{activeSensorsCount} Node {isWildfire ? "Termal" : "Radar"}</span>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-cyan-300 font-bold">{currentTimeWIB}</span>
          </div>
        </div>

        {/* Right: Live scrolling alerts marquee - stretched right next to the time */}
        <div className="flex-1 min-w-0 overflow-hidden relative h-6 rounded-md bg-slate-900/60 border border-white/5 px-2.5">
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
