import { useState } from "react";
import type { Person, BiblicalEvent } from "../types/genealogy";

type TimelineProps = {
  people: Person[];
  events: BiblicalEvent[];
  onUpdateEvent?: (updatedEvent: BiblicalEvent) => void;
};

export default function Timeline({ people, events, onUpdateEvent }: TimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<BiblicalEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<BiblicalEvent | null>(null);

  const sortedEvents = [...events].sort((a, b) => {
    const yearA = a.date?.year ?? 0;
    const yearB = b.date?.year ?? 0;
    return yearA - yearB;
  });

  const handleOpenModal = (event: BiblicalEvent) => {
    setSelectedEvent(event);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    if (selectedEvent) {
      setEditForm(JSON.parse(JSON.stringify(selectedEvent)));
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

  const togglePersonAssociation = (personId: string) => {
    if (!editForm) return;
    const currentPeople = editForm.personIds || [];
    const updated = currentPeople.includes(personId)
      ? currentPeople.filter((id) => id !== personId)
      : [...currentPeople, personId];

    setEditForm({ ...editForm, personIds: updated });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px" }}>
      <h2 style={{ fontSize: "1.75rem", fontWeight: "bold", marginBottom: "28px", color: "#0f172a" }}>
        Timeline
      </h2>

      <div style={{ position: "relative", paddingLeft: "110px" }}>
        {/* Vertical Timeline Line */}
        <div
          style={{
            position: "absolute",
            left: "95px",
            top: "18px",
            bottom: "18px",
            width: "2px",
            backgroundColor: "#cbd5e1",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {sortedEvents.map((event) => {
            const year = event.date?.year;
            const yearStr = year !== undefined ? `${Math.abs(year)} ${year < 0 ? "BC" : "AD"}` : "";

            return (
              <div key={event.id} style={{ position: "relative" }}>
                {/* Year Label */}
                <div
                  style={{
                    position: "absolute",
                    left: "-110px",
                    top: "16px",
                    width: "80px",
                    textAlign: "right",
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    color: "#64748b",
                  }}
                >
                  {yearStr}
                </div>

                {/* Timeline Dot */}
                <div
                  style={{
                    position: "absolute",
                    left: "-19px",
                    top: "20px",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#ffffff",
                    border: "2px solid #64748b",
                    zIndex: 1,
                  }}
                />

                {/* Event Card */}
                <div
                  onClick={() => handleOpenModal(event)}
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "16px 20px",
                    cursor: "pointer",
                    transition: "all 0.15s ease-in-out",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                >
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "1.05rem", fontWeight: "700", color: "#1e293b" }}>
                    {event.title}
                  </h3>

                  {event.description && (
                    <p style={{ margin: "0 0 10px 0", fontSize: "0.875rem", color: "#475569", lineHeight: "1.5" }}>
                      {event.description}
                    </p>
                  )}

                  {event.location && (
                    <p style={{ margin: "0 0 10px 0", fontSize: "0.85rem", color: "#64748b" }}>
                      Location: {event.location}
                    </p>
                  )}

                  {(event.personIds || []).length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                      {(event.personIds || []).map((personId) => {
                        const p = people.find((person) => person.id === personId);
                        return (
                          <span
                            key={personId}
                            style={{
                              background: "#e2e8f0",
                              color: "#334155",
                              padding: "2px 10px",
                              borderRadius: "12px",
                              fontSize: "0.75rem",
                              fontWeight: "500",
                            }}
                          >
                            {p ? p.name : personId}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {(event.biblicalReferences || []).length > 0 && (
                    <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                      {(event.biblicalReferences || []).join(", ")}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* View/Edit Event Modal */}
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a" }}>
                {isEditing ? "Edit Event" : selectedEvent.title}
              </h3>
              <button
                onClick={() => setSelectedEvent(null)}
                style={{ background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            {isEditing && editForm ? (
              <form onSubmit={handleSaveEdit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
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
                        date: { ...editForm.date, year: parseInt(e.target.value) || 0 },
                      })
                    }
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "bold", marginBottom: "4px" }}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={editForm.location || ""}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
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
                        biblicalReferences: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "bold", marginBottom: "6px" }}>
                    Associated People
                  </label>
                  <div
                    style={{
                      maxHeight: "120px",
                      overflowY: "auto",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      padding: "8px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    {people.map((p) => {
                      const checked = (editForm.personIds || []).includes(p.id);
                      return (
                        <label key={p.id} style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePersonAssociation(p.id)}
                          />
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
                    style={{
                      padding: "8px 16px",
                      background: "#f1f5f9",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
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
                    <strong>References:</strong> {(selectedEvent.biblicalReferences || []).join(", ")}
                  </p>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
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