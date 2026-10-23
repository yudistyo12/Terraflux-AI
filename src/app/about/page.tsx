import { AppShell } from "@/components/app-shell";
import {
  Cpu,
  ShieldAlert,
  Sparkles,
  Waves,
  Flame,
  Globe2,
  FileCheck2,
} from "lucide-react";

export default function AboutPage() {
  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8">
        {/* Header HUD */}
        <header className="rounded-[24px] border border-white/10 bg-slate-900/80 p-4 sm:p-6 shadow-xl backdrop-blur-md">
          <div className="text-xs uppercase font-mono tracking-widest text-cyan-300">
            METODOLOGI ILMIAH · SUMBER DATA · TRANSPARANSI PLATFORM
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
            Arsitektur & Metodologi TERRAFLUX AI
          </h1>
          <p className="mt-2 max-w-3xl text-sm sm:text-base text-slate-300 leading-relaxed">
            TERRAFLUX AI dirancang sebagai platform intelijen risiko bencana terpadu (Multi-Hazard Disaster Intelligence) yang menggabungkan analisis geospasial, model screening neural yang explainable, dan simulator intervensi mitigasi untuk wilayah Indonesia.
          </p>
        </header>

        {/* 2 Core Hazard Modeling Pillars */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Pillar 1: Flood Hydrometeorology */}
          <div className="rounded-[28px] border border-cyan-400/25 bg-slate-900/80 p-6 sm:p-7 shadow-xl">
            <div className="flex items-center gap-2.5 text-cyan-300 font-mono text-xs uppercase tracking-widest font-bold">
              <Waves className="h-4 w-4" />
              <span>1. PEMODELAN RISIKO BANJIR (HYDROLOGICAL RISK)</span>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Screening Limpasan Permukaan & Defisit Drainase
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Model risiko banjir perkotaan TERRAFLUX AI mengevaluasi potensi genangan berdasarkan interaksi 4 pilar hidrologis:
            </p>

            <div className="mt-4 space-y-3 text-xs text-slate-200">
              <div className="rounded-xl border border-white/5 bg-slate-950/60 p-3">
                <strong className="text-cyan-300">Presipitasi Curah Hujan (40%):</strong>
                <p className="mt-0.5 text-slate-400">Intensitas curah hujan per jam (mm/jam) dan akumulasi presipitasi 24 jam berbasis radar BMKG.</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-950/60 p-3">
                <strong className="text-cyan-300">Defisit Kapasitas Drainase (30%):</strong>
                <p className="mt-0.5 text-slate-400">Rasio daya tampung saluran primer, sekunder, dan kapasitas pompa polder terhadap debit air permukaan.</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-950/60 p-3">
                <strong className="text-cyan-300">Koefisien Limpasan Cekungan / Runoff (20%):</strong>
                <p className="mt-0.5 text-slate-400">Karakteristik kedap air (impervious surfaces) dan ketiadaan ruang terbuka hijau (RTH) penyerap air alami.</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-950/60 p-3">
                <strong className="text-cyan-300">Sensor TMA & Observasi Genangan (10%):</strong>
                <p className="mt-0.5 text-slate-400">Tinggi Muka Air di pintu air pengendali dan verifikasi titik genangan historis.</p>
              </div>
            </div>
          </div>

          {/* Pillar 2: Wildfire & Peatland */}
          <div className="rounded-[28px] border border-amber-400/25 bg-slate-900/80 p-6 sm:p-7 shadow-xl">
            <div className="flex items-center gap-2.5 text-amber-300 font-mono text-xs uppercase tracking-widest font-bold">
              <Flame className="h-4 w-4" />
              <span>2. PEMODELAN RISIKO KARHUTLA (WILDFIRE & PEATLAND)</span>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Deteksi Anomali Termal Satelit & Indeks FWI
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Model karhutla memantau kerawanan kebakaran hutan dan lahan gambut melalui integrasi 4 indikator lingkungan:
            </p>

            <div className="mt-4 space-y-3 text-xs text-slate-200">
              <div className="rounded-xl border border-white/5 bg-slate-950/60 p-3">
                <strong className="text-amber-300">Indeks Kekeringan Lahan / KBDI (40%):</strong>
                <p className="mt-0.5 text-slate-400">Keetch-Byram Drought Index dan Fire Weather Index mengukur kelembapan serasah serta lapisan organik tanah.</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-950/60 p-3">
                <strong className="text-amber-300">Sinyal Titik Panas Satelit / Hotspot (30%):</strong>
                <p className="mt-0.5 text-slate-400">Deteksi radiasi inframerah termal dari sensor antariksa MODIS Terra/Aqua dan VIIRS Suomi-NPP.</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-950/60 p-3">
                <strong className="text-amber-300">Vektor Kecepatan & Arah Angin (20%):</strong>
                <p className="mt-0.5 text-slate-400">Menentukan kecepatan ekspansi perambatan kobaran api permukaan dan proyeksi persebaran asap pekat.</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-950/60 p-3">
                <strong className="text-amber-300">Kerentanan Kubah Gambut / Peatland (10%):</strong>
                <p className="mt-0.5 text-slate-400">Indeks kerentanan kebakaran bawah permukaan (smoldering) pada formasi tanah gambut dalam.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Explainability & Feature Importance */}
        <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 sm:p-8">
          <div className="text-xs uppercase font-mono tracking-widest text-cyan-300 font-bold">
            EXPLAINABLE AI PRINCIPLES
          </div>
          <h2 className="mt-1 text-2xl font-bold text-white">
            Prinsip Transparansi Model & Non-Blackbox
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            Sistem kecerdasan buatan dalam kebencanaan tidak boleh beroperasi secara tertutup (black box). Setiap rekomendasi dan skor bahaya yang dihasilkan TERRAFLUX AI dapat ditelusuri kembali ke variabel asalnya, memungkinkan insinyur hidrologi, BPBD, dan satgas kebakaran memvalidasi formula secara objektif.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <Cpu className="h-5 w-5 text-cyan-300 mb-2" />
              <div className="font-bold text-white text-sm">Feature Weight Decomposition</div>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                Menyajikan persentase pengaruh masing-masing parameter lingkungan terhadap angka akhir indeks risiko.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <Sparkles className="h-5 w-5 text-amber-300 mb-2" />
              <div className="font-bold text-white text-sm">What-If Sensitivity Testing</div>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                Pengguna dapat menguji bagaimana perubahan satu variabel (misal penambahan sekat bakar atau pompa) mereduksi skor risiko.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <FileCheck2 className="h-5 w-5 text-emerald-300 mb-2" />
              <div className="font-bold text-white text-sm">Actionable Playbook Alignment</div>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                Setiap kategori siaga terhubung langsung dengan Standar Operasional Prosedur (SOP) aksi lapangan terstandarisasi.
              </p>
            </div>
          </div>
        </section>

        {/* UN SDG Alignment (SDG 11, SDG 13, SDG 15) */}
        <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-emerald-300 font-bold">
            <Globe2 className="h-4 w-4" />
            <span>KONTRIBUSI NYATA PADA AGENDA GLOBAL</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-white">
            Keselarasan dengan UN Sustainable Development Goals (SDGs)
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-emerald-500/25 bg-slate-950/60 p-5">
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-300 border border-emerald-500/30">
                SDG 11
              </span>
              <h3 className="mt-3 text-base font-bold text-white">Kota & Pemukiman Berkelanjutan</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Meningkatkan ketangguhan infrastruktur drainase perkotaan (Target 11.5) untuk memitigasi kerugian ekonomi dan korban akibat bencana hidrometeorologis di kota-kota padat Indonesia.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-500/25 bg-slate-950/60 p-5">
              <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-cyan-300 border border-cyan-500/30">
                SDG 13
              </span>
              <h3 className="mt-3 text-base font-bold text-white">Penanganan Perubahan Iklim</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Memperkuat kapasitas adaptasi terhadap bencana iklim ekstrem (Target 13.1) melalui sistem peringatan dini presipitasi tinggi dan pemantauan gelombang panas pemicu kebakaran.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/25 bg-slate-950/60 p-5">
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-300 border border-amber-500/30">
                SDG 15
              </span>
              <h3 className="mt-3 text-base font-bold text-white">Ekosistem Daratan & Hutan</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Melindungi kubah gambut tropis dan hutan hujan dari kebakaran (Target 15.2), mencegah pelepasan jutaan ton karbon ke atmosfer dan degradasi keanekaragaman hayati.
              </p>
            </div>
          </div>
        </section>

        {/* Scientific Integrity & Decision-Support Statement */}
        <section className="rounded-[28px] border border-cyan-400/30 bg-cyan-950/30 p-6 sm:p-7 text-cyan-200">
          <div className="flex items-center gap-2 font-bold text-sm text-cyan-300">
            <ShieldAlert className="h-5 w-5 text-cyan-400 shrink-0" />
            <span>Pernyataan Etika Data & Integritas Ilmiah:</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-300">
            TERRAFLUX AI dirancang sebagai sistem pendukung keputusan (decision-support system) mutakhir yang mengintegrasikan observasi spasial, telemetri hidrometeorologi, dan model neural screening untuk akselerasi kesiapsiagaan bencana nasional. Seluruh integrasi data dikembangkan untuk memperkuat kapasitas analisis mitigasi bagi pemangku kepentingan dan lembaga terkait di Indonesia.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
