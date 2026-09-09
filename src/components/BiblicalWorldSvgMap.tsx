import React, { useMemo } from "react";
import { useMapScaleTransformer } from "../utils/mapScaleTransformer";
import { localizeBiblicalReference } from "../utils/i18n";
import {
  MAP_WIDTH,
  MAP_HEIGHT,
  geoToPixel,
  coordsToSvgPath,
  MEDITERRANEAN_POLYGON,
  MEDITERRANEAN_COAST,
  CYPRUS_COAST,
  RED_SEA_COAST,
  PERSIAN_GULF_COAST,
  BLACK_SEA_COAST,
  CASPIAN_SEA_COAST,
  DEAD_SEA_COAST,
  SEA_OF_GALILEE_COAST,
  LAKE_VAN_COAST,
  LAKE_URMIA_COAST,
  LAKE_QARUN_COAST,
  NILE_RIVER_MAIN,
  NILE_ROSETTA_BRANCH,
  NILE_DAMIETTA_BRANCH,
  NILE_GOSHEN_PELUSIAC_BRANCH,
  WADI_TUMILAT_ROUTE,
  EUPHRATES_RIVER,
  BALIKH_RIVER,
  KHABUR_RIVER,
  TIGRIS_RIVER,
  GREAT_ZAB_RIVER,
  KARUN_RIVER,
  JORDAN_RIVER_SYSTEM,
  JABBOK_RIVER,
  ARNON_RIVER,
  ORONTES_RIVER,
  BIBLICAL_MOUNTAIN_RANGES,
  ANCIENT_ROUTES,
  FERTILE_CRESCENT_POLYGON,
  ABRAHAM_STATIONS,
  EXODUS_STATIONS,
  type RouteStation,
} from "../data/mapGeography";

export interface MapLayerVisibility {
  showRivers: boolean;
  showMountains: boolean;
  showRoutes: boolean;
  showAbrahamRoute?: boolean;
  showExodusRoute?: boolean;
  showFertileCrescent: boolean;
  showGraticule: boolean;
  showRegionLabels: boolean;
}

interface BiblicalWorldSvgMapProps {
  zoom: number;
  isRTL: boolean;
  layers?: Partial<MapLayerVisibility>;
  onLocationClick?: (locId: string) => void;
  onStationClick?: (station: RouteStation) => void;
  onOpenLegend?: () => void;
  selectedStationId?: string | null;
}

export const BiblicalWorldSvgMap: React.FC<BiblicalWorldSvgMapProps> = ({
  zoom,
  isRTL,
  layers,
  onLocationClick: _onLocationClick,
  onStationClick,
  onOpenLegend,
  selectedStationId,
}) => {
  const layerState: MapLayerVisibility = {
    showRivers: true,
    showMountains: true,
    showRoutes: true,
    showAbrahamRoute: true,
    showExodusRoute: true,
    showFertileCrescent: true,
    showGraticule: true,
    showRegionLabels: true,
    ...layers,
  };

  // Dynamic Scale Transformer:
  // Automatically counter-scales mountains, text labels, river strokes, trade routes,
  // and cartographic ornaments as zoom changes to maintain pristine legibility.
  const scale = useMapScaleTransformer(zoom);

  // Convert real geographic coordinate paths to SVG strings
  const medPath = useMemo(() => coordsToSvgPath(MEDITERRANEAN_POLYGON, true, true), []);
  const medCoast = useMemo(() => coordsToSvgPath(MEDITERRANEAN_COAST, false, true), []);
  const cyprusPath = useMemo(() => coordsToSvgPath(CYPRUS_COAST, true, true), []);
  const redSeaPath = useMemo(() => coordsToSvgPath(RED_SEA_COAST, true, true), []);
  const persianGulfPath = useMemo(() => coordsToSvgPath(PERSIAN_GULF_COAST, true, true), []);
  const blackSeaPath = useMemo(() => coordsToSvgPath(BLACK_SEA_COAST, true, true), []);
  const caspianSeaPath = useMemo(() => coordsToSvgPath(CASPIAN_SEA_COAST, true, true), []);

  const deadSeaPath = useMemo(() => coordsToSvgPath(DEAD_SEA_COAST, true, true), []);
  const galileePath = useMemo(() => coordsToSvgPath(SEA_OF_GALILEE_COAST, true, true), []);
  const lakeVanPath = useMemo(() => coordsToSvgPath(LAKE_VAN_COAST, true, true), []);
  const lakeUrmiaPath = useMemo(() => coordsToSvgPath(LAKE_URMIA_COAST, true, true), []);
  const lakeQarunPath = useMemo(() => coordsToSvgPath(LAKE_QARUN_COAST, true, true), []);

  const nileMainPath = useMemo(() => coordsToSvgPath(NILE_RIVER_MAIN, false, true), []);
  const nileRosettaPath = useMemo(() => coordsToSvgPath(NILE_ROSETTA_BRANCH, false, true), []);
  const nileDamiettaPath = useMemo(() => coordsToSvgPath(NILE_DAMIETTA_BRANCH, false, true), []);
  const nileGoshenPath = useMemo(() => coordsToSvgPath(NILE_GOSHEN_PELUSIAC_BRANCH, false, true), []);
  const wadiTumilatPath = useMemo(() => coordsToSvgPath(WADI_TUMILAT_ROUTE, false, true), []);

  const euphratesPath = useMemo(() => coordsToSvgPath(EUPHRATES_RIVER, false, true), []);
  const balikhPath = useMemo(() => coordsToSvgPath(BALIKH_RIVER, false, true), []);
  const khaburPath = useMemo(() => coordsToSvgPath(KHABUR_RIVER, false, true), []);
  const tigrisPath = useMemo(() => coordsToSvgPath(TIGRIS_RIVER, false, true), []);
  const greatZabPath = useMemo(() => coordsToSvgPath(GREAT_ZAB_RIVER, false, true), []);
  const karunPath = useMemo(() => coordsToSvgPath(KARUN_RIVER, false, true), []);

  const jordanPath = useMemo(() => coordsToSvgPath(JORDAN_RIVER_SYSTEM, false, true), []);
  const jabbokPath = useMemo(() => coordsToSvgPath(JABBOK_RIVER, false, true), []);
  const arnonPath = useMemo(() => coordsToSvgPath(ARNON_RIVER, false, true), []);
  const orontesPath = useMemo(() => coordsToSvgPath(ORONTES_RIVER, false, true), []);

  const fertileCrescentPath = useMemo(() => coordsToSvgPath(FERTILE_CRESCENT_POLYGON, true, true), []);

  // Graticule Lines (Parallels 25, 30, 35, 40°N; Meridians 25, 30, 35, 40, 45, 50, 55°E)
  const parallels = [25, 30, 35, 40];
  const meridians = [25, 30, 35, 40, 45, 50, 55];

  // Mountain Ridgelines
  const mountainPaths = useMemo(() => {
    return BIBLICAL_MOUNTAIN_RANGES.map((range) => ({
      id: range.id,
      name: range.name,
      arabicName: range.arabicName,
      path: coordsToSvgPath(range.coords, false, true),
      elevationLabel: range.elevationLabel,
      peaks: range.peaks.map((p) => ({
        ...p,
        pixel: geoToPixel(p.lat, p.lon),
      })),
    }));
  }, []);

  // Ancient Routes
  const routePaths = useMemo(() => {
    return ANCIENT_ROUTES.map((route) => ({
      ...route,
      path: coordsToSvgPath(route.coords, false, true),
    }));
  }, []);

  // Precomputed pixel locations for biblical journey stations
  const abrahamStationPixels = useMemo(() => {
    return ABRAHAM_STATIONS.map((s) => ({
      ...s,
      pixel: geoToPixel(s.coords[0], s.coords[1]),
    }));
  }, []);

  const exodusStationPixels = useMemo(() => {
    return EXODUS_STATIONS.map((s) => ({
      ...s,
      pixel: geoToPixel(s.coords[0], s.coords[1]),
    }));
  }, []);

  return (
    <svg
      id="biblical-world-map-svg"
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      className="w-full h-full block select-none pointer-events-none"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      style={{
        overflow: "visible",
        direction: "ltr",
        shapeRendering: "geometricPrecision",
        textRendering: "geometricPrecision",
      }}
    >
      <defs>
        {/* Parchment Base Texture & Gradients */}
        <radialGradient id="antiqueParchment" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#FFFBF0" />
          <stop offset="55%" stopColor="#F8EED7" />
          <stop offset="85%" stopColor="#EED9B2" />
          <stop offset="100%" stopColor="#DEBE92" />
        </radialGradient>

        <linearGradient id="oceanGradReal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E3E59" />
          <stop offset="40%" stopColor="#16324A" />
          <stop offset="80%" stopColor="#0F2436" />
          <stop offset="100%" stopColor="#0A1926" />
        </linearGradient>

        <linearGradient id="shallowWaterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2A5C7E" />
          <stop offset="100%" stopColor="#1A3B52" />
        </linearGradient>

        <radialGradient id="fertileGlow" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#84CC16" stopOpacity="0.22" />
          <stop offset="50%" stopColor="#65A30D" stopOpacity="0.16" />
          <stop offset="85%" stopColor="#CA8A04" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#CA8A04" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="desertWash" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EDC790" stopOpacity="0.3" />
          <stop offset="60%" stopColor="#E2B472" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#FFFBF0" stopOpacity="0" />
        </linearGradient>

        {/* Dune Pattern for Deserts */}
        <pattern id="desertDunes" width="30" height="15" patternUnits="userSpaceOnUse">
          <path
            d="M 0,10 Q 7,5 15,10 T 30,10"
            fill="none"
            stroke="#B48139"
            strokeWidth="0.75"
            strokeOpacity="0.25"
          />
        </pattern>
      </defs>

      {/* ============================================================= */}
      {/* 1. MAP BASE & CONTINENTAL LANDMASS                            */}
      {/* ============================================================= */}
      <rect
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        fill="url(#antiqueParchment)"
      />

      {/* ============================================================= */}
      {/* 2. ARABIAN & SYRIAN DESERT TEXTURE                            */}
      {/* ============================================================= */}
      {/* Great Arabian Desert Area (South Central to Southeast) */}
      <path
        d="M 700,600 C 900,560 1200,580 1350,650 L 1750,950 L 750,980 Z"
        fill="url(#desertDunes)"
        opacity="0.75"
      />
      {/* Syrian Desert / Badiyat ash-Sham */}
      <path
        d="M 700,340 C 850,340 1000,380 1100,450 C 950,520 800,500 700,450 Z"
        fill="url(#desertDunes)"
        opacity="0.45"
      />

      {/* ============================================================= */}
      {/* 3. FERTILE CRESCENT ZONE (Lush Agricultural Alluvium)          */}
      {/* ============================================================= */}
      {layerState.showFertileCrescent && (
        <g id="fertile-crescent-zone">
          <path
            d={fertileCrescentPath}
            fill="url(#fertileGlow)"
            stroke="#65A30D"
            strokeWidth="1.5"
            strokeDasharray="4,6"
            strokeOpacity="0.4"
          />
        </g>
      )}

      {/* ============================================================= */}
      {/* 4. REAL WATER BODIES & SEAS                                    */}
      {/* ============================================================= */}
      <g id="seas-and-oceans">
        {/* Coastal Bathymetric Water Echo Rings (Engraving Effect) */}
        <g fill="none" stroke="#25516E" strokeWidth="1" strokeOpacity="0.2">
          <path d={medCoast} strokeWidth="4" strokeDasharray="1,2" />
          <path d={medCoast} strokeWidth="8" strokeOpacity="0.1" />
          <path d={redSeaPath} strokeWidth="3" strokeDasharray="1,2" />
          <path d={persianGulfPath} strokeWidth="3" strokeDasharray="1,2" />
          <path d={blackSeaPath} strokeWidth="3" strokeDasharray="1,2" />
          <path d={caspianSeaPath} strokeWidth="3" strokeDasharray="1,2" />
          <path d={cyprusPath} strokeWidth="3" strokeOpacity="0.15" />
        </g>

        {/* Mediterranean Sea */}
        <path
          d={medPath}
          fill="url(#oceanGradReal)"
          stroke="#102A43"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />

        {/* Cyprus Island (Land sitting inside Mediterranean) */}
        <path
          d={cyprusPath}
          fill="url(#antiqueParchment)"
          stroke="#5B3A1A"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Red Sea & Sinai Bays (Gulf of Suez & Gulf of Aqaba) */}
        <path
          d={redSeaPath}
          fill="url(#oceanGradReal)"
          stroke="#102A43"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />

        {/* Persian Gulf & Shatt al-Arab */}
        <path
          d={persianGulfPath}
          fill="url(#oceanGradReal)"
          stroke="#102A43"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />

        {/* Black Sea (North) */}
        <path
          d={blackSeaPath}
          fill="url(#oceanGradReal)"
          stroke="#102A43"
          strokeWidth="1.5"
        />

        {/* Caspian Sea (Northeast) */}
        <path
          d={caspianSeaPath}
          fill="url(#oceanGradReal)"
          stroke="#102A43"
          strokeWidth="1.5"
        />
      </g>

      {/* ============================================================= */}
      {/* 5. INLAND SEAS, LAKES & BASINS                                */}
      {/* ============================================================= */}
      <g id="inland-lakes" stroke="#102A43" strokeWidth="1.2">
        {/* Dead Sea (Yam HaMelah) */}
        <path d={deadSeaPath} fill="#1B425A" />
        {/* Sea of Galilee (Lake Kinneret) */}
        <path d={galileePath} fill="#1B425A" />
        {/* Lake Van (Urartu) */}
        <path d={lakeVanPath} fill="#1B425A" />
        {/* Lake Urmia (Media) */}
        <path d={lakeUrmiaPath} fill="#1B425A" />
        {/* Lake Qarun (Faiyum) */}
        <path d={lakeQarunPath} fill="#1B425A" />
      </g>

      {/* ============================================================= */}
      {/* 6. REALISTIC RIVER SYSTEMS                                    */}
      {/* ============================================================= */}
      {layerState.showRivers && (
        <g id="river-systems" stroke="#164E63" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* NILE RIVER & DELTA */}
          <path d={nileMainPath} strokeWidth={Math.max(1.2, 3.5 * scale.riverStrokeScale)} />
          <path d={nileRosettaPath} strokeWidth={Math.max(0.9, 2.2 * scale.riverStrokeScale)} />
          <path d={nileDamiettaPath} strokeWidth={Math.max(0.9, 2.2 * scale.riverStrokeScale)} />
          <path d={nileGoshenPath} strokeWidth={Math.max(0.7, 1.6 * scale.riverStrokeScale)} strokeDasharray="3,2" />
          <path d={wadiTumilatPath} strokeWidth={Math.max(0.6, 1.4 * scale.riverStrokeScale)} strokeDasharray="2,2" />

          {/* EUPHRATES RIVER & TRIBUTARIES */}
          <path d={euphratesPath} strokeWidth={Math.max(1.1, 3.2 * scale.riverStrokeScale)} />
          <path d={balikhPath} strokeWidth={Math.max(0.7, 1.8 * scale.riverStrokeScale)} />
          <path d={khaburPath} strokeWidth={Math.max(0.8, 2.0 * scale.riverStrokeScale)} />

          {/* TIGRIS RIVER & TRIBUTARIES */}
          <path d={tigrisPath} strokeWidth={Math.max(1.0, 3.0 * scale.riverStrokeScale)} />
          <path d={greatZabPath} strokeWidth={Math.max(0.7, 1.8 * scale.riverStrokeScale)} />
          <path d={karunPath} strokeWidth={Math.max(0.8, 2.0 * scale.riverStrokeScale)} />

          {/* JORDAN RIVER SYSTEM */}
          <path d={jordanPath} strokeWidth={Math.max(0.9, 2.2 * scale.riverStrokeScale)} />
          <path d={jabbokPath} strokeWidth={Math.max(0.6, 1.6 * scale.riverStrokeScale)} />
          <path d={arnonPath} strokeWidth={Math.max(0.6, 1.6 * scale.riverStrokeScale)} />
          <path d={orontesPath} strokeWidth={Math.max(0.7, 1.8 * scale.riverStrokeScale)} />
        </g>
      )}

      {/* ============================================================= */}
      {/* 7. TOPOGRAPHICAL MOUNTAIN RANGES & PEAKS                      */}
      {/* ============================================================= */}
      {layerState.showMountains && (
        <g id="mountain-topography">
          {/* Mountain Ridge Shading & Contours (Scaled dynamically with zoom) */}
          {mountainPaths.map((m) => (
            <g key={`ridge-${m.id}`}>
              {/* Soft ridge backbone glow */}
              <path
                d={m.path}
                fill="none"
                stroke="#A16207"
                strokeWidth={Math.max(2.0, 14 * scale.mountainSymbolScale)}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.15"
              />
              {/* Mid contour line */}
              <path
                d={m.path}
                fill="none"
                stroke="#78350F"
                strokeWidth={Math.max(0.6, 4 * scale.mountainSymbolScale)}
                strokeDasharray="2,4"
                strokeLinecap="round"
                opacity="0.4"
              />
            </g>
          ))}

          {/* Individual Shaded Mountain Peaks (Scaled down as zoom increases) */}
          {mountainPaths.map((m) => (
            <g
              key={`peaks-${m.id}`}
              stroke="#451A03"
              strokeWidth={scale.mountainStrokeWidth}
              strokeLinejoin="round"
            >
              {m.peaks.map((peak) => {
                const { x, y } = peak.pixel;
                const size = peak.symbolSize * scale.mountainSymbolScale;
                const halfW = size * 0.75;

                const leftPt = `${x - halfW},${y}`;
                const topPt = `${x},${y - size}`;
                const rightPt = `${x + halfW},${y}`;
                const midPt = `${x},${y}`;

                return (
                  <g key={peak.id} className="cursor-default">
                    {/* Sunlit West face */}
                    <polygon points={`${leftPt} ${topPt} ${midPt}`} fill="#FDE68A" />
                    {/* Shadowed East face */}
                    <polygon points={`${midPt} ${topPt} ${rightPt}`} fill="#92400E" />
                    {/* Snow cap on highest summits (Ararat, Hermon, Damavand) */}
                    {peak.elevation > 2800 && (
                      <polygon
                        points={`${x - halfW * 0.3},${y - size * 0.7} ${topPt} ${x + halfW * 0.3},${y - size * 0.7}`}
                        fill="#FFFFFF"
                        stroke="#78350F"
                        strokeWidth={Math.max(0.2, 0.5 * scale.mountainSymbolScale)}
                      />
                    )}
                  </g>
                );
              })}
            </g>
          ))}

          {/* Mountain Peak Text Labels (Scaled down as zoom increases) */}
          <g
            fill="#573A18"
            stroke="#FFF8EE"
            strokeWidth={Math.max(0.8, 1.8 * scale.mountainLabelScale)}
            strokeLinejoin="round"
            paintOrder="stroke fill"
            fontFamily={isRTL ? "'Amiri', 'Cairo', serif" : "'Cinzel', Georgia, serif"}
            fontSize={Math.max(3.2, 10 * scale.mountainLabelScale)}
            fontStyle="italic"
            fontWeight="600"
            textAnchor="middle"
          >
            {mountainPaths.flatMap((m) =>
              m.peaks.map((peak) => {
                // Prevent duplicate overlapping text: peaks that correspond to major biblical locations
                // already have dedicated interactive pins with automatic collision avoidance.
                if (
                  peak.id === "mount-sinai-peak" ||
                  peak.id === "mount-ararat" ||
                  peak.id === "mount-serbal" ||
                  peak.id === "mount-olives" ||
                  peak.id === "mount-gerizim"
                ) {
                  return null;
                }
                const { x, y } = peak.pixel;
                const name = isRTL ? peak.arabicName : peak.name;
                const size = peak.symbolSize * scale.mountainSymbolScale;
                return (
                  <text key={`label-${peak.id}`} x={x} y={y - size - (2.5 * scale.mountainLabelScale)}>
                    {name}
                  </text>
                );
              })
            )}
          </g>
        </g>
      )}

      {/* ============================================================= */}
      {/* 8. ANCIENT TRADE ROUTES, ABRAHAM'S PATH & EXODUS ITINERARY     */}
      {/* ============================================================= */}
      <g id="ancient-routes" fill="none">
        {/* Ancient Caravan & Trade Highways (Via Maris, King's Highway, etc.) */}
        {layerState.showRoutes &&
          routePaths
            .filter((r) => r.type !== "abraham" && r.type !== "exodus")
            .map((route) => {
              const isRoyal = route.type === "royal";
              const strokeColor = isRoyal ? "#7E22CE" : "#854D0E";
              const strokeDash = isRoyal ? "6,4" : "3,3";
              const strokeWidth = 2.0 * scale.routeStrokeScale;
              return (
                <g key={route.id} opacity="0.65">
                  <path
                    d={route.path}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDash}
                    strokeLinecap="round"
                  />
                </g>
              );
            })}

        {/* ABRAHAM'S JOURNEY OF FAITH (Ur -> Haran -> Shechem -> Bethel -> Hebron -> Egypt -> Beersheba -> Moriah) */}
        {layerState.showAbrahamRoute !== false && (
          <g id="abraham-path-layer">
            {routePaths
              .filter((r) => r.type === "abraham")
              .map((route) => (
                <g key={route.id}>
                  {/* Subtle warm amber halo */}
                  <path
                    d={route.path}
                    stroke="#F59E0B"
                    strokeWidth={5.5 * scale.routeStrokeScale}
                    strokeOpacity={0.28}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Distinctive dash-dot amber path */}
                  <path
                    d={route.path}
                    stroke="#D97706"
                    strokeWidth={2.6 * scale.routeStrokeScale}
                    strokeDasharray="8,3,2,3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              ))}

            {/* Abraham's Journey Stations & Milestones */}
            <g id="abraham-stations" pointerEvents="auto">
              {abrahamStationPixels.map((station) => {
                const isSelected = selectedStationId === station.id;
                const radius = Math.max(5, (isSelected ? 9 : 7) * scale.markerScale);
                return (
                  <g
                    key={`abraham-station-${station.id}`}
                    transform={`translate(${station.pixel.x}, ${station.pixel.y})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onStationClick?.(station);
                    }}
                    cursor="pointer"
                    className="group"
                  >
                    <title>{`${station.stationNumber}. ${isRTL ? station.arabicTitle : station.title} - ${localizeBiblicalReference(station.scripture, isRTL ? "ar" : "en")}: ${isRTL ? station.arabicDescription : station.description}`}</title>
                    {/* Pulsing selection aura */}
                    {isSelected && (
                      <circle
                        r={radius * 1.8}
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="2"
                        strokeDasharray="3 2"
                        opacity="0.8"
                      />
                    )}
                    {/* Station milestone badge */}
                    <circle
                      r={radius}
                      fill="#D97706"
                      stroke="#FEF3C7"
                      strokeWidth={Math.max(1, 1.8 * scale.markerScale)}
                    />
                    <text
                      y={radius * 0.35}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize={Math.max(7, 9 * scale.markerScale)}
                      fontFamily="sans-serif"
                      fontWeight="bold"
                    >
                      {station.stationNumber}
                    </text>
                  </g>
                );
              })}
            </g>
          </g>
        )}

        {/* MOSES' EXODUS & SINAI 40-YEAR WILDERNESS ROUTE */}
        {layerState.showExodusRoute !== false && (
          <g id="exodus-path-layer">
            {routePaths
              .filter((r) => r.type === "exodus")
              .map((route) => (
                <g key={route.id}>
                  {/* Subtle red halo */}
                  <path
                    d={route.path}
                    stroke="#EF4444"
                    strokeWidth={6.5 * scale.routeStrokeScale}
                    strokeOpacity={0.28}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Rich crimson dashed line */}
                  <path
                    d={route.path}
                    stroke="#DC2626"
                    strokeWidth={3.0 * scale.routeStrokeScale}
                    strokeDasharray="6,3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              ))}

            {/* Exodus Stations & Milestones */}
            <g id="exodus-stations" pointerEvents="auto">
              {exodusStationPixels.map((station) => {
                const isSelected = selectedStationId === station.id;
                const radius = Math.max(5, (isSelected ? 9 : 7) * scale.markerScale);
                return (
                  <g
                    key={`exodus-station-${station.id}`}
                    transform={`translate(${station.pixel.x}, ${station.pixel.y})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onStationClick?.(station);
                    }}
                    cursor="pointer"
                    className="group"
                  >
                    <title>{`${station.stationNumber}. ${isRTL ? station.arabicTitle : station.title} - ${localizeBiblicalReference(station.scripture, isRTL ? "ar" : "en")}: ${isRTL ? station.arabicDescription : station.description}`}</title>
                    {isSelected && (
                      <circle
                        r={radius * 1.8}
                        fill="none"
                        stroke="#DC2626"
                        strokeWidth="2"
                        strokeDasharray="3 2"
                        opacity="0.8"
                      />
                    )}
                    <circle
                      r={radius}
                      fill="#DC2626"
                      stroke="#FEE2E2"
                      strokeWidth={Math.max(1, 1.8 * scale.markerScale)}
                    />
                    <text
                      y={radius * 0.35}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize={Math.max(7, 9 * scale.markerScale)}
                      fontFamily="sans-serif"
                      fontWeight="bold"
                    >
                      {station.stationNumber}
                    </text>
                  </g>
                );
              })}
            </g>
          </g>
        )}
      </g>

      {/* ============================================================= */}
      {/* 9. CARTOGRAPHIC GRATICULE GRID (Latitude & Longitude)         */}
      {/* ============================================================= */}
      {layerState.showGraticule && (
        <g id="graticule-grid" stroke="#78350F" strokeWidth={scale.graticuleStrokeWidth} strokeDasharray="3,5" opacity="0.25">
          {/* Parallels (Latitude) */}
          {parallels.map((lat) => {
            const { y } = geoToPixel(lat, 24);
            return (
              <g key={`lat-${lat}`}>
                <line x1="0" y1={y} x2={MAP_WIDTH} y2={y} />
                <text
                  x="12"
                  y={y - 4}
                  fill="#78350F"
                  fontSize={Math.max(2.8, 9 * scale.riverLabelScale)}
                  fontFamily="sans-serif"
                  fontStyle="italic"
                  stroke="none"
                  opacity="0.8"
                >
                  {lat}°N
                </text>
                <text
                  x={MAP_WIDTH - 28}
                  y={y - 4}
                  fill="#78350F"
                  fontSize={Math.max(2.8, 9 * scale.riverLabelScale)}
                  fontFamily="sans-serif"
                  fontStyle="italic"
                  stroke="none"
                  opacity="0.8"
                >
                  {lat}°N
                </text>
              </g>
            );
          })}

          {/* Meridians (Longitude) */}
          {meridians.map((lon) => {
            const { x } = geoToPixel(22, lon);
            return (
              <g key={`lon-${lon}`}>
                <line x1={x} y1="0" x2={x} y2={MAP_HEIGHT} />
                <text
                  x={x + 4}
                  y="16"
                  fill="#78350F"
                  fontSize={Math.max(2.8, 9 * scale.riverLabelScale)}
                  fontFamily="sans-serif"
                  fontStyle="italic"
                  stroke="none"
                  opacity="0.8"
                >
                  {lon}°E
                </text>
                <text
                  x={x + 4}
                  y={MAP_HEIGHT - 8}
                  fill="#78350F"
                  fontSize={Math.max(2.8, 9 * scale.riverLabelScale)}
                  fontFamily="sans-serif"
                  fontStyle="italic"
                  stroke="none"
                  opacity="0.8"
                >
                  {lon}°E
                </text>
              </g>
            );
          })}
        </g>
      )}

      {/* ============================================================= */}
      {/* 10. REALM, EMPIRE & REGIONAL LABELS                           */}
      {/* ============================================================= */}
      {layerState.showRegionLabels && (
        <g
          id="regional-realm-labels"
          fill="#451A03"
          stroke="#FFF8EE"
          strokeWidth={Math.max(1.2, 3.0 * scale.regionLabelScale)}
          strokeLinejoin="round"
          paintOrder="stroke fill"
          fontFamily={isRTL ? "'Amiri', 'Cairo', serif" : "'Cinzel', Georgia, serif"}
          fontWeight="bold"
          textAnchor="middle"
          style={{
            opacity: scale.regionLabelOpacity,
            transition: "opacity 0.25s ease",
          }}
        >
          {/* EGYPT / LAND OF HAM */}
          <text x="390" y="680" fontSize={Math.max(7.0, 26 * scale.regionLabelScale)} letterSpacing={isRTL ? "0" : `${4 * scale.regionLabelScale}px`}>
            {isRTL ? "مِصْر (أرض حام)" : "EGYPT"}
          </text>
          <text x="390" y={680 + Math.max(7, 22 * scale.regionLabelScale)} fontSize={Math.max(3.8, 13 * scale.regionLabelScale)} fontStyle="italic" fill="#78350F" letterSpacing={isRTL ? "0" : `${1 * scale.regionLabelScale}px`}>
            {isRTL ? "أرض الفراعنة ومصب النيل" : "Mizraim / Upper & Lower Egypt"}
          </text>

          {/* SINAI PENINSULA & WILDERNESS */}
          <text x="560" y="605" fontSize={Math.max(4.8, 16 * scale.regionLabelScale)} letterSpacing={isRTL ? "0" : `${3 * scale.regionLabelScale}px`}>
            {isRTL ? "شبه جزيرة سِينـاء" : "SINAI"}
          </text>
          <text x="560" y={605 + Math.max(5, 16 * scale.regionLabelScale)} fontSize={Math.max(3.4, 11 * scale.regionLabelScale)} fontStyle="italic" fill="#78350F">
            {isRTL ? "برية التيه (فاران وشور)" : "Wilderness of Paran & Sin"}
          </text>

          {/* ASIA MINOR / ANATOLIA (HITTITES) */}
          <text x="500" y="115" fontSize={Math.max(6.0, 22 * scale.regionLabelScale)} letterSpacing={isRTL ? "0" : `${3 * scale.regionLabelScale}px`}>
            {isRTL ? "آسيا الصغرى (أرض الحثيين)" : "ASIA MINOR (HITTITES)"}
          </text>

          {/* CANAAN / THE PROMISED LAND */}
          <text
            x="600"
            y="445"
            fontSize={Math.max(5.2, 18 * scale.regionLabelScale)}
            letterSpacing={isRTL ? "0" : `${3 * scale.regionLabelScale}px`}
            transform={isRTL ? undefined : "rotate(-82 600 445)"}
          >
            {isRTL ? "أرض كَنْعـان" : "CANAAN"}
          </text>

          {/* PHOENICIA */}
          <text
            x="650"
            y="380"
            fontSize={Math.max(3.6, 12 * scale.regionLabelScale)}
            letterSpacing={isRTL ? "0" : `${2 * scale.regionLabelScale}px`}
            transform={isRTL ? undefined : "rotate(-88 650 380)"}
            fill="#78350F"
          >
            {isRTL ? "فينيقية" : "PHOENICIA"}
          </text>

          {/* ARAM / SYRIA */}
          <text x="765" y="275" fontSize={Math.max(6.0, 22 * scale.regionLabelScale)} letterSpacing={isRTL ? "0" : `${3 * scale.regionLabelScale}px`}>
            {isRTL ? "أَرَام (سُوريا)" : "ARAM (SYRIA)"}
          </text>

          {/* MESOPOTAMIA */}
          <text x="965" y="215" fontSize={Math.max(6.5, 24 * scale.regionLabelScale)} letterSpacing={isRTL ? "0" : `${4 * scale.regionLabelScale}px`}>
            {isRTL ? "بلاد ما بين النهرين" : "MESOPOTAMIA"}
          </text>
          <text x="965" y={215 + Math.max(6, 18 * scale.regionLabelScale)} fontSize={Math.max(3.6, 12 * scale.regionLabelScale)} fontStyle="italic" fill="#78350F">
            {isRTL ? "أرض الرافدين (آرام النهرين)" : "Aram-Naharaim / Paddan-Aram"}
          </text>

          {/* ASSYRIA */}
          <text x="1100" y="260" fontSize={Math.max(6.5, 24 * scale.regionLabelScale)} letterSpacing={isRTL ? "0" : `${3 * scale.regionLabelScale}px`}>
            {isRTL ? "مملكة آشُـور" : "ASSYRIA"}
          </text>

          {/* URARTU / ARMENIA */}
          <text x="1080" y="80" fontSize={Math.max(5.5, 19 * scale.regionLabelScale)} letterSpacing={isRTL ? "0" : `${2 * scale.regionLabelScale}px`}>
            {isRTL ? "أورارتو (أرارات)" : "URARTU (ARMENIA)"}
          </text>

          {/* BABYLONIA / LAND OF SHINAR */}
          <text x="1175" y="445" fontSize={Math.max(6.5, 24 * scale.regionLabelScale)} letterSpacing={isRTL ? "0" : `${3 * scale.regionLabelScale}px`}>
            {isRTL ? "بَابِـل (أرض شنعار)" : "BABYLONIA"}
          </text>
          <text x="1205" y={445 + Math.max(7, 22 * scale.regionLabelScale)} fontSize={Math.max(4.0, 14 * scale.regionLabelScale)} fontStyle="italic" fill="#78350F">
            {isRTL ? "أرض الكلدانيين وسومر" : "Land of Shinar / Chaldea"}
          </text>

          {/* MEDIA */}
          <text x="1395" y="235" fontSize={Math.max(6.0, 22 * scale.regionLabelScale)} letterSpacing={isRTL ? "0" : `${3 * scale.regionLabelScale}px`}>
            {isRTL ? "مَادِي" : "MEDIA"}
          </text>

          {/* ELAM */}
          <text x="1425" y="425" fontSize={Math.max(6.0, 22 * scale.regionLabelScale)} letterSpacing={isRTL ? "0" : `${3 * scale.regionLabelScale}px`}>
            {isRTL ? "عِيلَام (شوشن)" : "ELAM (SUSIANA)"}
          </text>

          {/* PERSIA */}
          <text x="1620" y="585" fontSize={Math.max(6.5, 24 * scale.regionLabelScale)} letterSpacing={isRTL ? "0" : `${4 * scale.regionLabelScale}px`}>
            {isRTL ? "فَـارِس" : "PERSIA"}
          </text>

          {/* ARABIAN DESERT */}
          <text x="930" y="740" fontSize={Math.max(7.0, 26 * scale.regionLabelScale)} fill="#78350F" opacity="0.65" letterSpacing={isRTL ? "0" : `${5 * scale.regionLabelScale}px`}>
            {isRTL ? "صَحراء العَرب الكُبرى" : "ARABIAN DESERT"}
          </text>
        </g>
      )}

      {/* ============================================================= */}
      {/* 11. WATERWAY & RIVER LABELS                                   */}
      {/* ============================================================= */}
      {layerState.showRivers && (
        <g
          fill="#0E4861"
          fontSize={Math.max(3.2, 11 * scale.riverLabelScale)}
          fontStyle="italic"
          fontWeight="600"
          opacity="0.85"
          fontFamily={isRTL ? "'Amiri', 'Cairo', serif" : "sans-serif"}
        >
          <text x="445" y="750" transform="rotate(-80 445 750)">
            {isRTL ? "نهر النيل (سيحور)" : "Nile River (Gihon)"}
          </text>
          <text x="915" y="285" transform="rotate(26 915 285)">
            {isRTL ? "نهر الفرات (فرات)" : "Euphrates River (Perat)"}
          </text>
          <text x="1105" y="295" transform="rotate(48 1105 295)">
            {isRTL ? "نهر دجلة (حدّاقل)" : "Tigris River (Hiddekel)"}
          </text>
          <text x="645" y="475" transform={isRTL ? undefined : "rotate(-88 645 475)"}>
            {isRTL ? "نهر الأردن" : "Jordan River"}
          </text>
        </g>
      )}

      {/* ============================================================= */}
      {/* 12. SEA & GULF LABELS (Gilded Antique Typography)              */}
      {/* ============================================================= */}
      <g
        fill="#FFFFFF"
        fontFamily={isRTL ? "'Amiri', 'Cairo', serif" : "'Cinzel', Georgia, serif"}
        fontWeight="bold"
        opacity="0.9"
        textAnchor="middle"
      >
        {/* Mediterranean Sea */}
        <text
          x="310"
          y="325"
          fontSize={Math.max(5.2, 18 * scale.waterLabelScale)}
          letterSpacing={isRTL ? "0" : `${2 * scale.waterLabelScale}px`}
          stroke="#0A1926"
          strokeWidth={Math.max(1.0, 2.5 * scale.waterLabelScale)}
          strokeLinejoin="round"
          paintOrder="stroke fill"
        >
          {isRTL ? "البحر الكبير (البحر الأبيض المتوسط)" : "THE GREAT SEA (MEDITERRANEAN)"}
        </text>
        <text x="310" y={325 + Math.max(6, 21 * scale.waterLabelScale)} fontSize={Math.max(3.6, 12 * scale.waterLabelScale)} fontStyle="italic" fill="#E2E8F0">
          {isRTL ? "بحر الغرب وبحر الفلسطينيين" : "The Western Sea (Yam HaGadol)"}
        </text>

        {/* Black Sea */}
        <text x="600" y="32" fontSize={Math.max(4.2, 14 * scale.waterLabelScale)} letterSpacing={isRTL ? "0" : `${1 * scale.waterLabelScale}px`}>
          {isRTL ? "بحر البنطس (الأسود)" : "Pontus Euxinus (Black Sea)"}
        </text>

        {/* Caspian Sea */}
        <text x="1540" y="75" fontSize={Math.max(4.5, 15 * scale.waterLabelScale)} letterSpacing={isRTL ? "0" : `${1 * scale.waterLabelScale}px`}>
          {isRTL ? "بحر قزوين (هيركانيا)" : "Hyrcanian Sea (Caspian)"}
        </text>

        {/* Persian Gulf */}
        <text x="1540" y="720" fontSize={Math.max(4.8, 17 * scale.waterLabelScale)} letterSpacing={isRTL ? "0" : `${2 * scale.waterLabelScale}px`}>
          {isRTL ? "الخليج العربي (البحر الأسفل)" : "THE LOWER SEA (PERSIAN GULF)"}
        </text>

        {/* Red Sea - Positioned in central deep open waters to eliminate overlap with Sinai Peninsula */}
        <g transform="translate(710, 890) rotate(-55)">
          <text
            x="0"
            y="0"
            fontSize={Math.max(4.5, 15 * scale.waterLabelScale)}
            letterSpacing={isRTL ? "0" : `${2 * scale.waterLabelScale}px`}
            stroke="#0A1926"
            strokeWidth={Math.max(1.0, 2.5 * scale.waterLabelScale)}
            strokeLinejoin="round"
            paintOrder="stroke fill"
          >
            {isRTL ? "بحر سوف (البحر الأحمر)" : "RED SEA (YAM SUPH)"}
          </text>
        </g>
      </g>

      {/* ============================================================= */}
      {/* 13. ORNATE SCHOLARLY COMPASS ROSE                            */}
      {/* ============================================================= */}
      <g id="cartographic-compass" transform={`translate(180, 830) scale(${scale.compassScale})`}>
        {/* Outer Ring */}
        <circle cx="0" cy="0" r="48" fill="none" stroke="#78350F" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="44" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="2,3" />
        <circle cx="0" cy="0" r="32" fill="#FEF3C7" fillOpacity="0.4" stroke="#78350F" strokeWidth="0.8" />

        {/* 16-point Nautical Star */}
        {/* Major 4 Points (N, S, E, W) */}
        <g stroke="#573A18" strokeWidth="0.5">
          {/* North Point */}
          <polygon points="0,-48 -7,-12 0,0" fill="#800020" />
          <polygon points="0,-48 7,-12 0,0" fill="#B91C1C" />
          {/* South Point */}
          <polygon points="0,48 -7,12 0,0" fill="#78350F" />
          <polygon points="0,48 7,12 0,0" fill="#D97706" />
          {/* East Point */}
          <polygon points="48,0 12,-7 0,0" fill="#800020" />
          <polygon points="48,0 12,7 0,0" fill="#B91C1C" />
          {/* West Point */}
          <polygon points="-48,0 -12,-7 0,0" fill="#78350F" />
          <polygon points="-48,0 -12,7 0,0" fill="#D97706" />

          {/* Minor 4 Corner Points (NE, NW, SE, SW) */}
          <polygon points="28,-28 4,-12 0,0" fill="#CA8A04" />
          <polygon points="28,-28 12,-4 0,0" fill="#EAB308" />
          <polygon points="-28,-28 -4,-12 0,0" fill="#CA8A04" />
          <polygon points="-28,-28 -12,-4 0,0" fill="#EAB308" />
          <polygon points="28,28 4,12 0,0" fill="#CA8A04" />
          <polygon points="28,28 12,4 0,0" fill="#EAB308" />
          <polygon points="-28,28 -4,12 0,0" fill="#CA8A04" />
          <polygon points="-28,28 -12,4 0,0" fill="#EAB308" />
        </g>

        {/* Center Boss */}
        <circle cx="0" cy="0" r="5" fill="#800020" stroke="#D4AF37" strokeWidth="1.5" />

        {/* Fleur-de-lis on North */}
        <path
          d="M 0,-56 C -4,-51 -5,-48 0,-44 C 5,-48 4,-51 0,-56 Z"
          fill="#D4AF37"
          stroke="#78350F"
          strokeWidth="0.8"
        />

        {/* Cardinal Direction Letters */}
        <text x="0" y="-58" textAnchor="middle" fill="#800020" fontFamily="Georgia, serif" fontSize="13" fontWeight="bold">
          {isRTL ? "ش" : "N"}
        </text>
        <text x="0" y="63" textAnchor="middle" fill="#78350F" fontFamily="Georgia, serif" fontSize="12" fontWeight="bold">
          {isRTL ? "ج" : "S"}
        </text>
        <text x="59" y="4" textAnchor="middle" fill="#78350F" fontFamily="Georgia, serif" fontSize="12" fontWeight="bold">
          {isRTL ? "ق" : "E"}
        </text>
        <text x="-59" y="4" textAnchor="middle" fill="#78350F" fontFamily="Georgia, serif" fontSize="12" fontWeight="bold">
          {isRTL ? "غ" : "W"}
        </text>
      </g>

      {/* ============================================================= */}
      {/* 14. HISTORICAL CARTOUCHE & DETAILED MAP LEGEND               */}
      {/* ============================================================= */}
      <g
        id="historical-cartouche"
        transform="translate(1380, 715)"
        pointerEvents="auto"
        cursor="pointer"
        onClick={onOpenLegend}
        className="group"
      >
        <title>{isRTL ? "انقر لفتح دليل وشواهد المسارات ومفتاح الخريطة" : "Click to open comprehensive Route Guide & Map Legend"}</title>
        <rect
          width="360"
          height="215"
          rx="8"
          fill="#FEF3C7"
          stroke="#800020"
          strokeWidth="2"
          opacity="0.97"
          className="transition-all group-hover:stroke-[#D4AF37]"
        />
        {/* Inner gold border */}
        <rect
          x="4"
          y="4"
          width="352"
          height="207"
          rx="6"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1"
        />

        <text
          x="180"
          y="26"
          textAnchor="middle"
          fill="#800020"
          fontFamily="Georgia, serif"
          fontSize="14"
          fontWeight="bold"
          letterSpacing="1"
        >
          {isRTL ? "عَالَم العَهْد القَدِيم" : "THE OLD TESTAMENT WORLD"}
        </text>
        <text
          x="180"
          y="42"
          textAnchor="middle"
          fill="#78350F"
          fontFamily="sans-serif"
          fontSize="10.5"
          fontWeight="600"
        >
          {isRTL ? "مفتاح الخريطة والمسارات المقدسة" : "Cartographic Legend & Holy Biblical Routes"}
        </text>

        <line x1="20" y1="50" x2="340" y2="50" stroke="#D4AF37" strokeWidth="1" />

        {/* Legend Row 1: Historical City */}
        <circle cx="32" cy="66" r="5" fill="#800020" stroke="#D4AF37" strokeWidth="1.5" />
        <text x="48" y="70" fill="#451A03" fontFamily="sans-serif" fontSize="10" fontWeight="600">
          {isRTL ? "موقع كتابي تاريخي موثق أثرياً" : "Biblical Historical City / Archaeological Site"}
        </text>

        {/* Legend Row 2: Mountain Summits */}
        <polygon points="26,90 32,80 38,90" fill="#CA8A04" stroke="#78350F" strokeWidth="0.8" />
        <text x="48" y="88" fill="#451A03" fontFamily="sans-serif" fontSize="10" fontWeight="600">
          {isRTL ? "سلاسل الجبال والقمم (سيناء، أرارات، نيبو)" : "Topographical Mountain Summits & Ridges"}
        </text>

        {/* Legend Row 3: Abraham's Path */}
        <line x1="18" y1="106" x2="46" y2="106" stroke="#D97706" strokeWidth="2.5" strokeDasharray="6,2,2,2" />
        <circle cx="32" cy="106" r="4.5" fill="#D97706" stroke="#FEF3C7" strokeWidth="1" />
        <text x="48" y="109" fill="#92400E" fontFamily="sans-serif" fontSize="10" fontWeight="bold">
          {isRTL ? "مسار رحلة إبراهيم (أور إلى كنعان ومصر)" : "Abraham's Journey of Faith (Ur to Canaan & Egypt)"}
        </text>

        {/* Legend Row 4: Moses' Exodus */}
        <line x1="18" y1="126" x2="46" y2="126" stroke="#DC2626" strokeWidth="2.5" strokeDasharray="5,2.5" />
        <circle cx="32" cy="126" r="4.5" fill="#DC2626" stroke="#FEE2E2" strokeWidth="1" />
        <text x="48" y="129" fill="#991B1B" fontFamily="sans-serif" fontSize="10" fontWeight="bold">
          {isRTL ? "مسار خروج موسى وتيه سيناء (40 سنة)" : "Moses' Exodus & 40-Yr Wilderness Route"}
        </text>

        {/* Legend Row 5: Ancient Trade Caravan Routes */}
        <line x1="18" y1="146" x2="46" y2="146" stroke="#854D0E" strokeWidth="1.8" strokeDasharray="3,3" />
        <text x="48" y="149" fill="#573A18" fontFamily="sans-serif" fontSize="9.5" fontWeight="600">
          {isRTL ? "طرق التجارة والقوافل (طريق البحر ودرب الملك)" : "Ancient Trade Caravan Routes (Via Maris & King's Hwy)"}
        </text>

        {/* Legend Row 6: Fertile Crescent & Waterways */}
        <rect x="24" y="160" width="16" height="9" rx="2" fill="#65A30D" fillOpacity="0.3" stroke="#65A30D" strokeWidth="0.8" />
        <text x="48" y="168" fill="#365314" fontFamily="sans-serif" fontSize="9.5" fontWeight="600">
          {isRTL ? "الهلال الخصيب والأنهار المقدسة (النيل، الأردن، الفرات)" : "Fertile Crescent & Sacred Rivers (Nile, Jordan, Euphrates)"}
        </text>

        {/* Interactive Prompt Button at bottom of Cartouche */}
        <rect
          x="16"
          y="182"
          width="328"
          height="24"
          rx="6"
          fill="#800020"
          fillOpacity="0.08"
          stroke="#800020"
          strokeWidth="0.8"
          className="group-hover:fill-opacity-15"
        />
        <text
          x="180"
          y="198"
          textAnchor="middle"
          fill="#800020"
          fontFamily="sans-serif"
          fontSize="10"
          fontWeight="bold"
        >
          {isRTL ? "📖 انقر هنا لفتح الدليل والشواهد والمحطات الكاملة" : "📖 Click to open interactive Route Guide & Stations"}
        </text>
      </g>

      {/* ============================================================= */}
      {/* 15. GRAPHICAL ATLAS SCALE BAR (Miles & Kilometers)           */}
      {/* ============================================================= */}
      <g id="cartographic-scale-bar" transform="translate(1380, 936)">
        <rect width="360" height="46" rx="6" fill="#FEF3C7" stroke="#800020" strokeWidth="1.2" opacity="0.97" />
        <text x="180" y="15" textAnchor="middle" fill="#800020" fontFamily="Georgia, serif" fontSize="10" fontWeight="bold">
          {isRTL ? "مقياس الرسم الجغرافي (أميال وكيلومترات)" : "GRAPHIC SCALE OF MILES & KILOMETERS"}
        </text>

        {/* 1 degree lon at 32°N ≈ 94 km ≈ 53 px per 100 km */}
        <g transform="translate(45, 22)">
          {/* Black & white alternating bar segments */}
          <rect x="0" y="0" width="67.5" height="6" fill="#800020" stroke="#451A03" strokeWidth="0.5" />
          <rect x="67.5" y="0" width="67.5" height="6" fill="#FDFBF7" stroke="#451A03" strokeWidth="0.5" />
          <rect x="135" y="0" width="67.5" height="6" fill="#800020" stroke="#451A03" strokeWidth="0.5" />
          <rect x="202.5" y="0" width="67.5" height="6" fill="#FDFBF7" stroke="#451A03" strokeWidth="0.5" />

          {/* Scale Ticks & Labels */}
          <text x="0" y="15" textAnchor="middle" fill="#573A18" fontSize="8" fontFamily="sans-serif">0</text>
          <text x="67.5" y="15" textAnchor="middle" fill="#573A18" fontSize="8" fontFamily="sans-serif">100</text>
          <text x="135" y="15" textAnchor="middle" fill="#573A18" fontSize="8" fontFamily="sans-serif">200</text>
          <text x="202.5" y="15" textAnchor="middle" fill="#573A18" fontSize="8" fontFamily="sans-serif">300</text>
          <text x="270" y="15" textAnchor="middle" fill="#573A18" fontSize="8" fontFamily="sans-serif">400 mi</text>
        </g>
      </g>

      {/* ============================================================= */}
      {/* 16. NEATLINE BORDER WITH 1-DEGREE GRADUATION BLOCKS           */}
      {/* ============================================================= */}
      <g id="map-neatline-border">
        {/* Outer Heavy Border */}
        <rect
          x="0"
          y="0"
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          fill="none"
          stroke="#451A03"
          strokeWidth="3"
        />
        {/* Inner Parallel Border */}
        <rect
          x="6"
          y="6"
          width={MAP_WIDTH - 12}
          height={MAP_HEIGHT - 12}
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
};
