import { useState } from "react";
import AddEventModal from "../components/Event/AddEventModal";
import type { BiblicalEvent, Person } from "../types/genealogy";

type EventsProps = {
  events: BiblicalEvent[];
  people: Person[];
  onAddEvent: (newEvent: BiblicalEvent) => void;
  onUpdateEvent?: (updatedEvent: BiblicalEvent) => void;
  onDeleteEvent?: (eventId: string) => void;
};

const OT_LOCATIONS = [
  "Asshur",
  "Babylon",
  "Beersheba",
  "Calah (Nimrud)",
  "Carchemish",
  "Damascus",
  "Dan",
  "Dedan",
  "Ecbatana",
  "Erech (Uruk)",
  "Ezion-Geber",
  "Gaza",
  "Haran",
  "Hebron",
  "Jericho",
  "Jerusalem",
  "Joppa",
  "Kir-hareseth (Moab)",
  "Memphis (Noph)",
  "Mt. Sinai (Horeb)",
  "Nineveh",
  "Persepolis",
  "Rabbah (Ammon)",
  "Rameses (Goshen)",
  "Samaria",
  "Shechem",
  "Sidon",
  "Susa (Shushan)",
  "Tema",
  "Thebes (No-Amon)",
  "Tyre",
  "Ur of the Chaldees",
];

function Events({
  events,
  people,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
}: EventsProps) {
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<BiblicalEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<BiblicalEvent | null>(null);
  const [isCustomLocation, setIsCustomLocation] = useState(false);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  const getPersonName = (id?: string) => {
    if (!id) return null;
    return people.find((p) => p.id === id)?.name || id;
  };

  const handleOpenModal = (event: BiblicalEvent) => {
    setSelectedEvent(event);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    if (selectedEvent) {
      const formCopy = JSON.parse(JSON.stringify(selectedEvent));
      setEditForm(formCopy);
      setIsCustomLocation(
        Boolean(formCopy.location && !OT_LOCATIONS.includes(formCopy.location))
      );
      setIsEditing(true);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    if (onUpdateEvent) {
      onUpdateEvent(editForm);
    }

    setSelectedEvent(editForm);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!selectedEvent) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${selectedEvent.title}"?`
    );

    if (confirmed) {
      if (onDeleteEvent) {
        onDeleteEvent(selectedEvent.id);
      }
      setSelectedEvent(null);
    }
  };

  const togglePersonAssociation = (personId: string) => {
    if (!editForm) return;
    const currentPeople = editForm.personIds || [];
    const updated = currentPeople.includes(personId)
      ? currentPeople.filter((id) => id !== personId)
      : [...currentPeople, personId];

    setEditForm({ ...editForm, personIds: updated });
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
            <div
              className="event-card"
              key={event.id}
              onClick={() => handleOpenModal(event)}
              style={{ cursor: "pointer" }}
            >
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
              maxWidth: "520px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
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
                {isEditing ? "Edit Event" : selectedEvent.title}
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

            {isEditing && editForm ? (
              <form
                onSubmit={handleSaveEdit}
                style={{ display: "flex", flexDirection: "column", gap: "14px" }}
              >
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "bold", marginBottom: "4px" }}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    required
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "bold", marginBottom: "4px" }}>
                    Year (Use negative number for BC, e.g. -2000)
                  </label>
                  <input
                    type="number"
                    value={editForm.date?.year ?? ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        date: {
                          ...editForm.date,
                          year: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <label style={{ fontSize: "0.8rem", fontWeight: "bold" }}>Location</label>
                    <button
                      type="button"
                      onClick={() => setIsCustomLocation(!isCustomLocation)}
                      style={{ background: "none", border: "none", color: "#2563eb", fontSize: "0.75rem", cursor: "pointer", textDecoration: "underline" }}
                    >
                      {isCustomLocation ? "Select from list" : "Type custom location"}
                    </button>
                  </div>

                  {isCustomLocation ? (
                    <input
                      type="text"
                      placeholder="Type custom location..."
                      value={editForm.location || ""}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                    />
                  ) : (
                    <select
                      value={editForm.location || ""}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#ffffff" }}
                    >
                      <option value="">-- Select Location --</option>
                      {OT_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "bold", marginBottom: "4px" }}>
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.description || ""}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "bold", marginBottom: "4px" }}>
                    Scripture References (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={(editForm.biblicalReferences || []).join(", ")}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        biblicalReferences: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "bold", marginBottom: "6px" }}>
                    Associated People
                  </label>
                  <div style={{ maxHeight: "120px", overflowY: "auto", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    {people.map((p) => {
                      const checked = (editForm.personIds || []).includes(p.id);
                      return (
                        <label key={p.id} style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                          <input type="checkbox" checked={checked} onChange={() => togglePersonAssociation(p.id)} />
                          {p.name}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    style={{ padding: "8px 16px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: "8px 16px", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
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
                  <p style={{ margin: 0, lineHeight: "1.5" }}>{selectedEvent.description}</p>
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

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
                  <button
                    onClick={handleDelete}
                    style={{
                      padding: "8px 16px",
                      background: "#ef4444",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Delete Event
                  </button>
                  <button
                    onClick={handleStartEdit}
                    style={{
                      padding: "8px 16px",
                      background: "#2563eb",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Edit Event
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;