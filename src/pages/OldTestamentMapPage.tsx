import React, { useState, useMemo, useRef, useCallback } from "react";
import {
  MapPin,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  X,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  BookOpen,
  Calendar,
  Users,
  Navigation,
  Sparkles,
  Layers,
  Check,
  Mountain,
  Waves,
  Route,
  Grid,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import type { Person, BiblicalEvent, Language, BiblicalLocation } from "../types/genealogy";
import { BIBLICAL_LOCATIONS } from "../data/biblicalLocations";
import { MAP_WIDTH, MAP_HEIGHT, geoToPixel } from "../data/mapGeography";
import { BiblicalWorldSvgMap, type MapLayerVisibility } from "../components/BiblicalWorldSvgMap";
import { useMapScaleTransformer } from "../utils/mapScaleTransformer";

// Clean primary historical name helper for collision-free map labels
function getMapPinName(name: string): string {
  if (!name) return "";
  const clean = name.split("(")[0].split("/")[0].trim();
  return clean || name;
}

type OldTestamentMapPageProps = {
  events: BiblicalEvent[];
  people?: Person[];
  lang?: Language;
};

export default function OldTestamentMapPage({
  events,
  people = [],
  lang = "en",
}: OldTestamentMapPageProps) {
  // Selection State
  const [selectedLocation, setSelectedLocation] = useState<BiblicalLocation | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<BiblicalEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedEra, setSelectedEra] = useState<string>("All");
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);
  const [sidebarView, setSidebarView] = useState<"events" | "directory">("events");

  // Cartographic Layers State
  const [layers, setLayers] = useState<MapLayerVisibility>({
    showRivers: true,
    showMountains: true,
    showRoutes: true,
    showFertileCrescent: true,
    showGraticule: true,
    showRegionLabels: true,
  });
  const [showLayersMenu, setShowLayersMenu] = useState(false);

  // Mobile Bottom Sheet Collapse State (collapsed peek header vs 55% sheet)
  const [isMobileDrawerCollapsed, setIsMobileDrawerCollapsed] = useState(false);
  // Sidebar Visibility State (Desktop sidebar and Mobile drawer toggle)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Pan & Zoom Engine State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const mapViewportRef = useRef<HTMLDivElement>(null);
  const touchDistanceRef = useRef<number | null>(null);

  const isRTL = lang === "ar";
  const scaleFactors = useMapScaleTransformer(zoom);

  // Filter Categories
  const regions: { key: string; label: string; arabicLabel: string }[] = [
    { key: "All", label: "All Regions", arabicLabel: "جميع المناطق" },
    { key: "Mesopotamia", label: "Mesopotamia", arabicLabel: "ما بين النهرين" },
    { key: "Canaan", label: "Canaan", arabicLabel: "أرض كنعان" },
    { key: "Egypt", label: "Egypt", arabicLabel: "مصر القديمة" },
    { key: "Sinai", label: "Sinai", arabicLabel: "شبه جزيرة سيناء" },
    { key: "Anatolia", label: "Anatolia", arabicLabel: "آسيا الصغرى (الأناضول)" },
  ];

  const eras: { key: string; label: string; arabicLabel: string }[] = [
    { key: "All", label: "All Eras", arabicLabel: "كل العصور" },
    { key: "Patriarchal", label: "Patriarchal", arabicLabel: "عصر الآباء" },
    { key: "Exodus", label: "Exodus", arabicLabel: "عصر الخروج" },
    { key: "United Monarchy", label: "United Monarchy", arabicLabel: "المملكة المتحدة" },
  ];

  // Helper to match events with a biblical location
  const isLocationMatch = useCallback(
    (loc: BiblicalLocation, locationStr?: string) => {
      if (!locationStr) return false;
      const normalizedStr = locationStr.trim().toLowerCase();
      const locName = loc.name.toLowerCase();
      const arabicName = loc.arabicName.toLowerCase();
      const modernName = loc.modernName.toLowerCase();

      // Check direct inclusion or regex tokens
      if (
        normalizedStr.includes(loc.id.toLowerCase()) ||
        normalizedStr.includes(locName) ||
        normalizedStr.includes(arabicName) ||
        normalizedStr.includes(modernName)
      ) {
        return true;
      }

      // Check common aliases
      if (loc.id === "ur" && (normalizedStr.includes("chaldees") || normalizedStr.includes("أور"))) return true;
      if (loc.id === "jerusalem" && (normalizedStr.includes("zion") || normalizedStr.includes("صهيون") || normalizedStr.includes("يبوس"))) return true;
      if (loc.id === "mount-sinai" && (normalizedStr.includes("horeb") || normalizedStr.includes("حوريب") || normalizedStr.includes("سيناء"))) return true;
      if (loc.id === "rameses" && (normalizedStr.includes("goshen") || normalizedStr.includes("جاسان"))) return true;
      if (loc.id === "hebron" && (normalizedStr.includes("mamre") || normalizedStr.includes("ممرا"))) return true;
      if (loc.id === "mount-ararat" && (normalizedStr.includes("ararat") || normalizedStr.includes("أرارات"))) return true;

      return false;
    },
    []
  );

  // Map events to biblical locations (both via keyEvents array and location text match)
  const eventsByLocation = useMemo(() => {
    const map = new Map<string, BiblicalEvent[]>();
    BIBLICAL_LOCATIONS.forEach((loc) => {
      const matchedEvents = events.filter((event) => {
        const isKey = loc.keyEvents.includes(event.id);
        const isTextMatch = isLocationMatch(loc, event.location);
        return isKey || isTextMatch;
      });
      map.set(loc.id, matchedEvents);
    });
    return map;
  }, [events, isLocationMatch]);

  // Map people to locations by place of birth
  const peopleByLocation = useMemo(() => {
    const map = new Map<string, Person[]>();
    BIBLICAL_LOCATIONS.forEach((loc) => {
      const matchedPeople = people.filter((person) =>
        isLocationMatch(loc, person.placeOfBirth)
      );
      map.set(loc.id, matchedPeople);
    });
    return map;
  }, [people, isLocationMatch]);

  // Filtered Locations based on search, region, and era
  const filteredLocations = useMemo(() => {
    return BIBLICAL_LOCATIONS.filter((loc) => {
      if (selectedRegion !== "All" && loc.region !== selectedRegion) return false;
      if (selectedEra !== "All" && loc.biblicalEra !== selectedEra) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesName =
          loc.name.toLowerCase().includes(q) ||
          loc.arabicName.toLowerCase().includes(q) ||
          loc.modernName.toLowerCase().includes(q) ||
          loc.description.toLowerCase().includes(q) ||
          loc.arabicDescription.toLowerCase().includes(q) ||
          loc.region.toLowerCase().includes(q) ||
          loc.biblicalReferences.some((ref) => ref.toLowerCase().includes(q));

        if (!matchesName) return false;
      }

      return true;
    });
  }, [selectedRegion, selectedEra, searchQuery]);

  // Format BC/AD year label
  const formatYearLabel = (year?: number) => {
    if (year === undefined) return "";
    const absYear = Math.abs(year);
    if (lang === "ar") {
      return year < 0 ? `${absYear} ق.م` : `${year} م`;
    }
    return year < 0 ? `${absYear} BC` : `${year} AD`;
  };

  // Chronological list of events
  const chronologicalEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const ya = a.date?.year ?? 0;
      const yb = b.date?.year ?? 0;
      return ya - yb;
    });
  }, [events]);

  // Major Biblical centers given priority for label visibility
  const MAJOR_CENTERS = useMemo(
    () =>
      new Set([
        "jerusalem",
        "ur",
        "babylon",
        "nineveh",
        "mount-sinai",
        "hebron",
        "memphis",
        "haran",
        "mount-ararat",
        "shechem",
        "beersheba",
      ]),
    []
  );

  // Initial cluster separation offsets for dense Canaan corridor
  const CANAAN_OFFSETS: Record<string, { dx: number; dy: number }> = useMemo(
    () => ({
      jerusalem: { dx: -14, dy: 6 }, // West towards Mediterranean
      jericho: { dx: 18, dy: 2 },    // East towards Jordan Valley / Moab
      bethel: { dx: -4, dy: -14 },   // North-West
      shiloh: { dx: 8, dy: -18 },    // North-East
      hebron: { dx: -4, dy: 16 },    // South towards Negev
      shechem: { dx: 0, dy: -10 },
      samaria: { dx: -14, dy: 0 },
      rephidim: { dx: -10, dy: -6 },
    }),
    []
  );

  // Preferred label directions for ancient Near East cartography
  const PREFERRED_DIRECTIONS: Record<string, "top" | "bottom" | "left" | "right"> = useMemo(
    () => ({
      jerusalem: "left",
      hebron: "bottom",
      bethel: "top",
      jericho: "right",
      shiloh: "right",
      shechem: "top",
      samaria: "left",
      beersheba: "bottom",
      tyre: "left",
      sidon: "left",
      dan: "top",
      joppa: "left",
      gaza: "left",
      zoan: "top",
      rameses: "right",
      pithom: "bottom",
      on: "left",
      memphis: "bottom",
      "mount-sinai": "top",
      ur: "right",
      babylon: "right",
      nineveh: "right",
      haran: "top",
      "mount-ararat": "top",
      carchemish: "top",
      hattusa: "top",
      tarsus: "left",
    }),
    []
  );

  // NON-OVERLAPPING PLACED PINS & LABELS COMPUTATION (Relaxation + Collision Avoidance)
  const placedPins = useMemo(() => {
    // Counter-scaling via dynamic scale transformer:
    const { markerScale, pinLabelScale, minPinDistance, lodTier } = scaleFactors;
    const R = 13 * markerScale; // circle radius in map coords
    const minDistance = minPinDistance; // dynamic collision spacing

    // 1. Initial pin coordinates with geographic cluster separation offsets
    const pins = filteredLocations.map((loc) => {
      const { x, y } = geoToPixel(loc.coordinates[0], loc.coordinates[1]);
      const offset = CANAAN_OFFSETS[loc.id] || { dx: 0, dy: 0 };
      const locEvents = eventsByLocation.get(loc.id) || [];
      const locPeople = peopleByLocation.get(loc.id) || [];
      const totalActivity = locEvents.length + locPeople.length;
      return {
        loc,
        origX: x,
        origY: y,
        x: x + offset.dx,
        y: y + offset.dy,
        isDisplaced: false,
        labelDirection: (PREFERRED_DIRECTIONS[loc.id] ||
          (loc.coordinates[1] < 35.2 ? "left" : "right")) as
          | "top"
          | "bottom"
          | "left"
          | "right",
        showLabel: true,
        totalActivity,
        isSelected: selectedLocation?.id === loc.id,
      };
    });

    // 2. Iterative Relaxation to push points apart so pins NEVER overlap
    for (let iter = 0; iter < 35; iter++) {
      for (let i = 0; i < pins.length; i++) {
        for (let j = i + 1; j < pins.length; j++) {
          let dx = pins[j].x - pins[i].x;
          let dy = pins[j].y - pins[i].y;
          let d = Math.hypot(dx, dy);
          if (d < minDistance) {
            if (d < 0.1) {
              const angle = (((pins[i].loc.id.charCodeAt(0) * 47) % 360) * Math.PI) / 180;
              dx = Math.cos(angle);
              dy = Math.sin(angle);
              d = 1;
            }
            const overlap = (minDistance - d) * 0.5;
            const nx = dx / d;
            const ny = dy / d;
            pins[i].x -= nx * overlap;
            pins[i].y -= ny * overlap;
            pins[j].x += nx * overlap;
            pins[j].y += ny * overlap;
          }
        }
      }
      // Gentle constraint towards origin that preserves minimum separation
      for (const p of pins) {
        p.x += (p.origX - p.x) * 0.02;
        p.y += (p.origY - p.y) * 0.02;
      }
    }

    // 3. Mark displaced pins (for drawing leader line & ground dot)
    for (const p of pins) {
      p.isDisplaced = Math.hypot(p.x - p.origX, p.y - p.origY) > 5;
    }

    // 4. Collision-Free Label Direction & Bounding Box Placement
    const sortedIndices = [...pins.keys()].sort((a, b) => {
      if (pins[a].isSelected) return -1;
      if (pins[b].isSelected) return 1;
      const aMajor = MAJOR_CENTERS.has(pins[a].loc.id) ? 1 : 0;
      const bMajor = MAJOR_CENTERS.has(pins[b].loc.id) ? 1 : 0;
      if (aMajor !== bMajor) return bMajor - aMajor;
      return pins[b].totalActivity - pins[a].totalActivity;
    });

    const placedBoxes: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];

    sortedIndices.forEach((idx) => {
      const p = pins[idx];
      const cleanName = getMapPinName(isRTL ? p.loc.arabicName : p.loc.name);
      const labelW = (cleanName.length * (isRTL ? 7.6 : 7.0) + 16) * pinLabelScale;
      const labelH = 22 * pinLabelScale;

      const prefDir =
        PREFERRED_DIRECTIONS[p.loc.id] || (p.loc.coordinates[1] < 35.2 ? "left" : "right");
      const allDirs: Array<"top" | "bottom" | "left" | "right"> = [
        "left",
        "right",
        "top",
        "bottom",
      ];
      const candidateDirs = [prefDir, ...allDirs.filter((d) => d !== prefDir)];

      let chosenDir: "top" | "bottom" | "left" | "right" | null = null;
      let chosenBox: { x1: number; y1: number; x2: number; y2: number } | null = null;

      for (const dir of candidateDirs) {
        let b: { x1: number; y1: number; x2: number; y2: number };
        if (dir === "left") {
          b = {
            x1: p.x - R - 4 - labelW,
            y1: p.y - labelH / 2,
            x2: p.x - R - 4,
            y2: p.y + labelH / 2,
          };
        } else if (dir === "right") {
          b = {
            x1: p.x + R + 4,
            y1: p.y - labelH / 2,
            x2: p.x + R + 4 + labelW,
            y2: p.y + labelH / 2,
          };
        } else if (dir === "top") {
          b = {
            x1: p.x - labelW / 2,
            y1: p.y - R - 4 - labelH,
            x2: p.x + labelW / 2,
            y2: p.y - R - 4,
          };
        } else {
          b = {
            x1: p.x - labelW / 2,
            y1: p.y + R + 4,
            x2: p.x + labelW / 2,
            y2: p.y + R + 4 + labelH,
          };
        }

        // Check collision with already placed labels
        const boxCollision = placedBoxes.some(
          (o) => !(b.x2 < o.x1 || b.x1 > o.x2 || b.y2 < o.y1 || b.y1 > o.y2)
        );

        // Check collision with other pin circles
        const pinCollision = pins.some((other) => {
          if (other.loc.id === p.loc.id) return false;
          const cx = Math.max(b.x1, Math.min(other.x, b.x2));
          const cy = Math.max(b.y1, Math.min(other.y, b.y2));
          return Math.hypot(other.x - cx, other.y - cy) < R + 1;
        });

        if (!boxCollision && !pinCollision) {
          chosenDir = dir;
          chosenBox = b;
          break;
        }
      }

      if (chosenDir && chosenBox) {
        p.labelDirection = chosenDir;
        p.showLabel = true;
        placedBoxes.push(chosenBox);
      } else {
        if (p.isSelected || (MAJOR_CENTERS.has(p.loc.id) && zoom >= 1.3)) {
          p.labelDirection = prefDir;
          p.showLabel = true;
        } else {
          p.labelDirection = prefDir;
          p.showLabel = false;
        }
      }

      // Level of Detail 1 (Wide macro overview):
      // Keep minor sites with no historical events quiet until hovered to keep map pristine
      if (lodTier === 1 && !p.isSelected && !MAJOR_CENTERS.has(p.loc.id) && p.totalActivity === 0) {
        p.showLabel = false;
      }
    });

    return pins;
  }, [
    filteredLocations,
    scaleFactors,
    zoom,
    selectedLocation,
    eventsByLocation,
    peopleByLocation,
    isRTL,
    MAJOR_CENTERS,
    PREFERRED_DIRECTIONS,
    CANAAN_OFFSETS,
  ]);

  // Smoothly center the map on a given location
  const centerOnLocation = useCallback((lat: number, lon: number, targetZoom = 2.4) => {
    const { x, y } = geoToPixel(lat, lon);
    if (!mapViewportRef.current) return;

    const rect = mapViewportRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const newPanX = centerX - x * targetZoom;
    const newPanY = centerY - y * targetZoom;

    setZoom(targetZoom);
    setPan({ x: newPanX, y: newPanY });
  }, []);

  const handleSelectLocation = (loc: BiblicalLocation) => {
    setSelectedLocation(loc);
    setSelectedEvent(null);
    centerOnLocation(loc.coordinates[0], loc.coordinates[1]);
    // On mobile, automatically expand drawer if collapsed so user sees details
    setIsMobileDrawerCollapsed(false);
  };

  // Zoom and Pan Handlers
  const handleWheel = (e: React.WheelEvent) => {
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    const newZoom = Math.min(Math.max(zoom * zoomFactor, 1), 6);

    if (newZoom === zoom) return;

    if (mapViewportRef.current) {
      const rect = mapViewportRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const newPanX = mouseX - (mouseX - pan.x) * (newZoom / zoom);
      const newPanY = mouseY - (mouseY - pan.y) * (newZoom / zoom);

      setZoom(newZoom);
      setPan({ x: newPanX, y: newPanY });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchDistanceRef.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      setPan({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    } else if (e.touches.length === 2 && touchDistanceRef.current !== null) {
      const newDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = newDist / touchDistanceRef.current;
      touchDistanceRef.current = newDist;

      if (mapViewportRef.current) {
        const rect = mapViewportRef.current.getBoundingClientRect();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const centerX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
        const centerY = (touch1.clientY + touch2.clientY) / 2 - rect.top;

        setZoom((prevZoom) => {
          const nextZoom = Math.min(Math.max(prevZoom * factor, 1), 6);
          const zoomRatio = nextZoom / prevZoom;
          setPan((prevPan) => ({
            x: centerX - (centerX - prevPan.x) * zoomRatio,
            y: centerY - (centerY - prevPan.y) * zoomRatio,
          }));
          return nextZoom;
        });
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchDistanceRef.current = null;
  };

  const zoomIn = () => setZoom((prev) => Math.min(prev * 1.3, 6));
  const zoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(prev / 1.3, 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Active details for the selected location
  const activeEvents = selectedLocation
    ? eventsByLocation.get(selectedLocation.id) || []
    : [];

  const activePeople = selectedLocation
    ? peopleByLocation.get(selectedLocation.id) || []
    : [];

  return (
    <div
      id="old-testament-map-root"
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full h-full flex flex-col font-serif bg-[#FDFBF7] text-[#1C1917] select-none"
    >
      {/* HEADER BAR */}
      <header className="px-4 py-3 bg-[#FBF8EF] border-b border-[#D4AF37]/30 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-lg bg-[#800020] text-[#D4AF37] flex items-center justify-center shadow-sm shrink-0 border border-[#D4AF37]/50">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className={`text-lg md:text-xl font-bold text-[#800020] leading-tight ${isRTL ? "font-['Amiri']" : "font-['Cinzel']"}`}>
              {isRTL ? "عالم العهد القديم والجغرافيا الكتابية" : "The Old Testament World"}
            </h1>
            <p className="text-xs text-[#78716C] font-sans">
              {isRTL
                ? "خريطة تفاعلية لتضاريس ومدن العهد القديم مع المواقع الأثرية الحديثة"
                : "Interactive Historical Cartography & Archaeological Sites"}
            </p>
          </div>
        </div>

        {/* Top Controls & Quick Stats */}
        <div className="flex items-center gap-2 font-sans text-xs">
          {/* Show / Hide Sidebar Toggle Button */}
          <button
            id="header-toggle-sidebar-btn"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 font-semibold text-xs shadow-xs min-h-[36px] active:scale-95 cursor-pointer ${
              isSidebarOpen
                ? "bg-[#F5E8CA] border-[#D4AF37] text-[#800020] hover:bg-[#EBDCB9]"
                : "bg-white border-stone-300 text-stone-700 hover:bg-[#F5E8CA] hover:text-[#800020]"
            }`}
            title={
              isSidebarOpen
                ? isRTL ? "إخفاء القائمة الجانبية للخريطة" : "Hide Map Sidebar"
                : isRTL ? "إظهار القائمة الجانبية للخريطة" : "Show Map Sidebar"
            }
            aria-label={isSidebarOpen ? "Hide Map Sidebar" : "Show Map Sidebar"}
          >
            {isSidebarOpen ? (
              <>
                <PanelLeftClose className="w-4 h-4 text-[#800020]" />
                <span className="font-medium">{isRTL ? "إخفاء القائمة" : "Hide Sidebar"}</span>
              </>
            ) : (
              <>
                <PanelLeftOpen className="w-4 h-4 text-[#800020]" />
                <span className="font-medium">{isRTL ? "إظهار القائمة" : "Show Sidebar"}</span>
              </>
            )}
          </button>

          <span className="px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#854D0E] font-semibold border border-[#FDE68A]">
            {filteredLocations.length} {isRTL ? "مواقع محددة" : "Biblical Sites"}
          </span>
          {selectedLocation && (
            <button
              id="clear-location-btn"
              onClick={() => setSelectedLocation(null)}
              className="px-2.5 py-1 rounded-full bg-[#E7E5E4] text-[#44403C] hover:bg-[#D6D3D1] transition flex items-center gap-1 font-semibold"
            >
              <X className="w-3.5 h-3.5" />
              {isRTL ? "عرض الكل" : "Show All"}
            </button>
          )}
        </div>
      </header>

      {/* MAIN CONTENT AREA: Responsive Top/Bottom on Mobile, Side-by-Side on Desktop */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* ========================================================= */}
        {/* INTERACTIVE SIDEBAR (DESKTOP) / DETAILS DRAWER (MOBILE)  */}
        {/* ========================================================= */}
        <aside
          id="location-sidebar-drawer"
          className={`
            bg-[#FDFBF7] border-stone-300 z-40 transition-all duration-300 flex flex-col
            ${/* Mobile: when closed, zero height; when open, either 14 (peek) or 55% */ ""}
            ${
              !isSidebarOpen
                ? "h-0 md:h-full md:w-0 opacity-0 pointer-events-none overflow-hidden border-0"
                : isMobileDrawerCollapsed
                ? "order-2 h-14 md:h-full md:order-1 md:w-[35%] opacity-100 shrink-0"
                : "order-2 h-[55%] md:h-full md:order-1 md:w-[35%] opacity-100 shrink-0"
            }
            ${/* Desktop layout border styling */ ""}
            ${
              isSidebarOpen
                ? `md:border-r ${isRTL ? "md:border-l md:border-r-0" : ""} border-t md:border-t-0 shadow-lg md:shadow-none`
                : ""
            }
          `}
        >
          {/* MOBILE PEEK HEADER & DRAG HANDLE (Always visible on mobile) */}
          <div
            className="md:hidden flex items-center justify-between px-4 py-2 bg-[#F5E8CA] border-b border-[#D4AF37]/40 cursor-pointer min-h-[44px]"
            onClick={() => setIsMobileDrawerCollapsed((prev) => !prev)}
            role="button"
            tabIndex={0}
            aria-label={isMobileDrawerCollapsed ? "Expand Details" : "Collapse Details"}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-[#800020]/40 rounded-full mx-auto" />
              <span className="text-xs font-bold text-[#800020] uppercase tracking-wider font-sans">
                {selectedLocation
                  ? `${isRTL ? selectedLocation.arabicName : selectedLocation.name}`
                  : `${isRTL ? "دليل المواقع الكتابية" : "Biblical Locations Directory"} (${filteredLocations.length})`}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                id="mobile-drawer-toggle-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileDrawerCollapsed((prev) => !prev);
                }}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#800020] hover:bg-[#EBDCB9] rounded-md transition"
                title={isMobileDrawerCollapsed ? "Expand" : "Collapse"}
              >
                {isMobileDrawerCollapsed ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              <button
                id="mobile-close-sidebar-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSidebarOpen(false);
                }}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#800020] hover:bg-[#EBDCB9] rounded-md transition"
                title={isRTL ? "إخفاء القائمة" : "Hide Sidebar"}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SIDEBAR BODY (Visible when not collapsed on mobile, always on desktop) */}
          <div
            className={`flex-1 flex flex-col overflow-hidden ${
              isMobileDrawerCollapsed ? "hidden md:flex" : "flex"
            }`}
          >
            {/* SEARCH & FILTER CONTROLS */}
            <div className="p-3 bg-[#FBF8EF] border-b border-stone-200 space-y-2.5 shrink-0 font-sans">
              {/* Search Bar + Desktop Hide Sidebar Button */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 text-stone-400 ${isRTL ? "right-3" : "left-3"}`} />
                  <input
                    id="map-location-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      isRTL
                        ? "ابحث عن مدينة، موقع أثري، أو شاهد كتابي..."
                        : "Search city, modern site, or scripture..."
                    }
                    className={`w-full h-10 text-xs bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent ${
                      isRTL ? "pr-9 pl-8" : "pl-9 pr-8"
                    }`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className={`absolute top-1/2 -translate-y-1/2 min-w-[32px] min-h-[32px] flex items-center justify-center text-stone-400 hover:text-stone-600 ${
                        isRTL ? "left-1" : "right-1"
                      }`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Hide sidebar button inside desktop search header */}
                <button
                  id="sidebar-internal-hide-btn"
                  onClick={() => setIsSidebarOpen(false)}
                  className="hidden md:flex min-w-[36px] min-h-[36px] items-center justify-center rounded-lg bg-white border border-stone-300 text-stone-600 hover:bg-[#F5E8CA] hover:text-[#800020] transition shadow-2xs cursor-pointer"
                  title={isRTL ? "إخفاء القائمة الجانبية" : "Hide Map Sidebar"}
                  aria-label="Hide Map Sidebar"
                >
                  {isRTL ? <PanelRightClose className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                </button>
              </div>

              {/* Region Filter Chips (Scrollable with min 44px tap target) */}
              <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
                {regions.map((reg) => {
                  const isActive = selectedRegion === reg.key;
                  return (
                    <button
                      key={reg.key}
                      id={`region-chip-${reg.key}`}
                      onClick={() => setSelectedRegion(reg.key)}
                      className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center justify-center shrink-0 border ${
                        isActive
                          ? "bg-[#800020] text-[#D4AF37] border-[#800020] shadow-sm font-bold"
                          : "bg-[#F5E8CA]/60 text-[#451A03] border-[#D4AF37]/30 hover:bg-[#F5E8CA]"
                      }`}
                    >
                      {isRTL ? reg.arabicLabel : reg.label}
                    </button>
                  );
                })}
              </div>

              {/* Biblical Era Filter Chips (min 44px tap target) */}
              <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
                {eras.map((era) => {
                  const isActive = selectedEra === era.key;
                  return (
                    <button
                      key={era.key}
                      id={`era-chip-${era.key}`}
                      onClick={() => setSelectedEra(era.key)}
                      className={`min-h-[44px] px-3 py-1.5 rounded-md text-[11px] font-medium whitespace-nowrap transition flex items-center justify-center shrink-0 border ${
                        isActive
                          ? "bg-[#1A365D] text-white border-[#1A365D]"
                          : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      {isRTL ? era.arabicLabel : era.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PLACES TABS ROW (Horizontally Scrollable Left and Right) */}
            <div
              id="places-tabs-container"
              className="bg-[#FBF8EF] border-b border-stone-200 px-3 py-2 shrink-0 select-none font-sans"
            >
              <div className="flex items-center justify-between text-xs font-bold text-[#800020] mb-1.5 px-0.5">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#800020]" />
                  <span>{isRTL ? "مواقع الكتاب المقدس" : "Biblical Places & Cities"}</span>
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold text-stone-500 font-sans mr-1">
                    {filteredLocations.length} {isRTL ? "موقع" : "sites"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("places-horizontal-tabs");
                      if (el) el.scrollBy({ left: isRTL ? 180 : -180, behavior: "smooth" });
                    }}
                    className="w-7 h-7 min-w-[28px] min-h-[28px] flex items-center justify-center rounded-md border border-stone-300 bg-white hover:bg-[#F5E8CA] text-stone-600 active:scale-95 transition cursor-pointer"
                    title={isRTL ? "تمرير لليمين" : "Scroll Left"}
                    aria-label={isRTL ? "Scroll tabs right" : "Scroll tabs left"}
                  >
                    {isRTL ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("places-horizontal-tabs");
                      if (el) el.scrollBy({ left: isRTL ? -180 : 180, behavior: "smooth" });
                    }}
                    className="w-7 h-7 min-w-[28px] min-h-[28px] flex items-center justify-center rounded-md border border-stone-300 bg-white hover:bg-[#F5E8CA] text-stone-600 active:scale-95 transition cursor-pointer"
                    title={isRTL ? "تمرير لليسار" : "Scroll Right"}
                    aria-label={isRTL ? "Scroll tabs left" : "Scroll tabs right"}
                  >
                    {isRTL ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Horizontal Scrollable Tabs Strip (Left & Right Scroll) */}
              <div
                id="places-horizontal-tabs"
                className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1.5 scrollbar-thin scroll-smooth"
              >
                {/* "All Places" Tab */}
                <button
                  id="place-tab-all"
                  onClick={() => {
                    setSelectedLocation(null);
                    setSidebarView("events");
                  }}
                  className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 shrink-0 border ${
                    selectedLocation === null
                      ? "bg-[#800020] text-[#D4AF37] border-[#800020] shadow-sm"
                      : "bg-white text-stone-700 border-stone-200 hover:bg-[#F5E8CA]/60 hover:border-[#D4AF37]/50"
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 shrink-0" />
                  <span>{isRTL ? "جميع المواقع والأحداث" : "All Sites & Events"}</span>
                </button>

                {/* Individual Location Tabs */}
                {filteredLocations.map((loc) => {
                  const isCurrent = selectedLocation?.id === loc.id;
                  const locEvents = eventsByLocation.get(loc.id) || [];
                  const eventCount = locEvents.length;

                  return (
                    <button
                      key={`place-tab-${loc.id}`}
                      id={`place-tab-${loc.id}`}
                      onClick={() => {
                        handleSelectLocation(loc);
                        setSidebarView("events");
                      }}
                      className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 shrink-0 border ${
                        isCurrent
                          ? "bg-[#800020] text-[#D4AF37] border-[#800020] shadow-sm font-bold scale-[1.02]"
                          : "bg-white text-stone-700 border-stone-200 hover:bg-[#FBF8EF] hover:border-[#D4AF37]/60"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isCurrent ? "bg-[#D4AF37]" : "bg-[#800020]"
                        }`}
                      />
                      <span className={isRTL ? "font-['Amiri'] font-bold text-sm" : "font-['Cinzel']"}>
                        {isRTL ? loc.arabicName : loc.name}
                      </span>
                      {eventCount > 0 && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-sans font-bold ${
                            isCurrent
                              ? "bg-[#D4AF37] text-[#800020]"
                              : "bg-stone-100 text-stone-600 border border-stone-200"
                          }`}
                        >
                          {eventCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* EVENTS & DETAILS BODY (Vertically Scrollable Up and Down) */}
            <div
              id="sidebar-vertical-events-scroll"
              className="flex-1 overflow-y-auto p-3.5 space-y-3.5 font-sans text-sm scrollbar-thin scroll-smooth"
            >
              {/* Secondary Switcher when viewing all: Events Timeline vs Sites Directory */}
              {selectedLocation === null && (
                <div className="flex items-center justify-between pb-1">
                  <div className="flex bg-stone-100 p-1 rounded-lg border border-stone-200 gap-1 w-full text-xs">
                    <button
                      id="toggle-events-view-btn"
                      onClick={() => setSidebarView("events")}
                      className={`flex-1 min-h-[38px] py-1.5 px-3 rounded-md font-bold flex items-center justify-center gap-1.5 transition ${
                        sidebarView === "events"
                          ? "bg-[#800020] text-[#D4AF37] shadow-xs"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{isRTL ? "تسلسل الأحداث الكتابية" : "Biblical Events Stream"}</span>
                    </button>
                    <button
                      id="toggle-directory-view-btn"
                      onClick={() => setSidebarView("directory")}
                      className={`flex-1 min-h-[38px] py-1.5 px-3 rounded-md font-bold flex items-center justify-center gap-1.5 transition ${
                        sidebarView === "directory"
                          ? "bg-[#800020] text-[#D4AF37] shadow-xs"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      <Grid className="w-3.5 h-3.5" />
                      <span>{isRTL ? "دليل المواقع الأثرية" : "Sites Directory"}</span>
                    </button>
                  </div>
                </div>
              )}

              {selectedLocation ? (
                /* === SINGLE LOCATION FULL DETAILS & VERTICAL EVENTS CARD === */
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  {/* Card Top Action Bar */}
                  <div className="flex items-center justify-between pb-1 border-b border-stone-200">
                    <button
                      id="back-to-locations-list"
                      onClick={() => setSelectedLocation(null)}
                      className="min-h-[44px] px-3.5 rounded-lg bg-[#F5E8CA] text-[#451A03] hover:bg-[#EBDCB9] transition flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <span>{isRTL ? "→" : "←"}</span>
                      <span>{isRTL ? "عرض كل الأحداث" : "Show All Events"}</span>
                    </button>

                    <button
                      id="focus-map-location-btn"
                      onClick={() =>
                        centerOnLocation(
                          selectedLocation.coordinates[0],
                          selectedLocation.coordinates[1],
                          3.2
                        )
                      }
                      className="min-h-[44px] px-3.5 rounded-lg bg-[#800020] text-[#D4AF37] hover:bg-[#991B1B] transition flex items-center gap-1.5 text-xs font-bold shadow-sm"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{isRTL ? "تركيز على الخريطة" : "Center on Map"}</span>
                    </button>
                  </div>

                  {/* Location Title & Badges */}
                  <div className="space-y-1.5 bg-[#FBF8EF] p-3.5 rounded-xl border border-[#D4AF37]/40 shadow-xs">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#800020] text-[#D4AF37]">
                        {selectedLocation.region}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#1A365D] text-white">
                        {selectedLocation.biblicalEra}
                      </span>
                    </div>

                    <h2 className={`text-xl font-bold text-[#800020] ${isRTL ? "font-['Amiri']" : "font-['Cinzel']"}`}>
                      {selectedLocation.name}
                    </h2>
                    <h3 className="text-base font-semibold text-[#854D0E] font-['Amiri']">
                      {selectedLocation.arabicName}
                    </h3>

                    <div className="pt-2 text-xs text-stone-600 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#800020] shrink-0" />
                        <span className="font-semibold text-stone-700">
                          {isRTL ? "الموقع الأثري الحديث:" : "Modern Archaeological Site:"}
                        </span>
                        <span className="text-stone-800 font-medium">{selectedLocation.modernName}</span>
                      </div>
                      <div className="text-[11px] text-stone-500 font-mono">
                        {selectedLocation.coordinates[0].toFixed(4)}° N,{" "}
                        {selectedLocation.coordinates[1].toFixed(4)}° E
                      </div>
                    </div>
                  </div>

                  {/* Historical Context Narrative */}
                  <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#800020] uppercase tracking-wider">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{isRTL ? "السياق التاريخي والكتابي" : "Biblical Context"}</span>
                    </div>
                    <p className="text-stone-700 leading-relaxed text-xs">
                      {isRTL
                        ? selectedLocation.arabicDescription
                        : selectedLocation.description}
                    </p>
                    {isRTL && (
                      <p className="text-stone-500 text-[11px] leading-relaxed italic border-t border-stone-100 pt-2 font-sans">
                        {selectedLocation.description}
                      </p>
                    )}
                  </div>

                  {/* Scripture References */}
                  {selectedLocation.biblicalReferences.length > 0 && (
                    <div className="p-3 bg-[#FEF3C7]/40 rounded-xl border border-[#FDE68A] space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#854D0E]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isRTL ? "الشواهد والآيات الكتابية" : "Scripture References"}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedLocation.biblicalReferences.map((ref) => (
                          <span
                            key={ref}
                            className="px-2.5 py-1 rounded-md bg-[#FEF3C7] text-[#78350F] text-xs font-semibold border border-[#FDE68A]"
                          >
                            {ref}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Associated Biblical Figures */}
                  {activePeople.length > 0 && (
                    <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A365D]">
                        <Users className="w-3.5 h-3.5" />
                        <span>
                          {isRTL ? "شخصيات كتابية ارتبطت بالموقع" : "Associated Biblical Figures"} (
                          {activePeople.length})
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {activePeople.map((person) => (
                          <span
                            key={person.id}
                            className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 text-xs font-medium border border-stone-200"
                          >
                            👤 {person.name}
                            {person.yearsLived ? ` (${person.yearsLived} yrs)` : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* VERTICALLY SCROLLABLE EVENTS AT THIS LOCATION */}
                  <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-stone-100">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#800020]">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {isRTL
                            ? `الأحداث المسجلة في ${selectedLocation.arabicName}`
                            : `Biblical Events in ${selectedLocation.name}`}{" "}
                          ({activeEvents.length})
                        </span>
                      </div>
                    </div>

                    {activeEvents.length === 0 ? (
                      <div className="text-xs text-stone-500 p-3 bg-stone-50 rounded-lg space-y-2">
                        <p className="italic">
                          {isRTL
                            ? "لا توجد أحداث محددة حصراً بهذا الموقع، إليك أحداث العهد القديم في هذا العصر:"
                            : "No events specifically tagged with this site; explore era events below:"}
                        </p>
                        {/* Fallback to relevant events from this era */}
                        <div className="space-y-2 pt-1">
                          {chronologicalEvents.slice(0, 5).map((event) => (
                            <div
                              key={`era-ev-${event.id}`}
                              onClick={() => setSelectedEvent(event)}
                              className="p-2.5 bg-white rounded-lg border border-stone-200 hover:border-[#800020] hover:bg-[#FBF8EF] cursor-pointer transition space-y-1"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-xs font-bold text-stone-900 leading-snug">
                                  {event.title}
                                </h4>
                                {event.date?.year !== undefined && (
                                  <span className="text-[11px] font-bold text-[#B91C1C] shrink-0">
                                    {formatYearLabel(event.date.year)}
                                  </span>
                                )}
                              </div>
                              {event.description && (
                                <p className="text-[11px] text-stone-600 line-clamp-2">
                                  {event.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {/* Only up to 5 events visible simultaneously, scrollable container */}
                        <div className="space-y-2.5 max-h-[460px] md:max-h-[480px] overflow-y-auto pr-1.5 scrollbar-thin">
                          {activeEvents.map((event) => (
                            <div
                              key={event.id}
                              id={`event-card-${event.id}`}
                              onClick={() => setSelectedEvent(event)}
                              className="p-3 rounded-xl border border-stone-200 hover:border-[#800020] hover:bg-[#FBF8EF] cursor-pointer transition shadow-2xs group space-y-1.5"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#800020] leading-snug">
                                  {event.title}
                                </h4>
                                {event.date?.year !== undefined && (
                                  <span className="text-[11px] font-bold text-[#B91C1C] bg-red-50 px-2 py-0.5 rounded-full border border-red-100 shrink-0">
                                    {formatYearLabel(event.date.year)}
                                  </span>
                                )}
                              </div>
                              {event.description && (
                                <p className="text-[11px] text-stone-600 line-clamp-2">
                                  {event.description}
                                </p>
                              )}
                              {event.biblicalReferences && event.biblicalReferences.length > 0 && (
                                <div className="text-[10px] text-[#854D0E] font-semibold pt-1 flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" />
                                  <span>{event.biblicalReferences[0]}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        {activeEvents.length > 5 && (
                          <div className="text-center pt-1.5 text-[11px] font-medium text-stone-500 border-t border-stone-100 flex items-center justify-center gap-1">
                            <ChevronDown className="w-3.5 h-3.5 text-[#800020]" />
                            <span>
                              {isRTL
                                ? `يوجد ${activeEvents.length - 5} أحداث إضافية — مرر لأسفل للعرض`
                                : `${activeEvents.length - 5} more events below — scroll down to view`}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : sidebarView === "events" ? (
                /* === ALL CHRONOLOGICAL BIBLICAL EVENTS STREAM (Up & Down Scroll) === */
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-600 pb-1 border-b border-stone-200">
                    <span className="font-semibold">
                      {isRTL
                        ? "الأحداث الكتابية مرتبة زمنياً (ق.م)"
                        : "Old Testament Chronological Stream"}
                    </span>
                    <span className="font-bold text-[#800020] font-sans">
                      {chronologicalEvents.length} {isRTL ? "حدث" : "events"}
                    </span>
                  </div>

                  {/* Only 5 events visible maximum, scrollable stream */}
                  <div className="space-y-2.5 max-h-[460px] md:max-h-[480px] overflow-y-auto pr-1.5 scrollbar-thin">
                    {chronologicalEvents.map((event) => {
                      // Check if event has a matching biblical location on map
                      const matchedLoc = filteredLocations.find((loc) =>
                        isLocationMatch(loc, event.location)
                      );

                      return (
                        <div
                          key={`all-event-${event.id}`}
                          id={`chron-event-${event.id}`}
                          onClick={() => setSelectedEvent(event)}
                          className="p-3 bg-white rounded-xl border border-stone-200 hover:border-[#800020] hover:bg-[#FBF8EF] cursor-pointer transition shadow-2xs group space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#800020] leading-snug">
                              {event.title}
                            </h4>
                            {event.date?.year !== undefined && (
                              <span className="text-[11px] font-bold text-[#B91C1C] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100 shrink-0">
                                {formatYearLabel(event.date.year)}
                              </span>
                            )}
                          </div>

                          {event.description && (
                            <p className="text-[11px] text-stone-600 leading-relaxed line-clamp-2">
                              {event.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100 text-[11px]">
                            {/* Location Tag - Clicking it focuses on Map */}
                            {matchedLoc ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectLocation(matchedLoc);
                                }}
                                className="inline-flex items-center gap-1 text-[#800020] hover:text-[#991B1B] font-semibold hover:underline bg-[#F5E8CA]/60 px-2 py-0.5 rounded-md"
                              >
                                <MapPin className="w-3 h-3 text-[#800020]" />
                                <span>{isRTL ? matchedLoc.arabicName : matchedLoc.name}</span>
                              </button>
                            ) : event.location ? (
                              <span className="text-stone-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-stone-400" />
                                <span>{event.location}</span>
                              </span>
                            ) : (
                              <span />
                            )}

                            {event.biblicalReferences && event.biblicalReferences.length > 0 && (
                              <span className="text-[10px] text-[#854D0E] font-medium font-sans">
                                {event.biblicalReferences[0]}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {chronologicalEvents.length > 5 && (
                    <div className="text-center pt-1.5 text-[11px] font-medium text-stone-500 border-t border-stone-100 flex items-center justify-center gap-1">
                      <ChevronDown className="w-3.5 h-3.5 text-[#800020]" />
                      <span>
                        {isRTL
                          ? `يوجد ${chronologicalEvents.length - 5} أحداث إضافية — مرر لأسفل لعرض التسلسل الكامل`
                          : `${chronologicalEvents.length - 5} more events below — scroll down to explore complete stream`}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                /* === ALL SITES DIRECTORY LIST === */
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-stone-500 pb-1">
                    <span>
                      {isRTL ? "اختر موقعاً لعرض تفاصيله وأحداثه" : "Select a location to explore"}
                    </span>
                    <span className="font-semibold text-stone-700 font-sans">
                      {filteredLocations.length} {isRTL ? "مواقع" : "sites"}
                    </span>
                  </div>

                  {filteredLocations.length === 0 ? (
                    <div className="p-6 text-center text-stone-500 text-xs bg-stone-50 rounded-xl border border-stone-200">
                      {isRTL ? "لم يتم العثور على مواقع تطابق البحث." : "No locations match your filter."}
                    </div>
                  ) : (
                    filteredLocations.map((loc) => {
                      const eventCount = (eventsByLocation.get(loc.id) || []).length;
                      return (
                        <div
                          key={loc.id}
                          id={`location-card-${loc.id}`}
                          role="button"
                          tabIndex={0}
                          onClick={() => handleSelectLocation(loc)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              handleSelectLocation(loc);
                            }
                          }}
                          className="p-3 bg-white rounded-xl border border-stone-200 hover:border-[#D4AF37] hover:bg-[#FBF8EF] cursor-pointer transition shadow-2xs group space-y-1 min-h-[44px]"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className={`text-sm font-bold text-[#800020] group-hover:text-[#991B1B] ${isRTL ? "font-['Amiri']" : "font-['Cinzel']"}`}>
                                {loc.name}
                              </h4>
                              <span className="text-xs text-[#854D0E] font-['Amiri'] font-semibold">
                                {loc.arabicName}
                              </span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F5E8CA] text-[#451A03] shrink-0">
                              {loc.region}
                            </span>
                          </div>

                          <p className="text-[11px] text-stone-500 truncate flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                            {loc.modernName}
                          </p>

                          <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-stone-100 font-sans">
                            <span>{loc.biblicalEra}</span>
                            {eventCount > 0 && (
                              <span className="text-[#800020] font-semibold">
                                {eventCount} {isRTL ? "أحداث مسجلة" : "events"}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* INTERACTIVE SVG VECTOR MAP VIEWPORT                      */}
        {/* ========================================================= */}
        <main
          id="map-main-stage"
          dir="ltr"
          className={`
            relative overflow-hidden bg-[#1C1917] select-none transition-all duration-300 flex-1
            ${/* Mobile: Top 45% when sheet is open, or 100%-56px when collapsed, or 100% when sidebar is hidden */ ""}
            ${
              !isSidebarOpen
                ? "order-1 h-full w-full"
                : isMobileDrawerCollapsed
                ? "order-1 h-[calc(100%-56px)] md:h-full md:w-[65%]"
                : "order-1 h-[45%] md:h-full md:w-[65%]"
            }
            ${!isSidebarOpen ? "md:w-full" : "md:order-2"}
          `}
        >
          {/* MAP CANVAS VIEWPORT */}
          <div
            ref={mapViewportRef}
            id="ancient-map-viewport"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden touch-none"
          >
            {/* FLOATING SHOW SIDEBAR BUTTON (When sidebar is hidden) */}
            {!isSidebarOpen && (
              <button
                id="floating-show-sidebar-btn"
                onClick={() => setIsSidebarOpen(true)}
                className={`absolute top-3 ${
                  isRTL ? "right-3" : "left-3"
                } z-40 flex items-center gap-2 px-3 py-2 bg-[#FDFBF7]/95 hover:bg-[#F5E8CA] text-[#800020] rounded-xl shadow-lg border border-[#D4AF37] font-semibold text-xs transition active:scale-95 backdrop-blur-xs min-h-[44px] cursor-pointer`}
                title={isRTL ? "إظهار القائمة الجانبية والدليل" : "Show Map Sidebar & Directory"}
                aria-label="Show Map Sidebar"
              >
                {isRTL ? (
                  <PanelRightOpen className="w-4 h-4 text-[#800020]" />
                ) : (
                  <PanelLeftOpen className="w-4 h-4 text-[#800020]" />
                )}
                <span className={isRTL ? "font-['Amiri'] font-bold text-sm" : "font-['Cinzel'] font-bold"}>
                  {isRTL ? "عرض القائمة الجانبية" : "Show Sidebar"}
                </span>
              </button>
            )}

            {/* FLOATING ZOOM & LAYER CONTROLS (Top right or top left based on RTL) */}
            <div
              className={`absolute top-3 ${
                isRTL ? "left-3" : "right-3"
              } z-40 flex flex-col gap-1.5 bg-[#FDFBF7]/95 p-1 rounded-xl shadow-md border border-[#D4AF37]/50 backdrop-blur-xs`}
            >
              {/* Toggle Sidebar Button in Floating Controls */}
              <button
                id="map-sidebar-toggle-btn"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className={`w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition font-bold shadow-xs border active:scale-95 cursor-pointer ${
                  isSidebarOpen
                    ? "bg-white text-stone-800 hover:bg-[#F5E8CA] border-stone-200"
                    : "bg-[#800020] text-[#D4AF37] border-[#800020] ring-2 ring-[#D4AF37]/60"
                }`}
                title={
                  isSidebarOpen
                    ? isRTL ? "إخفاء القائمة الجانبية للخريطة" : "Hide Map Sidebar"
                    : isRTL ? "إظهار القائمة الجانبية للخريطة" : "Show Map Sidebar"
                }
                aria-label="Toggle Map Sidebar"
              >
                {isSidebarOpen ? (
                  <PanelLeftClose className="w-5 h-5 text-[#800020]" />
                ) : (
                  <PanelLeftOpen className="w-5 h-5 text-[#D4AF37]" />
                )}
              </button>

              <button
                id="map-zoom-in-btn"
                onClick={zoomIn}
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-white text-stone-800 hover:bg-[#F5E8CA] active:scale-95 transition font-bold shadow-xs border border-stone-200 cursor-pointer"
                title="Zoom In"
                aria-label="Zoom In"
              >
                <ZoomIn className="w-5 h-5 text-[#800020]" />
              </button>
              <button
                id="map-zoom-out-btn"
                onClick={zoomOut}
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-white text-stone-800 hover:bg-[#F5E8CA] active:scale-95 transition font-bold shadow-xs border border-stone-200 cursor-pointer"
                title="Zoom Out"
                aria-label="Zoom Out"
              >
                <ZoomOut className="w-5 h-5 text-[#800020]" />
              </button>
              <button
                id="map-reset-btn"
                onClick={resetView}
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-[#F5E8CA] text-[#451A03] hover:bg-[#EBDCB9] active:scale-95 transition font-bold shadow-xs border border-[#D4AF37]/40 cursor-pointer"
                title="Reset View"
                aria-label="Reset View"
              >
                <RotateCcw className="w-4 h-4 text-[#854D0E]" />
              </button>

              {/* Layer Visibility Toggle Button */}
              <div className="relative">
                <button
                  id="map-layers-toggle-btn"
                  onClick={() => setShowLayersMenu((prev) => !prev)}
                  className={`w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition font-bold shadow-xs border cursor-pointer ${
                    showLayersMenu
                      ? "bg-[#800020] text-[#D4AF37] border-[#800020]"
                      : "bg-white text-stone-800 hover:bg-[#F5E8CA] border-stone-200"
                  }`}
                  title={isRTL ? "طبقات الخريطة" : "Map Cartographic Layers"}
                  aria-label="Map Layers"
                >
                  <Layers className="w-5 h-5" />
                </button>

                {/* Dropdown Menu for Layers */}
                {showLayersMenu && (
                  <div
                    className={`absolute top-0 ${
                      isRTL ? "left-full ml-2" : "right-full mr-2"
                    } w-64 bg-[#FDFBF7] rounded-xl shadow-xl border border-[#D4AF37]/60 p-3 z-50 text-xs font-sans text-[#1C1917] space-y-2`}
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#D4AF37]/30">
                      <span className="font-bold text-[#800020] flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-[#D4AF37]" />
                        {isRTL ? "طبقات التضاريس والجغرافيا" : "Geographic Layers"}
                      </span>
                      <button
                        onClick={() => setShowLayersMenu(false)}
                        className="text-stone-400 hover:text-stone-700 p-0.5 rounded"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Layer Toggles */}
                    <div className="space-y-1">
                      <button
                        onClick={() => setLayers((prev) => ({ ...prev, showRivers: !prev.showRivers }))}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-[#F5E8CA] transition text-left"
                      >
                        <span className="flex items-center gap-2">
                          <Waves className="w-3.5 h-3.5 text-[#0E4861]" />
                          {isRTL ? "الأنهار والمسطحات المائية" : "Rivers & Waterways"}
                        </span>
                        {layers.showRivers && <Check className="w-3.5 h-3.5 text-[#800020]" />}
                      </button>

                      <button
                        onClick={() => setLayers((prev) => ({ ...prev, showMountains: !prev.showMountains }))}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-[#F5E8CA] transition text-left"
                      >
                        <span className="flex items-center gap-2">
                          <Mountain className="w-3.5 h-3.5 text-[#92400E]" />
                          {isRTL ? "سلاسل الجبال والقمم" : "Mountain Ranges & Summits"}
                        </span>
                        {layers.showMountains && <Check className="w-3.5 h-3.5 text-[#800020]" />}
                      </button>

                      <button
                        onClick={() => setLayers((prev) => ({ ...prev, showRoutes: !prev.showRoutes }))}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-[#F5E8CA] transition text-left"
                      >
                        <span className="flex items-center gap-2">
                          <Route className="w-3.5 h-3.5 text-[#991B1B]" />
                          {isRTL ? "طرق التجارة ومسار الخروج" : "Ancient & Exodus Routes"}
                        </span>
                        {layers.showRoutes && <Check className="w-3.5 h-3.5 text-[#800020]" />}
                      </button>

                      <button
                        onClick={() => setLayers((prev) => ({ ...prev, showFertileCrescent: !prev.showFertileCrescent }))}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-[#F5E8CA] transition text-left"
                      >
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-[#65A30D]" />
                          {isRTL ? "الهلال الخصيب والسهول" : "Fertile Crescent Zone"}
                        </span>
                        {layers.showFertileCrescent && <Check className="w-3.5 h-3.5 text-[#800020]" />}
                      </button>

                      <button
                        onClick={() => setLayers((prev) => ({ ...prev, showGraticule: !prev.showGraticule }))}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-[#F5E8CA] transition text-left"
                      >
                        <span className="flex items-center gap-2">
                          <Grid className="w-3.5 h-3.5 text-[#78350F]" />
                          {isRTL ? "خطوط الطول والعرض (الشبكة)" : "Lat/Long Coordinate Grid"}
                        </span>
                        {layers.showGraticule && <Check className="w-3.5 h-3.5 text-[#800020]" />}
                      </button>

                      <button
                        onClick={() => setLayers((prev) => ({ ...prev, showRegionLabels: !prev.showRegionLabels }))}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-[#F5E8CA] transition text-left"
                      >
                        <span className="flex items-center gap-2">
                          <Compass className="w-3.5 h-3.5 text-[#800020]" />
                          {isRTL ? "أسماء الممالك والأقاليم" : "Ancient Realm & Empire Names"}
                        </span>
                        {layers.showRegionLabels && <Check className="w-3.5 h-3.5 text-[#800020]" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* TRANSFORM CONTAINER (Pan & Zoom Applied Here) */}
            <div
              id="map-transform-layer"
              style={{
                position: "absolute",
                width: `${MAP_WIDTH}px`,
                height: `${MAP_HEIGHT}px`,
                background: "#EBDCB9",
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: "0 0",
                transition: isDragging ? "none" : "transform 0.12s ease-out",
              }}
            >
              {/* HISTORICAL CARTOGRAPHY SVG LAYER (Geographically Accurate) */}
              <BiblicalWorldSvgMap
                zoom={zoom}
                isRTL={isRTL}
                layers={layers}
              />

              {/* ========================================================= */}
              {/* GROUND ANCHORS & LEADER LINES (Accurate Historical Ground)*/}
              {/* ========================================================= */}
              <svg
                id="map-ground-anchors-layer"
                className="absolute inset-0 pointer-events-none w-full h-full z-20"
                viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
              >
                {placedPins.map((p) => {
                  return (
                    <g key={`anchor-${p.loc.id}`}>
                      {/* Exact Historical Ground Point Marker */}
                      <circle
                        cx={p.origX}
                        cy={p.origY}
                        r={p.isSelected ? scaleFactors.anchorDotRadius * 1.3 : scaleFactors.anchorDotRadius}
                        fill="#800020"
                        stroke="#D4AF37"
                        strokeWidth={Math.max(0.5, scaleFactors.anchorDotRadius * 0.35)}
                      />

                      {/* Golden Cartographic Leader Line if pin was relaxed/displaced */}
                      {p.isDisplaced && (
                        <line
                          x1={p.origX}
                          y1={p.origY}
                          x2={p.x}
                          y2={p.y}
                          stroke="#D4AF37"
                          strokeWidth={scaleFactors.leaderLineWidth}
                          strokeDasharray="3 2"
                          opacity={0.9}
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* ========================================================= */}
              {/* COLLISION-FREE PINS & DIRECTIONAL NON-OVERLAPPING LABELS  */}
              {/* Minimum 44px Tap Targets for Accessibility & Mobile UX     */}
              {/* Strict CSS Containment for Rendering Isolation & GPU Boost */}
              {/* ========================================================= */}
              {placedPins.map((p) => {
                const isSelected = p.isSelected;
                const isHovered = hoveredLocationId === p.loc.id;
                const showLabel = p.showLabel || isHovered || isSelected;

                // Directional positioning classes for the label pill
                let labelPositionClass = "mt-1.5 top-full left-1/2 -translate-x-1/2";
                if (p.labelDirection === "left") {
                  labelPositionClass = "mr-2 right-full top-1/2 -translate-y-1/2";
                } else if (p.labelDirection === "right") {
                  labelPositionClass = "ml-2 left-full top-1/2 -translate-y-1/2";
                } else if (p.labelDirection === "top") {
                  labelPositionClass = "mb-1.5 bottom-full left-1/2 -translate-x-1/2";
                }

                return (
                  <div
                    key={p.loc.id}
                    id={`map-pin-${p.loc.id}`}
                    role="button"
                    tabIndex={0}
                    onMouseEnter={() => setHoveredLocationId(p.loc.id)}
                    onMouseLeave={() => setHoveredLocationId(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectLocation(p.loc);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleSelectLocation(p.loc);
                      }
                    }}
                    title={`${p.loc.name} (${p.loc.arabicName}) • ${p.loc.modernName}`}
                    className={`map-marker-contained absolute cursor-pointer select-none group flex items-center justify-center min-w-[44px] min-h-[44px] ${
                      isSelected || isHovered ? "z-50" : "z-30"
                    }`}
                    style={{
                      left: `${p.x}px`,
                      top: `${p.y}px`,
                      transform: `translate(-50%, -50%) scale(${scaleFactors.markerScale})`,
                      transformOrigin: "center center",
                      ...scaleFactors.markerContainmentStyle,
                    }}
                  >
                    {/* Pulsing ring on selection */}
                    {isSelected && (
                      <div className="absolute w-10 h-10 rounded-full bg-[#D4AF37]/50 animate-ping pointer-events-none" />
                    )}

                    {/* Pin Marker Core (Rosette badge with Coptic gold & crimson) */}
                    <div
                      className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[10px] shadow-md transition-transform duration-200
                        ${
                          isSelected
                            ? "bg-[#800020] ring-4 ring-[#D4AF37] scale-125 z-40"
                            : isHovered
                            ? "bg-[#800020] ring-2 ring-[#D4AF37] scale-115"
                            : "bg-[#1A365D] border-2 border-[#D4AF37]"
                        }
                      `}
                    >
                      {p.totalActivity > 0 ? (
                        <span className="text-[#FEF3C7] font-sans font-bold">
                          {p.totalActivity}
                        </span>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                      )}
                    </div>

                    {/* Collision-Free Directional Pin Label Pill with CSS Containment */}
                    <div
                      dir={isRTL ? "rtl" : "ltr"}
                      className={`
                        map-label-contained absolute px-2.5 py-0.5 rounded-md text-[11px] font-bold whitespace-nowrap shadow-md pointer-events-none transition-all duration-150
                        ${labelPositionClass}
                        ${
                          showLabel
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-90 pointer-events-none hidden md:block group-hover:opacity-100 group-hover:scale-100"
                        }
                        ${
                          isSelected
                            ? "bg-[#800020] text-[#FEF3C7] border-2 border-[#D4AF37] scale-105 z-50 shadow-lg"
                            : isHovered
                            ? "bg-[#800020] text-[#D4AF37] border border-[#D4AF37] z-50 shadow-md"
                            : "bg-[#1C1917]/90 text-[#FDFBF7] border border-stone-700/60"
                        }
                      `}
                      style={{
                        ...scaleFactors.labelContainmentStyle,
                      }}
                    >
                      <span className={isRTL ? "font-['Amiri'] font-bold text-xs" : "font-['Cinzel'] font-bold text-[11px]"}>
                        {getMapPinName(isRTL ? p.loc.arabicName : p.loc.name)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* ========================================================= */}
      {/* SCRIPTURE & EVENT DETAILS MODAL                           */}
      {/* ========================================================= */}
      {selectedEvent && (
        <div
          id="event-details-modal-overlay"
          className="fixed inset-0 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            id="event-details-modal-card"
            className="bg-[#FDFBF7] rounded-2xl max-w-lg w-full p-6 shadow-2xl border-2 border-[#D4AF37] space-y-4 font-sans text-sm animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-stone-200 pb-3">
              <div>
                <h3 className={`text-lg font-bold text-[#800020] ${isRTL ? "font-['Amiri']" : "font-['Cinzel']"}`}>
                  {selectedEvent.title}
                </h3>
                {selectedEvent.date?.year !== undefined && (
                  <span className="text-xs font-bold text-[#B91C1C]">
                    {formatYearLabel(selectedEvent.date.year)}
                  </span>
                )}
              </div>

              <button
                id="close-event-modal-btn"
                onClick={() => setSelectedEvent(null)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            {selectedEvent.description && (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-stone-500 uppercase">
                  {isRTL ? "الوصف التاريخي" : "Historical Summary"}
                </span>
                <p className="text-stone-800 leading-relaxed text-xs bg-white p-3 rounded-lg border border-stone-200">
                  {selectedEvent.description}
                </p>
              </div>
            )}

            {/* Location & Figures */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {selectedEvent.location && (
                <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  <span className="font-semibold text-stone-600 block mb-0.5">
                    {isRTL ? "الموقع" : "Location"}
                  </span>
                  <span className="text-stone-800">{selectedEvent.location}</span>
                </div>
              )}

              {(selectedEvent.personIds || []).length > 0 && (
                <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  <span className="font-semibold text-stone-600 block mb-0.5">
                    {isRTL ? "الشخصيات المرتبطة" : "Key Figures"}
                  </span>
                  <span className="text-stone-800">
                    {(selectedEvent.personIds || [])
                      .map((id) => people.find((p) => p.id === id)?.name || id)
                      .join(", ")}
                  </span>
                </div>
              )}
            </div>

            {/* Scripture References */}
            {(selectedEvent.biblicalReferences || []).length > 0 && (
              <div className="space-y-1 text-xs">
                <span className="font-semibold text-stone-600 block">
                  {isRTL ? "الشواهد الكتابية" : "Biblical References"}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedEvent.biblicalReferences || []).map((ref) => (
                    <span
                      key={ref}
                      className="px-2.5 py-1 rounded bg-[#FEF3C7] text-[#78350F] font-semibold border border-[#FDE68A]"
                    >
                      {ref}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="min-h-[44px] px-5 rounded-lg bg-[#800020] text-[#D4AF37] font-bold hover:bg-[#991B1B] transition shadow-xs"
              >
                {isRTL ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
