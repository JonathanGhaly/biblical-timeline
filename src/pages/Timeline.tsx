import type { BiblicalEvent, Person } from "../types/genealogy";

type TimelineProps = {
  people: Person[];
  events: BiblicalEvent[];
};

function formatYear(year?: number) {
  if (year === undefined) {
    return "Unknown date";
  }

  return `${Math.abs(year)} ${year < 0 ? "BC" : "AD"}`;
}

function Timeline({ people, events }: TimelineProps) {
  const sortedEvents = [...events].sort(
    (a, b) =>
      (a.date?.year ?? 999999) -
      (b.date?.year ?? 999999),
  );

  const findPerson = (id: string) =>
    people.find((person) => person.id === id);

  return (
    <div>
      <h2>Timeline</h2>

      <p>
        Chronological view of events recorded in the
        application.
      </p>

      <div className="timeline">
        {sortedEvents.map((event) => (
          <div className="timeline-item" key={event.id}>
            <div className="timeline-date">
              {formatYear(event.date?.year)}
            </div>

            <div className="timeline-marker" />

            <div className="timeline-content">
              <h3>{event.title}</h3>

              {event.description && (
                <p>{event.description}</p>
              )}

              {event.location && (
                <span className="event-location">
                  Location: {event.location}
                </span>
              )}

              {event.personIds.length > 0 && (
                <div className="event-people">
                  {event.personIds.map((personId) => {
                    const person = findPerson(personId);

                    if (!person) return null;

                    return (
                      <span
                        className="person-tag"
                        key={person.id}
                      >
                        {person.name}
                      </span>
                    );
                  })}
                </div>
              )}

              {event.biblicalReferences.length > 0 && (
                <small>
                  {event.biblicalReferences.join(", ")}
                </small>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Timeline;