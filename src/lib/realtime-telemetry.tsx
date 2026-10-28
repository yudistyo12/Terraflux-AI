"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { demoAreas, type DemoArea } from "./demo-data";
import { getWildfireMetrics, type WildfireMetrics } from "./wildfire-data";

export type WeatherScenario = "normal" | "monsoon" | "cyclone";
export type HazardMode = "flood" | "wildfire";

export interface SensorAlert {
  id: string;
  time: string;
  location: string;
  type: "warning" | "danger" | "info" | "success";
  message: string;
  value: string;
}

export interface HazardControlState {
  hazardMode: HazardMode;
  setHazardMode: (mode: HazardMode) => void;
  scenario: WeatherScenario;
  setScenario: (s: WeatherScenario) => void;
  selectedProvinceId: string;
  setSelectedProvinceId: (id: string) => void;
  selectedProvince: DemoArea;
  wildfireMetrics: WildfireMetrics;
  isPresentationMode: boolean;
  setIsPresentationMode: (val: boolean) => void;
  disclaimerText: string;
}

export interface LiveTelemetryState {
  currentTimeWIB: string;
  currentTimeWITA: string;
  currentTimeWIT: string;
  activeSensorsCount: number;
  // Flood dynamic metrics
  liveRainfall: number;
  liveWaterLevel: number;
  liveRunoff: number;
  // Wildfire dynamic metrics
  liveHotspots: number;
  liveDryness: number;
  liveWindSpeed: number;
  livePeatMoisture: number;
  liveFireSpread: number;
  alerts: SensorAlert[];
}

export type RealtimeState = HazardControlState & LiveTelemetryState;

const HazardControlContext = createContext<HazardControlState | null>(null);
const LiveTelemetryContext = createContext<LiveTelemetryState | null>(null);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [hazardMode, setHazardMode] = useState<HazardMode>(() => {
    if (typeof window !== "undefined") {
      const savedMode = window.localStorage.getItem("terraflux-hazard-mode");
      if (savedMode === "flood" || savedMode === "wildfire") return savedMode;
    }
    return "flood";
  });
  const [scenario, setScenario] = useState<WeatherScenario>("monsoon");
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("dki");
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);

  // Time & Simulation Tick (throttled & paused when tab is inactive)
  const [now, setNow] = useState<Date | null>(null);
  const [tick, setTick] = useState<number>(0);
  const isVisibleRef = useRef<boolean>(true);

  const selectHazardMode = useCallback((mode: HazardMode) => {
    setHazardMode(mode);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("terraflux-hazard-mode", mode);
    }
  }, []);

  // Optimized ticker: runs at 2.5s interval to save battery and GPU/CPU cycles
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setNow(new Date());
    }, 0);

    const handleVisibility = () => {
      isVisibleRef.current = document.visibilityState === "visible";
    };

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibility);
    }

    const timer = setInterval(() => {
      if (isVisibleRef.current) {
        setNow(new Date());
        setTick((t) => (t + 1) % 1000);
      }
    }, 2500);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(timer);
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibility);
      }
    };
  }, []);

  const formatClock = useCallback(
    (offsetHours: number) => {
      if (!now) {
        return "12:00:00";
      }
      const d = new Date(now.getTime() + (offsetHours - 7) * 3600000);
      return d.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    },
    [now]
  );

  const selectedProvince = useMemo(() => {
    return demoAreas.find((a) => a.id === selectedProvinceId) ?? demoAreas[0];
  }, [selectedProvinceId]);

  const wildfireMetrics = useMemo(() => {
    return getWildfireMetrics(selectedProvince.id);
  }, [selectedProvince.id]);

  // Scenario multipliers
  const scenarioMultiplier = useMemo(() => {
    switch (scenario) {
      case "normal":
        return 0.75;
      case "monsoon":
        return 1.15;
      case "cyclone":
        return 1.6;
    }
  }, [scenario]);

  // FLOOD LIVE METRICS
  const liveRainfall = useMemo(() => {
    const wave = Math.sin(tick * 0.2) * 5 + Math.cos(tick * 0.1) * 3;
    const base = selectedProvince.rainfallToday * scenarioMultiplier;
    return Math.max(10, Math.round(base + wave));
  }, [tick, selectedProvince.rainfallToday, scenarioMultiplier]);

  const liveWaterLevel = useMemo(() => {
    const wave = Math.sin((tick + 5) * 0.15) * 0.18;
    const base = (selectedProvince.rainfallToday / 35) * scenarioMultiplier;
    return Number(Math.max(0.5, base + wave).toFixed(2));
  }, [tick, selectedProvince.rainfallToday, scenarioMultiplier]);

  const liveRunoff = useMemo(() => {
    const wave = Math.sin((tick + 10) * 0.1) * 3;
    const base = selectedProvince.surfaceRunoff * Math.min(1.3, scenarioMultiplier);
    return Math.min(98, Math.max(20, Math.round(base + wave)));
  }, [tick, selectedProvince.surfaceRunoff, scenarioMultiplier]);

  // WILDFIRE LIVE METRICS
  const liveHotspots = useMemo(() => {
    const wave = Math.round(Math.sin((tick + 3) * 0.15) * 2);
    const base = wildfireMetrics.hotspotSignals * scenarioMultiplier;
    return Math.max(0, Math.round(base + wave));
  }, [tick, wildfireMetrics.hotspotSignals, scenarioMultiplier]);

  const liveDryness = useMemo(() => {
    const wave = Math.round(Math.cos((tick + 7) * 0.08) * 3);
    const base = wildfireMetrics.drynessIndex * Math.min(1.2, scenarioMultiplier);
    return Math.min(99, Math.max(20, Math.round(base + wave)));
  }, [tick, wildfireMetrics.drynessIndex, scenarioMultiplier]);

  const liveWindSpeed = useMemo(() => {
    const wave = Math.round(Math.sin((tick + 12) * 0.25) * 3);
    const base = wildfireMetrics.windSpeed * (scenario === "cyclone" ? 1.4 : 1.0);
    return Math.max(5, Math.round(base + wave));
  }, [tick, wildfireMetrics.windSpeed, scenario]);

  const livePeatMoisture = useMemo(() => {
    return Math.max(5, 100 - liveDryness);
  }, [liveDryness]);

  const liveFireSpread = useMemo(() => {
    const wave = Math.round(Math.sin(tick * 0.12) * 4);
    const base = wildfireMetrics.fireSpreadRisk * scenarioMultiplier;
    return Math.min(98, Math.max(10, Math.round(base + wave)));
  }, [tick, wildfireMetrics.fireSpreadRisk, scenarioMultiplier]);

  // Dynamic alerts adapting to hazardMode and scenario with STABLE references
  const alerts = useMemo<SensorAlert[]>(() => {
    if (hazardMode === "wildfire") {
      return [
        {
          id: "alt-wf-1",
          time: "LIVE",
          location: "Riau · Kubah Gambut Siak & Bengkalis",
          type: scenario === "cyclone" ? "danger" : "warning",
          message:
            scenario === "cyclone"
              ? "Siaga 1 Darurat Karhutla · 14 Hotspot Terkonfirmasi"
              : "Patroli Manggala Agni Terjun ke Parit Api",
          value: "Suhu Gambut 41°C",
        },
        {
          id: "alt-wf-2",
          time: "LIVE",
          location: "Kalteng · Kawasan PLG Pulang Pisau",
          type: "danger",
          message: "TMA Gambut Kritis -54cm di bawah ambang batas BRGM",
          value: "ISPU 185 AQI",
        },
        {
          id: "alt-wf-3",
          time: "LIVE",
          location: "Sumsel · Rawa Gambut Ogan Komering Ilir",
          type: "warning",
          message: "Operasi Water Bombing 2 Heli BNPB Standby",
          value: "Angin 18 km/j",
        },
        {
          id: "alt-wf-4",
          time: "LIVE",
          location: "NTT · Padang Sabana Sumba Timur",
          type: scenario === "cyclone" ? "danger" : "warning",
          message: "Kecepatan Angin Tenggara Melonjak 27 km/jam",
          value: "FWI 42 (Ekstrem)",
        },
        {
          id: "alt-wf-5",
          time: "LIVE",
          location: "Kalbar · Kubu Raya Pesisir",
          type: "info",
          message: "Sekat Kanal Ditutup untuk Retensi Pembasahan Gambut",
          value: "Normal Basah",
        },
      ];
    }

    return [
      {
        id: "alt-fl-1",
        time: "LIVE",
        location: "DKI Jakarta · Pintu Air Manggarai",
        type: scenario === "cyclone" ? "danger" : "warning",
        message:
          scenario === "cyclone"
            ? "Status Siaga 1 (Kritis) - Debit 890 cm"
            : "Status Siaga 2 - Debit 760 cm",
        value: "760 cm",
      },
      {
        id: "alt-fl-2",
        time: "LIVE",
        location: "Semarang · Kali Garang & Kanal Barat",
        type: "warning",
        message: "Pompa Otomatis 5 Unit Aktif 100%",
        value: "4.8 m³/s",
      },
      {
        id: "alt-fl-3",
        time: "LIVE",
        location: "Banjarmasin · Sungai Martapura",
        type: scenario === "cyclone" ? "danger" : "info",
        message: "Pasang Perbani + Luapan Alur Muara",
        value: "+1.9m MSL",
      },
      {
        id: "alt-fl-4",
        time: "LIVE",
        location: "Bandung · DAS Citarum Dayeuhkolot",
        type: "warning",
        message: "Limpasan hulu meningkat 18% dalam 30 menit",
        value: "320 m³/s",
      },
      {
        id: "alt-fl-5",
        time: "LIVE",
        location: "Makassar · Pintu Pengendali Tallo",
        type: "info",
        message: "Sensor radar curah hujan mencatat akumulasi 64mm",
        value: "Normal",
      },
    ];
  }, [hazardMode, scenario]);

  const disclaimerText =
    "TERRAFLUX AI menyajikan model screening multi-bahaya terpadu dengan data simulasi dan indikator konseptual untuk keperluan demonstrasi akademik dan eksplorasi kesiapsiagaan bencana. Data ini bukan instrumen pemantauan operasional resmi BMKG/KLHK/BNPB.";

  // STABLE Hazard Control Context Value (Only changes on user action!)
  const hazardControlValue = useMemo<HazardControlState>(
    () => ({
      hazardMode,
      setHazardMode: selectHazardMode,
      scenario,
      setScenario,
      selectedProvinceId,
      setSelectedProvinceId,
      selectedProvince,
      wildfireMetrics,
      isPresentationMode,
      setIsPresentationMode,
      disclaimerText,
    }),
    [
      hazardMode,
      selectHazardMode,
      scenario,
      selectedProvinceId,
      selectedProvince,
      wildfireMetrics,
      isPresentationMode,
    ]
  );

  // Dynamic Telemetry Context Value
  const liveTelemetryValue = useMemo<LiveTelemetryState>(
    () => ({
      currentTimeWIB: `${formatClock(7)} WIB`,
      currentTimeWITA: `${formatClock(8)} WITA`,
      currentTimeWIT: `${formatClock(9)} WIT`,
      activeSensorsCount: demoAreas.length * 4 + 18,
      liveRainfall,
      liveWaterLevel,
      liveRunoff,
      liveHotspots,
      liveDryness,
      liveWindSpeed,
      livePeatMoisture,
      liveFireSpread,
      alerts,
    }),
    [
      formatClock,
      liveRainfall,
      liveWaterLevel,
      liveRunoff,
      liveHotspots,
      liveDryness,
      liveWindSpeed,
      livePeatMoisture,
      liveFireSpread,
      alerts,
    ]
  );

  return (
    <HazardControlContext.Provider value={hazardControlValue}>
      <LiveTelemetryContext.Provider value={liveTelemetryValue}>
        {children}
      </LiveTelemetryContext.Provider>
    </HazardControlContext.Provider>
  );
}

/**
 * Stable hook for components that only need hazard mode, province selection, or scenario.
 * Will NEVER cause unnecessary re-renders on timer ticks!
 */
export function useHazardControl(): HazardControlState {
  const ctx = useContext(HazardControlContext);
  if (!ctx) {
    throw new Error("useHazardControl must be used within a RealtimeProvider");
  }
  return ctx;
}

/**
 * Hook for widgets that explicitly display dynamic telemetry metrics (e.g. clock, live numbers).
 */
export function useLiveTelemetry(): LiveTelemetryState {
  const ctx = useContext(LiveTelemetryContext);
  if (!ctx) {
    throw new Error("useLiveTelemetry must be used within a RealtimeProvider");
  }
  return ctx;
}

/**
 * Combined backwards-compatible hook.
 */
export function useRealtimeTelemetry(): RealtimeState {
  const hazard = useHazardControl();
  const telemetry = useLiveTelemetry();

  return useMemo(
    () => ({
      ...hazard,
      ...telemetry,
    }),
    [hazard, telemetry]
  );
}
