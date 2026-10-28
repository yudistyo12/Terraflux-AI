"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Search, RotateCcw, Layers3, Flame, Waves, Wind, Compass, ShieldAlert, ArrowUpRight } from "lucide-react";
import { demoAreas, type DemoArea } from "@/lib/demo-data";
import { useHazardControl } from "@/lib/realtime-telemetry";
import { getWildfireMetrics } from "@/lib/wildfire-data";

const riskColors: Record<DemoArea["riskLevel"], string> = {
  low: "#2DBE83",
  moderate: "#E9C46A",
  high: "#F49B4A",
  "very-high": "#E85D68",
};

const riskLabels: Record<DemoArea["riskLevel"], string> = {
  low: "Rendah",
  moderate: "Sedang",
  high: "Tinggi",
  "very-high": "Sangat tinggi",
};

export function FloodMap() {
  const { selectedProvinceId, setSelectedProvinceId, hazardMode } = useHazardControl();
  const isWildfire = hazardMode === "wildfire";

  const layerOptions = isWildfire
    ? [
        { id: "risk", label: "Titik Panas Satelit (Hotspot)", color: "#E85D68" },
        { id: "rainfall", label: "Indeks Kekeringan (KBDI)", color: "#F97316" },
        { id: "waterways", label: "Vektor Angin & Lintasan Asap", color: "#FCD34D" },
      ]
    : [
        { id: "risk", label: "Indeks Risiko Banjir", color: "#F49B4A" },
        { id: "rainfall", label: "Intensitas Curah Hujan", color: "#55D6E8" },
        { id: "waterways", label: "Alur Sungai & Drainase", color: "#5FE0C2" },
      ];

  const getRiskLevel = useCallback(
    (area: DemoArea) => (isWildfire ? getWildfireMetrics(area.id).riskLevel : area.riskLevel),
    [isWildfire]
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const riskMarkersRef = useRef<maplibregl.Marker[]>([]);
  const dotsRef = useRef<HTMLSpanElement[]>([]);
  const labelsRef = useRef<HTMLSpanElement[]>([]);
  const setSelectedProvinceIdRef = useRef(setSelectedProvinceId);
  const isWildfireRef = useRef(isWildfire);

  // Single source of truth from telemetry
  const activeAreaId = selectedProvinceId || "dki";
  const activeAreaIdRef = useRef(activeAreaId);

  useEffect(() => {
    setSelectedProvinceIdRef.current = setSelectedProvinceId;
    isWildfireRef.current = isWildfire;
    activeAreaIdRef.current = activeAreaId;
  }, [setSelectedProvinceId, isWildfire, activeAreaId]);

  const [searchValue, setSearchValue] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [mapStatus, setMapStatus] = useState<"loading" | "ready" | "error">("loading");
  const [layers, setLayers] = useState<Record<string, boolean>>({
    risk: true,
    rainfall: true,
    waterways: true,
  });

  const activeArea = useMemo(
    () => demoAreas.find((area) => area.id === activeAreaId) ?? demoAreas[0],
    [activeAreaId],
  );

  const activeWildfire = useMemo(() => {
    return getWildfireMetrics(activeArea.id);
  }, [activeArea.id]);

  // Synchronize camera when activeAreaId changes
  useEffect(() => {
    if (mapRef.current) {
      const target = demoAreas.find((a) => a.id === activeAreaId);
      if (target) {
        mapRef.current.flyTo({ center: target.center, zoom: 9, essential: true });
      }
    }
  }, [activeAreaId]);

  // Fast label visibility update helper without querying DOM
  const updateLabelVisibility = useCallback(() => {
    const isZoomed = (mapRef.current?.getZoom() ?? 0) >= 7.2;
    const curId = activeAreaIdRef.current;
    demoAreas.forEach((area, index) => {
      const label = labelsRef.current[index];
      if (label) {
        label.style.display = area.id === curId || isZoomed ? "inline" : "none";
      }
    });
  }, []);

  // Initialize Map ONCE on mount
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    maplibregl.setWorkerUrl("/api/maplibre-worker");

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          openstreetmap: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            maxzoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: "openstreetmap",
            type: "raster",
            source: "openstreetmap",
          },
        ],
      },
      center: [118, -2],
      zoom: 4.4,
      attributionControl: { compact: true },
    });

    mapRef.current = map;

    map.on("error", (event) => {
      if (!map.isStyleLoaded()) {
        console.error("Map style or worker failed to load:", event.error);
        setMapStatus("error");
      }
    });

    map.on("load", () => {
      setMapStatus("ready");

      dotsRef.current = [];
      labelsRef.current = [];

      riskMarkersRef.current = demoAreas.map((area, index) => {
        const markerElement = document.createElement("button");
        markerElement.type = "button";
        markerElement.className = "terraflux-risk-marker";
        const riskLevel = isWildfireRef.current ? getWildfireMetrics(area.id).riskLevel : area.riskLevel;
        const wf = getWildfireMetrics(area.id);
        markerElement.setAttribute("aria-label", `${area.name}, risiko ${riskLabels[riskLevel]}`);
        markerElement.title = `${area.name} · ${isWildfireRef.current ? `${wf.hotspotSignals} Titik Panas Satelit` : `Curah Hujan ${area.rainfallToday}mm/jam`}`;

        const markerDot = document.createElement("span");
        markerDot.className = "terraflux-risk-marker-dot";
        markerDot.style.backgroundColor = riskColors[riskLevel];
        dotsRef.current[index] = markerDot;

        const markerLabel = document.createElement("span");
        markerLabel.className = "terraflux-risk-marker-label";
        markerLabel.textContent = area.name;
        labelsRef.current[index] = markerLabel;

        markerElement.append(markerDot, markerLabel);
        markerElement.addEventListener("click", (event) => {
          event.stopPropagation();
          setSelectedProvinceIdRef.current(area.id);
          map.flyTo({ center: area.center, zoom: 9.5, essential: true });
        });

        return new maplibregl.Marker({ element: markerElement, anchor: "center" })
          .setLngLat(area.center)
          .addTo(map);
      });

      // Set initial selection
      riskMarkersRef.current.forEach((marker, index) => {
        const selected = demoAreas[index]?.id === activeAreaIdRef.current;
        marker.getElement().setAttribute("data-selected", selected ? "true" : "false");
      });
      updateLabelVisibility();

      // Throttled zoom update
      map.on("zoomend", updateLabelVisibility);

      // Synthetic dynamic hazard layers
      const riskFeatures = demoAreas.map((area) => {
        const wf = getWildfireMetrics(area.id);
        return {
          type: "Feature" as const,
          properties: {
            id: area.id,
            name: area.name,
            riskScore: isWildfireRef.current ? wf.fireSpreadRisk : area.surfaceRunoff,
            rainfallToday: area.rainfallToday,
            hotspots: wf.hotspotSignals,
          },
          geometry: {
            type: "Polygon" as const,
            coordinates: [
              [
                [area.center[0] - 0.28, area.center[1] - 0.24],
                [area.center[0] + 0.32, area.center[1] - 0.2],
                [area.center[0] + 0.24, area.center[1] + 0.28],
                [area.center[0] - 0.22, area.center[1] + 0.22],
                [area.center[0] - 0.28, area.center[1] - 0.24],
              ],
            ],
          },
        };
      });

      const waterwaysFeatures = demoAreas.map((area) => ({
        type: "Feature" as const,
        properties: { id: area.id, name: `${area.name} Corridor` },
        geometry: {
          type: "LineString" as const,
          coordinates: [
            [area.center[0] - 0.45, area.center[1] - 0.35],
            [area.center[0] - 0.15, area.center[1] - 0.08],
            [area.center[0] + 0.12, area.center[1] + 0.14],
            [area.center[0] + 0.42, area.center[1] + 0.32],
          ],
        },
      }));

      map.addSource("terraflux-risk-polygons", {
        type: "geojson",
        data: { type: "FeatureCollection", features: riskFeatures },
      });

      map.addSource("terraflux-waterways", {
        type: "geojson",
        data: { type: "FeatureCollection", features: waterwaysFeatures },
      });

      map.addLayer({
        id: "terraflux-risk-layer",
        type: "fill",
        source: "terraflux-risk-polygons",
        paint: {
          "fill-color": isWildfireRef.current ? "#F97316" : "#E85D68",
          "fill-opacity": 0.24,
        },
      });

      map.addLayer({
        id: "terraflux-rainfall-layer",
        type: "line",
        source: "terraflux-risk-polygons",
        paint: {
          "line-color": isWildfireRef.current ? "#FCD34D" : "#55D6E8",
          "line-width": 2.2,
          "line-dasharray": [2, 1.5],
        },
      });

      map.addLayer({
        id: "terraflux-waterways-layer",
        type: "line",
        source: "terraflux-waterways",
        paint: {
          "line-color": isWildfireRef.current ? "#EF4444" : "#5FE0C2",
          "line-width": 3,
        },
      });
    });

    return () => {
      riskMarkersRef.current.forEach((marker) => marker.remove());
      riskMarkersRef.current = [];
      dotsRef.current = [];
      labelsRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [updateLabelVisibility]);

  // Update styles smoothly in-place on mode change WITHOUT destroying map!
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (map.getLayer("terraflux-risk-layer")) {
      map.setPaintProperty("terraflux-risk-layer", "fill-color", isWildfire ? "#F97316" : "#E85D68");
    }
    if (map.getLayer("terraflux-rainfall-layer")) {
      map.setPaintProperty("terraflux-rainfall-layer", "line-color", isWildfire ? "#FCD34D" : "#55D6E8");
    }
    if (map.getLayer("terraflux-waterways-layer")) {
      map.setPaintProperty("terraflux-waterways-layer", "line-color", isWildfire ? "#EF4444" : "#5FE0C2");
    }

    demoAreas.forEach((area, index) => {
      const riskLevel = isWildfire ? getWildfireMetrics(area.id).riskLevel : area.riskLevel;
      const dot = dotsRef.current[index];
      if (dot) dot.style.backgroundColor = riskColors[riskLevel];
      const marker = riskMarkersRef.current[index];
      if (marker) {
        const wf = getWildfireMetrics(area.id);
        const el = marker.getElement();
        el.setAttribute("aria-label", `${area.name}, risiko ${riskLabels[riskLevel]}`);
        el.title = `${area.name} · ${isWildfire ? `${wf.hotspotSignals} Titik Panas Satelit` : `Curah Hujan ${area.rainfallToday}mm/jam`}`;
      }
    });
  }, [isWildfire]);

  // Toggle layers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (map.getLayer("terraflux-risk-layer")) {
      map.setLayoutProperty("terraflux-risk-layer", "visibility", layers.risk ? "visible" : "none");
    }
    if (map.getLayer("terraflux-rainfall-layer")) {
      map.setLayoutProperty("terraflux-rainfall-layer", "visibility", layers.rainfall ? "visible" : "none");
    }
    if (map.getLayer("terraflux-waterways-layer")) {
      map.setLayoutProperty("terraflux-waterways-layer", "visibility", layers.waterways ? "visible" : "none");
    }
  }, [layers]);

  // Update selection indicator on markers
  useEffect(() => {
    riskMarkersRef.current.forEach((marker, index) => {
      const selected = demoAreas[index]?.id === activeAreaId;
      marker.getElement().setAttribute("data-selected", selected ? "true" : "false");
    });
    updateLabelVisibility();
  }, [activeAreaId, updateLabelVisibility]);

  const handleSearch = () => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return;

    const area = demoAreas.find(
      (entry) =>
        entry.name.toLowerCase().includes(query) ||
        entry.district.toLowerCase().includes(query) ||
        entry.region.toLowerCase().includes(query),
    );
    if (area) {
      setSearchMessage("");
      setSelectedProvinceId(area.id);
      mapRef.current?.flyTo({ center: area.center, zoom: 9.5, essential: true });
    } else {
      setSearchMessage("Wilayah tidak ditemukan dalam cakupan 34 provinsi.");
    }
  };

  const activeRiskLevel = getRiskLevel(activeArea);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.75fr_0.95fr] items-start">
      {/* Map Main Viewport */}
      <div className="overflow-hidden rounded-[24px] border border-white/10 bg-slate-900/85 shadow-2xl shadow-cyan-950/30">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-slate-950/80 px-3.5 py-2.5">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
            {isWildfire ? (
              <Flame className="h-4 w-4 text-amber-400" />
            ) : (
              <Waves className="h-4 w-4 text-cyan-300" />
            )}
            <span className="font-bold text-white text-xs sm:text-sm">
              {isWildfire
                ? "Peta Geospasial Karhutla & Gambut Indonesia"
                : "Peta Geospasial Risiko Banjir & Hidrologi Indonesia"}
            </span>
            <span className={`rounded-full border px-2 py-0.5 text-[9.5px] font-mono uppercase font-bold tracking-wider ${
              isWildfire ? "bg-amber-500/10 border-amber-400/30 text-amber-300" : "bg-cyan-500/10 border-cyan-400/30 text-cyan-200"
            }`}>
              {isWildfire ? "KARHUTLA" : "BANJIR"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                value={searchValue}
                onChange={(event) => {
                  setSearchValue(event.target.value);
                  setSearchMessage("");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleSearch();
                }}
                placeholder="Cari provinsi/kota..."
                aria-label="Cari provinsi atau kota"
                className="w-36 sm:w-44 rounded-full border border-white/10 bg-slate-900 pl-8 pr-2.5 py-1 text-xs text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
              />
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className={`rounded-full px-2.5 py-1 text-xs font-bold text-slate-950 transition ${
                isWildfire ? "bg-amber-400 hover:bg-amber-300" : "bg-cyan-400 hover:bg-cyan-300"
              }`}
            >
              Cari
            </button>
            <button
              type="button"
              aria-label="Kembali ke tampilan seluruh Indonesia"
              onClick={() => mapRef.current?.flyTo({ center: [118, -2], zoom: 4.4, essential: true })}
              className="rounded-full border border-white/10 p-1 text-slate-200 hover:bg-white/10"
              title="Reset pandangan ke seluruh Indonesia"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {searchMessage && (
          <div role="status" className="border-b border-white/10 bg-amber-950/40 px-3 py-1.5 text-xs text-amber-100">
            {searchMessage}
          </div>
        )}

        <div className="relative">
          {/* Responsive Map Height: perfect for 100% zoom */}
          <div ref={containerRef} className="h-[460px] xl:h-[490px] w-full" />
          
          {mapStatus === "loading" && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/50 text-xs text-white backdrop-blur-[2px]">
              Memuat citra peta dasar Indonesia…
            </div>
          )}
          {mapStatus === "error" && (
            <div className="absolute inset-x-3 bottom-3 rounded-xl border border-amber-300/30 bg-slate-950/90 p-2.5 text-xs text-amber-100">
              Peta dasar tidak dapat dimuat offline. Tampilan visual fallback aktif.
            </div>
          )}

          {/* Layer toggles */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5 rounded-xl border border-white/10 bg-slate-950/85 p-2.5 backdrop-blur-md shadow-xl text-[11px]">
            <div className="flex items-center gap-1.5 text-[9.5px] uppercase font-mono tracking-wider text-slate-400">
              <Layers3 className="h-3 w-3 text-cyan-300" />
              Lapisan Tematik
            </div>
            {layerOptions.map((option) => (
              <label key={option.id} className="flex items-center gap-1.5 text-slate-200 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={Boolean(layers[option.id as keyof typeof layers])}
                  onChange={() =>
                    setLayers((current) => ({
                      ...current,
                      [option.id]: !current[option.id as keyof typeof current],
                    }))
                  }
                  className={`h-3 w-3 rounded ${isWildfire ? "accent-amber-400" : "accent-cyan-400"}`}
                />
                <span className="inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: option.color }} />
                <span>{option.label}</span>
              </label>
            ))}
          </div>

          {/* Legend */}
          <div className="absolute right-3 top-3 rounded-xl border border-white/10 bg-slate-950/85 p-2.5 text-[11px] text-slate-200 backdrop-blur-md shadow-xl">
            <div className="mb-1 text-[9.5px] uppercase font-mono tracking-wider text-slate-400">
              Tingkat Kerawanan
            </div>
            <div className="space-y-1">
              {[
                ["Rendah (Aman)", "#2DBE83"],
                ["Sedang (Waspada)", "#E9C46A"],
                ["Tinggi (Siaga 2)", "#F49B4A"],
                ["Sangat Tinggi (Kritis)", "#E85D68"],
              ].map(([label, color]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-[10px]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Operational Telemetry Banner */}
        <div className="border-t border-white/10 bg-slate-950/70 px-3.5 py-1.5 text-[10.5px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span>
              {isWildfire
                ? "Integrasi deteksi termal antariksa MODIS/VIIRS, indeks Fire Weather (FWI), dan stasiun cuaca angin permukaan terpadu."
                : "Integrasi telemetri presipitasi radar BMKG, pemantauan sensor hidrometri TMA, dan analisis hidrologis cekungan terpadu."}
            </span>
          </div>
          <span className="font-mono text-cyan-300 font-bold text-[9.5px] hidden sm:inline">34 PROVINSI</span>
        </div>
      </div>

      {/* Right Detail Panel: Formatted to fit 100% zoom with zero clipping */}
      <aside className="rounded-[24px] border border-white/10 bg-slate-900/90 p-4 shadow-xl shadow-slate-950/40 space-y-2.5 flex flex-col justify-between">
        <div>
          {/* Focus Province Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div>
              <div className="text-[9.5px] uppercase font-mono tracking-widest text-slate-400">
                TARGET WILAYAH FOKUS
              </div>
              <h3 className="mt-0.5 text-xl font-bold text-white">{activeArea.name}</h3>
              <p className="text-[11px] text-slate-400">{activeArea.district} · {activeArea.region}</p>
            </div>
            <span
              className="rounded-full px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider border shadow-sm"
              style={{
                backgroundColor: `${riskColors[activeRiskLevel]}20`,
                borderColor: `${riskColors[activeRiskLevel]}50`,
                color: riskColors[activeRiskLevel],
              }}
            >
              {riskLabels[activeRiskLevel]}
            </span>
          </div>

          {/* Core Metrics: Compact & High Density */}
          {isWildfire ? (
            /* KEBAKARAN HUTAN & GAMBUT METRICS */
            <div className="mt-2.5 space-y-2 text-xs">
              {/* 1. Titik Panas Satelit */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-950/15 p-2.5">
                <div className="flex items-center justify-between text-amber-300 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Flame className="h-3.5 w-3.5 text-rose-400" />
                    Titik Panas (Hotspots)
                  </span>
                  <span className="font-mono text-[9.5px] text-amber-200/80">MODIS/VIIRS</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xl font-bold font-mono text-white">
                    {activeWildfire.hotspotSignals}
                  </span>
                  <span className="text-[11px] text-slate-300">Sinyal Termal Aktif</span>
                </div>
              </div>

              {/* 2. Indeks Kekeringan (KBDI) */}
              <div className="rounded-xl border border-white/10 bg-slate-950/50 p-2.5">
                <div className="flex items-center justify-between text-slate-300 text-[11px]">
                  <span>Indeks Kekeringan (KBDI)</span>
                  <span className="font-mono text-amber-300 font-bold">{activeWildfire.drynessIndex} / 100</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-rose-500"
                    style={{ width: `${activeWildfire.drynessIndex}%` }}
                  />
                </div>
                <div className="mt-1 text-[9.5px] text-slate-400">
                  Fire Weather Index (FWI): {activeWildfire.fwiScore}
                </div>
              </div>

              {/* 3. Tutupan Lahan & Gambut */}
              <div className="rounded-xl border border-white/10 bg-slate-950/50 p-2.5">
                <div className="flex items-center justify-between text-slate-300 text-[11px]">
                  <span>Tutupan Hutan: <strong className="text-white font-mono">{activeWildfire.forestCover}%</strong></span>
                  <span className="font-mono text-amber-300">Gambut: {activeWildfire.peatlandIndex}/100</span>
                </div>
              </div>

              {/* 4. Kecepatan & Arah Angin */}
              <div className="rounded-xl border border-white/10 bg-slate-950/50 p-2.5">
                <div className="flex items-center justify-between text-slate-300 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <Wind className="h-3.5 w-3.5 text-cyan-400" />
                    Kecepatan Angin
                  </span>
                  <span className="font-mono text-white font-bold">{activeWildfire.windSpeed} km/jam</span>
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-[10px] text-cyan-300">
                  <Compass className="h-3 w-3" />
                  <span>Vektor Arah: {activeWildfire.windDirection}</span>
                </div>
              </div>

              {/* Terrain Ecology Context */}
              <div className="rounded-xl border border-amber-400/20 bg-amber-500/5 p-2 text-[10.5px] text-amber-200/90 leading-snug">
                <strong className="text-white">Ekologi Lahan: </strong>
                {activeWildfire.terrainContext}
              </div>
            </div>
          ) : (
            /* BANJIR & HIDROLOGI METRICS */
            <div className="mt-2.5 space-y-2 text-xs">
              {/* 1. Curah Hujan Terukur */}
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/15 p-2.5">
                <div className="flex items-center justify-between text-cyan-300 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Waves className="h-3.5 w-3.5 text-cyan-400" />
                    Curah Hujan Terukur
                  </span>
                  <span className="font-mono text-[9.5px] text-cyan-200/80">Radar BMKG</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xl font-bold font-mono text-white">
                    {activeArea.rainfallToday} <span className="text-xs font-normal text-slate-400">mm/jam</span>
                  </span>
                  <span className="text-[11px] text-slate-300">Akumulasi: {activeArea.rainfallAccumulation} mm</span>
                </div>
              </div>

              {/* 2. Tinggi Muka Air */}
              <div className="rounded-xl border border-white/10 bg-slate-950/50 p-2.5">
                <div className="flex items-center justify-between text-slate-300 text-[11px]">
                  <span>Tinggi Muka Air (TMA Sensor)</span>
                  <span className="font-mono text-white font-bold">
                    {(activeArea.rainfallToday / 35).toFixed(2)} meter
                  </span>
                </div>
                <div className="mt-0.5 text-[10px] text-slate-400">
                  {activeArea.floodObservations} laporan genangan terverifikasi
                </div>
              </div>

              {/* 3. Kapasitas Drainase Kawasan */}
              <div className="rounded-xl border border-white/10 bg-slate-950/50 p-2.5">
                <div className="flex items-center justify-between text-slate-300 text-[11px]">
                  <span>Kapasitas Drainase</span>
                  <span className="font-mono text-cyan-300 font-bold">{activeArea.drainageIndex} / 100</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400"
                    style={{ width: `${activeArea.drainageIndex}%` }}
                  />
                </div>
              </div>

              {/* 4. Limpasan & Resapan Hijau */}
              <div className="rounded-xl border border-white/10 bg-slate-950/50 p-2.5">
                <div className="flex items-center justify-between text-slate-300 text-[11px]">
                  <span>Limpasan: <strong className="text-amber-300 font-mono">{activeArea.surfaceRunoff}%</strong></span>
                  <span>RTH: <strong className="text-emerald-300 font-mono">{activeArea.greenCoverage}%</strong></span>
                </div>
              </div>

              {/* Terrain Hydrological Context */}
              <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 p-2 text-[10.5px] text-cyan-200/90 leading-snug">
                <strong className="text-white">Karakteristik Medan: </strong>
                {activeArea.terrain}
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Navigation Buttons: Seamlessly integrated into card */}
        <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 mt-2">
          <Link
            href="/intelligence"
            className={`flex items-center justify-center gap-1 rounded-xl py-2 px-2 text-center text-[11px] font-bold text-slate-950 transition hover:brightness-110 shadow-sm ${
              isWildfire ? "bg-amber-400 hover:bg-amber-300" : "bg-cyan-400 hover:bg-cyan-300"
            }`}
          >
            <span>Analisis AI</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
          <Link
            href="/simulator"
            className="flex items-center justify-center gap-1 rounded-xl py-2 px-2 text-center text-[11px] font-bold text-white border border-white/15 bg-slate-950/80 hover:bg-white/10 transition"
          >
            <span>Simulasi</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </aside>
    </div>
  );
}
