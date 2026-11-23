"use client";

import { useMemo, useState } from "react";
import { Search, Waves, History as HistoryIcon } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { historyReports as floodReports } from "@/lib/demo-data";

export default function HistoryPage() {
  const [query, setQuery] = useState("");

  const filteredReports = useMemo(() => {
    return floodReports.filter((report) => {
      if (!query.trim()) return true;

      const q = query.toLowerCase();
      return (
        report.title.toLowerCase().includes(q) ||
        report.area.toLowerCase().includes(q) ||
        report.source.toLowerCase().includes(q) ||
        report.description.toLowerCase().includes(q)
      );
    });
  }, [query]);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <header className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-wider font-semibold text-blue-600">
              <HistoryIcon className="h-4 w-4" />
              <span>Historical Incidents Archive</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Riwayat Kejadian Bencana & Observasi Hidrologi
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Basis data historis kejadian banjir di Indonesia untuk kalibrasi model dan analisis kecenderungan limpasan air.
            </p>
          </div>
        </header>

        {/* Search & Records */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari berdasarkan lokasi (misal: Jakarta, Bandung, Semarang), kata kunci, atau sumber data..."
              className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 outline-none"
            />
          </div>

          <div className="space-y-3">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-slate-200"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-700">
                      <Waves className="h-3 w-3" />
                      <span>BANJIR</span>
                    </span>
                    <span className="font-semibold text-slate-900 text-xs sm:text-sm">{report.title}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500 font-medium">{report.date}</span>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-slate-600">{report.description}</p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-[11px]">
                  <span className="font-medium text-slate-700">Lokasi: {report.area}</span>
                  <span className="text-slate-500">Sumber: {report.source}</span>
                </div>
              </div>
            ))}

            {filteredReports.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-400">
                Tidak ada data historis yang cocok dengan kata kunci pencarian.
              </div>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
