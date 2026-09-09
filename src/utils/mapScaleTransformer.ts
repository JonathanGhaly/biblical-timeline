import { useMemo } from "react";

/**
 * mapScaleTransformer.ts
 *
 * Dynamic Scale Transformer & CSS Containment utilities for the Biblical World Map.
 * Automatically counter-scales text, pins, leader lines, mountain symbols, waterways,
 * and regional labels as the map zoom level changes, ensuring crisp legibility,
 * proportional hierarchy, and preventing visual overlap at every zoom level.
 */

export interface MapScaleFactors {
  zoom: number;

  // Interactive Marker & Pin Scalers
  markerScale: number;          // Counter-scale for pin badges (shrinks on zoom)
  pinLabelScale: number;        // Counter-scale for location name pill typography
  anchorDotRadius: number;      // Exact geographic anchor point radius
  leaderLineWidth: number;      // Dashed leader line width for relaxed/displaced pins

  // Topographic & Physical Geography Scalers
  mountainSymbolScale: number;  // Peak pyramid sizing (avoids crowding valleys)
  mountainLabelScale: number;   // Peak summit text label sizing
  mountainStrokeWidth: number;  // Contour & peak border stroke width

  // Cartographic Text & Region Scalers
  regionLabelScale: number;     // Macro empires & regional designations (Mesopotamia, Egypt, etc.)
  regionLabelOpacity: number;   // Gracefully fades macro labels at deep zoom so local sites dominate
  waterLabelScale: number;      // Seas, gulfs, and ocean label sizing
  riverLabelScale: number;      // Waterway label sizing

  // Path & Linear Feature Scalers
  riverStrokeScale: number;     // River line thickness multiplier
  routeStrokeScale: number;     // Ancient trade routes & Exodus path stroke multiplier
  graticuleStrokeWidth: number; // Latitude/longitude coordinate grid lines
  compassScale: number;         // Ornate scholarly compass rose sizing

  // Spatial Level-of-Detail & Spacing
  lodTier: 1 | 2 | 3;           // 1: Global macro, 2: Regional, 3: Local high-density
  minPinDistance: number;       // Dynamic collision threshold for relaxation algorithm

  // CSS Containment Style Presets
  markerContainmentStyle: React.CSSProperties;
  labelContainmentStyle: React.CSSProperties;
}

/**
 * Computes all dynamic scale transformation factors based on current map zoom.
 */
export function computeMapScale(zoom: number): MapScaleFactors {
  const safeZoom = Math.max(0.4, Math.min(6.0, zoom));

  // 1. Marker and pin counter-scaling
  // Uses sub-linear power curve so pins don't become giant at low zoom or microscopic at high zoom
  const markerScale = Math.max(0.20, Math.min(1.3, 1 / Math.pow(safeZoom, 0.92)));
  const pinLabelScale = Math.max(0.22, Math.min(1.25, 1 / Math.pow(safeZoom, 1.02)));
  const anchorDotRadius = Math.max(1.0, 2.8 / Math.pow(safeZoom, 0.65));
  const leaderLineWidth = Math.max(0.6, 1.4 / Math.pow(safeZoom, 0.65));

  // 2. Physical features (Mountains & Ridges)
  const mountainSymbolScale = Math.max(0.18, 1 / Math.pow(safeZoom, 1.15));
  const mountainLabelScale = Math.max(0.20, 1 / Math.pow(safeZoom, 1.10));
  const mountainStrokeWidth = Math.max(0.3, 0.8 * mountainSymbolScale);

  // 3. Cartographic typography
  const regionLabelScale = Math.max(0.25, 1 / Math.pow(safeZoom, 1.05));
  // At deep zoom (> 2.6x), macro empire labels fade to avoid obstructing city pins
  const regionLabelOpacity =
    safeZoom > 2.6 ? Math.max(0.22, 1.0 - (safeZoom - 2.6) * 0.42) : 0.90;

  const waterLabelScale = Math.max(0.22, 1 / Math.pow(safeZoom, 1.08));
  const riverLabelScale = Math.max(0.22, 1 / Math.pow(safeZoom, 1.02));

  // 4. Linear paths & vectors
  const riverStrokeScale = Math.max(0.35, 1 / Math.pow(safeZoom, 0.48));
  const routeStrokeScale = Math.max(0.38, 1 / Math.pow(safeZoom, 0.50));
  const graticuleStrokeWidth = Math.max(0.16, 0.42 / Math.pow(safeZoom, 0.55));
  const compassScale = Math.max(0.38, 1 / Math.pow(safeZoom, 0.65));

  // 5. Level of Detail
  const lodTier: 1 | 2 | 3 = safeZoom < 1.0 ? 1 : safeZoom < 2.0 ? 2 : 3;
  const minPinDistance = Math.max(26 * markerScale, 13);

  // 6. Marker & Label Styling
  // Ensures clean rendering without offscreen texture rasterization caching
  const markerContainmentStyle: React.CSSProperties = {
    pointerEvents: "auto",
  };

  const labelContainmentStyle: React.CSSProperties = {
    pointerEvents: "none",
  };

  return {
    zoom: safeZoom,
    markerScale,
    pinLabelScale,
    anchorDotRadius,
    leaderLineWidth,
    mountainSymbolScale,
    mountainLabelScale,
    mountainStrokeWidth,
    regionLabelScale,
    regionLabelOpacity,
    waterLabelScale,
    riverLabelScale,
    riverStrokeScale,
    routeStrokeScale,
    graticuleStrokeWidth,
    compassScale,
    lodTier,
    minPinDistance,
    markerContainmentStyle,
    labelContainmentStyle,
  };
}

/**
 * React hook that memoizes dynamic scale factors across map zoom changes.
 */
export function useMapScaleTransformer(zoom: number): MapScaleFactors {
  return useMemo(() => computeMapScale(zoom), [zoom]);
}
