"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  BrainCircuit,
  SlidersHorizontal,
  FileCheck2,
  ArrowRight,
} from "lucide-react";

interface WorkflowStepsProps {
  currentStep?: 1 | 2 | 3 | 4;
  className?: string;
}

export const WORKFLOW_STEPS = [
  {
    step: 1,
    title: "1. Pemantauan Wilayah",
    subtitle: "Deteksi Dini",
    desc: "Identifikasi stasiun hidrometri dan titik rawan genangan di 34 provinsi melalui peta geospasial real-time.",
    href: "/risk-map",
    icon: MapPin,
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    actionLabel: "Buka Peta",
  },
  {
    step: 2,
    title: "2. Diagnosis Risiko AI",
    subtitle: "Analisis Akar Masalah",
    desc: "Urai faktor dominan pemicu banjir (curah hujan vs defisit drainase) secara transparan tanpa model black-box.",
    href: "/intelligence",
    icon: BrainCircuit,
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    actionLabel: "Jalankan Diagnosis",
  },
  {
    step: 3,
    title: "3. Simulasi What-If",
    subtitle: "Uji Rekayasa Teknis",
    desc: "Simulasikan efektivitas penambahan pompa polder, kolam retensi, dan RTH sebelum anggaran fisik dialokasikan.",
    href: "/simulator",
    icon: SlidersHorizontal,
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    actionLabel: "Uji Skenario",
  },
  {
    step: 4,
    title: "4. SOP Aksi Lapangan",
    subtitle: "Eksekusi Mitigasi",
    desc: "Disposisikan panduan taktis terstandarisasi kepada satgas darurat BPBD dan Dinas PUPR di lokasi rawan.",
    href: "/recommendations",
    icon: FileCheck2,
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    actionLabel: "Lihat SOP",
  },
];

export function WorkflowSteps({ currentStep, className = "" }: WorkflowStepsProps) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm ${className}`}>
      {/* Header banner explaining business workflow */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="text-[11px] uppercase font-mono tracking-wider font-semibold text-blue-600">
            Alur Bisnis & Pengoperasian Sistem
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
            4 Tahap Pengambilan Keputusan Mitigasi Bencana
          </h2>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Dirancang untuk Petugas BPBD & Insinyur Tata Air PUPR
        </div>
      </div>

      {/* 4 Connected Step Cards */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {WORKFLOW_STEPS.map((item) => {
          const Icon = item.icon;
          const isActive = currentStep === item.step;

          return (
            <div
              key={item.step}
              className={`relative flex flex-col justify-between rounded-xl border p-4 transition-all ${
                isActive
                  ? "border-blue-500 bg-blue-50/40 ring-1 ring-blue-500 shadow-sm"
                  : "border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${item.badgeColor}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-500 border border-slate-200">
                    TAHAP {item.step}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wide">
                    {item.subtitle}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

