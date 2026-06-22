"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { MapPoint } from "@/lib/data";
import { sectorMeta, SECTORS } from "@/lib/sectors";

type LayerMode = "all" | "support" | "atlas" | "claims";

const ESRI_SATELLITE: maplibregl.StyleSpecification = {
  version: 8,
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    esri: {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "Imagery © Esri, Maxar, Earthstar Geographics",
    },
    labels: {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
    },
  },
  layers: [
    { id: "bg", type: "background", paint: { "background-color": "#0a0f17" } },
    { id: "esri", type: "raster", source: "esri" },
    { id: "labels", type: "raster", source: "labels", paint: { "raster-opacity": 0.85 } },
  ],
};

export function MapView({
  points,
  initialMode = "all",
  compact = false,
}: {
  points: MapPoint[];
  initialMode?: LayerMode;
  compact?: boolean;
}) {
  const mapEl = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const [ready, setReady] = useState(false);

  const [mode, setMode] = useState<LayerMode>(initialMode);
  const [sector, setSector] = useState<string>("all");
  const [ownership, setOwnership] = useState<string>("all");
  const [needsBuild, setNeedsBuild] = useState(false);
  const [selected, setSelected] = useState<MapPoint | null>(null);

  const visible = useMemo(() => {
    return points.filter((p) => {
      if (mode === "support" && !p.supportable) return false;
      if (mode === "atlas" && p.supportable) return false;
      if (mode === "claims" && !p.confiscated) return false;
      if (sector !== "all" && p.sector !== sector) return false;
      if (ownership !== "all" && p.ownership !== ownership) return false;
      if (needsBuild && !p.needsBuild) return false;
      return true;
    });
  }, [points, mode, sector, ownership, needsBuild]);

  // init map once
  useEffect(() => {
    if (map.current || !mapEl.current) return;
    const m = new maplibregl.Map({
      container: mapEl.current,
      style: ESRI_SATELLITE,
      center: [-79.5, 21.8],
      zoom: compact ? 5.1 : 5.6,
      attributionControl: { compact: true },
      maxZoom: 18,
    });
    m.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    m.on("load", () => {
      m.resize();
      setReady(true);
    });
    map.current = m;

    // The container's height resolves from a viewport calc that may settle after
    // map creation; keep the canvas in sync.
    const ro = new ResizeObserver(() => m.resize());
    ro.observe(mapEl.current);

    return () => {
      ro.disconnect();
      m.remove();
      map.current = null;
    };
  }, [compact]);

  // render markers when filters change
  useEffect(() => {
    if (!ready || !map.current) return;
    markers.current.forEach((mk) => mk.remove());
    markers.current = [];

    for (const p of visible) {
      const color = sectorMeta(p.sector).color;
      const el = document.createElement("button");
      el.className = "marker";
      el.setAttribute("aria-label", p.name);
      const risk = mode === "claims" && p.confiscated && p.titleIII === "active";
      el.style.cssText = `
        width:${risk ? 18 : 13}px;height:${risk ? 18 : 13}px;border-radius:50%;
        background:${mode === "claims" && p.confiscated ? "#f97316" : color};
        border:2px solid ${p.supportable ? "#22c55e" : "rgba(255,255,255,.65)"};
        box-shadow:0 0 0 1px rgba(0,0,0,.6)${risk ? ",0 0 12px 3px rgba(249,115,22,.7)" : ""};
        cursor:pointer;`;
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        setSelected(p);
        map.current?.flyTo({ center: [p.lng, p.lat], zoom: Math.max(map.current.getZoom(), 9), speed: 1.2 });
      });
      const mk = new maplibregl.Marker({ element: el }).setLngLat([p.lng, p.lat]).addTo(map.current);
      markers.current.push(mk);
    }
  }, [visible, ready, mode]);

  return (
    <div className={`relative w-full overflow-hidden rounded-lg border border-[var(--line)] ${compact ? "h-[420px]" : "h-[calc(100vh_-_8rem)]"}`}>
      <div ref={mapEl} className="absolute inset-0 h-full w-full" />

      {/* Layer toggle */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
        <div className="flex overflow-hidden rounded-md border border-[var(--line)] bg-[var(--panel)]/95 text-xs font-medium shadow-lg backdrop-blur">
          {([
            ["all", "All"],
            ["support", "Support now"],
            ["atlas", "Atlas"],
            ["claims", "Helms-Burton"],
          ] as [LayerMode, string][]).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setMode(k)}
              className={`px-3 py-2 transition-colors ${
                mode === k
                  ? k === "support"
                    ? "bg-invest/[0.14] text-[#047857]"
                    : k === "claims"
                    ? "bg-risk/[0.14] text-[#c2410c]"
                    : "bg-black/[0.06] text-text"
                  : "text-fog hover:bg-black/[0.04]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-2 rounded-md border border-[var(--line)] bg-[var(--panel)]/95 p-2 text-xs shadow-lg backdrop-blur">
          <select value={sector} onChange={(e) => setSector(e.target.value)} className="rounded bg-[var(--panel-2)] px-2 py-1.5 text-text">
            <option value="all">All sectors</option>
            {Object.values(SECTORS).map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
          <select value={ownership} onChange={(e) => setOwnership(e.target.value)} className="rounded bg-[var(--panel-2)] px-2 py-1.5 text-text">
            <option value="all">All ownership</option>
            <option value="state">🔴 State</option>
            <option value="jv">🟡 Joint venture</option>
            <option value="private">🟢 Private</option>
          </select>
          <label className="flex cursor-pointer items-center gap-2 px-1 text-fog">
            <input type="checkbox" checked={needsBuild} onChange={(e) => setNeedsBuild(e.target.checked)} />
            What needs to be built
          </label>
          <div className="px-1 font-mono text-[11px] text-ghost">{visible.length} of {points.length} assets</div>
        </div>
      </div>

      {/* Legend */}
      <div className="pointer-events-none absolute bottom-3 left-3 z-10 hidden rounded-md border border-[var(--line)] bg-[var(--panel)]/90 p-2 text-[11px] text-fog backdrop-blur sm:block">
        <div className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full border-2 border-invest bg-private" /> Supportable via QvaPay</div>
        <div className="mt-1 flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full border-2 border-ghost bg-atlas" /> Atlas — info only</div>
        <div className="mt-1 flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full bg-risk shadow-[0_0_8px_2px_rgba(249,115,22,.7)]" /> ⚠️ Title III risk</div>
      </div>

      {/* Side panel */}
      {selected && (
        <div className="absolute right-3 top-3 z-20 w-72 rounded-lg border border-[var(--line)] bg-[var(--panel)]/97 p-4 shadow-2xl backdrop-blur">
          <button onClick={() => setSelected(null)} className="absolute right-3 top-3 text-ghost hover:text-text" aria-label="Close">✕</button>
          <div className="kicker" style={{ color: sectorMeta(selected.sector).color }}>
            {sectorMeta(selected.sector).label} · {selected.province}
          </div>
          <h3 className="mt-1 pr-5 font-semibold leading-tight text-text">{selected.name}</h3>
          <p className="mt-2 text-xs text-fog">{selected.status || selected.type}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className={`badge owner-${selected.ownership}`}>
              {selected.ownership === "private" ? "🟢 Private" : selected.ownership === "jv" ? "🟡 JV" : "🔴 State"}
            </span>
            {selected.supportable ? (
              <span className="badge legal-invest">✅ Supportable</span>
            ) : (
              <span className="badge legal-atlas">ℹ️ Atlas only</span>
            )}
            {selected.sanctioned && <span className="badge badge-sdn">🚫 Sanctioned counterparty</span>}
            {selected.confiscated && selected.titleIII === "active" && <span className="badge badge-risk">⚠️ Title III suit</span>}
          </div>
          <div className="mt-4 flex gap-2">
            <Link href={`/opportunity/${selected.id}`} className="btn btn-ghost flex-1 px-3 py-1.5 text-xs">
              Open dossier →
            </Link>
            {selected.supportable && (
              <Link href="/invest" className="btn btn-primary px-3 py-1.5 text-xs">Support</Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
