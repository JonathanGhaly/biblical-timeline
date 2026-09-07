import { useState } from "react";
import type { Person, BiblicalEvent } from "../types/genealogy";

type TimelineProps = {
  people: Person[];
  events: BiblicalEvent[];
};

type CombinedItem = {
  id: string;
  year: number;
  type: "event" | "person_birth";
  title: string;
  subtitle?: string;
  description?: string;
  references?: string[];
  associatedPeople?: string[];
};

export default function Timeline({ people, events }: TimelineProps) {
  const [selectedItem, setSelectedItem] = useState<CombinedItem | null>(null);

  const items: CombinedItem[] = [];

  events.forEach((evt) => {
    if (evt.date?.year !== undefined) {
      items.push({
        id: `evt-${evt.id}`,
        year: evt.date.year,
        type: "event",
        title: evt.title,
        subtitle: evt.location ? `Location: ${evt.location}` : undefined,
        description: evt.description,
        references: evt.biblicalReferences,
        associatedPeople: evt.personIds,
      });
    }
  });

  people.forEach((p) => {
    if (p.birth?.year !== undefined) {
      items.push({
        id: `birth-${p.id}`,
        year: p.birth.year,
        type: "person_birth",
        title: `Birth of ${p.name}`,
        subtitle: p.yearsLived ? `Lived ${p.yearsLived} years` : undefined,
        description: p.notes,
        references: p.biblicalReferences,
      });
    }
  });

  // Sort chronologically (oldest first)
  items.sort((a, b) => a.year - b.year);

  return (
    <div className="timeline-line-page">
      <h2>Chronological Timeline</h2>
      <p>Scrollable timeline line. Click any entry card for details.</p>

      <div
        style={{
          position: "relative",
          margin: "30px 0 30px 20px",
          paddingLeft: "30px",
          borderLeft: "4px solid #2563eb",
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              position: "relative",
              marginBottom: "28px",
            }}
          >
            {/* Year Node Marker on Line */}
            <div
              style={{
                position: "absolute",
                left: "-39px",
                top: "4px",
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                background: item.type === "event" ? "#2563eb" : "#16a34a",
                border: "3px solid #ffffff",
                boxShadow: "0 0 0 2px #cbd5e1",
              }}
            />

            {/* Year Badge */}
            <div
              style={{
                display: "inline-block",
                background: "#1e293b",
                color: "#ffffff",
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "0.8rem",
                fontWeight: "bold",
                marginBottom: "6px",
              }}
            >
              {Math.abs(item.year)} {item.year < 0 ? "BC" : "AD"}
            </div>

            {/* Entry Box beside Line */}
            <div
              onClick={() => setSelectedItem(item)}
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "14px 18px",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                maxWidth: "600px",
              }}
            >
              <h3 style={{ margin: "0 0 4px 0", fontSize: "1.05rem" }}>
                {item.title}
              </h3>

              {item.subtitle && (
                <p
                  style={{
                    margin: "0 0 6px 0",
                    color: "#64748b",
                    fontSize: "0.85rem",
                  }}
                >
                  {item.subtitle}
                </p>
              )}

              {item.description && (
                <p style={{ margin: "0 0 8px 0", color: "#334155" }}>
                  {item.description}
                </p>
              )}

              {item.associatedPeople && item.associatedPeople.length > 0 && (
                <p
                  style={{
                    margin: "0",
                    fontSize: "0.85rem",
                    color: "#2563eb",
                  }}
                >
                  <strong>People: </strong>
                  {item.associatedPeople
                    .map((pid) => people.find((p) => p.id === pid)?.name || pid)
                    .join(", ")}
                </p>
              )}

              {item.references && item.references.length > 0 && (
                <p
                  style={{
                    margin: "4px 0 0 0",
                    fontSize: "0.8rem",
                    color: "#64748b",
                  }}
                >
                  <strong>Scripture: </strong>
                  {item.references.join(", ")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedItem.title}</h3>
              <button
                className="btn-close"
                onClick={() => setSelectedItem(null)}
              >
                ✕
              </button>
            </div>
            <p>
              <strong>Year:</strong> {Math.abs(selectedItem.year)}{" "}
              {selectedItem.year < 0 ? "BC" : "AD"}
            </p>
            {selectedItem.subtitle && <p>{selectedItem.subtitle}</p>}
            {selectedItem.description && <p>{selectedItem.description}</p>}
            {selectedItem.references && selectedItem.references.length > 0 && (
              <p>
                <strong>References:</strong>{" "}
                {selectedItem.references.join(", ")}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}