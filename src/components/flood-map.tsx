"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Search, RotateCcw, Layers3, Waves, ShieldAlert, ArrowUpRight } from "lucide-react";
import { demoAreas, type DemoArea } from "@/lib/demo-data";
import { useHazardControl } from "@/lib/realtime-telemetry";

const riskColors: Record<DemoArea["riskLevel"], string> = {
  low: "#059669",
  moderate: "#d97706",
  high: "#ea580c",
  "very-high": "#dc2626",
};

const riskLabels: Record<DemoArea["riskLevel"], string> = {
  low: "Rendah",
  moderate: "Sedang",
  high: "Tinggi",
  "very-high": "Sangat tinggi",
};

const layerOptions = [
  { id: "risk", label: "Indeks Risiko Genangan", color: "#ea580c" },
  { id: "rainfall", label: "Intensitas Curah Hujan", color: "#2563eb" },
  { id: "waterways", label: "Alur Sungai & Koridor Polder", color: "#059669" },
];

export function FloodMap() {
  const { selectedProvinceId, setSelectedProvinceId } = useHazardControl();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const riskMarkersRef = useRef<maplibregl.Marker[]>([]);
  const dotsRef = useRef<HTMLSpanElement[]>([]);
  const labelsRef = useRef<HTMLSpanElement[]>([]);
  const setSelectedProvinceIdRef = useRef(setSelectedProvinceId);

  const activeAreaId = selectedProvinceId || "dki";
  const activeAreaIdRef = useRef(activeAreaId);

  useEffect(() => {
    setSelectedProvinceIdRef.current = setSelectedProvinceId;
    activeAreaIdRef.current = activeAreaId;
  }, [setSelectedProvinceId, activeAreaId]);

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

  useEffect(() => {
    if (mapRef.current) {
      const target = demoAreas.find((a) => a.id === activeAreaId);
      if (target) {
        mapRef.current.flyTo({ center: target.center, zoom: 9, essential: true });
      }
    }
  }, [activeAreaId]);

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
        const riskLevel = area.riskLevel;
        markerElement.setAttribute("aria-label", `${area.name}, risiko ${riskLabels[riskLevel]}`);
        markerElement.title = `${area.name} · Curah Hujan ${area.rainfallToday}mm/jam`;

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

      riskMarkersRef.current.forEach((marker, index) => {
        const selected = demoAreas[index]?.id === activeAreaIdRef.current;
        marker.getElement().setAttribute("data-selected", selected ? "true" : "false");
      });
      updateLabelVisibility();

      map.on("zoomend", updateLabelVisibility);

      const riskFeatures = demoAreas.map((area) => ({
        type: "Feature" as const,
        properties: {
          id: area.id,
          name: area.name,
          riskScore: area.surfaceRunoff,
          rainfallToday: area.rainfallToday,
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
      }));

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
          "fill-color": "#ea580c",
          "fill-opacity": 0.2,
        },
      });

      map.addLayer({
        id: "terraflux-waterways-layer",
        type: "line",
        source: "terraflux-waterways",
        paint: {
          "line-color": "#2563eb",
          "line-width": 2.5,
          "line-opacity": 0.7,
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

  useEffect(() => {
    riskMarkersRef.current.forEach((marker, index) => {
      const isSelected = demoAreas[index]?.id === activeAreaId;
      marker.getElement().setAttribute("data-selected", isSelected ? "true" : "false");
    });
    updateLabelVisibility();
  }, [activeAreaId, updateLabelVisibility]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (map.getLayer("terraflux-risk-layer")) {
      map.setLayoutProperty("terraflux-risk-layer", "visibility", layers.risk ? "visible" : "none");
    }
    if (map.getLayer("terraflux-waterways-layer")) {
      map.setLayoutProperty("terraflux-waterways-layer", "visibility", layers.waterways ? "visible" : "none");
    }
  }, [layers]);

  const handleSearch = () => {
    const keyword = searchValue.trim().toLowerCase();
    if (!keyword) return;

    const area = demoAreas.find(
      (item) => item.name.toLowerCase().includes(keyword) || item.district.toLowerCase().includes(keyword),
    );

    if (area) {
      setSearchMessage("");
      setSelectedProvinceId(area.id);
      mapRef.current?.flyTo({ center: area.center, zoom: 9.5, essential: true });
    } else {
      setSearchMessage("Wilayah tidak ditemukan dalam cakupan 34 provinsi.");
    }
  };

  const activeColor = riskColors[activeArea.riskLevel];

  return (
    <div className="grid gap-4 lg:grid-cols-[1.75fr_0.95fr] items-start">
      {/* Map Main Viewport */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <Waves className="h-4 w-4 text-blue-600" />
            <span className="font-bold text-slate-900 text-xs sm:text-sm">
              Peta Geospasial Risiko Banjir Indonesia
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
                className="w-36 sm:w-44 rounded-lg border border-slate-200 bg-white pl-8 pr-2.5 py-1 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 shadow-sm"
              />
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700 transition"
            >
              Cari
            </button>
            <button
              type="button"
              aria-label="Reset pandangan"
              onClick={() => mapRef.current?.flyTo({ center: [118, -2], zoom: 4.4, essential: true })}
              className="rounded-lg border border-slate-200 bg-white p-1 text-slate-600 hover:bg-slate-50"
              title="Reset pandangan ke seluruh Indonesia"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {searchMessage && (
          <div role="status" className="border-b border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-800">
            {searchMessage}
          </div>
        )}

        <div className="relative">
          <div ref={containerRef} className="h-[460px] xl:h-[490px] w-full" />

          {mapStatus === "loading" && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/70 text-xs text-slate-700">
              Memuat citra peta dasar Indonesia…
            </div>
          )}
          {mapStatus === "error" && (
            <div className="absolute inset-x-3 bottom-3 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">
              Peta dasar tidak dapat dimuat offline. Tampilan visual fallback aktif.
            </div>
          )}

          {/* Layer toggles */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5 rounded-lg border border-slate-200 bg-white/95 p-2.5 shadow-md text-xs">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-slate-500 font-semibold">
              <Layers3 className="h-3 w-3 text-blue-600" />
              Lapisan Tematik
            </div>
            {layerOptions.map((option) => (
              <label key={option.id} className="flex items-center gap-1.5 text-slate-700 cursor-pointer hover:text-slate-900 text-[11px]">
                <input
                  type="checkbox"
                  checked={Boolean(layers[option.id as keyof typeof layers])}
                  onChange={() =>
                    setLayers((current) => ({
                      ...current,
                      [option.id]: !current[option.id as keyof typeof current],
                    }))
                  }
                  className="h-3 w-3 rounded accent-blue-600"
                />
                <span className="inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: option.color }} />
                <span>{option.label}</span>
              </label>
            ))}
          </div>

          {/* Legend */}
          <div className="absolute right-3 top-3 rounded-lg border border-slate-200 bg-white/95 p-2.5 text-xs text-slate-700 shadow-md">
            <div className="mb-1 text-[10px] uppercase font-mono tracking-wider text-slate-500 font-semibold">
              Tingkat Risiko
            </div>
            <div className="space-y-1">
              {[
                ["Rendah", "#059669"],
                ["Sedang", "#d97706"],
                ["Tinggi", "#ea580c"],
                ["Sangat Tinggi", "#dc2626"],
              ].map(([label, color]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-[11px]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Operational Telemetry Banner */}
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-blue-600 shrink-0" />
            <span>
              Integrasi telemetri presipitasi radar BMKG, sensor hidrometri TMA, dan analisis defisit drainase polder perkotaan.
            </span>
          </div>
          <span className="font-mono text-blue-700 font-bold text-[10px] hidden sm:inline">34 PROVINSI</span>
        </div>
      </div>

      {/* Right Detail Panel */}
      <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 flex flex-col justify-between">
        <div>
          {/* Focus Province Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider font-semibold text-blue-600">
                WILAYAH TERPILIH
              </div>
              <h3 className="mt-0.5 text-xl font-bold text-slate-900">{activeArea.name}</h3>
              <p className="text-xs text-slate-500">{activeArea.district} · Wilayah {activeArea.region}</p>
            </div>
            <span
              className="rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{
                backgroundColor: `${activeColor}15`,
                color: activeColor,
              }}
            >
              {riskLabels[activeArea.riskLevel]}
            </span>
          </div>

          {/* Core Metrics */}
          <div className="mt-3 space-y-2.5 text-xs">
            {/* 1. Curah Hujan */}
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
              <div className="flex items-center justify-between text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <Waves className="h-3.5 w-3.5 text-blue-600" />
                  Curah Hujan Terukur
                </span>
                <span className="font-mono text-[10px] text-slate-400">Radar BMKG</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-lg font-bold font-mono text-slate-900">
                  {activeArea.rainfallToday} <span className="text-xs font-normal text-slate-500">mm/jam</span>
                </span>
                <span className="text-[11px] text-slate-500">Akumulasi: {activeArea.rainfallAccumulation} mm</span>
              </div>
            </div>

            {/* 2. Muka Air */}
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
              <div className="flex items-center justify-between text-slate-600 text-xs">
                <span>Tinggi Muka Air (TMA)</span>
                <span className="font-mono text-slate-900 font-bold">
                  {(activeArea.rainfallToday / 35).toFixed(2)} meter
                </span>
              </div>
              <div className="mt-0.5 text-[10px] text-slate-400">
                {activeArea.floodObservations} laporan genangan terverifikasi
              </div>
            </div>

            {/* 3. Kapasitas Drainase */}
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
              <div className="flex items-center justify-between text-slate-600 text-xs">
                <span>Kapasitas Drainase</span>
                <span className="font-mono text-blue-700 font-bold">{activeArea.drainageIndex} / 100</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${activeArea.drainageIndex}%` }}
                />
              </div>
            </div>

            {/* 4. Limpasan & RTH */}
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
              <div className="flex items-center justify-between text-slate-600 text-xs">
                <span>Limpasan: <strong className="text-slate-900 font-mono">{activeArea.surfaceRunoff}%</strong></span>
                <span>RTH: <strong className="text-emerald-700 font-mono">{activeArea.greenCoverage}%</strong></span>
              </div>
            </div>

            {/* Terrain Context */}
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-800">Karakteristik Medan: </strong>
              {activeArea.terrain}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 mt-2">
          <Link
            href="/intelligence"
            className="flex items-center justify-center gap-1 rounded-lg py-2 px-2 text-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm"
          >
            <span>Analisis AI</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/simulator"
            className="flex items-center justify-center gap-1 rounded-lg py-2 px-2 text-center text-xs font-semibold text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 transition"
          >
            <span>Simulasi</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </aside>
    </div>
  );
}
