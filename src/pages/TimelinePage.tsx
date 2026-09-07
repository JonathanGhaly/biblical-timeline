import { useState } from "react";
import type { Person, BiblicalEvent } from "../types/genealogy";

type TimelinePageProps = {
  people: Person[];
  events: BiblicalEvent[];
};

type SelectedItem =
  | { type: "person"; data: Person }
  | { type: "event"; data: BiblicalEvent };

export default function TimelinePage({ people, events }: TimelinePageProps) {
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

  // Timeline scale settings
  const minYear = -4000;
  const maxYear = -1500;
  const totalYears = maxYear - minYear;
  const timelineWidth = 2600;

  const getLeftPx = (year: number) => {
    const ratio = (year - minYear) / totalYears;
    return Math.max(0, Math.min(timelineWidth, ratio * timelineWidth));
  };

  const getWidthPx = (duration: number) => {
    return (duration / totalYears) * timelineWidth;
  };

  // Generate tick marks every 250 years
  const ticks: number[] = [];
  for (let yr = minYear; yr <= maxYear; yr += 250) {
    ticks.push(yr);
  }

  const peopleWithBirth = people.filter((p) => p.birth?.year !== undefined);
  const validEvents = events.filter((e) => e.date?.year !== undefined);

  return (
    <div className="timeline-page-container" style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: "bold", margin: "0 0 4px 0", color: "#0f172a" }}>
          Integrated Biblical Timeline
        </h2>
        <p style={{ color: "#64748b", margin: 0, fontSize: "0.95rem" }}>
          Scroll horizontally to explore overlapping lifespans and historical events.
        </p>
      </div>

      <div
        style={{
          overflowX: "auto",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "24px 20px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ position: "relative", minWidth: `${timelineWidth + 160}px` }}>
          {/* Year Scale / Header Axis */}
          <div
            style={{
              display: "flex",
              marginLeft: "140px",
              position: "relative",
              height: "36px",
              borderBottom: "2px solid #cbd5e1",
              marginBottom: "20px",
            }}
          >
            {ticks.map((yr) => (
              <div
                key={yr}
                style={{
                  position: "absolute",
                  left: `${getLeftPx(yr)}px`,
                  transform: "translateX(-50%)",
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  color: "#475569",
                  whiteSpace: "nowrap",
                }}
              >
                {Math.abs(yr)} BC
              </div>
            ))}
          </div>

          {/* Background Gridlines */}
          <div
            style={{
              position: "absolute",
              top: "36px",
              bottom: 0,
              left: "140px",
              width: `${timelineWidth}px`,
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            {ticks.map((yr) => (
              <div
                key={yr}
                style={{
                  position: "absolute",
                  left: `${getLeftPx(yr)}px`,
                  top: 0,
                  bottom: 0,
                  borderLeft: "1px dashed #e2e8f0",
                }}
              />
            ))}
          </div>

          {/* MAJOR EVENTS Section */}
          <div style={{ position: "relative", zIndex: 1, marginBottom: "32px" }}>
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: "800",
                color: "#334155",
                letterSpacing: "0.05em",
                marginBottom: "16px",
              }}
            >
              MAJOR EVENTS
            </div>

            <div
              style={{
                position: "relative",
                marginLeft: "140px",
                width: `${timelineWidth}px`,
                height: "60px",
              }}
            >
              {validEvents.map((evt, idx) => {
                const year = evt.date!.year!;
                const left = getLeftPx(year);
                const topOffset = (idx % 2) * 32;

                return (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedItem({ type: "event", data: evt })}
                    style={{
                      position: "absolute",
                      left: `${left}px`,
                      top: `${topOffset}px`,
                      transform: "translateX(-50%)",
                      background: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "10px",
                      padding: "4px 10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      fontSize: "0.75rem",
                    }}
                  >
                    <span
                      style={{
                        background: "#fef2f2",
                        border: "1px solid #fca5a5",
                        color: "#dc2626",
                        borderRadius: "50%",
                        width: "18px",
                        height: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.7rem",
                      }}
                    >
                      📍
                    </span>
                    <div>
                      <div style={{ fontWeight: "700", color: "#1e293b", lineHeight: "1.2" }}>
                        {evt.title}
                      </div>
                      <div style={{ fontSize: "0.65rem", color: "#64748b" }}>
                        {Math.abs(year)} BC
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PATRIARCH LIFESPANS Section */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: "800",
                color: "#334155",
                letterSpacing: "0.05em",
                marginBottom: "16px",
              }}
            >
              PATRIARCH LIFESPANS
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {peopleWithBirth.map((person) => {
                const birthYear = person.birth!.year!;
                const deathYear =
                  person.death?.year !== undefined
                    ? person.death.year
                    : person.yearsLived
                    ? birthYear + person.yearsLived
                    : birthYear + 70;
                const yearsLived =
                  person.yearsLived || Math.abs(deathYear - birthYear);

                const left = getLeftPx(birthYear);
                const width = Math.max(120, getWidthPx(yearsLived));

                return (
                  <div
                    key={person.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: "32px",
                    }}
                  >
                    {/* Person Label on Left */}
                    <div
                      style={{
                        width: "130px",
                        paddingRight: "10px",
                        fontSize: "0.85rem",
                        fontWeight: "700",
                        color: "#1e293b",
                        textAlign: "left",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {person.name}
                    </div>

                    {/* Lifespan Blue Bar */}
                    <div
                      style={{
                        position: "relative",
                        width: `${timelineWidth}px`,
                        height: "100%",
                      }}
                    >
                      <div
                        onClick={() => setSelectedItem({ type: "person", data: person })}
                        style={{
                          position: "absolute",
                          left: `${left}px`,
                          width: `${width}px`,
                          height: "28px",
                          background: "#2563eb",
                          color: "#ffffff",
                          borderRadius: "14px",
                          display: "flex",
                          alignItems: "center",
                          padding: "0 12px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                        }}
                      >
                        {person.name} ({Math.abs(birthYear)}-{Math.abs(deathYear)} BC - {yearsLived} yrs)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedItem && (
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
          onClick={() => setSelectedItem(null)}
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
                {selectedItem.type === "person"
                  ? selectedItem.data.name
                  : selectedItem.data.title}
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
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

            {selectedItem.type === "person" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.9rem", color: "#334155" }}>
                <p style={{ margin: 0 }}><strong>Gender:</strong> {selectedItem.data.gender}</p>
                {selectedItem.data.birth?.year !== undefined && (
                  <p style={{ margin: 0 }}><strong>Born:</strong> {Math.abs(selectedItem.data.birth.year)} BC</p>
                )}
                {selectedItem.data.yearsLived && (
                  <p style={{ margin: 0 }}><strong>Lifespan:</strong> {selectedItem.data.yearsLived} years</p>
                )}
                {selectedItem.data.placeOfBirth && (
                  <p style={{ margin: 0 }}><strong>Birthplace:</strong> {selectedItem.data.placeOfBirth}</p>
                )}
                {selectedItem.data.notes && (
                  <p style={{ margin: 0 }}><strong>Notes:</strong> {selectedItem.data.notes}</p>
                )}
                {(selectedItem.data.biblicalReferences || []).length > 0 && (
                  <p style={{ margin: 0 }}>
                    <strong>References:</strong> {(selectedItem.data.biblicalReferences || []).join(", ")}
                  </p>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.9rem", color: "#334155" }}>
                {selectedItem.data.date?.year !== undefined && (
                  <p style={{ margin: 0 }}><strong>Date:</strong> {Math.abs(selectedItem.data.date.year)} BC</p>
                )}
                {selectedItem.data.location && (
                  <p style={{ margin: 0 }}><strong>Location:</strong> {selectedItem.data.location}</p>
                )}
                {selectedItem.data.description && (
                  <p style={{ margin: 0 }}>{selectedItem.data.description}</p>
                )}
                {(selectedItem.data.personIds || []).length > 0 && (
                  <p style={{ margin: 0 }}>
                    <strong>People:</strong>{" "}
                    {(selectedItem.data.personIds || [])
                      .map((id) => people.find((p) => p.id === id)?.name || id)
                      .join(", ")}
                  </p>
                )}
                {(selectedItem.data.biblicalReferences || []).length > 0 && (
                  <p style={{ margin: 0 }}>
                    <strong>References:</strong> {(selectedItem.data.biblicalReferences || []).join(", ")}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}