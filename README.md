# TERRAFLUX AI — Dashboard Geospasial Interaktif untuk Mitigasi Risiko Banjir & Kebakaran Hutan dan Lahan

**TERRAFLUX AI** adalah platform *Multi-Hazard Disaster Risk Intelligence* generasi berikutnya yang menggabungkan analitik geospasial komprehensif, telemetri lingkungan *real-time*, model skrining neural *explainable*, dan simulator mitigasi *What-If* untuk 34 Provinsi di Indonesia.

Dirancang untuk kompetisi inovasi teknologi dan kesiapsiagaan operasional pemangku kebijakan (BPBD, BNPB, KLHK, Dinas PUPR), TERRAFLUX AI beroperasi secara transparan dengan jaminan kejujuran data (*transparent data provenance*).

---

## 🌟 Fitur Utama Platform

### 1. Sistem Multi-Bencana (Multi-Hazard Architecture)
Dukungan penuh untuk dua ancaman hidrometeorologis dan iklim terbesar di Indonesia yang dapat diganti secara instan di seluruh ekosistem aplikasi:
- 🌊 **Banjir Perkotaan & Daerah Aliran Sungai (DAS):** Analisis curah hujan radar, kapasitas drainase perkotaan, koefisien limpasan cekungan (*surface runoff*), dan sensor Tinggi Muka Air (TMA).
- 🔥 **Kebakaran Hutan & Lahan Gambut (Karhutla):** Deteksi radiasi termal satelit (MODIS / VIIRS), indeks kekeringan serasah (*Keetch-Byram Drought Index / FWI*), vektor kecepatan angin, dan kerentanan kubah gambut dalam (*peatland*).

### 2. Cakupan 34 Provinsi Seluruh Indonesia
Database geospasial terintegrasi mencakup seluruh 34 provinsi di Indonesia:
- Dari Aceh, Riau, DKI Jakarta, Jawa Barat, Kalimantan Tengah, hingga Papua Barat Daya.
- Dilengkapi koordinat geospasial presisi, konteks medan geografis lokal (*terrain context*), dan nilai pengamatan terkalibrasi.

### 3. Telemetri Real-Time & Uji Skenario Ekstrem (Disaster Sandbox)
- **Live WIB Ticker:** Waktu operasional Indonesia Barat (WIB) dengan detak telemetri hidup (*pulsing sensor*).
- **Trigger Badai Siklon Tropis:** Pengujian lonjakan presipitasi hujan ekstrem hingga 130 mm/jam dan simulasi kenaikan muka air.
- **Trigger Fenomena El Niño Ekstrem:** Pengujian lonjakan indeks kekeringan tanah hingga 98/100, percepatan angin, dan kemunculan titik api serentak.

### 4. What-If Mitigation Engine
Simulator intervensi rekayasa interaktif dengan umpan balik fisik terukur:
- **Simulasi Banjir:** Efektivitas normalisasi kapasitas saluran polder, ekspansi Ruang Terbuka Hijau (RTH / *Sponge City*), dan kapasitas tampung waduk retensi air.
- **Simulasi Karhutla:** Efektivitas lebar sekat bakar komunal (*firebreaks*), sekat kanal pembasahan gambut (*canal blocking*), dan kesiapsiagaan patroli regu pemadam darat (*Manggala Agni*).

### 5. Explainable AI & Non-Blackbox Neural Screening
- Transparansi pembobotan indikator (*Feature Weight Decomposition*: 40% presipitasi/kekeringan, 30% drainase/hotspot, 20% limpasan/angin, 10% observasi).
- Sintesis laporan diagnosis berstandar satgas bencana dengan klasifikasi Siaga 1, Siaga 2, dan Siaga 3.

### 6. Peta Risiko Geospasial Interaktif (MapLibre GL)
- Peta vektor berkinerja tinggi dengan kemampuan toggle layer: Titik Panas, Indeks FWI, Vektor Angin, Curah Hujan Radar, dan Titik Rawan Banjir.
- Fallback canvas adaptif memastikan kelancaran navigasi bahkan di perangkat berspesifikasi rendah.

### 7. Playbook Rekomendasi Aksi & Arsip Historis
- Panduan taktis terstruktur untuk respon cepat tim gabungan di lapangan.
- Basis data kejadian bencana historis terdokumentasi untuk keperluan validasi model.

---

## 🎯 Keselarasan dengan UN Sustainable Development Goals (SDGs)

1. **SDG 11: Kota dan Komunitas yang Berkelanjutan (Target 11.5)**
   Mengurangi kerugian ekonomi dan risiko korban jiwa akibat bencana hidrometeorologis perkotaan melalui pemodelan tata air presisi.
2. **SDG 13: Penanganan Perubahan Iklim (Target 13.1)**
   Memperkuat ketahanan dan kapasitas adaptasi terhadap bencana cuaca ekstrem yang dipicu pemanasan global dan anomali siklus iklim.
3. **SDG 15: Ekosistem Daratan (Target 15.2)**
   Melindungi kubah gambut tropis dan hutan hujan Nusantara dari degradasi kebakaran berulang, mencegah emisi jutaan ton karbon ke atmosfer.

---

## 🛠️ Arsitektur & Teknologi

- **Framework:** Next.js 16 (App Router)
- **Library UI:** React 19, Tailwind CSS v4, Lucide React
- **Visualisasi Grafis:** Recharts (Area, Bar, Composed Charts)
- **Engine Geospasial:** MapLibre GL
- **State Telemetri:** React Context Realtime Synchronization & Event Broadcast
- **Design System:** Obsidian Cyber-Intelligence HUD, Glassmorphism, Dual-Color Theming (Cyan Hydrology & Amber Pyrology)

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Prasyarat
- Node.js versi 18+ atau 20+
- npm atau pnpm

### 2. Instalasi & Menjalankan Dev Server
```bash
# Masuk ke direktori proyek
cd terraflux-ai

# Instal dependensi
npm install

# Jalankan server pengembangan
npm run dev
```

Buka peramban di [http://localhost:3000](http://localhost:3000).

### 3. Pengecekan Type Safety & Build
```bash
# Verifikasi TypeScript
npx tsc --noEmit

# Jalankan build produksi
npm run build
```

---

## ⚖️ Transparansi Data & Pernyataan Integritas

TERRAFLUX AI dibangun sebagai purwarupa sistem pendukung keputusan (*decision-support system prototype*) berbasis data observasi geospasial, pemodelan screening transparan, dan skenario demonstratif akademik. 

Platform ini **tidak menggantikan** peringatan dini resmi dari instansi pemerintah (BMKG, BNPB, KLHK, atau BPBD daerah). Penetapan status darurat bencana, perintah evakuasi, dan komando penanganan fisik di lapangan sepenuhnya merupakan wewenang otoritas pemerintah Republik Indonesia yang berwenang.
