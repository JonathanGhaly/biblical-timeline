import { useState, useMemo } from "react";
import type { Person, BiblicalEvent } from "../types/genealogy";

type City = {
  id: string;
  name: string;
  arabicName: string;
  region: string;
  x: number; // Percentage position (0 - 100)
  y: number; // Percentage position (0 - 100)
  aliases: string[];
};

// Cities across the entire Old Testament World (Fertile Crescent, Egypt, Mesopotamia, Persia)
const OT_CITIES: City[] = [
  // Egypt & Sinai
  { id: "memphis", name: "Memphis / Noph", arabicName: "منف", region: "Egypt", x: 14, y: 75, aliases: ["Memphis", "Noph", "منف", "Egypt"] },
  { id: "rameses", name: "Rameses / Goshen", arabicName: "رعمسيس / جاسان", region: "Egypt", x: 19, y: 65, aliases: ["Rameses", "Goshen", "جاسان", "رعمسيس"] },
  { id: "sinai", name: "Mt. Sinai", arabicName: "جبل سيناء", region: "Sinai", x: 28, y: 82, aliases: ["Sinai", "Horeb", "سيناء", "حوريب"] },

  // Canaan / Southern Levant
  { id: "beersheba", name: "Beersheba", arabicName: "بئر سبع", region: "Canaan", x: 33, y: 62, aliases: ["Beersheba", "بئر سبع"] },
  { id: "hebron", name: "Hebron", arabicName: "حبرون", region: "Canaan", x: 36, y: 57, aliases: ["Hebron", "حبرون"] },
  { id: "jerusalem", name: "Jerusalem", arabicName: "أورشليم", region: "Canaan", x: 37, y: 52, aliases: ["Jerusalem", "Zion", "أورشليم", "Jebus"] },
  { id: "jericho", name: "Jericho", arabicName: "أريحا", region: "Canaan", x: 39, y: 50, aliases: ["Jericho", "أريحا"] },
  { id: "shechem", name: "Shechem", arabicName: "شكيم", region: "Canaan", x: 37, y: 44, aliases: ["Shechem", "شكيم"] },
  { id: "dan", name: "Dan", arabicName: "دان", region: "Canaan", x: 40, y: 35, aliases: ["Dan", "دان"] },

  // Northern Levant & Syria
  { id: "tyre", name: "Tyre", arabicName: "صور", region: "Phoenicia", x: 38, y: 31, aliases: ["Tyre", "صور"] },
  { id: "damascus", name: "Damascus", arabicName: "دمشق", region: "Syria", x: 44, y: 30, aliases: ["Damascus", "دمشق", "Aram"] },

  // Upper Mesopotamia & Northern Kingdom Routes
  { id: "haran", name: "Haran", arabicName: "حاران", region: "Mesopotamia", x: 53, y: 18, aliases: ["Haran", "حاران", "Paddan-aram"] },
  { id: "nineveh", name: "Nineveh", arabicName: "نينوى", region: "Assyria", x: 67, y: 22, aliases: ["Nineveh", "Assyria", "نينوى", "آشور"] },

  // Lower Mesopotamia (Babylonia & Sumer)
  { id: "babylon", name: "Babylon", arabicName: "بابل", region: "Babylonia", x: 74, y: 52, aliases: ["Babylon", "Babel", "بابل", "Chaldea"] },
  { id: "ur", name: "Ur of the Chaldees", arabicName: "أور الكلدانيين", region: "Babylonia", x: 82, y: 68, aliases: ["Ur", "أور"] },

  // Persia / Elam
  { id: "susa", name: "Susa / Shushan", arabicName: "شوشان", region: "Persia", x: 89, y: 54, aliases: ["Susa", "Shushan", "شوشان", "Persia"] },
];

type OldTestamentMapPageProps = {
  events: BiblicalEvent[];
  people?: Person[];
};

export default function OldTestamentMapPage({
  events,
  people = [],
}: OldTestamentMapPageProps) {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<BiblicalEvent | null>(null);

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

  const activeCityEvents = selectedCity ? eventsByCity.get(selectedCity.id) || [] : [];

  const formatYearLabel = (year?: number) => {
    if (year === undefined) return "";
    return year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: "bold", margin: "0 0 4px 0", color: "#0f172a" }}>
          Old Testament World Interactive Map
        </h2>
        <p style={{ color: "#64748b", margin: 0, fontSize: "0.95rem" }}>
          Explore key biblical locations spanning Egypt, Canaan, Mesopotamia, Assyria, Babylon, and Persia.
        </p>
      </div>

      {/* Interactive Map Canvas Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          minHeight: "480px",
          background: "#e0f2fe",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          border: "2px solid #cbd5e1",
        }}
      >
        {/* SVG Landmass & Water Map Background */}
        <svg
          viewBox="0 0 1000 562.5"
          style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
        >
          {/* Main Landmass (Ancient Near East Base) */}
          <path
            d="M 0,0 L 1000,0 L 1000,562.5 L 0,562.5 Z"
            fill="#fef3c7"
          />

          {/* Mediterranean Sea */}
          <path
            d="M 0,0 L 360,0 L 370,120 L 350,220 L 310,270 L 260,330 L 170,360 L 0,360 Z"
            fill="#7dd3fc"
          />

          {/* Red Sea & Gulfs */}
          <path
            d="M 120,562.5 L 200,430 L 230,420 L 240,460 L 260,430 L 290,440 L 220,562.5 Z"
            fill="#38bdf8"
          />

          {/* Nile River & Delta */}
          <path
            d="M 140,562.5 Q 150,470 180,410 L 170,360 L 210,360 Q 180,420 170,562.5 Z"
            fill="#0284c7"
          />

          {/* Persian Gulf */}
          <path
            d="M 810,562.5 L 820,440 L 930,390 L 1000,430 L 1000,562.5 Z"
            fill="#38bdf8"
          />

          {/* Rivers: Tigris & Euphrates */}
          <path
            d="M 520,100 Q 620,150 730,300 Q 780,380 820,440"
            fill="none"
            stroke="#0284c7"
            strokeWidth="3"
          />
          <path
            d="M 480,110 Q 560,220 700,340 Q 760,400 825,445"
            fill="none"
            stroke="#0284c7"
            strokeWidth="3.5"
          />

          {/* Jordan River & Dead Sea */}
          <path
            d="M 370,270 L 370,310 L 368,340"
            fill="none"
            stroke="#0284c7"
            strokeWidth="2.5"
          />
          <ellipse cx="368" cy="345" rx="5" ry="12" fill="#0284c7" />

          {/* Region Labels */}
          <text x="70" y="440" fill="#92400e" fontSize="16" fontWeight="bold" opacity="0.6">EGYPT</text>
          <text x="310" y="240" fill="#92400e" fontSize="14" fontWeight="bold" opacity="0.6">CANAAN</text>
          <text x="580" y="210" fill="#92400e" fontSize="16" fontWeight="bold" opacity="0.6">MESOPOTAMIA</text>
          <text x="720" y="160" fill="#92400e" fontSize="16" fontWeight="bold" opacity="0.6">ASSYRIA</text>
          <text x="740" y="380" fill="#92400e" fontSize="16" fontWeight="bold" opacity="0.6">BABYLONIA</text>
          <text x="890" y="320" fill="#92400e" fontSize="16" fontWeight="bold" opacity="0.6">PERSIA</text>
        </svg>

        {/* City Marker Overlays */}
        {OT_CITIES.map((city) => {
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
                zIndex: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: hasEvents ? "#dc2626" : "#2563eb",
                  border: "2px solid #ffffff",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontSize: "0.65rem",
                  fontWeight: "bold",
                }}
              >
                {hasEvents ? cityEvents.length : "•"}
              </div>

              <div
                style={{
                  marginTop: "3px",
                  background: "rgba(15, 23, 42, 0.88)",
                  color: "#ffffff",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "0.72rem",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                {city.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal 1: City Events List */}
      {selectedCity && !selectedEvent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
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
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "520px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a" }}>
                  {selectedCity.name} ({selectedCity.arabicName})
                </h3>
                <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                  Region: {selectedCity.region} • {activeCityEvents.length} event(s)
                </span>
              </div>
              <button
                onClick={() => setSelectedCity(null)}
                style={{ background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            {activeCityEvents.length === 0 ? (
              <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                No events currently matched with this location in your dataset.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {activeCityEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      background: "#f8fafc",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <h4 style={{ margin: "0 0 4px 0", color: "#1e293b", fontSize: "0.95rem" }}>
                        {evt.title}
                      </h4>
                      {evt.date?.year !== undefined && (
                        <span style={{ fontSize: "0.75rem", color: "#2563eb", fontWeight: "600" }}>
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
            background: "rgba(15, 23, 42, 0.6)",
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
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "520px",
              width: "90%",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a" }}>
                {selectedEvent.title}
              </h3>
              <button
                onClick={() => setSelectedEvent(null)}
                style={{ background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.9rem", color: "#334155" }}>
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