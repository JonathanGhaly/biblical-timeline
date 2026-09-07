import type { Person, BiblicalEvent } from "../types/genealogy";

type TimelineProps = {
  people: Person[];
  events: BiblicalEvent[];
};

export default function Timeline({ people, events }: TimelineProps) {
  return (
    <div className="timeline-page">
      <h2>Timeline</h2>

      <div className="timeline-list">
        {events.map((event) => (
          <div key={event.id} className="timeline-card">
            <h3>{event.title}</h3>

            {event.date?.year !== undefined && (
              <p>
                <strong>Date:</strong> {Math.abs(event.date.year)}{" "}
                {event.date.year < 0 ? "BC" : "AD"}
              </p>
            )}

            {event.location && (
              <p>
                <strong>Location:</strong> {event.location}
              </p>
            )}

            {event.description && <p>{event.description}</p>}

            {(event.personIds || []).length > 0 && (
              <div>
                <strong>People: </strong>
                {(event.personIds || [])
                  .map((personId: string) => {
                    const p = people.find((person) => person.id === personId);
                    return p ? p.name : personId;
                  })
                  .join(", ")}
              </div>
            )}

            {(event.biblicalReferences || []).length > 0 && (
              <div>
                <strong>References: </strong>
                {(event.biblicalReferences || []).join(", ")}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}