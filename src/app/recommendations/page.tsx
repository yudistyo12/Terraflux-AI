"use client";

import { useState } from "react";
import { Activity, ShieldCheck, Flame, Waves, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { recommendations as floodRecommendations } from "@/lib/demo-data";
import { wildfireRecommendations } from "@/lib/wildfire-data";
import { useHazardControl } from "@/lib/realtime-telemetry";

export default function RecommendationsPage() {
  const { hazardMode, setHazardMode } = useHazardControl();
  const [filterMode, setFilterMode] = useState<"all" | "flood" | "wildfire">(
    hazardMode === "wildfire" ? "wildfire" : "flood"
  );

  const displayedRecommendations = [
    ...floodRecommendations.map((r) => ({ ...r, hazardType: "flood" as const })),
    ...wildfireRecommendations.map((r) => ({ ...r, hazardType: "wildfire" as const })),
  ].filter((item) => {
    if (filterMode === "all") return true;
    return item.hazardType === filterMode;
  });

  return (
    <AppShell>
      <div className="space-y-5 sm:space-y-6">
        <header className="rounded-[24px] border border-white/10 bg-slate-900/80 p-4 sm:p-5 shadow-xl backdrop-blur-md">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-slate-400">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span className="text-cyan-300 font-bold">
                  MULTI-AGENCY ACTIONABLE PLAYBOOKS & MITIGATION
                </span>
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
                Rekomendasi Taktis & Prioritas Mitigasi Multi-Bencana
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-300">
                Formulasi langkah terukur untuk BPBD, Dinas PUPR, Manggala Agni, dan pemangku kebijakan daerah.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center rounded-full border border-white/15 bg-slate-950 p-1 text-xs">
              <button
                type="button"
                onClick={() => setFilterMode("all")}
                className={`rounded-full px-3.5 py-1.5 font-bold transition ${
                  filterMode === "all" ? "bg-white/20 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Semua ({floodRecommendations.length + wildfireRecommendations.length})
              </button>
              <button
                type="button"
                onClick={() => { setFilterMode("flood"); setHazardMode("flood"); }}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-bold transition ${
                  filterMode === "flood" ? "bg-cyan-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                <Waves className="h-3.5 w-3.5" />
                <span>Banjir ({floodRecommendations.length})</span>
              </button>
              <button
                type="button"
                onClick={() => { setFilterMode("wildfire"); setHazardMode("wildfire"); }}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-bold transition ${
                  filterMode === "wildfire" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                <Flame className="h-3.5 w-3.5" />
                <span>Karhutla ({wildfireRecommendations.length})</span>
              </button>
            </div>
          </div>
        </header>

        {/* Recommendations Feed */}
        <section className="grid gap-5">
          {displayedRecommendations.map((item) => {
            const isWf = item.hazardType === "wildfire";
            return (
              <article
                key={item.id}
                className={`rounded-[28px] border bg-slate-900/80 p-5 sm:p-6 shadow-xl transition-all ${
                  isWf ? "border-amber-400/25" : "border-cyan-400/25"
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${
                        isWf
                          ? "bg-amber-500/15 border border-amber-400/30 text-amber-300"
                          : "bg-cyan-500/15 border border-cyan-400/30 text-cyan-300"
                      }`}>
                        {isWf ? <Flame className="h-3 w-3" /> : <Waves className="h-3 w-3" />}
                        <span>{isWf ? "MITIGASI KARHUTLA" : "MITIGASI BANJIR"}</span>
                      </span>
                      <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                        • {item.area}
                      </span>
                    </div>
                    <h2 className="mt-2 text-xl font-bold text-white">{item.issue}</h2>
                  </div>

                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold shrink-0 border ${
                    item.priority.includes("sangat") || item.priority.includes("tinggi")
                      ? "bg-rose-500/15 border-rose-500/30 text-rose-300"
                      : "bg-amber-500/15 border-amber-500/30 text-amber-300"
                  }`}>
                    <ShieldCheck className="h-4 w-4" />
                    <span>{item.priority}</span>
                  </span>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-mono text-cyan-300">
                      <Activity className="h-3.5 w-3.5" />
                      Tindakan Usulan Konkret
                    </div>
                    <p className="text-xs leading-relaxed text-slate-200">{item.action}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    <div className="mb-2 text-xs uppercase tracking-[0.18em] font-mono text-slate-400">
                      Alasan & Analisis Risiko
                    </div>
                    <p className="text-xs leading-relaxed text-slate-200">{item.reason}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/40 p-3.5 text-xs text-slate-300">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                    <span className="text-slate-400 font-mono text-[11px]">Metodologi & Sumber Data:</span>
                    <span className="font-semibold text-slate-200">{item.source}</span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-400 leading-relaxed">
                    <strong className="text-slate-300">Batasan & Asumsi: </strong>
                    {item.uncertainty}
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Honest Disclosure Box */}
        <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-xs text-amber-200 flex items-start gap-3">
          <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            Rekomendasi mitigasi disintesis dari indikator simulasi lingkungan dan metodologi rekayasa bencana. Penetapan alokasi anggaran dan instruksi operasional lapangan tetap berada di bawah wewenang otoritas pemerintah terkait.
          </span>
        </div>
      </div>
    </AppShell>
  );
}
