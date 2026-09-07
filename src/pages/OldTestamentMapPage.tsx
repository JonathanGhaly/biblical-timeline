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

// Comprehensive biblical cities across the Ancient Near East
const OT_CITIES: City[] = [
  // --- Egypt & Sinai ---
  { id: "thebes", name: "Thebes (No-Amon)", arabicName: "طيبة / نوس آمن", region: "Egypt & Sinai", x: 8.5, y: 88, aliases: ["Thebes", "No-Amon", "No", "طيبة"] },
  { id: "memphis", name: "Memphis (Noph)", arabicName: "منف", region: "Egypt & Sinai", x: 11.5, y: 72, aliases: ["Memphis", "Noph", "منف", "Egypt"] },
  { id: "rameses", name: "Rameses (Goshen)", arabicName: "رعمسيس / جاسان", region: "Egypt & Sinai", x: 15, y: 60, aliases: ["Rameses", "Goshen", "جاسان", "رعمسيس"] },
  { id: "sinai", name: "Mt. Sinai (Horeb)", arabicName: "جبل سيناء", region: "Egypt & Sinai", x: 23, y: 82, aliases: ["Sinai", "Horeb", "سيناء", "حوريب"] },
  { id: "eziongeber", name: "Ezion-Geber", arabicName: "عصيون جابر", region: "Egypt & Sinai", x: 27.5, y: 75, aliases: ["Ezion-geber", "Ezion geber", "عصيون جابر"] },

  // --- Canaan, Philistia & Transjordan ---
  { id: "gaza", name: "Gaza", arabicName: "غزة", region: "Canaan & Levant", x: 28.5, y: 63, aliases: ["Gaza", "غزة"] },
  { id: "beersheba", name: "Beersheba", arabicName: "بئر سبع", region: "Canaan & Levant", x: 31, y: 65, aliases: ["Beersheba", "بئر سبع"] },
  { id: "kirhareseth", name: "Kir-hareseth (Moab)", arabicName: "قير حارسة", region: "Canaan & Levant", x: 36, y: 67, aliases: ["Moab", "Kir-hareseth", "Kir", "قير حارسة"] },
  { id: "hebron", name: "Hebron", arabicName: "حبرون", region: "Canaan & Levant", x: 33.2, y: 60, aliases: ["Hebron", "حبرون"] },
  { id: "jerusalem", name: "Jerusalem", arabicName: "أورشليم", region: "Canaan & Levant", x: 34, y: 56, aliases: ["Jerusalem", "Zion", "أورشليم", "Jebus"] },
  { id: "jericho", name: "Jericho", arabicName: "أريحا", region: "Canaan & Levant", x: 35.5, y: 55, aliases: ["Jericho", "أريحا"] },
  { id: "rabbah", name: "Rabbah (Ammon)", arabicName: "ربة عمون", region: "Canaan & Levant", x: 38, y: 56, aliases: ["Rabbah", "Ammon", "ربة"] },
  { id: "joppa", name: "Joppa", arabicName: "يافا", region: "Canaan & Levant", x: 31.8, y: 52, aliases: ["Joppa", "Jaffa", "يافا"] },
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
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto", fontFamily: "Georgia, serif" }}>
      {/* Header Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
        <div>
          <h2 style={{ fontSize: "1.9rem", fontWeight: "bold", margin: "0 0 4px 0", color: "#1e1b18", fontFamily: "Georgia, serif" }}>
            The Old Testament World
          </h2>
          <p style={{ color: "#786c5e", margin: 0, fontSize: "0.95rem", fontFamily: "sans-serif" }}>
            High-detail historical relief map spanning Egypt, Canaan, Mesopotamia, Assyria, Arabia, Media, and Persia.
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", fontFamily: "sans-serif" }}>
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              style={{
                padding: "6px 14px",
                borderRadius: "6px",
                border: "1px solid " + (selectedRegion === reg ? "#8b4513" : "#d2c4b0"),
                background: selectedRegion === reg ? "#8b4513" : "#fdfbf7",
                color: selectedRegion === reg ? "#ffffff" : "#4a3e31",
                fontSize: "0.82rem",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Panoramic Map Container */}
      <div
        style={{
          width: "100%",
          overflowX: "auto",
          borderRadius: "12px",
          border: "4px solid #5c4033",
          boxShadow: "0 15px 35px rgba(0, 0, 0, 0.3)",
          background: "#1c1917",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "1800px",
            height: "950px",
            background: "#dfcb9f",
          }}
        >
          {/* High Detail Vector Graphic SVG Map */}
          <svg
            viewBox="0 0 1800 950"
            style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
          >
            <defs>
              {/* Ocean Blue Water Gradient */}
              <linearGradient id="seaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#41728d" />
                <stop offset="50%" stopColor="#315c74" />
                <stop offset="100%" stopColor="#224254" />
              </linearGradient>

              {/* Water Edge Coastal Glow */}
              <linearGradient id="coastalGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7cb0cf" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#41728d" stopOpacity="0" />
              </linearGradient>

              {/* Topographical Land Gradient */}
              <linearGradient id="landTopography" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ebd9b2" />
                <stop offset="40%" stopColor="#dfca9b" />
                <stop offset="70%" stopColor="#cca972" />
                <stop offset="100%" stopColor="#bd965b" />
              </linearGradient>

              {/* Mountain Shading Pattern */}
              <pattern id="mountainRidgePattern" width="60" height="30" patternUnits="userSpaceOnUse">
                <path d="M 0,30 L 15,10 L 30,30 M 20,30 L 35,5 L 50,30 M 40,30 L 50,15 L 60,30" fill="none" stroke="#6e502c" strokeWidth="1.8" opacity="0.3" />
                <path d="M 15,10 L 22,30 M 35,5 L 42,30 M 50,15 L 55,30" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.2" />
              </pattern>

              {/* Drop Shadow Filter for Map Titles */}
              <filter id="mapTextShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#ffffff" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* Base Landmass Background */}
            <rect width="1800" height="950" fill="url(#landTopography)" />

            {/* Mediterranean Sea Body */}
            <path
              d="M 0,0 L 560,0 C 580,140 550,220 620,250 C 660,260 670,220 700,220 C 740,220 710,290 640,330 C 620,350 620,400 640,460 C 640,500 610,530 520,550 C 440,570 300,580 0,580 Z"
              fill="url(#seaGradient)"
              stroke="#224254"
              strokeWidth="2"
            />

            {/* Cyprus Island */}
            <path
              d="M 500,320 C 530,310 560,315 585,325 C 560,335 520,345 490,335 Z"
              fill="url(#landTopography)"
              stroke="#735738"
              strokeWidth="2"
            />

            {/* Black Sea (North) */}
            <path
              d="M 520,0 C 600,60 700,80 840,40 C 900,10 920,0 920,0 Z"
              fill="url(#seaGradient)"
              stroke="#224254"
              strokeWidth="2"
            />

            {/* Caspian Sea (North East) */}
            <path
              d="M 1480,0 C 1530,60 1570,130 1560,210 C 1540,270 1470,230 1440,150 C 1420,90 1410,0 1410,0 Z"
              fill="url(#seaGradient)"
              stroke="#224254"
              strokeWidth="2"
            />

            {/* Gulf of Suez, Gulf of Aqaba & Red Sea */}
            <path
              d="M 210,950 L 300,720 C 310,680 330,680 340,710 L 340,770 L 370,720 C 380,680 400,690 410,720 L 480,740 L 510,730 L 380,950 Z"
              fill="url(#seaGradient)"
              stroke="#224254"
              strokeWidth="2"
            />

            {/* Persian Gulf */}
            <path
              d="M 1350,950 C 1370,820 1410,750 1510,690 C 1600,640 1700,610 1800,630 L 1800,950 Z"
              fill="url(#seaGradient)"
              stroke="#224254"
              strokeWidth="2"
            />

            {/* Major Mountain Relief Formations */}
            {/* Taurus Mountains (Turkey) */}
            <path d="M 450,180 Q 580,220 700,160 Q 600,140 450,180 Z" fill="url(#mountainRidgePattern)" />
            <text x="560" y="195" fill="#52391b" fontSize="13" fontWeight="bold" fontStyle="italic">Taurus Mountains</text>

            {/* Lebanon Mountains */}
            <path d="M 630,300 Q 660,370 650,440 Q 630,370 630,300 Z" fill="url(#mountainRidgePattern)" />
            <text x="605" y="380" fill="#52391b" fontSize="12" fontWeight="bold" transform="rotate(-75 605 380)">Lebanon Mountains</text>

            {/* Armenia / Ararat Mountain Complex */}
            <path d="M 850,80 Q 1050,60 1200,140 Q 1000,180 850,80 Z" fill="url(#mountainRidgePattern)" />
            <text x="1010" y="115" fill="#52391b" fontSize="14" fontWeight="bold">Ararat Mountains</text>
            <text x="1030" y="132" fill="#52391b" fontSize="11" fontStyle="italic">Mt. Ararat</text>

            {/* Zagros Mountains (Media/Persia) */}
            <path d="M 1150,220 Q 1400,380 1650,620 Q 1550,680 1250,380 Z" fill="url(#mountainRidgePattern)" />
            <text x="1380" y="420" fill="#52391b" fontSize="16" fontWeight="bold" transform="rotate(38 1380 420)">Zagros Mountains</text>

            {/* Caspian Mountains */}
            <path d="M 1300,190 Q 1420,240 1520,230 Z" fill="url(#mountainRidgePattern)" />
            <text x="1380" y="215" fill="#52391b" fontSize="12" fontWeight="bold">Caspian Mountains</text>

            {/* Sinai Mountain Cluster */}
            <path d="M 360,740 Q 420,800 400,850 Q 340,820 360,740 Z" fill="url(#mountainRidgePattern)" />
            <text x="380" y="810" fill="#52391b" fontSize="12" fontWeight="bold">Mt. Sinai</text>

            {/* Rivers & Watercourses */}
            {/* Nile River System */}
            <g stroke="#2b5f7e" fill="none" strokeLinecap="round">
              <path d="M 150,950 Q 180,850 210,780 L 250,710 L 250,600" strokeWidth="5" />
              {/* Nile Delta Branches */}
              <path d="M 250,600 Q 200,570 170,555" strokeWidth="3" />
              <path d="M 250,600 Q 230,560 220,550" strokeWidth="2.5" />
              <path d="M 250,600 Q 270,560 280,550" strokeWidth="2.5" />
              <path d="M 250,600 Q 300,560 320,550" strokeWidth="3" />
            </g>
            <text x="130" y="850" fill="#1e445b" fontSize="13" fontStyle="italic" transform="rotate(-70 130 850)">Nile River</text>

            {/* Jordan River, Sea of Galilee, Dead Sea */}
            <g stroke="#2b5f7e" fill="none">
              <ellipse cx="640" cy="400" rx="9" ry="14" fill="#315c74" stroke="none" />
              <ellipse cx="630" cy="560" rx="14" ry="32" fill="#315c74" stroke="none" />
              <path d="M 640,414 L 638,470 L 632,528" strokeWidth="3" />
            </g>

            {/* Euphrates River */}
            <path
              d="M 800,160 Q 920,200 1000,280 Q 1120,400 1280,540 Q 1380,630 1430,710"
              fill="none"
              stroke="#2b5f7e"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <text x="960" y="325" fill="#1e445b" fontSize="13" fontStyle="italic" transform="rotate(32 960 325)">Euphrates River</text>

            {/* Tigris River */}
            <path
              d="M 1060,140 Q 1160,260 1240,360 Q 1340,500 1430,710"
              fill="none"
              stroke="#2b5f7e"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <text x="1190" y="310" fill="#1e445b" fontSize="13" fontStyle="italic" transform="rotate(50 1190 310)">Tigris River</text>

            {/* Araxes River */}
            <path d="M 1200,120 Q 1320,100 1420,120" fill="none" stroke="#2b5f7e" strokeWidth="2.5" />
            <text x="1310" y="105" fill="#1e445b" fontSize="11" fontStyle="italic">Araxes River</text>

            {/* Major Ancient Near East Region Titles */}
            <g fill="#3a2712" fontFamily="Georgia, serif" fontWeight="bold" textAnchor="middle" filter="url(#mapTextShadow)">
              <text x="750" y="440" fontSize="38" letterSpacing="4">THE OLD TESTAMENT WORLD</text>
              <text x="180" y="780" fontSize="28">EGYPT</text>
              <text x="500" y="140" fontSize="26">Asia Minor</text>
              <text x="610" y="480" fontSize="22" transform="rotate(-80 610 480)">Canaan</text>
              <text x="710" y="340" fontSize="26">Syria</text>
              <text x="1030" y="240" fontSize="28">Mesopotamia</text>
              <text x="1040" y="270" fontSize="15" fontStyle="italic">Paddan Aram</text>
              <text x="1180" y="220" fontSize="26">Assyria</text>
              <text x="1050" y="100" fontSize="22">Armenia</text>
              <text x="1270" y="520" fontSize="22" transform="rotate(-35 1270 520)">Chaldea</text>
              <text x="1370" y="320" fontSize="26">Media</text>
              <text x="1420" y="500" fontSize="26">Elam</text>
              <text x="1620" y="450" fontSize="28">Persia</text>
              <text x="820" y="660" fontSize="28" fill="#573e21">Arabian Desert</text>
            </g>

            {/* Ocean Body Labels */}
            <g fill="#ffffff" fontFamily="sans-serif" fontWeight="bold" opacity="0.85" textAnchor="middle">
              <text x="280" y="270" fontSize="20">Mediterranean Sea</text>
              <text x="700" y="40" fontSize="15">Black Sea</text>
              <text x="1500" y="120" fontSize="16">Caspian Sea</text>
              <text x="1620" y="780" fontSize="18">Persian Gulf</text>
              <text x="290" y="880" fontSize="16" transform="rotate(-65 290 880)">Red Sea</text>
            </g>
          </svg>

          {/* City Interactive Pins */}
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
                {/* City Marker Pin */}
                <div
                  style={{
                    width: hasEvents ? "22px" : "14px",
                    height: hasEvents ? "22px" : "14px",
                    borderRadius: "50%",
                    backgroundColor: hasEvents ? "#b91c1c" : "#1e3a8a",
                    border: "2px solid #ffffff",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                  }}
                >
                  {hasEvents ? cityEvents.length : ""}
                </div>

                {/* City Title Overlay */}
                <div
                  style={{
                    marginTop: "3px",
                    background: "rgba(28, 25, 23, 0.92)",
                    color: "#fef3c7",
                    padding: "2px 7px",
                    borderRadius: "4px",
                    fontSize: "0.72rem",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.4)",
                    border: "1px solid rgba(217, 119, 6, 0.4)",
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
              border: "2px solid #8b4513",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.4rem", color: "#291e13", fontFamily: "Georgia, serif" }}>
                  {selectedCity.name}
                </h3>
                <p style={{ margin: "2px 0 0 0", fontSize: "0.9rem", color: "#8b4513", fontWeight: "600", fontFamily: "sans-serif" }}>
                  {selectedCity.arabicName} • {selectedCity.region}
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
                No events currently matched with this location in your dataset.
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
                      border: "1px solid #d2c4b0",
                      background: "#ffffff",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <h4 style={{ margin: "0 0 4px 0", color: "#1c1917", fontSize: "0.95rem" }}>
                        {evt.title}
                      </h4>
                      {evt.date?.year !== undefined && (
                        <span style={{ fontSize: "0.78rem", color: "#8b4513", fontWeight: "bold" }}>
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
              border: "2px solid #8b4513",
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