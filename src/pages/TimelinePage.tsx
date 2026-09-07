import { useState } from "react";
import type { BiblicalEvent } from "../types/genealogy";
import { computeAllDates } from "../utils/chronology";
import type { ComputedPerson } from "../utils/chronology";
import type { Person } from "../types/genealogy";
type TimelineProps = {
  people: Person[];
  events: BiblicalEvent[];
};

type SelectedItem =
  | { type: "event"; data: BiblicalEvent }
  | { type: "person"; data: ComputedPerson }
  | null;

export default function TimelinePage({ people = [], events = [] }: TimelineProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);

  const computedPeople = computeAllDates(people);
  const timelinePeople = computedPeople.filter(
    (p) => p.yearsLived && p.yearsLived > 0
  );

  const START_BC = 4000;
  const END_BC = 1800;
  const TOTAL_SPAN = START_BC - END_BC;

  const tickStep = zoom >= 3 ? 50 : zoom >= 2 ? 100 : 250;

  const centuryTicks: number[] = [];
  for (let year = START_BC; year >= END_BC; year -= tickStep) {
    centuryTicks.push(year);
  }

  const getPercent = (yearBC: number) => {
    const positiveBC = Math.abs(yearBC);
    const clamped = Math.min(START_BC, Math.max(END_BC, positiveBC));
    return ((START_BC - clamped) / TOTAL_SPAN) * 100;
  };

  const getPersonName = (id?: string) => {
    if (!id) return null;
    return people.find((p) => p.id === id)?.name || id;
  };

  return (
    <div className="page-container">
      {/* Header & Controls */}
      <div className="timeline-header">
        <div>
          <h2>Integrated Biblical Timeline</h2>
          <p className="subtitle">
            Hover over items to preview details, click to open full details.
          </p>
        </div>

        <div className="zoom-controls">
          <span className="zoom-label">Intervals: {tickStep} yrs</span>
          <button
            onClick={() => setZoom((prev) => Math.max(prev - 1, 1))}
            disabled={zoom <= 1}
            className="btn-zoom"
          >
            ➖ Zoom Out
          </button>
          <button
            onClick={() => setZoom(1)}
            disabled={zoom === 1}
            className="btn-zoom"
          >
            Reset
          </button>
          <button
            onClick={() => setZoom((prev) => Math.min(prev + 1, 3))}
            disabled={zoom >= 3}
            className="btn-zoom"
          >
            ➕ Zoom In
          </button>
        </div>
      </div>

      {/* Timeline Viewport */}
      <div className="timeline-scroll-wrapper">
        <div
          className="timeline-canvas"
          style={{ minWidth: `${1200 * zoom}px` }}
        >
          {/* Scaled Grid Overlay */}
          <div className="grid-overlay">
            {centuryTicks.map((year) => (
              <div
                key={year}
                className="grid-line"
                style={{ left: `${getPercent(year)}%` }}
              >
                <span className="grid-label">{year} BC</span>
              </div>
            ))}
          </div>

          {/* Events Track */}
          <div className="timeline-section">
            <h3 className="section-title">Major Events</h3>
            <div className="events-track">
              {events.map((evt) => {
                const left = getPercent(evt.date.year);
                return (
                  <div
                    key={evt.id}
                    className="event-marker interactive"
                    data-tooltip={`Click for event details: ${evt.title}`}
                    style={{ left: `${left}%` }}
                    onClick={() => setSelectedItem({ type: "event", data: evt })}
                  >
                    <div className="marker-pin" />
                    <div className="marker-card">
                      <strong>{evt.title}</strong>
                      <small>{Math.abs(evt.date.year)} BC</small>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lifespans Track */}
          <div className="timeline-section">
            <h3 className="section-title">Patriarch Lifespans</h3>
            <div className="lifespans-list">
              {timelinePeople.map((p) => {
                const birthBC = Math.abs(p.birthYearBC);
                const deathBC = Math.abs(p.deathYearBC);

                const left = getPercent(birthBC);
                const right = getPercent(deathBC);
                const width = Math.max(1.5, right - left);

                return (
                  <div key={p.id} className="timeline-row">
                    <div className="person-label-sticky">
                      <strong>{p.name}</strong>
                    </div>
                    <div className="bar-track">
                      <div
                        className="lifespan-bar interactive"
                        data-tooltip={`Click profile: ${p.name} (${birthBC}–${deathBC} BC)`}
                        style={{
                          left: `${left}%`,
                          width: `${width}%`,
                        }}
                        onClick={() => setSelectedItem({ type: "person", data: p })}
                      >
                        <span className="bar-label">
                          {p.name} ({birthBC}–{deathBC} BC • {p.yearsLived} yrs)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Popup Details */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className={`badge-type ${selectedItem.type}`}>
                {selectedItem.type === "event" ? "Biblical Event" : "Patriarch Profile"}
              </span>
              <button
                className="btn-close"
                onClick={() => setSelectedItem(null)}
              >
                ✕
              </button>
            </div>

            {selectedItem.type === "event" ? (
              <div className="detail-content">
                <h3>{selectedItem.data.title}</h3>
                <p className="detail-meta">
                  <strong>Year:</strong> {Math.abs(selectedItem.data.date.year)} BC
                  {selectedItem.data.location && (
                    <span> • <strong>Location:</strong> {selectedItem.data.location}</span>
                  )}
                </p>
                <p className="detail-desc">{selectedItem.data.description}</p>
                {selectedItem.data.personIds && selectedItem.data.personIds.length > 0 && (
                  <div className="detail-section">
                    <strong>People Involved:</strong>
                    <div className="chip-list">
                      {selectedItem.data.personIds.map((id) => (
                        <span key={id} className="chip">
                          {getPersonName(id)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {selectedItem.data.biblicalReferences && (
                  <div className="detail-section">
                    <strong>Scripture References:</strong>
                    <div className="chip-list">
                      {selectedItem.data.biblicalReferences.map((ref) => (
                        <span key={ref} className="chip ref">
                          📖 {ref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="detail-content">
                <h3>{selectedItem.data.name}</h3>
                <p className="detail-meta">
                  <strong>Lifespan:</strong> {Math.abs(selectedItem.data.birthYearBC)} BC –{" "}
                  {Math.abs(selectedItem.data.deathYearBC)} BC ({selectedItem.data.yearsLived} years)
                </p>
                {selectedItem.data.notes && (
                  <p className="detail-desc">{selectedItem.data.notes}</p>
                )}
                <div className="detail-grid">
                  {selectedItem.data.fatherId && (
                    <div>
                      <strong>Father:</strong> {getPersonName(selectedItem.data.fatherId)}
                      {selectedItem.data.fatherAgeAtBirth ? (
                        <small> (at age {selectedItem.data.fatherAgeAtBirth})</small>
                      ) : null}
                    </div>
                  )}
                  {selectedItem.data.motherId && (
                    <div>
                      <strong>Mother:</strong> {getPersonName(selectedItem.data.motherId)}
                    </div>
                  )}
                </div>
                {selectedItem.data.biblicalReferences && (
                  <div className="detail-section">
                    <strong>Scripture References:</strong>
                    <div className="chip-list">
                      {selectedItem.data.biblicalReferences.map((ref) => (
                        <span key={ref} className="chip ref">
                          📖 {ref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}