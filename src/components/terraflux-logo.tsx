"use client";

import React from "react";

interface TerrafluxLogoProps {
  size?: number;
  className?: string;
}

export function TerrafluxLogo({
  size = 36,
  className = "",
}: TerrafluxLogoProps) {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          <linearGradient id="tf-clean-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>

        {/* Clean Rounded Shield */}
        <path
          d="M22 3L38 11.5C39.2 12.2 40 13.5 40 15V29C40 30.5 39.2 31.8 38 32.5L22 41C20.8 41.7 19.2 41.7 18 41L2 32.5C0.8 31.8 0 30.5 0 29V15C0 13.5 0.8 12.2 2 11.5L18 3C19.2 2.3 20.8 2.3 22 3Z"
          fill="url(#tf-clean-grad)"
        />

        {/* River/Water Wave Contours */}
        <path
          d="M9 18C14 13.5 28 13.5 33 18C27 22.5 14 20.5 9 27"
          stroke="#93c5fd"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M11 26C16 30 28 29.5 33 25"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Clean Center Point */}
        <circle cx="21" cy="21" r="3" fill="#ffffff" />
      </svg>
    </div>
  );
}
