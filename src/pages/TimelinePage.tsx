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
  const [zoom, setZoom] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

  const minYear = -4000;
  const maxYear = 0;
  const totalYears = maxYear - minYear;

  const baseWidth = 2400;
  const currentWidth = baseWidth * zoom;

  const getLeftPx = (year: number) => {
    const ratio = (year - minYear) / totalYears;
    return Math.max(0, Math.min(currentWidth, ratio * currentWidth));
  };

  const getWidthPx = (durationYears: number) => {
    return (durationYears / totalYears) * currentWidth;
  };

  const peopleWithDates = people.filter((p) => p.birth?.year !== undefined);
  const validEvents = events.filter((e) => e.date?.year !== undefined);

  return (
    <div className="timeline-page-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div>
          <h2>Lifespans & Events Visualizer</h2>
          <p>Click any lifespan or event marker to open detailed info.</p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span>Zoom:</span>
          <button
            className="btn-secondary"
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
          >
            -
          </button>
          <span>{Math.round(zoom * 100)}%</span>
          <button
            className="btn-secondary"
            onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
          >
            +
          </button>
          <button className="btn-secondary" onClick={() => setZoom(1)}>
            Reset
          </button>
        </div>
      </div>

      <div
        style={{
          overflowX: "auto",
          background: "#f8fafc",
          border: "1px solid #cbd5e1",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <div
          style={{
            position: "relative",
            width: `${currentWidth}px`,
            paddingBottom: "20px",
          }}
        >
          {/* Axis Scale Markers */}
          <div
            style={{
              position: "relative",
              height: "30px",
              borderBottom: "2px solid #64748b",
              marginBottom: "20px",
            }}
          >
            {[-4000, -3500, -3000, -2500, -2000, -1500, -1000, -500, 0].map(
              (yr) => {
                const left = getLeftPx(yr);
                return (
                  <div
                    key={yr}
                    style={{
                      position: "absolute",
                      left: `${left}px`,
                      transform: "translateX(-50%)",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      color: "#475569",
                    }}
                  >
                    {Math.abs(yr)} {yr < 0 ? "BC" : "AD"}
                  </div>
                );
              }
            )}
          </div>

          {/* Events Section */}
          <div style={{ marginBottom: "30px" }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#1e293b" }}>
              Historical Events
            </h4>
            <div
              style={{
                position: "relative",
                minHeight: "80px",
                borderBottom: "1px dashed #cbd5e1",
              }}
            >
              {validEvents.map((evt, idx) => {
                const year = evt.date!.year!;
                const left = getLeftPx(year);
                const top = (idx % 3) * 26;

                return (
                  <div
                    key={evt.id}
                    onClick={() =>
                      setSelectedItem({ type: "event", data: evt })
                    }
                    style={{
                      position: "absolute",
                      left: `${left}px`,
                      top: `${top}px`,
                      transform: "translateX(-50%)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      background: "#dbeafe",
                      border: "1px solid #2563eb",
                      borderRadius: "12px",
                      padding: "2px 8px",
                      fontSize: "0.75rem",
                      whiteSpace: "nowrap",
                      zIndex: 2,
                    }}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#2563eb",
                      }}
                    />
                    <strong>{evt.title}</strong> ({Math.abs(year)} BC)
                  </div>
                );
              })}
            </div>
          </div>

          {/* People Lifespans Section */}
          <div>
            <h4 style={{ margin: "0 0 10px 0", color: "#1e293b" }}>
              Person Lifespans
            </h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {peopleWithDates.map((person) => {
                const birthYear = person.birth!.year!;
                const duration =
                  person.yearsLived ||
                  (person.death?.year !== undefined
                    ? person.death.year - birthYear
                    : 70);
                const left = getLeftPx(birthYear);
                const width = Math.max(20, getWidthPx(duration));

                return (
                  <div
                    key={person.id}
                    onClick={() =>
                      setSelectedItem({ type: "person", data: person })
                    }
                    style={{ position: "relative", height: "28px" }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: `${left}px`,
                        width: `${width}px`,
                        height: "100%",
                        background:
                          person.gender === "male" ? "#e0f2fe" : "#fce7f3",
                        border: `1px solid ${
                          person.gender === "male" ? "#0284c7" : "#db2777"
                        }`,
                        borderRadius: "4px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        padding: "0 8px",
                        fontSize: "0.8rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <strong>{person.name}</strong>
                      <span
                        style={{
                          marginLeft: "6px",
                          fontSize: "0.7rem",
                          opacity: 0.8,
                        }}
                      >
                        ({Math.abs(birthYear)} BC, {duration}y)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Item Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {selectedItem.type === "person"
                  ? `Person: ${selectedItem.data.name}`
                  : `Event: ${selectedItem.data.title}`}
              </h3>
              <button
                className="btn-close"
                onClick={() => setSelectedItem(null)}
              >
                ✕
              </button>
            </div>

            {selectedItem.type === "person" ? (
              <div>
                <p>
                  <strong>Gender:</strong> {selectedItem.data.gender}
                </p>
                {selectedItem.data.birth?.year !== undefined && (
                  <p>
                    <strong>Birth:</strong>{" "}
                    {Math.abs(selectedItem.data.birth.year)} BC
                  </p>
                )}
                {selectedItem.data.death?.year !== undefined && (
                  <p>
                    <strong>Death:</strong>{" "}
                    {Math.abs(selectedItem.data.death.year)} BC
                  </p>
                )}
                {selectedItem.data.yearsLived ? (
                  <p>
                    <strong>Lifespan:</strong> {selectedItem.data.yearsLived}{" "}
                    years
                  </p>
                ) : null}
                {selectedItem.data.placeOfBirth && (
                  <p>
                    <strong>Place of Birth:</strong>{" "}
                    {selectedItem.data.placeOfBirth}
                  </p>
                )}
                {(selectedItem.data.biblicalReferences || []).length > 0 && (
                  <p>
                    <strong>References:</strong>{" "}
                    {(selectedItem.data.biblicalReferences || []).join(", ")}
                  </p>
                )}
                {selectedItem.data.notes && (
                  <p>
                    <strong>Notes:</strong> {selectedItem.data.notes}
                  </p>
                )}
              </div>
            ) : (
              <div>
                {selectedItem.data.date?.year !== undefined && (
                  <p>
                    <strong>Date:</strong>{" "}
                    {Math.abs(selectedItem.data.date.year)} BC
                  </p>
                )}
                {selectedItem.data.location && (
                  <p>
                    <strong>Location:</strong> {selectedItem.data.location}
                  </p>
                )}
                {selectedItem.data.description && (
                  <p>{selectedItem.data.description}</p>
                )}
                {(selectedItem.data.personIds || []).length > 0 && (
                  <p>
                    <strong>Associated People:</strong>{" "}
                    {(selectedItem.data.personIds || [])
                      .map((id) => people.find((p) => p.id === id)?.name || id)
                      .join(", ")}
                  </p>
                )}
                {(selectedItem.data.biblicalReferences || []).length > 0 && (
                  <p>
                    <strong>References:</strong>{" "}
                    {(selectedItem.data.biblicalReferences || []).join(", ")}
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