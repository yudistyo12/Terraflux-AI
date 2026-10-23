import { demoAreas } from "@/lib/demo-data";
import { getWildfireMetrics } from "@/lib/wildfire-data";

const errorResponse = (message: string, status: number) =>
  Response.json({ status: "error", message }, { status });

export async function POST(request: Request) {
  const payload: unknown = await request.json().catch(() => null);
  if (typeof payload !== "object" || payload === null) {
    return errorResponse("Payload simulasi tidak valid.", 400);
  }

  const body = payload as Record<string, unknown>;
  if (typeof body.areaId !== "string") {
    return errorResponse("Pilih wilayah yang tersedia sebelum menjalankan simulasi.", 400);
  }
  const area = demoAreas.find((item) => item.id === body.areaId);
  if (!area) {
    return errorResponse("Wilayah yang dipilih tidak tersedia.", 400);
  }

  const hazardMode = body.hazardMode === "wildfire" ? "wildfire" : "flood";

  if (hazardMode === "wildfire") {
    const wf = getWildfireMetrics(area.id);

    const firebreak = typeof body.firebreak === "number" ? Math.max(0, Math.min(100, body.firebreak)) : 40;
    const canalBlocking = typeof body.canalBlocking === "number" ? Math.max(0, Math.min(100, body.canalBlocking)) : 35;
    const patrolResponse = typeof body.patrolResponse === "number" ? Math.max(0, Math.min(100, body.patrolResponse)) : 30;
    const windSpeed = typeof body.windSimulation === "number" ? Math.max(5, Math.min(50, body.windSimulation)) : wf.windSpeed;

    const baseline = Math.min(
      100,
      Math.max(
        15,
        wf.drynessIndex * 0.42 +
          wf.hotspotSignals * 1.5 +
          windSpeed * 0.8 +
          wf.peatlandIndex * 0.2
      )
    );

    const reductionPoints = firebreak * 0.28 + canalBlocking * 0.34 + patrolResponse * 0.22;
    const modified = Math.min(100, Math.max(10, baseline - reductionPoints));
    const delta = Number((baseline - modified).toFixed(1));

    return Response.json({
      area: area.name,
      hazardMode: "wildfire",
      baseline: Number(baseline.toFixed(1)),
      modified: Number(modified.toFixed(1)),
      delta,
      reductionPercent: Math.max(0, Math.round((delta / baseline) * 100)),
      label: "Simulasi konseptual mitigasi karhutla — bukan kalkulasi perambatan api fisik langsung",
      assumptions: [
        `Skor dasar menggunakan indeks kekeringan (${wf.drynessIndex}/100), titik panas aktif (${wf.hotspotSignals}), dan kerentanan gambut (${wf.peatlandIndex}/100).`,
        `Sekat bakar selebar ${firebreak} meter mengisolasi transmisi bahan bakar semak permukaan.`,
        `Sekat kanal ${canalBlocking}% menaikkan retensi air untuk membasahi kubah gambut bawah tanah.`,
        `Respon patroli ${patrolResponse}% memangkas waktu tanggap pemadaman api awal.`,
      ],
    });
  }

  // FLOOD SIMULATION
  const parameters = [
    ["drainageCapacity", "Kapasitas drainase"],
    ["greenCoverage", "Cakupan infrastruktur hijau"],
    ["retentionCapacity", "Kapasitas retensi air"],
  ] as const;
  const parameterValues: Record<(typeof parameters)[number][0], number> = {
    drainageCapacity: 0,
    greenCoverage: 0,
    retentionCapacity: 0,
  };

  for (const [key, label] of parameters) {
    const value = body[key];
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 100) {
      return errorResponse(`${label} harus berupa angka antara 0 dan 100.`, 400);
    }
    parameterValues[key] = value;
  }

  const rain = body.rainfallIntensity;
  if (typeof rain !== "number" || !Number.isFinite(rain) || rain < 40 || rain > 120) {
    return errorResponse("Intensitas hujan harus berupa angka antara 40 dan 120 mm/jam.", 400);
  }

  const baseline = Math.min(100, Math.max(0,
    rain * 0.42 +
    (100 - area.drainageIndex) * 0.29 +
    (100 - area.greenCoverage) * 0.18 +
    area.surfaceRunoff * 0.12,
  ));
  const modified = Math.min(100, Math.max(0,
    rain * 0.42 +
    (100 - parameterValues.drainageCapacity) * 0.29 +
    (100 - parameterValues.greenCoverage) * 0.18 +
    (100 - parameterValues.retentionCapacity) * 0.12,
  ));
  const delta = Number((baseline - modified).toFixed(1));

  return Response.json({
    area: area.name,
    hazardMode: "flood",
    baseline: Number(baseline.toFixed(1)),
    modified: Number(modified.toFixed(1)),
    delta,
    reductionPercent: Math.max(0, Math.round((delta / baseline) * 100)),
    label: "Simulasi konseptual mitigasi banjir perkotaan — bukan prediksi genangan aktual",
    assumptions: [
      "Skor dasar menggunakan indikator drainase, tutupan hijau, limpasan, dan hujan wilayah terpilih.",
      "Skenario intervensi mengubah parameter drainase, infrastruktur hijau, dan retensi air.",
      "Skor dibatasi pada rentang 0–100 dan tidak menggantikan pemodelan hidrologi terkalibrasi.",
    ],
  });
}
