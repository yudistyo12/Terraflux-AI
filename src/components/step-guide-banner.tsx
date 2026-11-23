"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";

interface StepGuideBannerProps {
  currentStep: 1 | 2 | 3 | 4;
}

const STEPS = [
  { step: 1, name: "1. Pemantauan", desc: "Sensor & Peta", href: "/risk-map" },
  { step: 2, name: "2. Diagnosis AI", desc: "Dekomposisi XAI", href: "/intelligence" },
  { step: 3, name: "3. Simulator", desc: "What-If Sandbox", href: "/simulator" },
  { step: 4, name: "4. SOP Aksi", desc: "Disposisi BPBD", href: "/recommendations" },
];

export function StepGuideBanner({ currentStep }: StepGuideBannerProps) {
  const prevStep = STEPS[currentStep - 2];
  const nextStep = STEPS[currentStep];

  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Interactive Stepper indicators */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-500 mr-1 hidden sm:inline">
            Alur Keputusan:
          </span>
          {STEPS.map((s, idx) => {
            const isActive = s.step === currentStep;
            const isCompleted = s.step < currentStep;

            return (
              <React.Fragment key={s.step}>
                <Link
                  href={s.href}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition ${
                    isActive
                      ? "bg-blue-600 text-white font-semibold shadow-sm"
                      : isCompleted
                      ? "bg-blue-50 text-blue-700 font-medium hover:bg-blue-100"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                  title={`Buka Tahap ${s.step}: ${s.name}`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-3 w-3 text-blue-600 shrink-0" />
                  ) : (
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-mono font-bold ${
                        isActive ? "bg-white text-blue-600" : "bg-slate-300 text-slate-700"
                      }`}
                    >
                      {s.step}
                    </span>
                  )}
                  <span>{s.name}</span>
                </Link>
                {idx < STEPS.length - 1 && (
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right: Next / Prev Step Navigation Shortcuts */}
        <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
          {prevStep && (
            <Link
              href={prevStep.href}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
            >
              <ArrowLeft className="h-3 w-3" />
              <span className="hidden sm:inline">Kembali:</span> {prevStep.name}
            </Link>
          )}
          {nextStep ? (
            <Link
              href={nextStep.href}
              className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm transition"
            >
              <span>Lanjut: {nextStep.name}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="h-3 w-3" />
              Alur Pengambilan Keputusan Lengkap
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
