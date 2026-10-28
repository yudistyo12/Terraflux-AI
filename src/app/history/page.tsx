"use client";

import { useMemo, useState } from "react";
import { Search, Flame, Waves, ShieldAlert, History as HistoryIcon, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { historyReports as floodReports } from "@/lib/demo-data";
import { wildfireHistoryReports } from "@/lib/wildfire-data";
import { useHazardControl } from "@/lib/realtime-telemetry";

export default function HistoryPage() {
  const { hazardMode } = useHazardControl();
  const [query, setQuery] = useState("");
  const [hazardFilter, setHazardFilter] = useState<"all" | "flood" | "wildfire">(
    hazardMode === "wildfire" ? "wildfire" : "all"
  );

  const combinedReports = useMemo(() => {
    const list = [
      ...floodReports.map((r) => ({ ...r, hazardType: "flood" as const })),
      ...wildfireHistoryReports.map((r) => ({ ...r, hazardType: "wildfire" as const })),
    ];

    return list.filter((report) => {
      if (hazardFilter !== "all" && report.hazardType !== hazardFilter) return false;
      if (!query.trim()) return true;

      const q = query.toLowerCase();
      return (
        report.title.toLowerCase().includes(q) ||
        report.area.toLowerCase().includes(q) ||
        report.source.toLowerCase().includes(q) ||
        report.description.toLowerCase().includes(q)
      );
    });
  }, [hazardFilter, query]);

  return (
    <AppShell>
      <div className="space-y-5 sm:space-y-6">
        {/* Header HUD */}
        <header className="rounded-[24px] border border-white/10 bg-slate-900/80 p-4 sm:p-5 shadow-xl backdrop-blur-md">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-slate-400">
                <HistoryIcon className="h-4 w-4 text-cyan-400" />
                <span className="text-cyan-300 font-bold">HISTORICAL INCIDENTS ARCHIVE</span>
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
                Riwayat Kejadian Bencana & Observasi Terdokumentasi
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-300">
                Basis data historis kejadian banjir dan karhutla di Indonesia untuk kalibrasi dan validasi model AI.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center rounded-full border border-white/15 bg-slate-950 p-1 text-xs">
              <button
                type="button"
                onClick={() => setHazardFilter("all")}
                className={`rounded-full px-3.5 py-1.5 font-bold transition ${
                  hazardFilter === "all" ? "bg-white/20 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Semua ({floodReports.length + wildfireHistoryReports.length})
              </button>
              <button
                type="button"
                onClick={() => setHazardFilter("flood")}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-bold transition ${
                  hazardFilter === "flood" ? "bg-cyan-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                <Waves className="h-3.5 w-3.5" />
                <span>Banjir ({floodReports.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setHazardFilter("wildfire")}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-bold transition ${
                  hazardFilter === "wildfire" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                <Flame className="h-3.5 w-3.5" />
                <span>Karhutla ({wildfireHistoryReports.length})</span>
              </button>
            </div>
          </div>
        </header>

        {/* Search & Records Table */}
        <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 sm:p-6 shadow-xl">
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-3">
            <Search className="h-4 w-4 text-slate-400 ml-1" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari berdasarkan lokasi (e.g. Riau, Jakarta, Palangka Raya), kata kunci, atau sumber data..."
              className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 outline-none"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs text-slate-300">
              <thead className="border-b border-white/10 font-mono text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="pb-3 pr-4">Bahaya</th>
                  <th className="pb-3 pr-4">Peristiwa & Kronologi</th>
                  <th className="pb-3 pr-4">Wilayah</th>
                  <th className="pb-3 pr-4">Tanggal</th>
                  <th className="pb-3 pr-4">Dampak Terukur</th>
                  <th className="pb-3 pr-4">Sumber Laporan</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {combinedReports.map((report) => {
                  const isWf = report.hazardType === "wildfire";
                  return (
                    <tr key={report.id} className="hover:bg-white/5 transition-colors align-top">
                      <td className="py-4 pr-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase ${
                          isWf
                            ? "bg-amber-500/15 border border-amber-400/30 text-amber-300"
                            : "bg-cyan-500/15 border border-cyan-400/30 text-cyan-300"
                        }`}>
                          {isWf ? <Flame className="h-3 w-3" /> : <Waves className="h-3 w-3" />}
                          <span>{isWf ? "Karhutla" : "Banjir"}</span>
                        </span>
                      </td>
                      <td className="py-4 pr-4 max-w-sm">
                        <div className="font-semibold text-white">{report.title}</div>
                        <div className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                          {report.description}
                        </div>
                      </td>
                      <td className="py-4 pr-4 font-medium text-slate-200">{report.area}</td>
                      <td className="py-4 pr-4 font-mono text-slate-400">{report.date}</td>
                      <td className={`py-4 pr-4 font-mono font-bold ${isWf ? "text-amber-300" : "text-cyan-300"}`}>
                        {report.value}
                      </td>
                      <td className="py-4 pr-4 text-slate-400">{report.source}</td>
                      <td className="py-4 text-right">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{report.status}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Data Architecture Note */}
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-xs text-cyan-200 flex items-start gap-3">
          <ShieldAlert className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            Arsip riwayat mengompilasi rekam data kejadian bencana terdokumentasi dari publikasi BNPB, BPBD, KLHK, dan observasi hidrologis lapangan untuk keperluan validasi pemodelan AI dan analisis komparasi historis.
          </span>
        </div>
      </div>
    </AppShell>
  );
}
