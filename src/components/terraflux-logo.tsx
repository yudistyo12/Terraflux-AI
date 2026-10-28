"use client";

import React from "react";

interface TerrafluxLogoProps {
  size?: number;
  className?: string;
  isWildfire?: boolean;
}

export function TerrafluxLogo({
  size = 40,
  className = "",
  isWildfire = false,
}: TerrafluxLogoProps) {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          {/* Cyber Dual Gradient for Shield Base */}
          <linearGradient id={`tf-base-grad-${isWildfire ? "wf" : "fl"}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0b1324" />
            <stop offset="50%" stopColor="#070c18" />
            <stop offset="100%" stopColor="#030712" />
          </linearGradient>

          {/* Flow Gradient */}
          <linearGradient id={`tf-flow-grad-${isWildfire ? "wf" : "fl"}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isWildfire ? "#fbbf24" : "#38bdf8"} />
            <stop offset="50%" stopColor={isWildfire ? "#f97316" : "#2dd4bf"} />
            <stop offset="100%" stopColor={isWildfire ? "#f43f5e" : "#10b981"} />
          </linearGradient>

          {/* Border Glow Gradient */}
          <linearGradient id={`tf-border-grad-${isWildfire ? "wf" : "fl"}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isWildfire ? "#fbbf24" : "#38bdf8"} stopOpacity="0.8" />
            <stop offset="50%" stopColor={isWildfire ? "#f97316" : "#2dd4bf"} stopOpacity="0.4" />
            <stop offset="100%" stopColor={isWildfire ? "#f43f5e" : "#10b981"} stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Outer High-Tech Rounded Hexagon Shield */}
        <path
          d="M22 2.8L38 11.5C39.2 12.2 40 13.5 40 15V29C40 30.5 39.2 31.8 38 32.5L22 41.2C20.8 41.9 19.2 41.9 18 41.2L2 32.5C0.8 31.8 0 30.5 0 29V15C0 13.5 0.8 12.2 2 11.5L18 2.8C19.2 2.1 20.8 2.1 22 2.8Z"
          fill={`url(#tf-base-grad-${isWildfire ? "wf" : "fl"})`}
          stroke={`url(#tf-border-grad-${isWildfire ? "wf" : "fl"})`}
          strokeWidth="1.8"
        />

        {/* Internal Subtle Radar Grid Rings */}
        <circle cx="20" cy="22" r="14" stroke={isWildfire ? "#f59e0b" : "#38bdf8"} strokeOpacity="0.15" strokeDasharray="2 3" />
        <circle cx="20" cy="22" r="9" stroke={isWildfire ? "#f59e0b" : "#38bdf8"} strokeOpacity="0.2" />

        {/* Terra Topographic Flow Contour (Top Flux Arc) */}
        <path
          d="M8 17.5C12.5 13 27.5 12.5 32 17C27 21.5 13 19.5 8 26.5"
          stroke={`url(#tf-flow-grad-${isWildfire ? "wf" : "fl"})`}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Dynamic Water/Thermal Wave Vector (Bottom Flux Arc) */}
        <path
          d="M10 27C15 31.5 29 31 33 26.5C28.5 22 14.5 24 10 17"
          stroke={isWildfire ? "#fb923c" : "#38bdf8"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.9"
        />

        {/* Central AI Geospatial Neural Core */}
        <circle cx="20" cy="22" r="3.2" fill="#ffffff" />
        <circle
          cx="20"
          cy="22"
          r="4.8"
          stroke={isWildfire ? "#f59e0b" : "#2dd4bf"}
          strokeWidth="1.2"
          strokeOpacity="0.9"
        />
        <circle cx="20" cy="22" r="1.5" fill={isWildfire ? "#ea580c" : "#0284c7"} />
      </svg>

      {/* Real-time Online Telemetry Node Dot at bottom right */}
      <span
        className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-slate-950 ${
          isWildfire ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
        }`}
      />
    </div>
  );
}
