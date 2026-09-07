import { useState, useMemo, useRef } from "react";
import type { Person, BiblicalEvent } from "../types/genealogy";

type CityRegion =
  | "Egypt & Sinai"
  | "Canaan & Levant"
  | "Mesopotamia & Assyria"
  | "Babylonia"
  | "Arabia"
  | "Persia & Media";

type City = {
  id: string;
  name: string;
  arabicName: string;
  region: CityRegion;
  lat: number;
  lon: number;
  aliases: string[];
};

type OldTestamentMapPageProps = {
  events: BiblicalEvent[];
  people?: Person[];
  mapSrc?: string;
};

const MAP_WIDTH = 1800;
const MAP_HEIGHT = 950;

const MAP_BOUNDS = {
  minLon: 24,
  maxLon: 56,
  minLat: 22,
  maxLat: 40,
};

function geoToPixel(lat: number, lon: number) {
  const clampedLon = Math.max(
    MAP_BOUNDS.minLon,
    Math.min(MAP_BOUNDS.maxLon, lon)
  );

  const clampedLat = Math.max(
    MAP_BOUNDS.minLat,
    Math.min(MAP_BOUNDS.maxLat, lat)
  );

  const x =
    ((clampedLon - MAP_BOUNDS.minLon) /
      (MAP_BOUNDS.maxLon - MAP_BOUNDS.minLon)) *
    MAP_WIDTH;

  const y =
    ((MAP_BOUNDS.maxLat - clampedLat) /
      (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) *
    MAP_HEIGHT;

  return { x, y };
}

const OT_CITIES: City[] = [
  {
    id: "thebes",
    name: "Thebes (No-Amon)",
    arabicName: "طيبة / نوس آمن",
    region: "Egypt & Sinai",
    lat: 25.6872,
    lon: 32.6396,
    aliases: ["Thebes", "No-Amon", "No", "طيبة"],
  },
  {
    id: "memphis",
    name: "Memphis (Noph)",
    arabicName: "منف",
    region: "Egypt & Sinai",
    lat: 29.8448,
    lon: 31.2508,
    aliases: ["Memphis", "Noph", "منف"],
  },
  {
    id: "rameses",
    name: "Rameses (Goshen)",
    arabicName: "رعمسيس / جاسان",
    region: "Egypt & Sinai",
    lat: 30.75,
    lon: 32.05,
    aliases: ["Rameses", "Ramesses", "Goshen", "جاسان", "رعمسيس"],
  },
  {
    id: "sinai",
    name: "Mt. Sinai (Horeb)",
    arabicName: "جبل سيناء",
    region: "Egypt & Sinai",
    lat: 28.5394,
    lon: 33.975,
    aliases: ["Sinai", "Horeb", "سيناء", "حوريب"],
  },
  {
    id: "eziongeber",
    name: "Ezion-Geber",
    arabicName: "عصيون جابر",
    region: "Egypt & Sinai",
    lat: 29.53,
    lon: 34.95,
    aliases: ["Ezion-geber", "Ezion geber", "عصيون جابر"],
  },
  {
    id: "gaza",
    name: "Gaza",
    arabicName: "غزة",
    region: "Canaan & Levant",
    lat: 31.5017,
    lon: 34.4668,
    aliases: ["Gaza", "غزة"],
  },
  {
    id: "beersheba",
    name: "Beersheba",
    arabicName: "بئر سبع",
    region: "Canaan & Levant",
    lat: 31.2529,
    lon: 34.7915,
    aliases: ["Beersheba", "באר שבע", "بئر سبع"],
  },
  {
    id: "kirhareseth",
    name: "Kir-hareseth (Moab)",
    arabicName: "قير حارسة",
    region: "Canaan & Levant",
    lat: 31.182,
    lon: 35.705,
    aliases: ["Moab", "Kir-hareseth", "Kir", "قير حارسة"],
  },
  {
    id: "hebron",
    name: "Hebron",
    arabicName: "حبرون",
    region: "Canaan & Levant",
    lat: 31.5326,
    lon: 35.0998,
    aliases: ["Hebron", "حبرون"],
  },
  {
    id: "jerusalem",
    name: "Jerusalem",
    arabicName: "أورشليم",
    region: "Canaan & Levant",
    lat: 31.7767,
    lon: 35.2342,
    aliases: ["Jerusalem", "Zion", "أورشليم", "Jebus"],
  },
  {
    id: "jericho",
    name: "Jericho",
    arabicName: "أريحا",
    region: "Canaan & Levant",
    lat: 31.8717,
    lon: 35.4446,
    aliases: ["Jericho", "أريحا"],
  },
  {
    id: "rabbah",
    name: "Rabbah (Ammon)",
    arabicName: "ربة عمون",
    region: "Canaan & Levant",
    lat: 31.9539,
    lon: 35.9106,
    aliases: ["Rabbah", "Ammon", "Rabbath", "ربة"],
  },
  {
    id: "joppa",
    name: "Joppa",
    arabicName: "يافا",
    region: "Canaan & Levant",
    lat: 32.05,
    lon: 34.75,
    aliases: ["Joppa", "Jaffa", "يافا"],
  },
  {
    id: "shechem",
    name: "Shechem",
    arabicName: "شكيم",
    region: "Canaan & Levant",
    lat: 32.213,
    lon: 35.282,
    aliases: ["Shechem", "شكيم"],
  },
  {
    id: "samaria",
    name: "Samaria",
    arabicName: "السامرة",
    region: "Canaan & Levant",
    lat: 32.276,
    lon: 35.198,
    aliases: ["Samaria", "السامرة"],
  },
  {
    id: "dan",
    name: "Dan",
    arabicName: "دان",
    region: "Canaan & Levant",
    lat: 33.249,
    lon: 35.652,
    aliases: ["Dan", "Laish", "دان"],
  },
  {
    id: "tyre",
    name: "Tyre",
    arabicName: "صور",
    region: "Canaan & Levant",
    lat: 33.27,
    lon: 35.203,
    aliases: ["Tyre", "صور"],
  },
  {
    id: "sidon",
    name: "Sidon",
    arabicName: "صيدون",
    region: "Canaan & Levant",
    lat: 33.56,
    lon: 35.375,
    aliases: ["Sidon", "صيدون"],
  },
  {
    id: "damascus",
    name: "Damascus",
    arabicName: "دمشق",
    region: "Canaan & Levant",
    lat: 33.513,
    lon: 36.292,
    aliases: ["Damascus", "دمشق", "Aram"],
  },
  {
    id: "carchemish",
    name: "Carchemish",
    arabicName: "كركميش",
    region: "Mesopotamia & Assyria",
    lat: 36.83,
    lon: 37.93,
    aliases: ["Carchemish", "كركميش"],
  },
  {
    id: "haran",
    name: "Haran",
    arabicName: "حاران",
    region: "Mesopotamia & Assyria",
    lat: 36.864,
    lon: 39.031,
    aliases: ["Haran", "حاران", "Paddan-aram"],
  },
  {
    id: "asshur",
    name: "Asshur",
    arabicName: "آشور",
    region: "Mesopotamia & Assyria",
    lat: 35.458,
    lon: 43.256,
    aliases: ["Asshur", "Ashur", "آشور"],
  },
  {
    id: "nineveh",
    name: "Nineveh",
    arabicName: "نينوى",
    region: "Mesopotamia & Assyria",
    lat: 36.3667,
    lon: 43.15,
    aliases: ["Nineveh", "نينوى"],
  },
  {
    id: "calah",
    name: "Calah (Nimrud)",
    arabicName: "كالح",
    region: "Mesopotamia & Assyria",
    lat: 36.096,
    lon: 43.332,
    aliases: ["Calah", "Nimrud", "كالح"],
  },
  {
    id: "babylon",
    name: "Babylon",
    arabicName: "بابل",
    region: "Babylonia",
    lat: 32.5229,
    lon: 44.4241,
    aliases: ["Babylon", "Babel", "بابل", "Chaldea"],
  },
  {
    id: "erech",
    name: "Erech (Uruk)",
    arabicName: "أروك",
    region: "Babylonia",
    lat: 31.3259,
    lon: 45.6374,
    aliases: ["Erech", "Uruk", "أروك"],
  },
  {
    id: "ur",
    name: "Ur of the Chaldees",
    arabicName: "أور الكلدانيين",
    region: "Babylonia",
    lat: 30.9622,
    lon: 46.1044,
    aliases: ["Ur", "Ur of the Chaldees", "أور"],
  },
  {
    id: "dedan",
    name: "Dedan",
    arabicName: "ديدان",
    region: "Arabia",
    lat: 26.608,
    lon: 37.923,
    aliases: ["Dedan", "ديدان"],
  },
  {
    id: "tema",
    name: "Tema",
    arabicName: "تيماء",
    region: "Arabia",
    lat: 27.626,
    lon: 38.543,
    aliases: ["Tema", "تيماء"],
  },
  {
    id: "ecbatana",
    name: "Ecbatana",
    arabicName: "أحمتا / أكتبانا",
    region: "Persia & Media",
    lat: 34.7992,
    lon: 48.5146,
    aliases: ["Ecbatana", "Achmetha", "أحمتا", "أكتبانا"],
  },
  {
    id: "susa",
    name: "Susa (Shushan)",
    arabicName: "شوشان",
    region: "Persia & Media",
    lat: 32.1896,
    lon: 48.257,
    aliases: ["Susa", "Shushan", "شوشان", "Elam"],
  },
  {
    id: "persepolis",
    name: "Persepolis",
    arabicName: "تخت جمشيد",
    region: "Persia & Media",
    lat: 29.935,
    lon: 52.891,
    aliases: ["Persepolis", "تخت جمشيد"],
  },
];

export default function OldTestamentMapPage({
  events,
  people = [],
}: OldTestamentMapPageProps) {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<BiblicalEvent | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>("All");

  // Map Pan and Zoom States
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const mapViewportRef = useRef<HTMLDivElement>(null);

  const regions = [
    "All",
    "Egypt & Sinai",
    "Canaan & Levant",
    "Mesopotamia & Assyria",
    "Babylonia",
    "Arabia",
    "Persia & Media",
  ];

  const eventsByCity = useMemo(() => {
    const map = new Map<string, BiblicalEvent[]>();

    OT_CITIES.forEach((city) => {
      const matching = events.filter((event) => {
        if (!event.location) return false;
        const location = event.location.trim().toLowerCase();

        return city.aliases.some((alias) => {
          const normalizedAlias = alias.trim().toLowerCase();
          if (!normalizedAlias) return false;

          const escapedAlias = normalizedAlias.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          );

          const regex = new RegExp(
            `(^|[^\\p{L}\\p{N}])${escapedAlias}([^\\p{L}\\p{N}]|$)`,
            "iu"
          );

          return regex.test(location);
        });
      });

      map.set(city.id, matching);
    });

    return map;
  }, [events]);

  const filteredCities = useMemo(() => {
    if (selectedRegion === "All") return OT_CITIES;
    return OT_CITIES.filter((city) => city.region === selectedRegion);
  }, [selectedRegion]);

  const activeCityEvents = selectedCity
    ? eventsByCity.get(selectedCity.id) || []
    : [];

  const formatYearLabel = (year?: number) => {
    if (year === undefined) return "";
    return year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;
  };

  // Zoom & Pan Handlers
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
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
    if (e.button !== 0) return; // Left mouse button only
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

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.25, 6));
  };

  const zoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(prev / 1.25, 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1400px",
        margin: "0 auto",
        fontFamily: "Georgia, serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              margin: "0 0 4px 0",
              color: "#1c1917",
            }}
          >
            The Old Testament World
          </h2>
          <p
            style={{
              color: "#78716c",
              margin: 0,
              fontSize: "0.92rem",
              fontFamily: "sans-serif",
            }}
          >
            Interactive map. Scroll to zoom, click and drag to move.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "6px",
            flexWrap: "wrap",
            fontFamily: "sans-serif",
          }}
        >
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border:
                  "1px solid " +
                  (selectedRegion === region ? "#854d0e" : "#d6d3d1"),
                background: selectedRegion === region ? "#854d0e" : "#fef3c7",
                color: selectedRegion === region ? "#ffffff" : "#451a03",
                fontSize: "0.8rem",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={mapViewportRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          width: "100%",
          height: "650px",
          overflow: "hidden",
          position: "relative",
          borderRadius: "12px",
          border: "3px solid #78350f",
          boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)",
          background: "#1c1917",
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        {/* MAP CONTROLS OVERLAY */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            background: "rgba(255, 255, 255, 0.9)",
            padding: "6px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            fontFamily: "sans-serif",
          }}
        >
          <button
            onClick={zoomIn}
            title="Zoom In"
            style={{
              width: "32px",
              height: "32px",
              fontSize: "1.2rem",
              fontWeight: "bold",
              border: "1px solid #d6d3d1",
              borderRadius: "4px",
              background: "#ffffff",
              cursor: "pointer",
            }}
          >
            +
          </button>
          <button
            onClick={zoomOut}
            title="Zoom Out"
            style={{
              width: "32px",
              height: "32px",
              fontSize: "1.2rem",
              fontWeight: "bold",
              border: "1px solid #d6d3d1",
              borderRadius: "4px",
              background: "#ffffff",
              cursor: "pointer",
            }}
          >
            −
          </button>
          <button
            onClick={resetView}
            title="Reset Map View"
            style={{
              padding: "4px 8px",
              fontSize: "0.7rem",
              fontWeight: "bold",
              border: "1px solid #d6d3d1",
              borderRadius: "4px",
              background: "#f5f5f4",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>

        {/* TRANSFORMABLE CANVAS (SVG + MARKERS TOGETHER) */}
        <div
          style={{
            position: "absolute",
            width: `${MAP_WIDTH}px`,
            height: `${MAP_HEIGHT}px`,
            background: "#ebdcb9",
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            transition: isDragging ? "none" : "transform 0.1s ease-out",
          }}
        >
          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              inset: 0,
            }}
          >
            <defs>
              <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2b5368" />
                <stop offset="100%" stopColor="#1a3644" />
              </linearGradient>

              <linearGradient id="fertileArc" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ebdcb9" />
                <stop offset="35%" stopColor="#c5d8a4" stopOpacity="0.6" />
                <stop offset="70%" stopColor="#a3ccab" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ebdcb9" />
              </linearGradient>

              <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f5e8ca" />
                <stop offset="50%" stopColor="#ebdcb9" />
                <stop offset="100%" stopColor="#d2bc8a" />
              </linearGradient>

              <filter id="labelShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow
                  dx="1"
                  dy="1"
                  stdDeviation="1.5"
                  floodColor="#fef3c7"
                  floodOpacity="0.95"
                />
              </filter>
            </defs>

            {/* BASE LAND */}
            <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#landGrad)" />

            {/* FERTILE CRESCENT ARC */}
            <path
              d="
                M 330,500
                C 420,440 500,445 580,450
                C 640,350 700,260 760,200
                C 880,120 1020,130 1120,180
                C 1260,280 1320,420 1350,520
                C 1220,510 1140,430 1080,390
                C 920,280 810,250 760,240
                C 680,290 630,370 610,460
                C 480,550 400,530 330,500
                Z
              "
              fill="url(#fertileArc)"
            />

            {/* MEDITERRANEAN SEA */}
            <path
              d="
                M 0,0
                L 0,448
                C 100,452 220,458 332,464
                C 375,445 420,442 455,460
                C 480,465 530,458 575,450
                C 595,440 605,425 612,410
                C 620,380 625,350 635,320
                C 648,270 660,220 669,180
                C 620,168 520,175 365,185
                C 225,185 100,175 0,169
                Z
              "
              fill="url(#oceanGrad)"
              stroke="#1a3644"
              strokeWidth="2"
            />

            {/* CYPRUS */}
            <path
              d="
                M 465,275
                C 490,260 540,240 595,226
                C 570,245 540,265 510,278
                C 485,285 460,285 465,275
                Z
              "
              fill="url(#landGrad)"
              stroke="#78350f"
              strokeWidth="1.5"
            />

            {/* BLACK SEA */}
            <path
              d="
                M 225,0
                C 380,75 700,75 956,0
                Z
              "
              fill="url(#oceanGrad)"
              stroke="#1a3644"
            />

            {/* CASPIAN SEA */}
            <path
              d="
                M 1450,0
                C 1425,75 1430,140 1480,180
                C 1580,205 1650,155 1688,0
                Z
              "
              fill="url(#oceanGrad)"
              stroke="#1a3644"
            />

            {/* REALISTIC RED SEA & GULFS */}
            <path
              d="
                M 480,528
                C 492,550 510,588 528,620
                C 555,668 600,748 645,828
                C 680,888 715,928 735,950
                L 830,950
                C 795,908 755,848 718,778
                C 680,708 645,658 618,618
                C 608,602 602,578 615,552
                C 602,572 588,600 578,625
                C 572,638 568,646 565,648
                C 555,628 532,592 512,558
                C 498,536 488,528 480,528
                Z
              "
              fill="url(#oceanGrad)"
              stroke="#1a3644"
              strokeWidth="2"
            />

            {/* PERSIAN GULF */}
            <path
              d="
                M 1350,528
                C 1370,565 1420,630 1470,685
                C 1520,740 1590,800 1670,850
                C 1720,880 1760,920 1800,945
                L 1800,750
                C 1750,700 1650,650 1520,625
                C 1450,590 1380,550 1350,528
                Z
              "
              fill="url(#oceanGrad)"
              stroke="#1a3644"
              strokeWidth="2"
            />

            {/* NILE RIVER & DELTA */}
            <g stroke="#1e4e6d" fill="none" strokeLinecap="round">
              <path
                d="M 500,950 C 495,880 482,800 485,740 C 440,690 405,620 405,528"
                strokeWidth="4.5"
              />
              <path d="M 405,528 C 385,500 365,475 350,462" strokeWidth="2.5" />
              <path d="M 405,528 C 425,500 445,475 455,460" strokeWidth="2.5" />
            </g>

            {/* JORDAN RIVER SYSTEM */}
            <g stroke="#1e4e6d" fill="none">
              <ellipse cx="652" cy="378" rx="8" ry="12" fill="#2b5368" stroke="none" />
              <ellipse cx="646" cy="455" rx="14" ry="32" fill="#2b5368" stroke="none" />
              <path d="M 652,390 C 650,405 648,415 646,423" strokeWidth="2.5" />
            </g>

            {/* EUPHRATES RIVER */}
            <path
              d="
                M 984,11
                C 890,45 810,100 788,132
                C 770,160 810,190 870,220
                C 940,260 1020,310 1100,360
                C 1180,410 1260,470 1350,528
              "
              fill="none"
              stroke="#1e4e6d"
              strokeWidth="4.5"
              strokeLinecap="round"
            />

            {/* TIGRIS RIVER */}
            <path
              d="
                M 855,84
                C 920,105 980,135 1024,158
                C 1070,185 1085,230 1086,306
                C 1140,360 1220,430 1350,528
              "
              fill="none"
              stroke="#1e4e6d"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* MOUNTAIN RANGES */}
            <g
              stroke="#78350f"
              fill="none"
              strokeWidth="2"
              strokeDasharray="4,4"
              opacity="0.45"
            >
              <path d="M 360,185 C 500,170 600,160 780,165" />
              <path d="M 645,300 C 642,330 641,350 640,370" />
              <path d="M 980,30 C 1100,20 1150,40 1200,60" />
              <path d="M 1150,120 C 1300,280 1500,450 1650,580" />
            </g>

            {/* REGIONAL LABELS */}
            <g
              fill="#451a03"
              fontFamily="Georgia, serif"
              fontWeight="bold"
              textAnchor="middle"
              filter="url(#labelShadow)"
            >
              <text x="370" y="680" fontSize="26">EGYPT</text>
              <text x="548" y="585" fontSize="16">SINAI</text>
              <text x="390" y="100" fontSize="22">ASIA MINOR</text>
              <text x="680" y="420" fontSize="20" transform="rotate(-75 680 420)">CANAAN</text>
              <text x="730" y="260" fontSize="22">SYRIA (ARAM)</text>
              <text x="930" y="210" fontSize="26">MESOPOTAMIA</text>
              <text x="930" y="235" fontSize="14" fontStyle="italic">Paddan-aram</text>
              <text x="1100" y="210" fontSize="24">ASSYRIA</text>
              <text x="1040" y="50" fontSize="20">ARMENIA</text>
              <text x="1180" y="420" fontSize="24">BABYLONIA</text>
              <text x="1180" y="445" fontSize="16" fontStyle="italic">Chaldea</text>
              <text x="1380" y="210" fontSize="24">MEDIA</text>
              <text x="1400" y="420" fontSize="24">ELAM</text>
              <text x="1630" y="580" fontSize="26">PERSIA</text>
              <text x="900" y="738" fontSize="28" fill="#78350f" opacity="0.6">ARABIAN DESERT</text>
            </g>

            {/* RIVER LABELS */}
            <g fill="#1e4e6d" fontSize="12" fontStyle="italic" fontWeight="600">
              <text x="440" y="750" transform="rotate(-78 440 750)">Nile River</text>
              <text x="920" y="270" transform="rotate(28 920 270)">Euphrates River</text>
              <text x="1110" y="280" transform="rotate(52 1110 280)">Tigris River</text>
            </g>

            {/* WATER LABELS */}
            <g fill="#ffffff" fontFamily="sans-serif" fontWeight="bold" opacity="0.85" textAnchor="middle">
              <text x="300" y="320" fontSize="18">Mediterranean Sea</text>
              <text x="600" y="30" fontSize="14">Black Sea</text>
              <text x="1530" y="80" fontSize="15">Caspian Sea</text>
              <text x="1550" y="720" fontSize="18">Persian Gulf</text>
              <text x="650" y="750" fontSize="15" transform="rotate(-62 650 750)">Red Sea</text>
            </g>

            {/* LEGEND */}
            <g transform="translate(1420, 800)">
              <rect width="320" height="110" rx="8" fill="#fef3c7" stroke="#78350f" strokeWidth="2" opacity="0.92" />
              <text x="160" y="35" textAnchor="middle" fill="#451a03" fontFamily="Georgia, serif" fontSize="18" fontWeight="bold">
                THE OLD TESTAMENT WORLD
              </text>
              <text x="160" y="60" textAnchor="middle" fill="#78350f" fontFamily="sans-serif" fontSize="12">
                Ancient Near East Geographic Map
              </text>
              <line x1="30" y1="75" x2="290" y2="75" stroke="#78350f" strokeWidth="1" opacity="0.5" />
              <circle cx="50" cy="90" r="5" fill="#b91c1c" />
              <text x="65" y="94" fill="#451a03" fontFamily="sans-serif" fontSize="11">
                Biblical Location Marker
              </text>
            </g>
          </svg>

          {/* CITY MARKERS */}
          {filteredCities.map((city) => {
            const cityEvents = eventsByCity.get(city.id) || [];
            const hasEvents = cityEvents.length > 0;
            const { x, y } = geoToPixel(city.lat, city.lon);

            return (
              <div
                key={city.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCity(city);
                  setSelectedEvent(null);
                }}
                title={`${city.name} • ${city.lat.toFixed(4)}°, ${city.lon.toFixed(4)}°`}
                style={{
                  position: "absolute",
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: "translate(-50%, -50%)",
                  cursor: "pointer",
                  zIndex: 30,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: hasEvents ? "18px" : "12px",
                    height: hasEvents ? "18px" : "12px",
                    borderRadius: "50%",
                    backgroundColor: hasEvents ? "#b91c1c" : "#0284c7",
                    border: "2px solid #ffffff",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontSize: "0.68rem",
                    fontWeight: "bold",
                  }}
                >
                  {hasEvents ? cityEvents.length : ""}
                </div>

                <div
                  style={{
                    marginTop: "2px",
                    background: "rgba(28, 25, 23, 0.9)",
                    color: "#fef3c7",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                    border: "1px solid rgba(217, 119, 6, 0.3)",
                    fontFamily: "sans-serif",
                  }}
                >
                  {city.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CITY EVENT MODAL */}
      {selectedCity && !selectedEvent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedCity(null)}
        >
          <div
            style={{
              background: "#fdfbf7",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "520px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)",
              border: "2px solid #78350f",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "16px",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1.4rem",
                    color: "#291e13",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {selectedCity.name}
                </h3>
                <p
                  style={{
                    margin: "2px 0 0 0",
                    fontSize: "0.88rem",
                    color: "#78350f",
                    fontWeight: "600",
                    fontFamily: "sans-serif",
                  }}
                >
                  {selectedCity.arabicName} • Region: {selectedCity.region}
                </p>
                <p
                  style={{
                    margin: "5px 0 0 0",
                    fontSize: "0.78rem",
                    color: "#78716c",
                    fontFamily: "sans-serif",
                  }}
                >
                  {selectedCity.lat.toFixed(4)}° N, {selectedCity.lon.toFixed(4)}° E
                </p>
              </div>

              <button
                onClick={() => setSelectedCity(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.4rem",
                  cursor: "pointer",
                  color: "#786c5e",
                }}
              >
                ✕
              </button>
            </div>

            {activeCityEvents.length === 0 ? (
              <p style={{ color: "#786c5e", fontSize: "0.9rem", fontFamily: "sans-serif" }}>
                No biblical events currently tagged with this location in your dataset.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontFamily: "sans-serif" }}>
                {activeCityEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #d6d3d1",
                      background: "#ffffff",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "10px" }}>
                      <h4 style={{ margin: "0 0 4px 0", color: "#1c1917", fontSize: "0.95rem" }}>
                        {event.title}
                      </h4>
                      {event.date?.year !== undefined && (
                        <span style={{ fontSize: "0.78rem", color: "#b91c1c", fontWeight: "bold", whiteSpace: "nowrap" }}>
                          {formatYearLabel(event.date.year)}
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#57534e", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {event.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* EVENT DETAILS MODAL */}
      {selectedEvent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100,
          }}
          onClick={() => setSelectedEvent(null)}
        >
          <div
            style={{
              background: "#fdfbf7",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "520px",
              width: "90%",
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)",
              border: "2px solid #78350f",
              fontFamily: "sans-serif",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "1.3rem", color: "#1c1917", fontFamily: "Georgia, serif" }}>
                {selectedEvent.title}
              </h3>
              <button
                onClick={() => setSelectedEvent(null)}
                style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#786c5e" }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.9rem", color: "#44403c" }}>
              {selectedEvent.date?.year !== undefined && (
                <p style={{ margin: 0 }}>
                  <strong>Date:</strong> {formatYearLabel(selectedEvent.date.year)}
                </p>
              )}
              {selectedEvent.location && (
                <p style={{ margin: 0 }}>
                  <strong>Location:</strong> {selectedEvent.location}
                </p>
              )}
              {selectedEvent.description && (
                <p style={{ margin: 0, lineHeight: "1.5" }}>{selectedEvent.description}</p>
              )}
              {(selectedEvent.personIds || []).length > 0 && (
                <p style={{ margin: 0 }}>
                  <strong>Key Figures:</strong>{" "}
                  {(selectedEvent.personIds || [])
                    .map((id) => people.find((person) => person.id === id)?.name || id)
                    .join(", ")}
                </p>
              )}
              {(selectedEvent.biblicalReferences || []).length > 0 && (
                <p style={{ margin: 0 }}>
                  <strong>Scripture:</strong> {(selectedEvent.biblicalReferences || []).join(", ")}
                </p>
              )}

              <button
                onClick={() => setSelectedEvent(null)}
                style={{
                  marginTop: "12px",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  background: "#e7e5e4",
                  border: "1px solid #d6d3d1",
                  color: "#292524",
                  fontWeight: "bold",
                  cursor: "pointer",
                  alignSelf: "flex-start",
                }}
              >
                ← Back to City Events
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}