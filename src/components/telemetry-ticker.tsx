"use client";

import React from "react";
import { Radio, AlertTriangle, Activity } from "lucide-react";
import { useRealtimeTelemetry } from "@/lib/realtime-telemetry";

export function TelemetryTicker() {
  const { currentTimeWIB, activeSensorsCount, alerts } = useRealtimeTelemetry();

  return (
    <div className="border-b border-slate-200 bg-slate-50 text-[11px] text-slate-600">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-1.5 sm:px-6">
        {/* Status indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          <span className="font-semibold text-slate-800 tracking-wide text-[10px] uppercase">
            Telemetri Hidrologi
          </span>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 text-slate-500">
            <Radio className="h-3 w-3 text-blue-600" />
            <span>{activeSensorsCount} Stasiun</span>
            <span className="text-slate-300">|</span>
            <span className="font-mono text-slate-700 font-medium">{currentTimeWIB}</span>
          </div>
        </div>

        {/* Marquee Alerts */}
        <div className="flex-1 min-w-0 overflow-hidden relative h-5 rounded bg-white border border-slate-200/80 px-2.5">
          <div className="marquee-content items-center gap-6">
            {alerts.concat(alerts).map((alert, idx) => (
              <div key={`${alert.id}-${idx}`} className="flex items-center gap-1.5 shrink-0 text-[11px]">
                {alert.type === "danger" ? (
                  <AlertTriangle className="h-3 w-3 text-red-600 shrink-0" />
                ) : (
                  <Activity className="h-3 w-3 text-blue-600 shrink-0" />
                )}
                <span className="font-medium text-slate-800">{alert.location}:</span>
                <span
                  className={
                    alert.type === "danger"
                      ? "text-red-600 font-medium"
                      : alert.type === "warning"
                      ? "text-amber-700 font-medium"
                      : "text-slate-600"
                  }
                >
                  {alert.message}
                </span>
                <span className="font-mono text-[10px] text-slate-400">({alert.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
