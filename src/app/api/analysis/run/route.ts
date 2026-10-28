import { demoAreas } from "@/lib/demo-data";
import { getWildfireMetrics } from "@/lib/wildfire-data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const area = demoAreas.find((item) => item.id === body.areaId) ?? demoAreas[0];
    const period = body.period ?? "7 hari";
    const hazardMode = body.hazardMode === "wildfire" ? "wildfire" : "flood";

    if (hazardMode === "wildfire") {
      const wf = getWildfireMetrics(area.id);
      const score = Math.min(
        98,
        Math.max(
          28,
          Math.round(
            wf.drynessIndex * 0.42 +
              wf.hotspotSignals * 1.8 +
              wf.windSpeed * 0.75 +
              wf.peatlandIndex * 0.2
          )
        )
      );

      const category =
        score >= 80
          ? "Siaga 1 (Darurat Karhutla Kritis)"
          : score >= 60
          ? "Siaga 2 (Perhatian Tinggi)"
          : "Siaga 3 (Pemantauan Rutin)";

      return Response.json({
        analysisId: `WF-${area.id.toUpperCase()}-${Date.now()}`,
        selectedArea: area.name,
        hazardMode: "wildfire",
        dataset: "demo-wildfire-neural-mesh",
        method: "Screening risiko karhutla berbasis FWI, anomali termal satelit, & karakteristik gambut",
        category,
        score,
        summary: `Untuk periode ${period}, wilayah ${area.name} (${area.district}) menunjukkan potensi perambatan api ${score}/100. Hal ini dipicu oleh indeks kekeringan ${wf.drynessIndex}/100, deteksi ${wf.hotspotSignals} titik panas satelit, dan kecepatan angin ${wf.windSpeed} km/jam yang bertiup ke arah ${wf.windDirection}.`,
        indicators: [
          { label: "Titik Panas Satelit", value: `${wf.hotspotSignals} Sinyal` },
          { label: "Indeks Kekeringan (KBDI)", value: `${wf.drynessIndex} / 100` },
          { label: "Kecepatan Angin", value: `${wf.windSpeed} km/jam` },
          { label: "Kerentanan Gambut", value: `${wf.peatlandIndex} / 100` },
        ],
        metricTitle: "Estimasi Laju Rambatan Api",
        metricValue: score >= 80 ? "2.4 - 4.8 km/jam" : "0.8 - 1.8 km/jam",
        confidence: score >= 80 ? "97.4% (Tinggi)" : "94.8% (Tinggi)",
        actionablePlaybook:
          score >= 80
            ? "Operasikan water bombing heli BNPB, isolasi sekat bakar di perbatasan hutan lindung, dan lakukan pembasahan gambut intensif bersama Manggala Agni."
            : "Tingkatkan patroli darat regu Manggala Agni, siagakan kelompok Masyarakat Peduli Api (MPA), dan pantau terus anomali termal satelit.",
        weights: [
          { factor: "Indeks Kekeringan (KBDI)", weight: "40%" },
          { factor: "Anomali Termal Satelit", weight: "30%" },
          { factor: "Kecepatan & Arah Angin", weight: "20%" },
          { factor: "Tutupan Bahan Bakar Gambut", weight: "10%" },
        ],
        warning:
          "Hasil ini adalah model screening konseptual berbasis dataset demonstrasi akademik. Keputusan pemadaman darurat dan penetapan status siaga resmi merupakan kewenangan Satgas Karhutla BNPB, KLHK, dan BPBD setempat.",
        generatedAt: new Date().toISOString(),
      });
    }

    // FLOOD MODE
    const score = Math.min(
      98,
      Math.max(
        38,
        Math.round(
          area.rainfallToday * 0.38 +
            area.surfaceRunoff * 0.28 +
            (100 - area.drainageIndex) * 0.22 +
            area.floodObservations * 0.8
        )
      )
    );

    const category =
      score >= 78
        ? "Siaga 1 (Perhatian Sangat Tinggi)"
        : score >= 60
        ? "Siaga 2 (Perhatian Menengah)"
        : "Siaga 3 (Monitoring)";

    return Response.json({
      analysisId: `FL-${area.id.toUpperCase()}-${Date.now()}`,
      selectedArea: area.name,
      hazardMode: "flood",
      dataset: "demo-flood-screening-model",
      method: "Screening risiko banjir berbasis debit hidrometeorologis & defisit drainase",
      category,
      score,
      summary: `Selama ${period}, wilayah ${area.name} (${area.district}) menunjukkan konsentrasi limpasan permukaan ${area.surfaceRunoff}% dengan curah hujan ${area.rainfallToday} mm/jam. Kapasitas drainase ${area.drainageIndex}/100 membatasi laju penyerapan air alami.`,
      metricTitle: "Estimasi Tinggi Genangan Air",
      metricValue: score >= 78 ? "45 - 90 cm" : "15 - 35 cm",
      confidence: score >= 78 ? "96.8% (Tinggi)" : "93.5% (Tinggi)",
      actionablePlaybook:
        score >= 78
          ? "Aktifkan seluruh pompa polder darurat zona kritis, tutup pintu air pengendali pasang laut, kuras sedimentasi saluran primer, dan siapkan posko evakuasi mandiri BPBD."
          : "Lakukan pembersihan sampah penyaring drainase, monitor elevasi sensor TMA secara berkala, dan siagakan tim satgas banjir kelurahan.",
      indicators: [
        { label: "Curah Hujan Terukur", value: `${area.rainfallToday} mm/jam` },
        { label: "Kapasitas Drainase", value: `${area.drainageIndex} / 100` },
        { label: "Limpasan Permukaan (Runoff)", value: `${area.surfaceRunoff}%` },
        { label: "Cakupan Resapan Hijau", value: `${area.greenCoverage}%` },
      ],
      weights: [
        { factor: "Intensitas Curah Hujan", weight: "40%" },
        { factor: "Defisit Kapasitas Drainase", weight: "30%" },
        { factor: "Koefisien Limpasan Cekungan", weight: "20%" },
        { factor: "Observasi Historis Genangan", weight: "10%" },
      ],
      warning:
        "Hasil ini adalah model screening risiko berbasis data simulasi hidrologis perkotaan. Penetapan status siaga banjir resmi mengacu pada pengumuman BPBD dan instansi teknis berwenang.",
      generatedAt: new Date().toISOString(),
    });
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Input analisis tidak valid. Mohon periksa parameter dan coba lagi.",
      },
      { status: 400 }
    );
  }
}
