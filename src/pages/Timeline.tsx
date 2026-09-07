import { useState } from "react";
import type { Person, BiblicalEvent } from "../types/genealogy";

type TimelineProps = {
  people: Person[];
  events: BiblicalEvent[];
};

export default function Timeline({ people, events }: TimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<BiblicalEvent | null>(null);

  const sortedEvents = [...events].sort((a, b) => {
    const yearA = a.date?.year ?? 0;
    const yearB = b.date?.year ?? 0;
    return yearA - yearB;
  });

  return (
    <div style={{ padding: "20px", maxWidth: "800px" }}>
      <h2 style={{ fontSize: "1.75rem", fontWeight: "bold", marginBottom: "28px", color: "#0f172a" }}>
        Timeline
      </h2>

      <div style={{ position: "relative", paddingLeft: "110px" }}>
        {/* Vertical Timeline Line */}
        <div
          style={{
            position: "absolute",
            left: "95px",
            top: "18px",
            bottom: "18px",
            width: "2px",
            backgroundColor: "#cbd5e1",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {sortedEvents.map((event) => {
            const year = event.date?.year;
            const yearStr = year !== undefined ? `${Math.abs(year)} ${year < 0 ? "BC" : "AD"}` : "";

            return (
              <div key={event.id} style={{ position: "relative" }}>
                {/* Year label left of line */}
                <div
                  style={{
                    position: "absolute",
                    left: "-110px",
                    top: "16px",
                    width: "80px",
                    textAlign: "right",
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    color: "#64748b",
                  }}
                >
                  {yearStr}
                </div>

                {/* Node Circle on line */}
                <div
                  style={{
                    position: "absolute",
                    left: "-19px",
                    top: "20px",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#ffffff",
                    border: "2px solid #64748b",
                    zIndex: 1,
                  }}
                />

                {/* Clickable Event Card */}
                <div
                  onClick={() => setSelectedEvent(event)}
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "16px 20px",
                    cursor: "pointer",
                    transition: "all 0.15s ease-in-out",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#2563eb";
                    e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "1.05rem",
                      fontWeight: "700",
                      color: "#1e293b",
                    }}
                  >
                    {event.title}
                  </h3>

                  {event.description && (
                    <p
                      style={{
                        margin: "0 0 10px 0",
                        fontSize: "0.875rem",
                        color: "#475569",
                        lineHeight: "1.5",
                      }}
                    >
                      {event.description}
                    </p>
                  )}

                  {event.location && (
                    <p
                      style={{
                        margin: "0 0 10px 0",
                        fontSize: "0.85rem",
                        color: "#64748b",
                      }}
                    >
                      Location: {event.location}
                    </p>
                  )}

                  {/* Associated People Chips */}
                  {(event.personIds || []).length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        marginBottom: "10px",
                      }}
                    >
                      {(event.personIds || []).map((personId) => {
                        const p = people.find((person) => person.id === personId);
                        const name = p ? p.name : personId;
                        return (
                          <span
                            key={personId}
                            style={{
                              background: "#e2e8f0",
                              color: "#334155",
                              padding: "2px 10px",
                              borderRadius: "12px",
                              fontSize: "0.75rem",
                              fontWeight: "500",
                            }}
                          >
                            {name}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Scripture Reference */}
                  {(event.biblicalReferences || []).length > 0 && (
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "#64748b",
                      }}
                    >
                      {(event.biblicalReferences || []).join(", ")}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
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
          onClick={() => setSelectedEvent(null)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "500px",
              width: "90%",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a" }}>
                {selectedEvent.title}
              </h3>
              <button
                onClick={() => setSelectedEvent(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.9rem", color: "#334155" }}>
              {selectedEvent.date?.year !== undefined && (
                <p style={{ margin: 0 }}>
                  <strong>Date:</strong> {Math.abs(selectedEvent.date.year)}{" "}
                  {selectedEvent.date.year < 0 ? "BC" : "AD"}
                </p>
              )}
              {selectedEvent.location && (
                <p style={{ margin: 0 }}>
                  <strong>Location:</strong> {selectedEvent.location}
                </p>
              )}
              {selectedEvent.description && (
                <p style={{ margin: 0, lineHeight: "1.5" }}>
                  {selectedEvent.description}
                </p>
              )}
              {(selectedEvent.personIds || []).length > 0 && (
                <p style={{ margin: 0 }}>
                  <strong>Associated People:</strong>{" "}
                  {(selectedEvent.personIds || [])
                    .map((id) => people.find((p) => p.id === id)?.name || id)
                    .join(", ")}
                </p>
              )}
              {(selectedEvent.biblicalReferences || []).length > 0 && (
                <p style={{ margin: 0 }}>
                  <strong>References:</strong>{" "}
                  {(selectedEvent.biblicalReferences || []).join(", ")}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}