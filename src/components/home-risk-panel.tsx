"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight, MapPinned } from "lucide-react";
import { demoAreas, type DemoArea } from "@/lib/demo-data";
import { useRealtimeTelemetry } from "@/lib/realtime-telemetry";
import { getWildfireMetrics } from "@/lib/wildfire-data";

const riskColors: Record<DemoArea["riskLevel"], string> = {
  low: "#39C995",
  moderate: "#EBC66C",
  high: "#F29A55",
  "very-high": "#EF6472",
};

const riskLabels: Record<DemoArea["riskLevel"], string> = {
  low: "Rendah",
  moderate: "Sedang",
  high: "Tinggi",
  "very-high": "Sangat tinggi",
};

const longitudeBounds = { min: 94, max: 142 };
const latitudeBounds = { min: -12, max: 7 };

function getPlotPosition([longitude, latitude]: DemoArea["center"]) {
  return {
    left: `${((longitude - longitudeBounds.min) / (longitudeBounds.max - longitudeBounds.min)) * 100}%`,
    top: `${((latitudeBounds.max - latitude) / (latitudeBounds.max - latitudeBounds.min)) * 100}%`,
  };
}

export function HomeRiskPanel() {
  const { hazardMode } = useRealtimeTelemetry();
  const isWildfire = hazardMode === "wildfire";
  const [activeAreaId, setActiveAreaId] = useState("dki");
  const activeArea = useMemo(
    () => demoAreas.find((area) => area.id === activeAreaId) ?? demoAreas[0],
    [activeAreaId],
  );
  const wildfireMetrics = getWildfireMetrics(activeArea.id);
  const riskLevel = isWildfire ? wildfireMetrics.riskLevel : activeArea.riskLevel;
  const riskColor = riskColors[riskLevel];

  return (
    <section className="home-risk-panel" aria-label="Ringkasan cakupan risiko Indonesia">
      <div className="home-risk-panel-head">
        <div>
          <div className="home-panel-kicker">Jangkauan nasional</div>
          <h2 className="home-panel-title">Satu pandangan. Seluruh wilayah.</h2>
        </div>
        <div className="home-schematic-tag">
          <MapPinned aria-hidden="true" />
          Plot koordinat
        </div>
      </div>

      <div className="home-coverage">
        <div className="home-coverage-map" aria-label="Plot skematik pusat wilayah yang tercakup">
          <div className="home-map-grid" aria-hidden="true" />
          <div className="home-map-coordinate home-map-coordinate-top" aria-hidden="true">7° LU</div>
          <div className="home-map-coordinate home-map-coordinate-bottom" aria-hidden="true">12° LS</div>
          <div className="home-map-coordinate home-map-coordinate-left" aria-hidden="true">94° BT</div>
          <div className="home-map-coordinate home-map-coordinate-right" aria-hidden="true">142° BT</div>
          <svg className="home-map-arc" viewBox="0 0 600 270" preserveAspectRatio="none" aria-hidden="true">
            <path d="M31 177 C129 133 155 121 234 144 S364 191 444 138 S531 102 576 122" />
            <path d="M76 73 C164 94 218 69 299 93 S417 115 523 71" />
            <path d="M150 229 C225 194 312 218 371 190 S467 190 548 222" />
          </svg>

          {demoAreas.map((area) => {
            const selected = area.id === activeAreaId;
            return (
              <button
                key={area.id}
                type="button"
                className={`home-map-point${selected ? " is-selected" : ""}`}
                style={{
                  ...getPlotPosition(area.center),
                  "--point-color": riskColors[isWildfire ? getWildfireMetrics(area.id).riskLevel : area.riskLevel],
                } as CSSProperties}
                onClick={() => setActiveAreaId(area.id)}
                aria-label={`${area.name}, risiko ${riskLabels[isWildfire ? getWildfireMetrics(area.id).riskLevel : area.riskLevel]}`}
                aria-pressed={selected}
                title={`${area.name} · Risiko ${riskLabels[isWildfire ? getWildfireMetrics(area.id).riskLevel : area.riskLevel]}`}
              >
                <span />
              </button>
            );
          })}
          <div className="home-map-overlay-note">Pusat wilayah · skematik, indikator demonstrasi</div>
        </div>

        <div className="home-area-summary" aria-live="polite">
          <div className="home-area-summary-top">
            <div>
              <div className="home-panel-kicker">Sorotan wilayah</div>
              <h3>{activeArea.district}</h3>
              <p>{activeArea.name} <span>·</span> {activeArea.region}</p>
            </div>
            <span className="home-risk-badge" style={{ "--risk-color": riskColor } as CSSProperties}>
              <span />
              {riskLabels[riskLevel]}
            </span>
          </div>

          <div className="home-area-metrics">
            <div>
              <span>{isWildfire ? "Sinyal titik panas*" : "Hujan terindikasi"}</span>
              <strong>{isWildfire ? wildfireMetrics.hotspotSignals : activeArea.rainfallToday}<small>{isWildfire ? " sinyal" : " mm"}</small></strong>
            </div>
            <div>
              <span>{isWildfire ? "Indeks kekeringan*" : "Catatan historis"}</span>
              <strong>{isWildfire ? wildfireMetrics.drynessIndex : activeArea.floodObservations}<small>{isWildfire ? " /100" : " laporan"}</small></strong>
            </div>
            <div>
              <span>{isWildfire ? "Kecepatan angin*" : "Indeks drainase"}</span>
              <strong>{isWildfire ? wildfireMetrics.windSpeed : activeArea.drainageIndex}<small>{isWildfire ? " km/j" : " /100"}</small></strong>
            </div>
          </div>

          <div className="home-risk-scale">
            <div className="home-risk-scale-label"><span>{isWildfire ? "Indeks kerawanan*" : "Indikator risiko"}</span><strong>{riskLabels[riskLevel]}</strong></div>
            <div className="home-risk-scale-track">
              <span style={{ width: `${isWildfire ? wildfireMetrics.drynessIndex : Math.max(13, (activeArea.rainfallToday / 120) * 100)}%`, backgroundColor: riskColor }} />
            </div>
            <div className="home-risk-scale-foot"><span>Indikator demonstrasi</span><span>Pilih titik untuk melihat wilayah</span></div>
          </div>

          <Link href="/risk-map" className="home-panel-link">
            {isWildfire ? "Buka peta kerawanan" : "Buka peta risiko"} <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="home-panel-footnote">
        <span className="home-panel-footnote-dot" />
        <span>{demoAreas.length} titik pusat wilayah ditampilkan secara skematik. {isWildfire ? "Sinyal dan indeks kebakaran adalah data demonstrasi, bukan titik panas aktual." : "Bukan batas administrasi atau pantauan waktu nyata."}</span>
      </div>
    </section>
  );
}
