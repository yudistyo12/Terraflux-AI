import { AppShell } from "@/components/app-shell";
import {
  Cpu,
  ShieldAlert,
  Sparkles,
  Waves,
  Globe2,
  FileCheck2,
} from "lucide-react";

export default function AboutPage() {
  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8">
        {/* Header Bar */}
        <header className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
          <div className="text-xs uppercase font-mono tracking-wider font-semibold text-blue-600">
            Metodologi Ilmiah · Sumber Data · Transparansi Platform
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Arsitektur & Metodologi TERRAFLUX AI
          </h1>
          <p className="mt-2 max-w-3xl text-xs sm:text-sm text-slate-600 leading-relaxed">
            TERRAFLUX AI dirancang sebagai platform intelijen geospasial berbasis AI untuk deteksi dini, pemodelan risiko, dan simulasi mitigasi tata air di Indonesia, yang mengintegrasikan radar presipitasi, sensor hidrometri, dan model skrining transparan.
          </p>
        </header>

        {/* Core Flood Modeling Pillars */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 font-mono text-xs uppercase tracking-wider font-semibold">
            <Waves className="h-4 w-4" />
            <span>Pemodelan Risiko Banjir & Hidrologi Perkotaan</span>
          </div>
          <h2 className="mt-1 text-xl sm:text-2xl font-bold text-slate-900">
            Skrining Limpasan Permukaan & Defisit Drainase
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            Model skrining risiko banjir TERRAFLUX AI mengevaluasi potensi genangan berdasarkan interaksi 4 pilar hidrologis terbobot:
          </p>

          <div className="mt-5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <strong className="text-blue-700 text-xs block">Presipitasi Curah Hujan (40%):</strong>
              <p className="mt-1 text-slate-600 text-[11px] leading-relaxed">Intensitas curah hujan per jam (mm/jam) dan akumulasi presipitasi 24 jam berbasis radar BMKG.</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <strong className="text-blue-700 text-xs block">Defisit Kapasitas Drainase (30%):</strong>
              <p className="mt-1 text-slate-600 text-[11px] leading-relaxed">Rasio daya tampung saluran primer, sekunder, dan kapasitas pompa polder terhadap debit air permukaan.</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <strong className="text-blue-700 text-xs block">Koefisien Limpasan / Runoff (20%):</strong>
              <p className="mt-1 text-slate-600 text-[11px] leading-relaxed">Karakteristik permukaan kedap air (impervious surfaces) dan ketersediaan ruang terbuka hijau penyerap air alami.</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <strong className="text-blue-700 text-xs block">Sensor TMA & Observasi (10%):</strong>
              <p className="mt-1 text-slate-600 text-[11px] leading-relaxed">Tinggi Muka Air di pintu air pengendali dan verifikasi titik genangan historis terdokumentasi.</p>
            </div>
          </div>
        </section>

        {/* Explainability & Feature Importance */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
          <div className="text-xs uppercase font-mono tracking-wider font-semibold text-blue-600">
            Explainable AI Principles
          </div>
          <h2 className="mt-1 text-xl sm:text-2xl font-bold text-slate-900">
            Prinsip Transparansi Model & Non-Blackbox
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            Sistem kecerdasan buatan dalam penanggulangan bencana harus dapat dipertanggungjawabkan (transparent & explainable). Setiap rekomendasi dan skor risiko yang dihasilkan TERRAFLUX AI dapat ditelusuri kembali ke variabel asalnya untuk divalidasi oleh pemangku kebijakan.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <Cpu className="h-5 w-5 text-blue-600 mb-2" />
              <div className="font-bold text-slate-900 text-sm">Feature Weight Decomposition</div>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Menyajikan persentase pengaruh masing-masing parameter lingkungan terhadap angka akhir indeks risiko secara terbuka.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <Sparkles className="h-5 w-5 text-blue-600 mb-2" />
              <div className="font-bold text-slate-900 text-sm">What-If Sensitivity Testing</div>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Pengguna dapat menguji bagaimana perubahan satu variabel (seperti penambahan kapasitas saluran atau kolam retensi) mereduksi probabilitas genangan.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <FileCheck2 className="h-5 w-5 text-emerald-600 mb-2" />
              <div className="font-bold text-slate-900 text-sm">Actionable Playbook Alignment</div>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Setiap status siaga terhubung langsung dengan Standar Operasional Prosedur (SOP) aksi tanggap darurat BPBD dan Dinas PUPR.
              </p>
            </div>
          </div>
        </section>

        {/* UN SDG Alignment (SDG 11 & SDG 13) */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
          <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-wider text-emerald-700 font-semibold">
            <Globe2 className="h-4 w-4" />
            <span>Kontribusi pada Agenda Global UN SDG</span>
          </div>
          <h2 className="mt-1 text-xl sm:text-2xl font-bold text-slate-900">
            Keselarasan dengan UN Sustainable Development Goals (SDGs)
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-800 border border-emerald-200">
                SDG 11
              </span>
              <h3 className="mt-2.5 text-base font-bold text-slate-900">Kota & Pemukiman Berkelanjutan</h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Meningkatkan ketahanan infrastruktur tata air perkotaan (Target 11.5) untuk memitigasi risiko kerugian ekonomi dan korban akibat bencana hidrometeorologis di kawasan perkotaan Indonesia.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-mono font-bold text-blue-700 border border-blue-200">
                SDG 13
              </span>
              <h3 className="mt-2.5 text-base font-bold text-slate-900">Penanganan Perubahan Iklim</h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Memperkuat kapasitas adaptasi terhadap bencana cuaca ekstrem (Target 13.1) melalui sistem peringatan dini presipitasi tinggi dan analisis limpasan air waktu nyata.
              </p>
            </div>
          </div>
        </section>

        {/* Scientific Integrity Statement */}
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6 text-slate-700">
          <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-slate-900">
            <ShieldAlert className="h-4 w-4 text-blue-600 shrink-0" />
            <span>Pernyataan Etika Data & Integritas Ilmiah:</span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            TERRAFLUX AI dirancang sebagai purwarupa sistem pendukung keputusan (decision-support system prototype) berbasis observasi spasial, telemetri hidrometeorologi, dan model skrining risiko untuk memperkuat kesiapsiagaan bencana di Indonesia. Seluruh analisis bertujuan mendukung pengambilan keputusan teknis pemangku kebijakan.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
