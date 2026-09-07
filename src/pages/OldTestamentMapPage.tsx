import { useState, useMemo } from "react";
import type { Person, BiblicalEvent } from "../types/genealogy";

type City = {
  id: string;
  name: string;
  arabicName: string;
  region: "Egypt & Sinai" | "Canaan & Levant" | "Mesopotamia & Assyria" | "Babylonia" | "Arabia" | "Persia & Media";
  x: number; // Percentage width position across 1800px canvas
  y: number; // Percentage height position
  aliases: string[];
};

// Comprehensive biblical cities across the entire Ancient Near East
const OT_CITIES: City[] = [
  // --- Egypt & Sinai ---
  { id: "thebes", name: "Thebes (No-Amon)", arabicName: "طيبة / نوس آمن", region: "Egypt & Sinai", x: 8, y: 88, aliases: ["Thebes", "No-Amon", "No", "طيبة"] },
  { id: "memphis", name: "Memphis (Noph)", arabicName: "منف", region: "Egypt & Sinai", x: 12, y: 72, aliases: ["Memphis", "Noph", "منف", "Egypt"] },
  { id: "rameses", name: "Rameses (Goshen)", arabicName: "رعمسيس / جاسان", region: "Egypt & Sinai", x: 15, y: 60, aliases: ["Rameses", "Goshen", "جاسان", "رعمسيس"] },
  { id: "sinai", name: "Mt. Sinai (Horeb)", arabicName: "جبل سيناء", region: "Egypt & Sinai", x: 23, y: 82, aliases: ["Sinai", "Horeb", "سيناء", "حوريب"] },
  { id: "eziongeber", name: "Ezion-Geber", arabicName: "عصيون جابر", region: "Egypt & Sinai", x: 28, y: 75, aliases: ["Ezion-geber", "Ezion geber", "عصيون جابر"] },

  // --- Canaan, Philistia & Transjordan ---
  { id: "gaza", name: "Gaza", arabicName: "غزة", region: "Canaan & Levant", x: 28, y: 63, aliases: ["Gaza", "غزة"] },
  { id: "beersheba", name: "Beersheba", arabicName: "بئر سبع", region: "Canaan & Levant", x: 31, y: 65, aliases: ["Beersheba", "بئر سبع"] },
  { id: "kirhareseth", name: "Kir-hareseth (Moab)", arabicName: "قير حارسة", region: "Canaan & Levant", x: 36, y: 67, aliases: ["Moab", "Kir-hareseth", "Kir", "قير حارسة"] },
  { id: "hebron", name: "Hebron", arabicName: "حبرون", region: "Canaan & Levant", x: 33.5, y: 60, aliases: ["Hebron", "حبرون"] },
  { id: "jerusalem", name: "Jerusalem", arabicName: "أورشليم", region: "Canaan & Levant", x: 34, y: 56, aliases: ["Jerusalem", "Zion", "أورشليم", "Jebus"] },
  { id: "jericho", name: "Jericho", arabicName: "أريحا", region: "Canaan & Levant", x: 35.5, y: 55, aliases: ["Jericho", "أريحا"] },
  { id: "rabbah", name: "Rabbah (Ammon)", arabicName: "ربة عمون", region: "Canaan & Levant", x: 38, y: 56, aliases: ["Rabbah", "Ammon", "ربة"] },
  { id: "joppa", name: "Joppa", arabicName: "يافا", region: "Canaan & Levant", x: 31.5, y: 52, aliases: ["Joppa", "Jaffa", "يافا"] },
  { id: "shechem", name: "Shechem", arabicName: "شكيم", region: "Canaan & Levant", x: 35, y: 49, aliases: ["Shechem", "شكيم"] },
  { id: "samaria", name: "Samaria", arabicName: "السامرة", region: "Canaan & Levant", x: 34.5, y: 47, aliases: ["Samaria", "السامرة"] },
  { id: "dan", name: "Dan", arabicName: "دان", region: "Canaan & Levant", x: 37, y: 40, aliases: ["Dan", "Laish", "دان"] },
  { id: "tyre", name: "Tyre", arabicName: "صور", region: "Canaan & Levant", x: 35.5, y: 38, aliases: ["Tyre", "صور"] },
  { id: "sidon", name: "Sidon", arabicName: "صيدون", region: "Canaan & Levant", x: 36, y: 34, aliases: ["Sidon", "صيدون"] },
  { id: "damascus", name: "Damascus", arabicName: "دمشق", region: "Canaan & Levant", x: 41, y: 36, aliases: ["Damascus", "دمشق", "Aram"] },

  // --- Syria, Northern Levant & Upper Mesopotamia ---
  { id: "carchemish", name: "Carchemish", arabicName: "كركميش", region: "Mesopotamia & Assyria", x: 47, y: 22, aliases: ["Carchemish", "كركميش"] },
  { id: "haran", name: "Haran", arabicName: "حاران", region: "Mesopotamia & Assyria", x: 52, y: 20, aliases: ["Haran", "حاران", "Paddan-aram"] },
  { id: "asshur", name: "Asshur", arabicName: "آشور", region: "Mesopotamia & Assyria", x: 64, y: 34, aliases: ["Asshur", "Ashur", "آشور"] },
  { id: "nineveh", name: "Nineveh", arabicName: "نينوى", region: "Mesopotamia & Assyria", x: 65, y: 26, aliases: ["Nineveh", "Assyria", "نينوى"] },
  { id: "calah", name: "Calah (Nimrud)", arabicName: "كالح", region: "Mesopotamia & Assyria", x: 66, y: 29, aliases: ["Calah", "Nimrud", "كالح"] },

  // --- Babylonia & Lower Mesopotamia ---
  { id: "babylon", name: "Babylon", arabicName: "بابل", region: "Babylonia", x: 72, y: 54, aliases: ["Babylon", "Babel", "بابل", "Chaldea"] },
  { id: "erech", name: "Erech (Uruk)", arabicName: "أروك", region: "Babylonia", x: 77, y: 64, aliases: ["Erech", "Uruk", "أروك"] },
  { id: "ur", name: "Ur of the Chaldees", arabicName: "أور الكلدانيين", region: "Babylonia", x: 79, y: 70, aliases: ["Ur", "أور"] },

  // --- Arabia ---
  { id: "dedan", name: "Dedan", arabicName: "ديدان", region: "Arabia", x: 42, y: 85, aliases: ["Dedan", "ديدان", "Arabia"] },
  { id: "tema", name: "Tema", arabicName: "تيماء", region: "Arabia", x: 48, y: 82, aliases: ["Tema", "تيماء"] },

  // --- Persia & Media ---
  { id: "ecbatana", name: "Ecbatana", arabicName: "أحمتا / أكتبانا", region: "Persia & Media", x: 84, y: 32, aliases: ["Ecbatana", "Achmetha", "أحمتا"] },
  { id: "susa", name: "Susa (Shushan)", arabicName: "شوشان", region: "Persia & Media", x: 86, y: 55, aliases: ["Susa", "Shushan", "شوشان", "Persia", "Elam"] },
  { id: "persepolis", name: "Persepolis", arabicName: "تخت جمشيد", region: "Persia & Media", x: 94, y: 68, aliases: ["Persepolis", "Persia"] },
];

type OldTestamentMapPageProps = {
  events: BiblicalEvent[];
  people?: Person[];
  mapSrc?: string;
};

export default function OldTestamentMapPage({
  events,
  people = [],
}: OldTestamentMapPageProps) {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<BiblicalEvent | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>("All");

  const regions = ["All", "Egypt & Sinai", "Canaan & Levant", "Mesopotamia & Assyria", "Babylonia", "Arabia", "Persia & Media"];

  const eventsByCity = useMemo(() => {
    const map = new Map<string, BiblicalEvent[]>();
    OT_CITIES.forEach((city) => {
      const matching = events.filter((e) => {
        if (!e.location) return false;
        const locLower = e.location.toLowerCase();
        return city.aliases.some((alias) => locLower.includes(alias.toLowerCase()));
      });
      map.set(city.id, matching);
    });
    return map;
  }, [events]);

  const filteredCities = useMemo(() => {
    if (selectedRegion === "All") return OT_CITIES;
    return OT_CITIES.filter((c) => c.region === selectedRegion);
  }, [selectedRegion]);

  const activeCityEvents = selectedCity ? eventsByCity.get(selectedCity.id) || [] : [];

  const formatYearLabel = (year?: number) => {
    if (year === undefined) return "";
    return year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      {/* Header & Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
        <div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "bold", margin: "0 0 6px 0", color: "#0f172a" }}>
            Ancient Near East: Old Testament World Map
          </h2>
          <p style={{ color: "#64748b", margin: 0, fontSize: "0.92rem" }}>
            Scroll horizontally to navigate from Egypt & the Sinai Peninsula all the way to Arabia, Babylonia, and Persia.
          </p>
        </div>

        {/* Region Filter Buttons */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                border: "1px solid " + (selectedRegion === reg ? "#0284c7" : "#cbd5e1"),
                background: selectedRegion === reg ? "#0284c7" : "#ffffff",
                color: selectedRegion === reg ? "#ffffff" : "#334155",
                fontSize: "0.8rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal Scroll Wrapper Container */}
      <div
        style={{
          width: "100%",
          overflowX: "auto",
          borderRadius: "16px",
          border: "2px solid #94a3b8",
          boxShadow: "0 12px 28px -5px rgba(0, 0, 0, 0.15)",
          background: "#0f172a",
        }}
      >
        {/* Fixed Width Canvas for Rich High-Detail Panoramic View */}
        <div
          style={{
            position: "relative",
            width: "1800px",
            height: "950px",
            background: "#fef3c7",
          }}
        >
          {/* Detailed SVG Topography, Coastlines, Rivers, Trade Routes */}
          <svg
            viewBox="0 0 1800 950"
            style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
          >
            <defs>
              {/* Gradients */}
              <linearGradient id="seaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>

              <linearGradient id="fertileArc" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="35%" stopColor="#d9f99d" stopOpacity="0.7" />
                <stop offset="70%" stopColor="#bbf7d0" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#fef3c7" />
              </linearGradient>

              <linearGradient id="desertGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde68a" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
              </linearGradient>

              {/* Mountain Pattern */}
              <pattern id="mountainPattern" width="40" height="20" patternUnits="userSpaceOnUse">
                <path d="M 0,20 L 10,5 L 20,20 M 15,20 L 25,2 L 35,20" fill="none" stroke="#d97706" strokeWidth="1.2" opacity="0.4" />
              </pattern>
            </defs>

            {/* Base Desert Terrain */}
            <rect width="1800" height="950" fill="url(#desertGrad)" />

            {/* Fertile Crescent Overlay */}
            <path
              d="M 200,600 Q 400,300 700,200 Q 1100,180 1450,650 Q 1300,750 800,450 Q 500,450 200,600 Z"
              fill="url(#fertileArc)"
            />

            {/* Mediterranean Sea */}
            <path
              d="M 0,0 L 620,0 L 640,220 L 620,320 L 590,380 L 570,420 L 520,490 L 400,530 L 280,560 L 0,560 Z"
              fill="url(#seaGrad)"
            />

            {/* Black Sea (North West) */}
            <path
              d="M 450,0 Q 600,0 750,0 Q 700,80 580,70 Q 480,60 450,0 Z"
              fill="url(#seaGrad)"
            />

            {/* Caspian Sea (North East) */}
            <path
              d="M 1400,0 Q 1550,0 1620,0 Q 1650,150 1580,220 Q 1480,180 1420,100 Z"
              fill="url(#seaGrad)"
            />

            {/* Red Sea, Gulf of Suez & Gulf of Aqaba */}
            <path
              d="M 220,950 L 320,720 L 360,700 L 375,760 L 410,710 L 460,730 L 490,720 L 380,950 Z"
              fill="url(#seaGrad)"
            />

            {/* Persian Gulf */}
            <path
              d="M 1380,950 L 1400,760 L 1490,700 L 1650,640 L 1800,680 L 1800,950 Z"
              fill="url(#seaGrad)"
            />

            {/* Nile River System & Delta */}
            <g stroke="#0284c7" fill="none" strokeWidth="4">
              {/* Main River */}
              <path d="M 150,950 Q 180,850 220,760 L 270,680 L 270,600" />
              {/* Delta Branches */}
              <path d="M 270,600 Q 230,570 210,560" strokeWidth="2.5" />
              <path d="M 270,600 Q 270,570 280,560" strokeWidth="2.5" />
              <path d="M 270,600 Q 310,570 340,560" strokeWidth="2.5" />
            </g>

            {/* Jordan River, Sea of Galilee, Dead Sea */}
            <g stroke="#0284c7" fill="none">
              {/* Sea of Galilee */}
              <ellipse cx="640" cy="400" rx="9" ry="14" fill="#0284c7" stroke="none" />
              {/* Dead Sea */}
              <ellipse cx="630" cy="560" rx="14" ry="32" fill="#0284c7" stroke="none" />
              {/* Jordan River */}
              <path d="M 640,414 L 638,470 L 632,528" strokeWidth="3" />
            </g>

            {/* Tigris & Euphrates Rivers */}
            <g stroke="#0284c7" fill="none" strokeWidth="4.5">
              {/* Euphrates River */}
              <path d="M 750,160 Q 900,200 1020,320 Q 1200,480 1320,580 Q 1380,650 1430,730" />
              {/* Tigris River */}
              <path d="M 1100,150 Q 1200,280 1280,400 Q 1360,550 1430,730" strokeWidth="4" />
            </g>

            {/* Mountain Ranges Visual Shading */}
            <rect x="360" y="740" width="100" height="100" fill="url(#mountainPattern)" /> {/* Sinai */}
            <rect x="620" y="260" width="80" height="100" fill="url(#mountainPattern)" />  {/* Lebanon / Anti-Lebanon */}
            <rect x="1350" y="200" width="300" height="250" fill="url(#mountainPattern)" /> {/* Zagros Mtns */}
            <rect x="1050" y="80" width="200" height="100" fill="url(#mountainPattern)" />  {/* Mt. Ararat Region */}

            {/* Historical Trade Routes (Dashed Lines) */}
            <g stroke="#b45309" strokeWidth="2.5" strokeDasharray="6,6" fill="none" opacity="0.65">
              {/* Via Maris (Coastal Highway) */}
              <path d="M 270,600 L 520,490 L 600,380 L 650,300 L 740,320" />
              {/* King's Highway */}
              <path d="M 500,720 L 650,620 L 650,480 L 740,320" />
              {/* Royal Road to Susa */}
              <path d="M 1180,260 L 1300,520 L 1550,520" />
            </g>

            {/* Region / Geographic Labels */}
            <g fill="#78350f" fontWeight="bold" opacity="0.55" fontSize="18" textAnchor="middle">
              <text x="180" y="780" fontSize="24">EGYPT</text>
              <text x="380" y="830" fontSize="18">SINAI</text>
              <text x="540" y="440" fontSize="20">PHILISTIA</text>
              <text x="610" y="500" fontSize="22">CANAAN</text>
              <text x="680" y="600" fontSize="18">MOAB</text>
              <text x="740" y="360" fontSize="22">SYRIA (ARAM)</text>
              <text x="1000" y="240" fontSize="26">MESOPOTAMIA</text>
              <text x="1180" y="220" fontSize="24">ASSYRIA</text>
              <text x="1300" y="500" fontSize="26">BABYLONIA</text>
              <text x="880" y="820" fontSize="24">ARABIA</text>
              <text x="1620" y="460" fontSize="26">PERSIA / MEDIA</text>
              <text x="1150" y="100" fontSize="18">MT. ARARAT</text>
            </g>

            {/* Physical Body of Water Labels */}
            <g fill="#ffffff" fontWeight="600" opacity="0.8" fontSize="14" textAnchor="middle">
              <text x="300" y="260" fontSize="18">MEDITERRANEAN SEA</text>
              <text x="1600" y="800" fontSize="18">PERSIAN GULF</text>
              <text x="310" y="880" transform="rotate(-65 310 880)">RED SEA</text>
            </g>

            {/* Route Labels */}
            <g fill="#92400e" fontSize="12" fontWeight="bold" opacity="0.8">
              <text x="440" y="525" transform="rotate(-25 440 525)">Via Maris</text>
              <text x="665" y="540" transform="rotate(-85 665 540)">King's Highway</text>
            </g>
          </svg>

          {/* Interactive City Overlay Markers */}
          {filteredCities.map((city) => {
            const cityEvents = eventsByCity.get(city.id) || [];
            const hasEvents = cityEvents.length > 0;

            return (
              <div
                key={city.id}
                onClick={() => setSelectedCity(city)}
                style={{
                  position: "absolute",
                  left: `${city.x}%`,
                  top: `${city.y}%`,
                  transform: "translate(-50%, -50%)",
                  cursor: "pointer",
                  zIndex: 30,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* City Pin Pulse/Badge */}
                <div
                  style={{
                    width: hasEvents ? "24px" : "16px",
                    height: hasEvents ? "24px" : "16px",
                    borderRadius: "50%",
                    backgroundColor: hasEvents ? "#dc2626" : "#0284c7",
                    border: "2px solid #ffffff",
                    boxShadow: "0 3px 8px rgba(0,0,0,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    transition: "transform 0.15s ease",
                  }}
                >
                  {hasEvents ? cityEvents.length : ""}
                </div>

                {/* Readable City Title Box */}
                <div
                  style={{
                    marginTop: "4px",
                    background: "rgba(15, 23, 42, 0.9)",
                    color: "#ffffff",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  {city.name}
                  <span style={{ fontSize: "0.68rem", opacity: 0.75, marginLeft: "4px" }}>
                    ({city.arabicName})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal 1: City Events List */}
      {selectedCity && !selectedEvent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
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
              background: "#ffffff",
              borderRadius: "16px",
              padding: "24px",
              maxWidth: "540px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.35rem", color: "#0f172a" }}>
                  {selectedCity.name}
                </h3>
                <p style={{ margin: "2px 0 0 0", fontSize: "0.9rem", color: "#0284c7", fontWeight: "600" }}>
                  {selectedCity.arabicName} • Region: {selectedCity.region}
                </p>
              </div>
              <button
                onClick={() => setSelectedCity(null)}
                style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            {activeCityEvents.length === 0 ? (
              <p style={{ color: "#64748b", fontSize: "0.92rem", padding: "12px 0" }}>
                No events currently tagged with this location in your dataset.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {activeCityEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    style={{
                      padding: "14px",
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                      background: "#f8fafc",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <h4 style={{ margin: "0 0 4px 0", color: "#0f172a", fontSize: "1rem" }}>
                        {evt.title}
                      </h4>
                      {evt.date?.year !== undefined && (
                        <span style={{ fontSize: "0.78rem", color: "#2563eb", fontWeight: "700" }}>
                          {formatYearLabel(evt.date.year)}
                        </span>
                      )}
                    </div>
                    {evt.description && (
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#475569", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {evt.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal 2: Event Details */}
      {selectedEvent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
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
              background: "#ffffff",
              borderRadius: "16px",
              padding: "24px",
              maxWidth: "540px",
              width: "90%",
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "1.35rem", color: "#0f172a" }}>
                {selectedEvent.title}
              </h3>
              <button
                onClick={() => setSelectedEvent(null)}
                style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.92rem", color: "#334155" }}>
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
                <p style={{ margin: 0, lineHeight: "1.6" }}>{selectedEvent.description}</p>
              )}
              {(selectedEvent.personIds || []).length > 0 && (
                <p style={{ margin: 0 }}>
                  <strong>Key Figures:</strong>{" "}
                  {(selectedEvent.personIds || [])
                    .map((id) => people.find((p) => p.id === id)?.name || id)
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
                  marginTop: "8px",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  background: "#f1f5f9",
                  border: "1px solid #cbd5e1",
                  color: "#334155",
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