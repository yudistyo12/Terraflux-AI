"use client";

import { Activity, ShieldCheck, Waves, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StepGuideBanner } from "@/components/step-guide-banner";
import { recommendations as floodRecommendations } from "@/lib/demo-data";

export default function RecommendationsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Step Guide Banner */}
        <StepGuideBanner currentStep={4} />

        <header className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-wider font-semibold text-blue-600">
              <ShieldCheck className="h-4 w-4" />
              <span>Multi-Agency Actionable Playbooks & Mitigation</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Rekomendasi Taktis & Prioritas Mitigasi Banjir
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Formulasi langkah penanganan terukur untuk BPBD, Dinas PUPR, dan pemangku kebijakan daerah.
            </p>
          </div>
        </header>

        {/* Recommendations Feed */}
        <section className="grid gap-4">
          {floodRecommendations.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase text-blue-700">
                      <Waves className="h-3 w-3" />
                      <span>MITIGASI BANJIR</span>
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      • {item.area}
                    </span>
                  </div>
                  <h2 className="mt-1.5 text-lg font-bold text-slate-900">{item.issue}</h2>
                </div>

                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shrink-0 ${
                  item.priority.includes("sangat") || item.priority.includes("tinggi")
                    ? "bg-red-50 border border-red-200 text-red-700"
                    : "bg-amber-50 border border-amber-200 text-amber-700"
                }`}>
                  <ShieldCheck className="h-4 w-4" />
                  <span>{item.priority}</span>
                </span>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="mb-1.5 flex items-center gap-2 text-xs uppercase font-mono font-semibold text-blue-700">
                    <Activity className="h-3.5 w-3.5" />
                    Tindakan Usulan Konkret
                  </div>
                  <p className="text-xs leading-relaxed text-slate-700">{item.action}</p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="mb-1.5 text-xs uppercase font-mono font-semibold text-slate-500">
                    Alasan & Analisis Risiko
                  </div>
                  <p className="text-xs leading-relaxed text-slate-700">{item.reason}</p>
                </div>
              </div>

              <div className="mt-3.5 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500 font-mono text-[11px]">Metodologi & Sumber Data:</span>
                  <span className="font-semibold text-slate-800">{item.source}</span>
                </div>
                <div className="mt-1.5 text-[11px] text-slate-500 leading-relaxed">
                  <strong className="text-slate-700">Batasan & Asumsi: </strong>
                  {item.uncertainty}
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Honest Disclosure Box */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 flex items-start gap-3">
          <ShieldAlert className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            Rekomendasi mitigasi disintesis dari indikator simulasi lingkungan dan metodologi rekayasa hidrologi perkotaan. Penetapan alokasi anggaran dan instruksi teknis lapangan mengacu pada arahan BNPB/BPBD serta Dinas Pekerjaan Umum daerah.
          </span>
        </div>
      </div>
    </AppShell>
  );
}
