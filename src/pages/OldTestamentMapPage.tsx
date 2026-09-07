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

// Geographically accurate coordinates on 1800x950 canvas
const OT_CITIES: City[] = [
  // --- Egypt & Sinai ---
  { id: "thebes", name: "Thebes (No-Amon)", arabicName: "طيبة / نوس آمن", region: "Egypt & Sinai", x: 10.0, y: 92.6, aliases: ["Thebes", "No-Amon", "No", "طيبة"] },
  { id: "memphis", name: "Memphis (Noph)", arabicName: "منف", region: "Egypt & Sinai", x: 12.8, y: 69.5, aliases: ["Memphis", "Noph", "منف", "Egypt"] },
  { id: "rameses", name: "Rameses (Goshen)", arabicName: "رعمسيس / جاسان", region: "Egypt & Sinai", x: 15.0, y: 62.1, aliases: ["Rameses", "Goshen", "جاسان", "رعمسيس"] },
  { id: "sinai", name: "Mt. Sinai (Horeb)", arabicName: "جبل سيناء", region: "Egypt & Sinai", x: 20.6, y: 86.3, aliases: ["Sinai", "Horeb", "سيناء", "حوريب"] },
  { id: "eziongeber", name: "Ezion-Geber", arabicName: "عصيون جابر", region: "Egypt & Sinai", x: 23.9, y: 74.7, aliases: ["Ezion-geber", "Ezion geber", "عصيون جابر"] },

  // --- Canaan, Philistia & Transjordan ---
  { id: "gaza", name: "Gaza", arabicName: "غزة", region: "Canaan & Levant", x: 21.1, y: 62.1, aliases: ["Gaza", "غزة"] },
  { id: "beersheba", name: "Beersheba", arabicName: "بئر سبع", region: "Canaan & Levant", x: 22.8, y: 65.3, aliases: ["Beersheba", "بئر سبع"] },
  { id: "kirhareseth", name: "Kir-hareseth (Moab)", arabicName: "قير حارسة", region: "Canaan & Levant", x: 26.9, y: 66.3, aliases: ["Moab", "Kir-hareseth", "Kir", "قير حارسة"] },
  { id: "hebron", name: "Hebron", arabicName: "حبرون", region: "Canaan & Levant", x: 24.4, y: 60.0, aliases: ["Hebron", "حبرون"] },
  { id: "jerusalem", name: "Jerusalem", arabicName: "أورشليم", region: "Canaan & Levant", x: 24.7, y: 56.3, aliases: ["Jerusalem", "Zion", "أورشليم", "Jebus"] },
  { id: "jericho", name: "Jericho", arabicName: "أريحا", region: "Canaan & Levant", x: 26.1, y: 55.3, aliases: ["Jericho", "أريحا"] },
  { id: "rabbah", name: "Rabbah (Ammon)", arabicName: "ربة عمون", region: "Canaan & Levant", x: 28.1, y: 55.3, aliases: ["Rabbah", "Ammon", "ربة"] },
  { id: "joppa", name: "Joppa", arabicName: "يافا", region: "Canaan & Levant", x: 22.8, y: 52.6, aliases: ["Joppa", "Jaffa", "يافا"] },
  { id: "shechem", name: "Shechem", arabicName: "شكيم", region: "Canaan & Levant", x: 25.0, y: 50.0, aliases: ["Shechem", "شكيم"] },
  { id: "samaria", name: "Samaria", arabicName: "السامرة", region: "Canaan & Levant", x: 24.7, y: 47.9, aliases: ["Samaria", "السامرة"] },
  { id: "dan", name: "Dan", arabicName: "دان", region: "Canaan & Levant", x: 26.1, y: 41.0, aliases: ["Dan", "Laish", "دان"] },
  { id: "tyre", name: "Tyre", arabicName: "صور", region: "Canaan & Levant", x: 24.4, y: 38.4, aliases: ["Tyre", "صور"] },
  { id: "sidon", name: "Sidon", arabicName: "صيدون", region: "Canaan & Levant", x: 24.7, y: 34.7, aliases: ["Sidon", "صيدون"] },
  { id: "damascus", name: "Damascus", arabicName: "دمشق", region: "Canaan & Levant", x: 28.6, y: 36.8, aliases: ["Damascus", "دمشق", "Aram"] },

  // --- Syria, Northern Levant & Upper Mesopotamia ---
  { id: "carchemish", name: "Carchemish", arabicName: "كركميش", region: "Mesopotamia & Assyria", x: 34.4, y: 22.1, aliases: ["Carchemish", "كركميش"] },
  { id: "haran", name: "Haran", arabicName: "حاران", region: "Mesopotamia & Assyria", x: 38.3, y: 20.0, aliases: ["Haran", "حاران", "Paddan-aram"] },
  { id: "asshur", name: "Asshur", arabicName: "آشور", region: "Mesopotamia & Assyria", x: 51.7, y: 34.7, aliases: ["Asshur", "Ashur", "آشور"] },
  { id: "nineveh", name: "Nineveh", arabicName: "نينوى", region: "Mesopotamia & Assyria", x: 52.2, y: 26.3, aliases: ["Nineveh", "Assyria", "نينوى"] },
  { id: "calah", name: "Calah (Nimrud)", arabicName: "كالح", region: "Mesopotamia & Assyria", x: 53.1, y: 29.5, aliases: ["Calah", "Nimrud", "كالح"] },

  // --- Babylonia & Lower Mesopotamia ---
  { id: "babylon", name: "Babylon", arabicName: "بابل", region: "Babylonia", x: 60.0, y: 54.7, aliases: ["Babylon", "Babel", "بابل", "Chaldea"] },
  { id: "erech", name: "Erech (Uruk)", arabicName: "أروك", region: "Babylonia", x: 65.0, y: 65.3, aliases: ["Erech", "Uruk", "أروك"] },
  { id: "ur", name: "Ur of the Chaldees", arabicName: "أور الكلدانيين", region: "Babylonia", x: 67.2, y: 71.6, aliases: ["Ur", "أور"] },

  // --- Arabia ---
  { id: "dedan", name: "Dedan", arabicName: "ديدان", region: "Arabia", x: 31.1, y: 87.4, aliases: ["Dedan", "ديدان", "Arabia"] },
  { id: "tema", name: "Tema", arabicName: "تيماء", region: "Arabia", x: 36.1, y: 84.2, aliases: ["Tema", "تيماء"] },

  // --- Persia & Media ---
  { id: "ecbatana", name: "Ecbatana", arabicName: "أحمتا / أكتبانا", region: "Persia & Media", x: 71.1, y: 31.6, aliases: ["Ecbatana", "Achmetha", "أحمتا"] },
  { id: "susa", name: "Susa (Shushan)", arabicName: "شوشان", region: "Persia & Media", x: 73.3, y: 55.8, aliases: ["Susa", "Shushan", "شوشان", "Persia", "Elam"] },
  { id: "persepolis", name: "Persepolis", arabicName: "تخت جمشيد", region: "Persia & Media", x: 86.1, y: 69.5, aliases: ["Persepolis", "Persia"] },
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
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto", fontFamily: "Georgia, serif" }}>
      {/* Header & Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
        <div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "bold", margin: "0 0 4px 0", color: "#1c1917" }}>
            The Old Testament World
          </h2>
          <p style={{ color: "#78716c", margin: 0, fontSize: "0.92rem", fontFamily: "sans-serif" }}>
            High-precision historical vector map of the Ancient Near East. Scroll horizontally to explore regions.
          </p>
        </div>

        {/* Region Filter Buttons */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", fontFamily: "sans-serif" }}>
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid " + (selectedRegion === reg ? "#854d0e" : "#d6d3d1"),
                background: selectedRegion === reg ? "#854d0e" : "#fef3c7",
                color: selectedRegion === reg ? "#ffffff" : "#451a03",
                fontSize: "0.8rem",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Map Pan Wrapper */}
      <div
        style={{
          width: "100%",
          overflowX: "auto",
          borderRadius: "12px",
          border: "3px solid #78350f",
          boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)",
          background: "#1c1917",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "1800px",
            height: "950px",
            background: "#ebdcb9",
          }}
        >
          {/* Geographically Accurate Vector Topography */}
          <svg
            viewBox="0 0 1800 950"
            style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
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

              {/* Text Shadow for High Readability */}
              <filter id="labelShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodColor="#fef3c7" floodOpacity="0.95" />
              </filter>
            </defs>

            {/* Base Landmass */}
            <rect width="1800" height="950" fill="url(#landGrad)" />

            {/* Fertile Crescent Vegetative Shading */}
            <path
              d="M 230,660 Q 300,560 450,450 Q 620,180 800,180 Q 1000,180 1250,680 Q 1150,750 900,450 Q 650,300 450,550 Q 300,650 230,660 Z"
              fill="url(#fertileArc)"
            />

            {/* Mediterranean Sea Coastline */}
            <path
              d="M 0,0 L 560,0 C 530,120 510,180 460,200 C 450,240 442,280 438,320 C 432,360 422,410 410,450 C 400,490 385,540 365,580 C 330,570 280,560 220,560 L 0,560 Z"
              fill="url(#oceanGrad)"
              stroke="#1a3644"
              strokeWidth="2"
            />

            {/* Cyprus */}
            <path
              d="M 330,300 C 360,290 390,295 415,305 C 390,315 350,325 320,315 Z"
              fill="url(#landGrad)"
              stroke="#78350f"
              strokeWidth="1.5"
            />

            {/* Black Sea */}
            <path
              d="M 520,0 C 580,70 700,90 850,50 C 900,20 950,0 950,0 Z"
              fill="url(#oceanGrad)"
              stroke="#1a3644"
            />

            {/* Caspian Sea */}
            <path
              d="M 1450,0 C 1500,80 1520,160 1500,240 C 1470,300 1420,260 1390,160 C 1370,80 1370,0 1370,0 Z"
              fill="url(#oceanGrad)"
              stroke="#1a3644"
            />

            {/* Red Sea, Gulf of Suez & Gulf of Aqaba */}
            <path
              d="M 320,630 L 230,950 L 380,950 L 400,860 L 440,710 L 420,710 L 360,830 L 330,630 Z"
              fill="url(#oceanGrad)"
              stroke="#1a3644"
              strokeWidth="2"
            />

            {/* Persian Gulf */}
            <path
              d="M 1220,950 C 1230,750 1300,700 1420,670 C 1580,640 1700,650 1800,690 L 1800,950 Z"
              fill="url(#oceanGrad)"
              stroke="#1a3644"
              strokeWidth="2"
            />

            {/* Major Rivers */}
            {/* Nile River & Delta */}
            <g stroke="#1e4e6d" fill="none" strokeLinecap="round">
              <path d="M 180,950 Q 210,850 230,660 L 250,600" strokeWidth="5" />
              <path d="M 250,600 Q 200,570 170,560" strokeWidth="2.5" />
              <path d="M 250,600 Q 240,570 230,560" strokeWidth="2" />
              <path d="M 250,600 Q 280,570 300,560" strokeWidth="2.5" />
            </g>

            {/* Jordan River System */}
            <g stroke="#1e4e6d" fill="none">
              <ellipse cx="475" cy="410" rx="8" ry="12" fill="#2b5368" stroke="none" />
              <ellipse cx="475" cy="560" rx="12" ry="30" fill="#2b5368" stroke="none" />
              <path d="M 475,422 L 475,530" strokeWidth="2.5" />
            </g>

            {/* Euphrates River */}
            <path
              d="M 780,100 Q 680,180 620,210 Q 750,310 900,420 Q 1020,480 1080,520 Q 1140,580 1210,680 L 1230,720"
              fill="none"
              stroke="#1e4e6d"
              strokeWidth="4.5"
              strokeLinecap="round"
            />

            {/* Tigris River */}
            <path
              d="M 900,100 Q 940,250 955,280 Q 930,330 1050,470 Q 1150,570 1230,720"
              fill="none"
              stroke="#1e4e6d"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Mountain Ridge Outlines */}
            <g stroke="#78350f" fill="none" strokeWidth="2" strokeDasharray="4,4" opacity="0.45">
              {/* Taurus Range */}
              <path d="M 460,160 Q 560,190 660,150" />
              {/* Lebanon Range */}
              <path d="M 450,280 L 445,380" />
              {/* Ararat Range */}
              <path d="M 880,90 Q 1020,70 1150,110" />
              {/* Zagros Range */}
              <path d="M 1180,220 Q 1380,380 1620,600" />
            </g>

            {/* Region / Geographic Labels */}
            <g fill="#451a03" fontFamily="Georgia, serif" fontWeight="bold" textAnchor="middle" filter="url(#labelShadow)">
              <text x="170" y="780" fontSize="26">EGYPT</text>
              <text x="375" y="790" fontSize="16">SINAI</text>
              <text x="430" y="140" fontSize="22">ASIA MINOR</text>
              <text x="320" y="470" fontSize="20" transform="rotate(-75 320 470)">CANAAN</text>
              <text x="520" y="280" fontSize="22">SYRIA (ARAM)</text>
              <text x="820" y="260" fontSize="26">MESOPOTAMIA</text>
              <text x="830" y="290" fontSize="14" fontStyle="italic">Paddan-aram</text>
              <text x="1010" y="220" fontSize="24">ASSYRIA</text>
              <text x="1000" y="80" fontSize="20">ARMENIA</text>
              <text x="1100" y="600" fontSize="24">BABYLONIA</text>
              <text x="1170" y="630" fontSize="16" fontStyle="italic">Chaldea</text>
              <text x="1310" y="260" fontSize="24">MEDIA</text>
              <text x="1390" y="520" fontSize="24">ELAM</text>
              <text x="1560" y="580" fontSize="26">PERSIA</text>
              <text x="800" y="720" fontSize="28" fill="#78350f" opacity="0.6">ARABIAN DESERT</text>
            </g>

            {/* River Labels */}
            <g fill="#1e4e6d" fontSize="12" fontStyle="italic" fontWeight="600">
              <text x="110" y="820" transform="rotate(-72 110 820)">Nile River</text>
              <text x="790" y="320" transform="rotate(28 790 320)">Euphrates River</text>
              <text x="1030" y="340" transform="rotate(48 1030 340)">Tigris River</text>
            </g>

            {/* Bodies of Water Labels */}
            <g fill="#ffffff" fontFamily="sans-serif" fontWeight="bold" opacity="0.85" textAnchor="middle">
              <text x="220" y="280" fontSize="18">Mediterranean Sea</text>
              <text x="680" y="40" fontSize="14">Black Sea</text>
              <text x="1460" y="120" fontSize="15">Caspian Sea</text>
              <text x="1600" y="780" fontSize="18">Persian Gulf</text>
              <text x="290" y="880" fontSize="15" transform="rotate(-68 290 880)">Red Sea</text>
            </g>

            {/* Map Legend / Title Block */}
            <g transform="translate(1420, 800)">
              <rect width="320" height="110" rx="8" fill="#fef3c7" stroke="#78350f" strokeWidth="2" opacity="0.92" />
              <text x="160" y="35" textAnchor="middle" fill="#451a03" fontFamily="Georgia, serif" fontSize="18" fontWeight="bold">
                THE OLD TESTAMENT WORLD
              </text>
              <text x="160" y="60" textAnchor="middle" fill="#78350f" fontFamily="sans-serif" fontSize="12">
                Ancient Near East Topographical Map
              </text>
              <line x1="30" y1="75" x2="290" y2="75" stroke="#78350f" strokeWidth="1" opacity="0.5" />
              <circle cx="50" cy="90" r="5" fill="#b91c1c" />
              <text x="65" y="94" fill="#451a03" fontFamily="sans-serif" fontSize="11">Biblical Location Marker</text>
            </g>
          </svg>

          {/* City Interactive Pin Markers */}
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
                {/* Pin Point */}
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

                {/* Compact Label */}
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

      {/* Modal 1: City Event List */}
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
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.4rem", color: "#291e13", fontFamily: "Georgia, serif" }}>
                  {selectedCity.name}
                </h3>
                <p style={{ margin: "2px 0 0 0", fontSize: "0.88rem", color: "#78350f", fontWeight: "600", fontFamily: "sans-serif" }}>
                  {selectedCity.arabicName} • Region: {selectedCity.region}
                </p>
              </div>
              <button
                onClick={() => setSelectedCity(null)}
                style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#786c5e" }}
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
                {activeCityEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #d6d3d1",
                      background: "#ffffff",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <h4 style={{ margin: "0 0 4px 0", color: "#1c1917", fontSize: "0.95rem" }}>
                        {evt.title}
                      </h4>
                      {evt.date?.year !== undefined && (
                        <span style={{ fontSize: "0.78rem", color: "#b91c1c", fontWeight: "bold" }}>
                          {formatYearLabel(evt.date.year)}
                        </span>
                      )}
                    </div>
                    {evt.description && (
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#57534e", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
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
            onClick={(e) => e.stopPropagation()}
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