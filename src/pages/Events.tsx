import { useState } from "react";
import AddEventModal from "../components/Event/AddEventModal";
import type { BiblicalEvent, Person } from "../types/genealogy";

type EventsProps = {
  events: BiblicalEvent[];
  people: Person[];
  onAddEvent: (newEvent: BiblicalEvent) => void;
};

function Events({ events, people, onAddEvent }: EventsProps) {
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  const getPersonName = (id?: string) => {
    if (!id) return null;
    return people.find((p) => p.id === id)?.name || id;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Events</h2>
          <p>Manage events and their chronological positions.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => setIsAddModalOpen(true)}
        >
          + Add Event
        </button>
      </div>

      <input
        className="search-input"
        type="search"
        placeholder="Search events..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="events-grid">
        {filteredEvents.map((event) => {
          const evtAny = event as BiblicalEvent & {
            anchorPersonId?: string;
            anchorAge?: number;
          };

          return (
            <div className="event-card" key={event.id}>
              <h3>{event.title}</h3>

              {event.date?.year !== undefined ? (
                <strong>
                  {Math.abs(event.date.year)}{" "}
                  {event.date.year < 0 ? "BC" : "AD"}
                </strong>
              ) : evtAny.anchorPersonId ? (
                <strong>
                  Anchor: {getPersonName(evtAny.anchorPersonId)} (Age {evtAny.anchorAge})
                </strong>
              ) : null}

              {event.location && <p>Location: {event.location}</p>}

              {event.description && <p>{event.description}</p>}

              {event.biblicalReferences && event.biblicalReferences.length > 0 && (
                <small>{event.biblicalReferences.join(", ")}</small>
              )}
            </div>
          );
        })}
      </div>

      {isAddModalOpen && (
        <AddEventModal
          existingPeople={people}
          onAddEvent={onAddEvent}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Events;