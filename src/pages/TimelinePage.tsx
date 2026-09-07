import { useState } from "react";
import type { Person, BiblicalEvent } from "../types/genealogy";

type TimelinePageProps = {
  people: Person[];
  events: BiblicalEvent[];
};

export default function TimelinePage({ people, events }: TimelinePageProps) {
  const [selectedItem, setSelectedItem] = useState<BiblicalEvent | null>(null);

  const minYear = -4000;
  const maxYear = 0;

  const getPercent = (year: number) => {
    return Math.max(0, Math.min(100, ((year - minYear) / (maxYear - minYear)) * 100));
  };

  const validEvents = events.filter((e) => e.date?.year !== undefined);

  return (
    <div className="timeline-page-container">
      <h2>Lifespans & Events Timeline</h2>
      <p>Click any event marker to view details.</p>

      <div className="timeline-track-wrapper">
        <div className="timeline-track">
          {validEvents.map((evt, index) => {
            const year = evt.date!.year!;
            const left = getPercent(year);
            // Stagger vertical placement across 4 rows to prevent label collision
            const topOffset = (index % 4) * 42;

            return (
              <div
                key={evt.id}
                className="timeline-marker-node"
                style={{
                  left: `${left}%`,
                  top: `${topOffset}px`,
                }}
                onClick={() => setSelectedItem(evt)}
              >
                <div className="marker-dot" />
                <div className="marker-label">
                  <strong>{evt.title}</strong>
                  <small>{Math.abs(year)} BC</small>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedItem && (
        <div className="event-detail-card">
          <div className="card-header">
            <h3>{selectedItem.title}</h3>
            <button className="btn-secondary" onClick={() => setSelectedItem(null)}>
              ✕ Close
            </button>
          </div>
          {selectedItem.date?.year !== undefined && (
            <p>
              <strong>Date:</strong> {Math.abs(selectedItem.date.year)}{" "}
              {selectedItem.date.year < 0 ? "BC" : "AD"}
            </p>
          )}
          {selectedItem.location && <p><strong>Location:</strong> {selectedItem.location}</p>}
          {selectedItem.description && <p>{selectedItem.description}</p>}
          {(selectedItem.biblicalReferences || []).length > 0 && (
            <p>
              <strong>References:</strong> {(selectedItem.biblicalReferences || []).join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}