export async function GET() {
  return Response.json({
    status: "ok",
    mode: "demo",
    lastUpdated: "2026-10-11T08:45:00+07:00",
    providerStatus: "Dataset demo terverifikasi tersedia",
  });
}
