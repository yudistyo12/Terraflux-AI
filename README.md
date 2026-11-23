<<<<<<< HEAD
# TERRAFLUX AI — Dashboard Geospasial Interaktif untuk Mitigasi Risiko Banjir & Kebakaran Hutan dan Lahan
=======
# TERRAFLUX AI — Platform Intelijen Geospasial & Mitigasi Banjir Indonesia
>>>>>>> 9c5e308 (feat: complete redesign to clean institutional data intelligence, focus 100% on flood mitigation, eliminate AI slop, add 4-step decision workflow)

**TERRAFLUX AI** adalah platform *Hydrological Disaster Risk Intelligence* generasi berikutnya yang menggabungkan analitik geospasial presisi, telemetri lingkungan *real-time*, model skrining neural transparan (*Explainable AI*), dan simulator mitigasi tata air (*What-If Engine*) untuk 34 Provinsi di Indonesia.

Dirancang untuk kompetisi inovasi teknologi dan kesiapsiagaan operasional pemangku kebijakan (BPBD, BNPB, dan Dinas PUPR), TERRAFLUX AI beroperasi dengan standar estetika antarmuka bersih (*Clean Professional Data Intelligence*) serta transparansi data (*transparent data provenance*).

---

<<<<<<< HEAD
## Fitur Utama Platform

### 1. Sistem Multi-Bencana (Multi-Hazard Architecture)
Dukungan penuh untuk dua ancaman hidrometeorologis dan iklim terbesar di Indonesia yang dapat diganti secara instan di seluruh ekosistem aplikasi:
- **Banjir Perkotaan & Daerah Aliran Sungai (DAS):** Analisis curah hujan radar, kapasitas drainase perkotaan, koefisien limpasan cekungan (*surface runoff*), dan sensor Tinggi Muka Air (TMA).
- **Kebakaran Hutan & Lahan Gambut (Karhutla):** Deteksi radiasi termal satelit (MODIS / VIIRS), indeks kekeringan serasah (*Keetch-Byram Drought Index / FWI*), vektor kecepatan angin, dan kerentanan kubah gambut dalam (*peatland*).
=======
## 🌊 Fitur Utama Platform

### 1. Sistem Intelijen Banjir Terpadu (Hydrological Intelligence)
Analisis menyeluruh mencakup:
- **Presipitasi Curah Hujan Radar:** Intensitas hujan per jam (mm/jam) dan akumulasi presipitasi 24 jam berbasis radar BMKG.
- **Kapasitas Drainase Perkotaan:** Rasio daya tampung saluran primer, sekunder, dan kapasitas stasiun pompa polder.
- **Koefisien Limpasan Cekungan (*Surface Runoff*):** Pemetaan permukaan kedap air dan defisit ruang resapan air.
- **Sensor Tinggi Muka Air (TMA):** Integrasi telemetri pintu air hidrometri pengendali banjir.
>>>>>>> 9c5e308 (feat: complete redesign to clean institutional data intelligence, focus 100% on flood mitigation, eliminate AI slop, add 4-step decision workflow)

### 2. Cakupan 34 Provinsi Seluruh Indonesia
Database geospasial mencakup seluruh 34 provinsi di Indonesia:
- Dari Aceh, DKI Jakarta, Jawa Barat, Kalimantan Barat, hingga Papua.
- Dilengkapi koordinat geospasial presisi, karakteristik bentang alam lokal (*terrain context*), dan nilai telemetri terkalibrasi.

### 3. What-If Mitigation Engine
Simulator intervensi rekayasa tata air interaktif dengan umpan balik terukur:
- **Simulasi Pompa Polder:** Peningkatan kapasitas debit pembuangan air di zona kritis cekungan.
- **Simulasi Sponge City:** Ekspansi Ruang Terbuka Hijau (RTH) dan bioswale untuk peresapan air alami.
- **Simulasi Kolam Retensi:** Pengujian kapasitas tampung waduk pengendali debit banjir puncak.

### 4. Explainable AI & Non-Blackbox Neural Screening
- Transparansi pembobotan indikator (*Feature Weight Decomposition*: 40% curah hujan, 30% defisit drainase, 20% limpasan, 10% observasi TMA).
- Sintesis laporan diagnosis berstandar satgas bencana dengan klasifikasi Siaga 1, Siaga 2, dan Siaga 3.

### 5. Peta Risiko Geospasial Interaktif (MapLibre GL)
- Peta vektor berkinerja tinggi dengan kemampuan toggle layer: Indeks Risiko Genangan, Intensitas Curah Hujan, dan Alur Drainase / Polder.
- Fitur pencarian cepat dan navigasi kamera *fly-to* wilayah sasaran.

### 6. Actionable Multi-Agency Playbooks & Arsip Historis
- Panduan taktis terstruktur untuk respon cepat tim gabungan BPBD dan dinas teknis di lapangan.
- Basis data historis banjir terdokumentasi untuk keperluan validasi model.

---

## Keselarasan dengan UN Sustainable Development Goals (SDGs)

1. **SDG 11: Kota dan Komunitas yang Berkelanjutan (Target 11.5)**  
   Mengurangi kerugian ekonomi dan risiko korban jiwa akibat bencana hidrometeorologis perkotaan melalui pemodelan tata air presisi.
2. **SDG 13: Penanganan Perubahan Iklim (Target 13.1)**  
   Memperkuat ketahanan dan kapasitas adaptasi terhadap bencana cuaca ekstrem yang dipicu pemanasan global dan anomali siklus iklim.

---

## Arsitektur & Teknologi

- **Framework:** Next.js (App Router)
- **Library UI:** React, Tailwind CSS, Lucide React
- **Visualisasi Grafis:** Recharts (Area & Bar Charts)
- **Engine Geospasial:** MapLibre GL & WebGL
- **Design System:** Clean Professional Data Intelligence, Light Mode, Semantic Risk Indicators
- **State Management:** React Context Realtime Telemetry Synchronization

---

## Panduan Menjalankan Aplikasi

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

---

## Transparansi Data & Pernyataan Integritas

TERRAFLUX AI dibangun sebagai purwarupa sistem pendukung keputusan (*decision-support system prototype*) berbasis data observasi geospasial, pemodelan skrining transparan, dan simulasi akademik. 

Platform ini **tidak menggantikan** peringatan dini resmi dari instansi pemerintah (BMKG, BNPB, atau BPBD setempat). Penetapan status darurat bencana, perintah evakuasi, dan komando penanganan fisik di lapangan sepenuhnya merupakan wewenang otoritas pemerintah Republik Indonesia yang berwenang.
