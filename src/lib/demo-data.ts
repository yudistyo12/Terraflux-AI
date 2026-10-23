export type RiskLevel = "low" | "moderate" | "high" | "very-high";

export type DemoArea = {
  id: string;
  name: string;
  district: string;
  region: string;
  center: [number, number];
  polygon: [number, number][];
  floodObservations: number;
  rainfallToday: number;
  rainfallAccumulation: number;
  riskLevel: RiskLevel;
  confidence: "Tinggi" | "Menengah" | "Rendah";
  dataFreshness: string;
  drainageIndex: number;
  greenCoverage: number;
  surfaceRunoff: number;
  terrain: string;
};

const provinceProfiles: Array<{
  id: string;
  name: string;
  district: string;
  region: string;
  center: [number, number];
  rainfallToday: number;
  rainfallAccumulation: number;
  floodObservations: number;
  drainageIndex: number;
  greenCoverage: number;
  surfaceRunoff: number;
  terrain: string;
}> = [
  { id: "aceh", name: "Aceh", district: "Banda Aceh", region: "Sumatera", center: [95.316, 5.551], rainfallToday: 86, rainfallAccumulation: 252, floodObservations: 18, drainageIndex: 61, greenCoverage: 36, surfaceRunoff: 67, terrain: "Daerah pesisir dan lembah sungai dengan curah hujan cepat meningkat." },
  { id: "sumut", name: "Sumatera Utara", district: "Medan", region: "Sumatera", center: [98.678, 3.595], rainfallToday: 82, rainfallAccumulation: 232, floodObservations: 16, drainageIndex: 58, greenCoverage: 29, surfaceRunoff: 66, terrain: "Wilayah perkotaan dan aliran sungai aktif dengan kombinasi tutupan lahan padat." },
  { id: "sumbar", name: "Sumatera Barat", district: "Padang", region: "Sumatera", center: [100.354, -0.949], rainfallToday: 72, rainfallAccumulation: 208, floodObservations: 13, drainageIndex: 63, greenCoverage: 42, surfaceRunoff: 52, terrain: "Topografi bergelombang dengan area urban di cekungan sungai." },
  { id: "riau", name: "Riau", district: "Pekanbaru", region: "Sumatera", center: [101.447, 0.507], rainfallToday: 76, rainfallAccumulation: 214, floodObservations: 12, drainageIndex: 60, greenCoverage: 34, surfaceRunoff: 58, terrain: "Titik meluap air di area urban dan jaringan drainase yang melambat." },
  { id: "jambi", name: "Jambi", district: "Jambi City", region: "Sumatera", center: [103.609, -1.610], rainfallToday: 68, rainfallAccumulation: 190, floodObservations: 9, drainageIndex: 66, greenCoverage: 41, surfaceRunoff: 55, terrain: "Wilayah sungai dan rawa dengan kapasitas retensi sedang." },
  { id: "sumsel", name: "Sumatera Selatan", district: "Palembang", region: "Sumatera", center: [104.775, -2.991], rainfallToday: 75, rainfallAccumulation: 240, floodObservations: 14, drainageIndex: 55, greenCoverage: 31, surfaceRunoff: 62, terrain: "Wilayah cekungan rendah di sekitar sungai besar dan kanal urban." },
  { id: "bengkulu", name: "Bengkulu", district: "Bengkulu", region: "Sumatera", center: [102.257, -3.792], rainfallToday: 70, rainfallAccumulation: 197, floodObservations: 8, drainageIndex: 68, greenCoverage: 45, surfaceRunoff: 49, terrain: "Berkurangnya ruang resapan di kawasan dataran terbuka yang berdekatan sungai." },
  { id: "lampung", name: "Lampung", district: "Bandar Lampung", region: "Sumatera", center: [105.258, -5.384], rainfallToday: 79, rainfallAccumulation: 218, floodObservations: 15, drainageIndex: 62, greenCoverage: 33, surfaceRunoff: 59, terrain: "Zona urban berpasir dan area cekungan dekat kanal serta rawa." },
  { id: "babel", name: "Kepulauan Bangka Belitung", district: "Pangkal Pinang", region: "Sumatera", center: [106.118, -2.124], rainfallToday: 63, rainfallAccumulation: 170, floodObservations: 7, drainageIndex: 71, greenCoverage: 51, surfaceRunoff: 44, terrain: "Drainase lokal cukup stabil, namun hujan tinggi dapat memicu limpasan di area padat." },
  { id: "kepri", name: "Kepulauan Riau", district: "Batam", region: "Sumatera", center: [104.030, 0.953], rainfallToday: 72, rainfallAccumulation: 204, floodObservations: 11, drainageIndex: 64, greenCoverage: 46, surfaceRunoff: 51, terrain: "Banyak area pesisir, saluran berdekatan dengan permukiman padat." },
  { id: "dki", name: "DKI Jakarta", district: "Jakarta Pusat", region: "Jawa", center: [106.845, -6.208], rainfallToday: 92, rainfallAccumulation: 308, floodObservations: 22, drainageIndex: 39, greenCoverage: 18, surfaceRunoff: 76, terrain: "Basin urban dengan drainase terbatas dan tutupan keras mendominasi." },
  { id: "jabar", name: "Jawa Barat", district: "Bandung", region: "Jawa", center: [107.619, -6.917], rainfallToday: 83, rainfallAccumulation: 272, floodObservations: 17, drainageIndex: 52, greenCoverage: 26, surfaceRunoff: 64, terrain: "Puncak topografi dan dataran rendah bertemu di zona urban yang rapat." },
  { id: "jateng", name: "Jawa Tengah", district: "Semarang", region: "Jawa", center: [110.420, -7.024], rainfallToday: 78, rainfallAccumulation: 246, floodObservations: 14, drainageIndex: 57, greenCoverage: 32, surfaceRunoff: 62, terrain: "Wilayah pesisir dan cekungan rendah dengan infrastruktur drainase tepi kota." },
  { id: "yogyakarta", name: "DI Yogyakarta", district: "Yogyakarta", region: "Jawa", center: [110.367, -7.797], rainfallToday: 70, rainfallAccumulation: 192, floodObservations: 10, drainageIndex: 64, greenCoverage: 41, surfaceRunoff: 54, terrain: "Area urban dan aliran sungai dengan kanal yang perlu pemeliharaan rutin." },
  { id: "jatim", name: "Jawa Timur", district: "Surabaya", region: "Jawa", center: [112.737, -7.257], rainfallToday: 81, rainfallAccumulation: 261, floodObservations: 19, drainageIndex: 49, greenCoverage: 28, surfaceRunoff: 68, terrain: "Koordinasi drainase, dataran rendah, dan urbanisasi cepat menekan kapasitas saluran." },
  { id: "banten", name: "Banten", district: "Tangerang", region: "Jawa", center: [106.631, -6.203], rainfallToday: 87, rainfallAccumulation: 288, floodObservations: 18, drainageIndex: 46, greenCoverage: 22, surfaceRunoff: 73, terrain: "Zona alur sungai dan permukiman padat yang tidak memiliki buffer cukup." },
  { id: "bali", name: "Bali", district: "Denpasar", region: "Nusa Tenggara", center: [115.188, -8.409], rainfallToday: 61, rainfallAccumulation: 164, floodObservations: 6, drainageIndex: 72, greenCoverage: 52, surfaceRunoff: 43, terrain: "Kawasan wisata dengan drainase terkelola baik, namun genangan lokal masih terjadi." },
  { id: "ntb", name: "Nusa Tenggara Barat", district: "Mataram", region: "Nusa Tenggara", center: [116.115, -8.650], rainfallToday: 74, rainfallAccumulation: 210, floodObservations: 12, drainageIndex: 60, greenCoverage: 38, surfaceRunoff: 57, terrain: "Curah hujan musiman kuat di wilayah cekungan dan aliran permukaan cepat." },
  { id: "ntt", name: "Nusa Tenggara Timur", district: "Kupang", region: "Nusa Tenggara", center: [123.591, -10.177], rainfallToday: 68, rainfallAccumulation: 188, floodObservations: 9, drainageIndex: 63, greenCoverage: 44, surfaceRunoff: 55, terrain: "Kawasan kering dengan risiko lokal tinggi saat hujan ekstrem di cekungan." },
  { id: "kalbar", name: "Kalimantan Barat", district: "Pontianak", region: "Kalimantan", center: [109.342, -0.026], rainfallToday: 90, rainfallAccumulation: 294, floodObservations: 20, drainageIndex: 50, greenCoverage: 34, surfaceRunoff: 69, terrain: "Wilayah rawa dan delta dengan aliran air yang membesar ketika hujan turun lama." },
  { id: "kalteng", name: "Kalimantan Tengah", district: "Palangka Raya", region: "Kalimantan", center: [113.921, -2.219], rainfallToday: 76, rainfallAccumulation: 214, floodObservations: 11, drainageIndex: 63, greenCoverage: 39, surfaceRunoff: 54, terrain: "Debit air tinggi di daerah rawa dan sungai berpotensi memicu banjir bandang." },
  { id: "kalsel", name: "Kalimantan Selatan", district: "Banjarmasin", region: "Kalimantan", center: [114.590, -3.319], rainfallToday: 88, rainfallAccumulation: 285, floodObservations: 18, drainageIndex: 51, greenCoverage: 31, surfaceRunoff: 70, terrain: "Dataran banjir dan wilayah rawa di sekitar kanal dengan perubahan tutupan lahan." },
  { id: "kaltim", name: "Kalimantan Timur", district: "Samarinda", region: "Kalimantan", center: [117.153, -0.502], rainfallToday: 81, rainfallAccumulation: 235, floodObservations: 15, drainageIndex: 57, greenCoverage: 37, surfaceRunoff: 60, terrain: "Zona urban di dekat sungai besar dengan musim hujan yang signifikan." },
  { id: "kaltara", name: "Kalimantan Utara", district: "Tarakan", region: "Kalimantan", center: [117.591, 3.327], rainfallToday: 74, rainfallAccumulation: 205, floodObservations: 9, drainageIndex: 66, greenCoverage: 43, surfaceRunoff: 49, terrain: "Area pesisir dan hutan transisi dengan kanal yang pernah meluap pada musim hujan." },
  { id: "sulut", name: "Sulawesi Utara", district: "Manado", region: "Sulawesi", center: [124.842, 1.458], rainfallToday: 73, rainfallAccumulation: 198, floodObservations: 8, drainageIndex: 67, greenCoverage: 48, surfaceRunoff: 48, terrain: "Bentang alam bergelombang membuat aliran cepat, namun beberapa cekungan urban masih rawan." },
  { id: "sulteng", name: "Sulawesi Tengah", district: "Palu", region: "Sulawesi", center: [119.868, -0.894], rainfallToday: 84, rainfallAccumulation: 250, floodObservations: 17, drainageIndex: 53, greenCoverage: 31, surfaceRunoff: 66, terrain: "Dekat lembah sungai dengan durasi hujan panjang dan kanal yang tersendat." },
  { id: "sulsel", name: "Sulawesi Selatan", district: "Makassar", region: "Sulawesi", center: [119.431, -5.139], rainfallToday: 80, rainfallAccumulation: 244, floodObservations: 15, drainageIndex: 56, greenCoverage: 34, surfaceRunoff: 63, terrain: "Wilayah perkotaan dekat muara sungai dengan kondisi drainase campuran." },
  { id: "sultenggara", name: "Sulawesi Tenggara", district: "Kendari", region: "Sulawesi", center: [122.594, -3.988], rainfallToday: 67, rainfallAccumulation: 180, floodObservations: 8, drainageIndex: 70, greenCoverage: 46, surfaceRunoff: 47, terrain: "Curah hujan musiman cukup tinggi, tetapi jaringan drainase relatif lebih stabil." },
  { id: "gorontalo", name: "Gorontalo", district: "Gorontalo", region: "Sulawesi", center: [121.056, 0.543], rainfallToday: 72, rainfallAccumulation: 196, floodObservations: 9, drainageIndex: 68, greenCoverage: 45, surfaceRunoff: 51, terrain: "Topografi landai dengan potensi genangan lokal saat hujan berulang." },
  { id: "sulbar", name: "Sulawesi Barat", district: "Mamuju", region: "Sulawesi", center: [118.866, -2.683], rainfallToday: 69, rainfallAccumulation: 186, floodObservations: 7, drainageIndex: 71, greenCoverage: 49, surfaceRunoff: 46, terrain: "Perbukitan yang beralih fungsi, dengan alur limpasan yang cepat di zona urban." },
  { id: "maluku", name: "Maluku", district: "Ambon", region: "Maluku", center: [128.183, -3.596], rainfallToday: 77, rainfallAccumulation: 214, floodObservations: 12, drainageIndex: 58, greenCoverage: 39, surfaceRunoff: 60, terrain: "Daerah pesisir dengan curah hujan tinggi dan saluran yang cepat terisi." },
  { id: "malut", name: "Maluku Utara", district: "Ternate", region: "Maluku", center: [127.373, 0.789], rainfallToday: 71, rainfallAccumulation: 200, floodObservations: 10, drainageIndex: 65, greenCoverage: 42, surfaceRunoff: 52, terrain: "Wilayah pulau kecil dengan curah hujan lokal yang dapat memicu genangan singkat." },
  { id: "papbar", name: "Papua Barat", district: "Manokwari", region: "Papua", center: [134.064, -0.861], rainfallToday: 82, rainfallAccumulation: 268, floodObservations: 15, drainageIndex: 54, greenCoverage: 37, surfaceRunoff: 64, terrain: "Drainase pegunungan dan wilayah pesisir menghadapi limpasan cepat saat hujan lebat." },
  { id: "papua", name: "Papua", district: "Jayapura", region: "Papua", center: [140.707, -2.548], rainfallToday: 88, rainfallAccumulation: 292, floodObservations: 19, drainageIndex: 49, greenCoverage: 33, surfaceRunoff: 71, terrain: "Daerah pegunungan dan sungai besar menimbulkan risiko banjir di kota-kota di sisi lembah." },
];

const buildPolygon = (center: [number, number], width = 0.85, height = 0.6): [number, number][] => {
  const [lng, lat] = center;
  return [
    [lng - width, lat - height],
    [lng + width, lat - height],
    [lng + width * 1.2, lat - height * 0.3],
    [lng + width * 1.1, lat + height * 1.1],
    [lng, lat + height * 1.5],
    [lng - width * 1.1, lat + height * 1.1],
    [lng - width * 1.2, lat],
    [lng - width * 0.8, lat - height * 0.8],
  ];
};

export const demoAreas: DemoArea[] = provinceProfiles.map((profile) => {
  const riskScore = Math.min(100, Math.round(profile.rainfallToday * 0.42 + profile.floodObservations * 1.7 + (100 - profile.drainageIndex) * 0.6 + profile.surfaceRunoff * 0.5));

  let riskLevel: RiskLevel = "low";
  if (riskScore >= 78) riskLevel = "very-high";
  else if (riskScore >= 62) riskLevel = "high";
  else if (riskScore >= 45) riskLevel = "moderate";

  let confidence: DemoArea["confidence"] = "Menengah";
  if (profile.drainageIndex <= 52 || profile.rainfallToday >= 80) confidence = "Tinggi";
  else if (profile.drainageIndex >= 70) confidence = "Rendah";

  return {
    id: profile.id,
    name: profile.name,
    district: profile.district,
    region: profile.region,
    center: profile.center,
    polygon: buildPolygon(profile.center),
    floodObservations: profile.floodObservations,
    rainfallToday: profile.rainfallToday,
    rainfallAccumulation: profile.rainfallAccumulation,
    riskLevel,
    confidence,
    dataFreshness: "15 menit yang lalu",
    drainageIndex: profile.drainageIndex,
    greenCoverage: profile.greenCoverage,
    surfaceRunoff: profile.surfaceRunoff,
    terrain: profile.terrain,
  };
});

export const rainfallTrend = [
  { name: "Senin", rainfall: 42, baseline: 28 },
  { name: "Selasa", rainfall: 54, baseline: 30 },
  { name: "Rabu", rainfall: 63, baseline: 35 },
  { name: "Kamis", rainfall: 71, baseline: 39 },
  { name: "Jumat", rainfall: 87, baseline: 42 },
  { name: "Sabtu", rainfall: 92, baseline: 44 },
  { name: "Minggu", rainfall: 76, baseline: 41 },
];

export const regionalComparison = [
  { name: "Jakarta", score: 91, observations: 22 },
  { name: "Banten", score: 86, observations: 18 },
  { name: "Jawa Barat", score: 82, observations: 17 },
  { name: "Kalimantan Barat", score: 80, observations: 20 },
  { name: "Jawa Timur", score: 76, observations: 19 },
  { name: "Papua", score: 74, observations: 19 },
];

export const historyReports = [
  {
    id: "rep-101",
    title: "Genangan di jalur utama Jakarta Utara",
    date: "2026-10-08",
    area: "DKI Jakarta",
    source: "Laporan warga dan sensor urban",
    status: "Terverifikasi",
    value: "44 cm",
    description: "Debit limpasan tinggi pada saat hujan 90 mm/jam dan kapasitas drainase turun." ,
  },
  {
    id: "rep-102",
    title: "Banjir lokal di kawasan pesisir Kalimantan Barat",
    date: "2026-10-07",
    area: "Kalimantan Barat",
    source: "Observasi satelit dan wawancara lapangan",
    status: "Terverifikasi",
    value: "32 cm",
    description: "Banjir pendangkalan alur sungai dan kejenuhan saluran di titik yang terkurung jaringan." ,
  },
  {
    id: "rep-103",
    title: "Limbah dan sedimentasi membuat drainase tersendat",
    date: "2026-10-04",
    area: "Jawa Barat",
    source: "Laporan komunitas dan perangkat monitoring",
    status: "Belum diverifikasi",
    value: "26 cm",
    description: "Hujan berulang mempercepat akumulasi aliran permukaan dari wilayah yang tidak teraliri dengan baik." ,
  },
  {
    id: "rep-104",
    title: "Puncak limpasan di daerah delta dan rawa",
    date: "2026-09-29",
    area: "Kalimantan Selatan",
    source: "Pemantauan lingkungan dan data kanal",
    status: "Terverifikasi",
    value: "38 cm",
    description: "Area dataran rendah menghadapi penumpukan air dengan laju turun hujan yang konsisten." ,
  },
];

export const observations = [
  {
    id: "obs-1",
    label: "Curah hujan 1 jam",
    value: "92 mm",
    source: "BMKG nasional dan jaringan urban",
    time: "08:45 WIB",
    type: "Terukur",
  },
  {
    id: "obs-2",
    label: "Akumulasi 7 hari",
    value: "308 mm",
    source: "Model agregat curah hujan",
    time: "Periode 7 hari",
    type: "Dihitung",
  },
  {
    id: "obs-3",
    label: "Kepadatan genangan potensial",
    value: "81/100",
    source: "Screening geospasial",
    time: "Hasil model",
    type: "Simulasi",
  },
  {
    id: "obs-4",
    label: "Ketersediaan ruang resapan",
    value: "18%",
    source: "Pemetaan tutupan lahan",
    time: "Update harian",
    type: "Indikator",
  },
];

export const recommendations = [
  {
    id: "rec-1",
    area: "DKI Jakarta",
    issue: "Bottleneck drainase dan kapasitas saluran yang terus menurun",
    action: "Prioritaskan pembersihan dan pelebaran saluran utama di koridor padat penduduk.",
    reason: "Curah hujan tinggi, indeks drainase buruk, dan catatan genangan terbanyak terjadi pada area ini.",
    uncertainty: "Data detail jaringan bawah tanah masih perlu diverifikasi di beberapa titik kritis.",
    source: "Model risiko, sensor hujan, dan laporan tersebar",
    priority: "Prioritas tinggi",
  },
  {
    id: "rec-2",
    area: "Kalimantan Barat",
    issue: "Cadangan retensi dan daya tampung kanal tidak sebanding dengan debit hujan lama",
    action: "Tingkatkan ruang retensi bantaran sungai dan perkuat pengelolaan aliran di zona rawa.",
    reason: "Wilayah pesisir dan delta menghadapi lonjakan limpasan saat hujan periodik berlangsung lama.",
    uncertainty: "Kebutuhan infrastruktur akan bergantung pada intensitas dan durasi hujan dari model musiman.",
    source: "Pola hujan, data muka air, dan observasi zona rawa",
    priority: "Prioritas tinggi",
  },
  {
    id: "rec-3",
    area: "Jawa Barat",
    issue: "Limpasan cepat dari wilayah pegunungan dan lahan padat",
    action: "Kombinasikan normalisasi sungai dengan penyediaan ruang resapan di wilayah hulu dan tengah kota.",
    reason: "Koordinasi antara daerah dengan fluktuasi topografi dan urbanisasi yang cepat meningkatkan hambatan aliran.",
    uncertainty: "Perlunya pemantauan di beberapa sub-wilayah untuk mengukur efek intervensi sungai.",
    source: "Analisis hidrologi, topografi, dan estimasi aliran",
    priority: "Prioritas menengah",
  },
];

export const systemStatus = {
  mode: "Operational simulation",
  dataProvider: "Dataset simulasi Indonesia dengan transparansi sumber dan pembatasan penggunaan jelas",
  lastUpdated: "2026-10-11T08:45:00+07:00",
  providerStatus: "Sistem live-refresh terisi otomatis untuk seluruh wilayah Indonesia",
};

export const analysisInputs = [
  "Curah hujan 1 jam",
  "Akumulasi 7 hari",
  "Lahan terbuka dan ruang resapan",
  "Indeks drainase",
  "Laporan terdokumentasi",
];

export const scenarioProfiles = [
  { label: "Baseline", value: 0 },
  { label: "Penanganan ringan", value: 15 },
  { label: "Penanganan menengah", value: 30 },
  { label: "Intervensi agresif", value: 50 },
];
