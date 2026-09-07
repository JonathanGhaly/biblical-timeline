import { useState, useMemo } from "react";
import type { Person, BiblicalEvent } from "../types/genealogy";

type City = {
  id: string;
  name: string;
  arabicName: string;
  x: number; // Percentage from left (0 to 100)
  y: number; // Percentage from top (0 to 100)
  aliases: string[];
};

// Key Old Testament cities aligned with map coordinates
const OT_CITIES: City[] = [
  { id: "damascus", name: "Damascus", arabicName: "دمشق", x: 90, y: 5, aliases: ["Damascus", "دمشق"] },
  { id: "sidon", name: "Sidon", arabicName: "صيدون", x: 52, y: 3, aliases: ["Sidon", "صيدون"] },
  { id: "tyre", name: "Tyre", arabicName: "صور", x: 44, y: 13, aliases: ["Tyre", "Tyros", "صور"] },
  { id: "dan", name: "Dan", arabicName: "دان / لايش", x: 66, y: 10, aliases: ["Dan", "Laish", "دان"] },
  { id: "kedesh", name: "Kedesh", arabicName: "قادش", x: 50, y: 16, aliases: ["Kedesh", "קדש", "قادش"] },
  { id: "samaria", name: "Samaria", arabicName: "السامرة", x: 28, y: 46, aliases: ["Samaria", "السامرة"] },
  { id: "shechem", name: "Shechem", arabicName: "شكيم", x: 40, y: 48, aliases: ["Shechem", "Sychar", "شكيم"] },
  { id: "joppa", name: "Joppa", arabicName: "يافا", x: 21, y: 55, aliases: ["Joppa", "Jaffa", "يافا"] },
  { id: "shiloh", name: "Shiloh", arabicName: "شيلوه", x: 41, y: 54, aliases: ["Shiloh", "شيلوه"] },
  { id: "bethel", name: "Bethel", arabicName: "بيت إيل", x: 35, y: 60, aliases: ["Bethel", "Beth-el", "بيت إيل"] },
  { id: "jericho", name: "Jericho", arabicName: "أريحا", x: 49, y: 63, aliases: ["Jericho", "أريحا"] },
  { id: "jerusalem", name: "Jerusalem", arabicName: "أورشليم", x: 38, y: 67, aliases: ["Jerusalem", "Zion", "أورشليم", "Jebus"] },
  { id: "bethlehem", name: "Bethlehem", arabicName: "بيت لحم", x: 38, y: 71, aliases: ["Bethlehem", "Ephrath", "بيت لحم"] },
  { id: "hebron", name: "Hebron", arabicName: "حبرون / أربع", x: 34, y: 77, aliases: ["Hebron", "Kiriath-arba", "حبرون"] },
  { id: "beersheba", name: "Beersheba", arabicName: "بئر سبع", x: 25, y: 86, aliases: ["Beersheba", "Beer-sheba", "بئر سبع"] },
  { id: "ashdod", name: "Ashdod", arabicName: "أشدود", x: 16, y: 65, aliases: ["Ashdod", "أشدود"] },
  { id: "ashkelon", name: "Ashkelon", arabicName: "أشقلون", x: 13, y: 69, aliases: ["Ashkelon", "أشقلون"] },
  { id: "gaza", name: "Gaza", arabicName: "غزة", x: 5, y: 77, aliases: ["Gaza", "غزة"] },
];

type OldTestamentMapPageProps = {
  events: BiblicalEvent[];
  people?: Person[];
  mapSrc?: string;
};

export default function OldTestamentMapPage({
  events,
  people = [],
  mapSrc = "/map.png", // Path to your uploaded Old Testament map image
}: OldTestamentMapPageProps) {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<BiblicalEvent | null>(null);

  // Group events by city match
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
          Old Testament Interactive Map
        </h2>
        <p style={{ color: "#64748b", margin: 0, fontSize: "0.95rem" }}>
          Click on any city marker to view historical events that took place in that location.
        </p>
      </div>

      {/* Map Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          border: "1px solid #cbd5e1",
          background: "#f8fafc",
        }}
      >
        <img
          src={mapSrc}
          alt="Old Testament Map"
          style={{ width: "100%", height: "auto", display: "block" }}
        />

        {/* City Overlay Pins */}
        {OT_CITIES.map((city) => {
          const cityEvents = eventsByCity.get(city.id) || [];
          const hasEvents = cityEvents.length > 0;

          return (
            <div
              key={city.id}
              onClick={() => setSelectedCity(city)}
              title={`${city.name} (${city.arabicName}) - ${cityEvents.length} event(s)`}
              style={{
                position: "absolute",
                left: `${city.x}%`,
                top: `${city.y}%`,
                transform: "translate(-50%, -50%)",
                cursor: "pointer",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Pin Indicator */}
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: hasEvents ? "#ef4444" : "#0284c7",
                  border: "2px solid #ffffff",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  transition: "transform 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {hasEvents && (
                  <span style={{ color: "#ffffff", fontSize: "0.6rem", fontWeight: "bold" }}>
                    {cityEvents.length}
                  </span>
                )}
              </div>

              {/* Tooltip Label */}
              <div
                style={{
                  marginTop: "2px",
                  background: "rgba(15, 23, 42, 0.85)",
                  color: "#ffffff",
                  padding: "1px 6px",
                  borderRadius: "4px",
                  fontSize: "0.7rem",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
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
            background: "rgba(15, 23, 42, 0.5)",
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
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a" }}>
                  {selectedCity.name} ({selectedCity.arabicName})
                </h3>
                <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                  {activeCityEvents.length} event(s) recorded
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
                No explicit biblical events currently tagged for this city in your dataset.
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
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <h4 style={{ margin: "0 0 4px 0", color: "#1e293b", fontSize: "0.95rem", fontWeight: "700" }}>
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
            background: "rgba(15, 23, 42, 0.5)",
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
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
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
                  <strong>Biblical References:</strong> {(selectedEvent.biblicalReferences || []).join(", ")}
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