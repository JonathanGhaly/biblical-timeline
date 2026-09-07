import { useState, useMemo } from "react";
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

  /**
   * Real-world geographic coordinates.
   * Latitude:  north/south position
   * Longitude: east/west position
   */
  lat: number;
  lon: number;

  aliases: string[];
};

type OldTestamentMapPageProps = {
  events: BiblicalEvent[];
  people?: Person[];
  mapSrc?: string;
};

/*
 * ============================================================
 * MAP CONFIGURATION
 * ============================================================
 *
 * The map uses a simple geographic projection:
 *
 * longitude -> X
 * latitude  -> Y
 *
 * This is much more reliable than manually assigning x/y
 * percentages to every city.
 *
 * The bounds cover the main Old Testament world:
 *
 * Egypt
 * Sinai
 * Canaan
 * Syria
 * Mesopotamia
 * Babylonia
 * Arabia
 * Media
 * Persia
 */
const MAP_WIDTH = 1800;
const MAP_HEIGHT = 950;

const MAP_BOUNDS = {
  minLon: 24,
  maxLon: 56,
  minLat: 22,
  maxLat: 40,
};

/**
 * Convert latitude / longitude into SVG/map pixel coordinates.
 *
 * This uses an equirectangular projection.
 *
 * It is not suitable for global maps, but works well for this
 * relatively compact Ancient Near East map.
 */
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

/*
 * ============================================================
 * OLD TESTAMENT LOCATIONS
 * ============================================================
 *
 * Coordinates are geographic latitude / longitude rather than
 * arbitrary canvas positions.
 *
 * NOTE:
 * Some biblical locations are archaeological identifications
 * rather than absolutely certain coordinates. Therefore the
 * coordinates should be understood as representative locations.
 */
const OT_CITIES: City[] = [
  // ==========================================================
  // EGYPT & SINAI
  // ==========================================================

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

  // ==========================================================
  // CANAAN & LEVANT
  // ==========================================================

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
    aliases: ["Beersheba", "Beersheba", "באר שבע", "بئر سبع"],
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
    lat: 32.050,
    lon: 34.750,
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

  // ==========================================================
  // MESOPOTAMIA & ASSYRIA
  // ==========================================================

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

  // ==========================================================
  // BABYLONIA
  // ==========================================================

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

  // ==========================================================
  // ARABIA
  // ==========================================================

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

  // ==========================================================
  // PERSIA & MEDIA
  // ==========================================================

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
  const [selectedEvent, setSelectedEvent] =
    useState<BiblicalEvent | null>(null);

  const [selectedRegion, setSelectedRegion] =
    useState<string>("All");

  const regions = [
    "All",
    "Egypt & Sinai",
    "Canaan & Levant",
    "Mesopotamia & Assyria",
    "Babylonia",
    "Arabia",
    "Persia & Media",
  ];

  /*
   * ==========================================================
   * EVENT -> CITY MATCHING
   * ==========================================================
   *
   * We still support location strings from your existing data.
   *
   * However, we deliberately removed broad aliases such as
   * "Egypt" from Memphis because:
   *
   *   location = "Egypt"
   *
   * does NOT mean:
   *
   *   location = "Memphis"
   *
   * Otherwise one tiny string match can create geographical
   * nonsense.
   */
  const eventsByCity = useMemo(() => {
    const map = new Map<string, BiblicalEvent[]>();

    OT_CITIES.forEach((city) => {
      const matching = events.filter((event) => {
        if (!event.location) {
          return false;
        }

        const location = event.location.trim().toLowerCase();

        return city.aliases.some((alias) => {
          const normalizedAlias = alias.trim().toLowerCase();

          if (!normalizedAlias) {
            return false;
          }

          /*
           * Match whole words where possible.
           *
           * This avoids cases such as:
           *
           * "Ur"
           *
           * matching unrelated words that happen to contain
           * the letters "ur".
           */
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

  /*
   * ==========================================================
   * FILTERED CITIES
   * ==========================================================
   */
  const filteredCities = useMemo(() => {
    if (selectedRegion === "All") {
      return OT_CITIES;
    }

    return OT_CITIES.filter(
      (city) => city.region === selectedRegion
    );
  }, [selectedRegion]);

  const activeCityEvents = selectedCity
    ? eventsByCity.get(selectedCity.id) || []
    : [];

  /*
   * ==========================================================
   * DATE FORMATTING
   * ==========================================================
   */
  const formatYearLabel = (year?: number) => {
    if (year === undefined) {
      return "";
    }

    return year < 0
      ? `${Math.abs(year)} BC`
      : `${year} AD`;
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
      {/* ======================================================
          HEADER
          ====================================================== */}

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
            Geographic map of the Ancient Near East with
            latitude/longitude-based biblical locations.
          </p>
        </div>

        {/* ====================================================
            REGION FILTERS
            ==================================================== */}

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
                  (selectedRegion === region
                    ? "#854d0e"
                    : "#d6d3d1"),
                background:
                  selectedRegion === region
                    ? "#854d0e"
                    : "#fef3c7",
                color:
                  selectedRegion === region
                    ? "#ffffff"
                    : "#451a03",
                fontSize: "0.8rem",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================
          MAP
          ====================================================== */}

      <div
        style={{
          width: "100%",
          overflowX: "auto",
          borderRadius: "12px",
          border: "3px solid #78350f",
          boxShadow:
            "0 12px 30px rgba(0, 0, 0, 0.25)",
          background: "#1c1917",
        }}
      >
        <div
          style={{
            position: "relative",
            width: `${MAP_WIDTH}px`,
            height: `${MAP_HEIGHT}px`,
            background: "#ebdcb9",
          }}
        >
          {/* ==================================================
              SVG GEOGRAPHIC BACKGROUND
              ================================================== */}

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
              {/* Ocean */}

              <linearGradient
                id="oceanGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor="#2b5368"
                />

                <stop
                  offset="100%"
                  stopColor="#1a3644"
                />
              </linearGradient>

              {/* Fertile Crescent */}

              <linearGradient
                id="fertileArc"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  stopColor="#ebdcb9"
                />

                <stop
                  offset="35%"
                  stopColor="#c5d8a4"
                  stopOpacity="0.6"
                />

                <stop
                  offset="70%"
                  stopColor="#a3ccab"
                  stopOpacity="0.6"
                />

                <stop
                  offset="100%"
                  stopColor="#ebdcb9"
                />
              </linearGradient>

              {/* Land */}

              <linearGradient
                id="landGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor="#f5e8ca"
                />

                <stop
                  offset="50%"
                  stopColor="#ebdcb9"
                />

                <stop
                  offset="100%"
                  stopColor="#d2bc8a"
                />
              </linearGradient>

              {/* Label shadow */}

              <filter
                id="labelShadow"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feDropShadow
                  dx="1"
                  dy="1"
                  stdDeviation="1.5"
                  floodColor="#fef3c7"
                  floodOpacity="0.95"
                />
              </filter>
            </defs>

            {/* =================================================
                BASE LAND
                ================================================= */}

            <rect
              width={MAP_WIDTH}
              height={MAP_HEIGHT}
              fill="url(#landGrad)"
            />

            {/* =================================================
                FERTILE CRESCENT
                ================================================= */}

            <path
              d="
                M 230,660
                Q 300,560 450,450
                Q 620,180 800,180
                Q 1000,180 1250,680
                Q 1150,750 900,450
                Q 650,300 450,550
                Q 300,650 230,660
                Z
              "
              fill="url(#fertileArc)"
            />

            {/* =================================================
                MEDITERRANEAN SEA
                ================================================= */}

            <path
              d="
                M 0,0
                L 560,0
                C 530,120 510,180 460,200
                C 450,240 442,280 438,320
                C 432,360 422,410 410,450
                C 400,490 385,540 365,580
                C 330,570 280,560 220,560
                L 0,560
                Z
              "
              fill="url(#oceanGrad)"
              stroke="#1a3644"
              strokeWidth="2"
            />

            {/* =================================================
                CYPRUS
                ================================================= */}

            <path
              d="
                M 330,300
                C 360,290 390,295 415,305
                C 390,315 350,325 320,315
                Z
              "
              fill="url(#landGrad)"
              stroke="#78350f"
              strokeWidth="1.5"
            />

            {/* =================================================
                BLACK SEA
                ================================================= */}

            <path
              d="
                M 520,0
                C 580,70 700,90 850,50
                C 900,20 950,0 950,0
                Z
              "
              fill="url(#oceanGrad)"
              stroke="#1a3644"
            />

            {/* =================================================
                CASPIAN SEA
                ================================================= */}

            <path
              d="
                M 1450,0
                C 1500,80 1520,160 1500,240
                C 1470,300 1420,260 1390,160
                C 1370,80 1370,0 1370,0
                Z
              "
              fill="url(#oceanGrad)"
              stroke="#1a3644"
            />

            {/* =================================================
                RED SEA / GULFS
                ================================================= */}

            <path
              d="
                M 320,630
                L 230,950
                L 380,950
                L 400,860
                L 440,710
                L 420,710
                L 360,830
                L 330,630
                Z
              "
              fill="url(#oceanGrad)"
              stroke="#1a3644"
              strokeWidth="2"
            />

            {/* =================================================
                PERSIAN GULF
                ================================================= */}

            <path
              d="
                M 1220,950
                C 1230,750 1300,700 1420,670
                C 1580,640 1700,650 1800,690
                L 1800,950
                Z
              "
              fill="url(#oceanGrad)"
              stroke="#1a3644"
              strokeWidth="2"
            />

            {/* =================================================
                NILE RIVER
                ================================================= */}

            <g
              stroke="#1e4e6d"
              fill="none"
              strokeLinecap="round"
            >
              <path
                d="
                  M 180,950
                  Q 210,850 230,660
                  L 250,600
                "
                strokeWidth="5"
              />

              <path
                d="
                  M 250,600
                  Q 200,570 170,560
                "
                strokeWidth="2.5"
              />

              <path
                d="
                  M 250,600
                  Q 240,570 230,560
                "
                strokeWidth="2"
              />

              <path
                d="
                  M 250,600
                  Q 280,570 300,560
                "
                strokeWidth="2.5"
              />
            </g>

            {/* =================================================
                JORDAN RIVER SYSTEM
                ================================================= */}

            <g
              stroke="#1e4e6d"
              fill="none"
            >
              <ellipse
                cx="475"
                cy="410"
                rx="8"
                ry="12"
                fill="#2b5368"
                stroke="none"
              />

              <ellipse
                cx="475"
                cy="560"
                rx="12"
                ry="30"
                fill="#2b5368"
                stroke="none"
              />

              <path
                d="M 475,422 L 475,530"
                strokeWidth="2.5"
              />
            </g>

            {/* =================================================
                EUPHRATES
                ================================================= */}

            <path
              d="
                M 780,100
                Q 680,180 620,210
                Q 750,310 900,420
                Q 1020,480 1080,520
                Q 1140,580 1210,680
                L 1230,720
              "
              fill="none"
              stroke="#1e4e6d"
              strokeWidth="4.5"
              strokeLinecap="round"
            />

            {/* =================================================
                TIGRIS
                ================================================= */}

            <path
              d="
                M 900,100
                Q 940,250 955,280
                Q 930,330 1050,470
                Q 1150,570 1230,720
              "
              fill="none"
              stroke="#1e4e6d"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* =================================================
                MOUNTAIN RANGES
                ================================================= */}

            <g
              stroke="#78350f"
              fill="none"
              strokeWidth="2"
              strokeDasharray="4,4"
              opacity="0.45"
            >
              {/* Taurus */}

              <path
                d="M 460,160 Q 560,190 660,150"
              />

              {/* Lebanon */}

              <path
                d="M 450,280 L 445,380"
              />

              {/* Ararat */}

              <path
                d="
                  M 880,90
                  Q 1020,70 1150,110
                "
              />

              {/* Zagros */}

              <path
                d="
                  M 1180,220
                  Q 1380,380 1620,600
                "
              />
            </g>

            {/* =================================================
                REGIONAL LABELS
                ================================================= */}

            <g
              fill="#451a03"
              fontFamily="Georgia, serif"
              fontWeight="bold"
              textAnchor="middle"
              filter="url(#labelShadow)"
            >
              <text
                x="170"
                y="780"
                fontSize="26"
              >
                EGYPT
              </text>

              <text
                x="375"
                y="790"
                fontSize="16"
              >
                SINAI
              </text>

              <text
                x="430"
                y="140"
                fontSize="22"
              >
                ASIA MINOR
              </text>

              <text
                x="320"
                y="470"
                fontSize="20"
                transform="rotate(-75 320 470)"
              >
                CANAAN
              </text>

              <text
                x="520"
                y="280"
                fontSize="22"
              >
                SYRIA (ARAM)
              </text>

              <text
                x="820"
                y="260"
                fontSize="26"
              >
                MESOPOTAMIA
              </text>

              <text
                x="830"
                y="290"
                fontSize="14"
                fontStyle="italic"
              >
                Paddan-aram
              </text>

              <text
                x="1010"
                y="220"
                fontSize="24"
              >
                ASSYRIA
              </text>

              <text
                x="1000"
                y="80"
                fontSize="20"
              >
                ARMENIA
              </text>

              <text
                x="1100"
                y="600"
                fontSize="24"
              >
                BABYLONIA
              </text>

              <text
                x="1170"
                y="630"
                fontSize="16"
                fontStyle="italic"
              >
                Chaldea
              </text>

              <text
                x="1310"
                y="260"
                fontSize="24"
              >
                MEDIA
              </text>

              <text
                x="1390"
                y="520"
                fontSize="24"
              >
                ELAM
              </text>

              <text
                x="1560"
                y="580"
                fontSize="26"
              >
                PERSIA
              </text>

              <text
                x="800"
                y="720"
                fontSize="28"
                fill="#78350f"
                opacity="0.6"
              >
                ARABIAN DESERT
              </text>
            </g>

            {/* =================================================
                RIVER LABELS
                ================================================= */}

            <g
              fill="#1e4e6d"
              fontSize="12"
              fontStyle="italic"
              fontWeight="600"
            >
              <text
                x="110"
                y="820"
                transform="rotate(-72 110 820)"
              >
                Nile River
              </text>

              <text
                x="790"
                y="320"
                transform="rotate(28 790 320)"
              >
                Euphrates River
              </text>

              <text
                x="1030"
                y="340"
                transform="rotate(48 1030 340)"
              >
                Tigris River
              </text>
            </g>

            {/* =================================================
                WATER LABELS
                ================================================= */}

            <g
              fill="#ffffff"
              fontFamily="sans-serif"
              fontWeight="bold"
              opacity="0.85"
              textAnchor="middle"
            >
              <text
                x="220"
                y="280"
                fontSize="18"
              >
                Mediterranean Sea
              </text>

              <text
                x="680"
                y="40"
                fontSize="14"
              >
                Black Sea
              </text>

              <text
                x="1460"
                y="120"
                fontSize="15"
              >
                Caspian Sea
              </text>

              <text
                x="1600"
                y="780"
                fontSize="18"
              >
                Persian Gulf
              </text>

              <text
                x="290"
                y="880"
                fontSize="15"
                transform="rotate(-68 290 880)"
              >
                Red Sea
              </text>
            </g>

            {/* =================================================
                LEGEND
                ================================================= */}

            <g
              transform="translate(1420, 800)"
            >
              <rect
                width="320"
                height="110"
                rx="8"
                fill="#fef3c7"
                stroke="#78350f"
                strokeWidth="2"
                opacity="0.92"
              />

              <text
                x="160"
                y="35"
                textAnchor="middle"
                fill="#451a03"
                fontFamily="Georgia, serif"
                fontSize="18"
                fontWeight="bold"
              >
                THE OLD TESTAMENT WORLD
              </text>

              <text
                x="160"
                y="60"
                textAnchor="middle"
                fill="#78350f"
                fontFamily="sans-serif"
                fontSize="12"
              >
                Ancient Near East Geographic Map
              </text>

              <line
                x1="30"
                y1="75"
                x2="290"
                y2="75"
                stroke="#78350f"
                strokeWidth="1"
                opacity="0.5"
              />

              <circle
                cx="50"
                cy="90"
                r="5"
                fill="#b91c1c"
              />

              <text
                x="65"
                y="94"
                fill="#451a03"
                fontFamily="sans-serif"
                fontSize="11"
              >
                Biblical Location Marker
              </text>
            </g>
          </svg>

          {/* ====================================================
              CITY MARKERS
              ==================================================== */}

          {filteredCities.map((city) => {
            const cityEvents =
              eventsByCity.get(city.id) || [];

            const hasEvents =
              cityEvents.length > 0;

            /*
             * IMPORTANT:
             *
             * City position is calculated from its actual
             * geographic coordinates.
             */
            const { x, y } = geoToPixel(
              city.lat,
              city.lon
            );

            return (
              <div
                key={city.id}
                onClick={() => {
                  setSelectedCity(city);
                  setSelectedEvent(null);
                }}
                title={`${city.name} • ${city.lat.toFixed(
                  4
                )}°, ${city.lon.toFixed(4)}°`}
                style={{
                  position: "absolute",
                  left: `${x}px`,
                  top: `${y}px`,
                  transform:
                    "translate(-50%, -50%)",
                  cursor: "pointer",
                  zIndex: 30,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* =================================================
                    CITY POINT
                    ================================================= */}

                <div
                  style={{
                    width: hasEvents
                      ? "18px"
                      : "12px",
                    height: hasEvents
                      ? "18px"
                      : "12px",
                    borderRadius: "50%",
                    backgroundColor: hasEvents
                      ? "#b91c1c"
                      : "#0284c7",
                    border:
                      "2px solid #ffffff",
                    boxShadow:
                      "0 2px 5px rgba(0,0,0,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontSize: "0.68rem",
                    fontWeight: "bold",
                  }}
                >
                  {hasEvents
                    ? cityEvents.length
                    : ""}
                </div>

                {/* =================================================
                    CITY LABEL
                    ================================================= */}

                <div
                  style={{
                    marginTop: "2px",
                    background:
                      "rgba(28, 25, 23, 0.9)",
                    color: "#fef3c7",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                    boxShadow:
                      "0 1px 4px rgba(0,0,0,0.3)",
                    border:
                      "1px solid rgba(217, 119, 6, 0.3)",
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

      {/* ======================================================
          CITY EVENT MODAL
          ====================================================== */}

      {selectedCity && !selectedEvent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => {
            setSelectedCity(null);
          }}
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
              boxShadow:
                "0 20px 25px -5px rgba(0,0,0,0.3)",
              border: "2px solid #78350f",
            }}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            {/* =================================================
                CITY HEADER
                ================================================= */}

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
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
                    fontFamily:
                      "Georgia, serif",
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
                  {selectedCity.arabicName}
                  {" • "}
                  Region: {selectedCity.region}
                </p>

                <p
                  style={{
                    margin: "5px 0 0 0",
                    fontSize: "0.78rem",
                    color: "#78716c",
                    fontFamily: "sans-serif",
                  }}
                >
                  {selectedCity.lat.toFixed(4)}°
                  {" N, "}
                  {selectedCity.lon.toFixed(4)}°
                  {" E"}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedCity(null)
                }
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

            {/* =================================================
                EVENTS
                ================================================= */}

            {activeCityEvents.length === 0 ? (
              <p
                style={{
                  color: "#786c5e",
                  fontSize: "0.9rem",
                  fontFamily: "sans-serif",
                }}
              >
                No biblical events currently tagged
                with this location in your dataset.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  fontFamily: "sans-serif",
                }}
              >
                {activeCityEvents.map(
                  (event) => (
                    <div
                      key={event.id}
                      onClick={() =>
                        setSelectedEvent(event)
                      }
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border:
                          "1px solid #d6d3d1",
                        background:
                          "#ffffff",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "baseline",
                          gap: "10px",
                        }}
                      >
                        <h4
                          style={{
                            margin:
                              "0 0 4px 0",
                            color: "#1c1917",
                            fontSize:
                              "0.95rem",
                          }}
                        >
                          {event.title}
                        </h4>

                        {event.date?.year !==
                          undefined && (
                          <span
                            style={{
                              fontSize:
                                "0.78rem",
                              color:
                                "#b91c1c",
                              fontWeight:
                                "bold",
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {formatYearLabel(
                              event.date.year
                            )}
                          </span>
                        )}
                      </div>

                      {event.description && (
                        <p
                          style={{
                            margin: 0,
                            fontSize:
                              "0.85rem",
                            color:
                              "#57534e",
                            overflow:
                              "hidden",
                            textOverflow:
                              "ellipsis",
                            display:
                              "-webkit-box",
                            WebkitLineClamp:
                              2,
                            WebkitBoxOrient:
                              "vertical",
                          }}
                        >
                          {event.description}
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================
          EVENT DETAILS MODAL
          ====================================================== */}

      {selectedEvent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100,
          }}
          onClick={() =>
            setSelectedEvent(null)
          }
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
              boxShadow:
                "0 20px 25px -5px rgba(0,0,0,0.3)",
              border: "2px solid #78350f",
              fontFamily: "sans-serif",
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* =================================================
                EVENT HEADER
                ================================================= */}

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "flex-start",
                marginBottom: "16px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.3rem",
                  color: "#1c1917",
                  fontFamily:
                    "Georgia, serif",
                }}
              >
                {selectedEvent.title}
              </h3>

              <button
                onClick={() =>
                  setSelectedEvent(null)
                }
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

            {/* =================================================
                EVENT INFORMATION
                ================================================= */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: "0.9rem",
                color: "#44403c",
              }}
            >
              {selectedEvent.date?.year !==
                undefined && (
                <p style={{ margin: 0 }}>
                  <strong>Date:</strong>{" "}
                  {formatYearLabel(
                    selectedEvent.date.year
                  )}
                </p>
              )}

              {selectedEvent.location && (
                <p style={{ margin: 0 }}>
                  <strong>
                    Location:
                  </strong>{" "}
                  {selectedEvent.location}
                </p>
              )}

              {selectedEvent.description && (
                <p
                  style={{
                    margin: 0,
                    lineHeight: "1.5",
                  }}
                >
                  {selectedEvent.description}
                </p>
              )}

              {(selectedEvent.personIds ||
                []).length > 0 && (
                <p style={{ margin: 0 }}>
                  <strong>
                    Key Figures:
                  </strong>{" "}
                  {(
                    selectedEvent.personIds ||
                    []
                  )
                    .map(
                      (id) =>
                        people.find(
                          (person) =>
                            person.id === id
                        )?.name || id
                    )
                    .join(", ")}
                </p>
              )}

              {(
                selectedEvent.biblicalReferences ||
                []
              ).length > 0 && (
                <p style={{ margin: 0 }}>
                  <strong>
                    Scripture:
                  </strong>{" "}
                  {(
                    selectedEvent.biblicalReferences ||
                    []
                  ).join(", ")}
                </p>
              )}

              {/* =================================================
                  BACK BUTTON
                  ================================================= */}

              <button
                onClick={() =>
                  setSelectedEvent(null)
                }
                style={{
                  marginTop: "12px",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  background: "#e7e5e4",
                  border:
                    "1px solid #d6d3d1",
                  color: "#292524",
                  fontWeight: "bold",
                  cursor: "pointer",
                  alignSelf:
                    "flex-start",
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