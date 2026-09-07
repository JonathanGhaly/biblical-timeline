import { useState } from "react";
import type { Person, BiblicalEvent } from "../types/genealogy";

type TimelinePageProps = {
  people: Person[];
  events: BiblicalEvent[];
};

export default function TimelinePage({ people, events }: TimelinePageProps) {
  const [selectedItem, setSelectedItem] = useState<{
    type: "event" | "person";
    data: BiblicalEvent | Person;
  } | null>(null);

  const minYear = -4000;
  const maxYear = 0;

  const getPercent = (year: number) => {
    return Math.max(0, Math.min(100, ((year - minYear) / (maxYear - minYear)) * 100));
  };

  return (
    <div className="timeline-page-container">
      <h2>Lifespans & Events Timeline</h2>

      <div className="timeline-visual" style={{ position: "relative", minHeight: "200px" }}>
        {events.map((evt) => {
          if (evt.date?.year === undefined) return null;
          const left = getPercent(evt.date.year);

          return (
            <div
              key={evt.id}
              className="timeline-event-marker"
              style={{ position: "absolute", left: `${left}%`, cursor: "pointer" }}
              onClick={() => setSelectedItem({ type: "event", data: evt })}
            >
              <span>{evt.title}</span>
              <br />
              <small>{Math.abs(evt.date.year)} BC</small>
            </div>
          );
        })}
      </div>

      {selectedItem && selectedItem.type === "event" && (
        <div className="details-panel" style={{ marginTop: "20px" }}>
          <h3>{(selectedItem.data as BiblicalEvent).title}</h3>

          {(selectedItem.data as BiblicalEvent).date?.year !== undefined && (
            <p>
              <strong>Year:</strong> {Math.abs((selectedItem.data as BiblicalEvent).date!.year!)} BC
            </p>
          )}

          {(selectedItem.data as BiblicalEvent).description && (
            <p>{(selectedItem.data as BiblicalEvent).description}</p>
          )}

          {((selectedItem.data as BiblicalEvent).personIds || []).length > 0 && (
            <div>
              <strong>Associated People: </strong>
              {((selectedItem.data as BiblicalEvent).personIds || []).map((id: string) => {
                const p = people.find((person) => person.id === id);
                return (
                  <span key={id} style={{ marginRight: "8px" }}>
                    {p ? p.name : id}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}