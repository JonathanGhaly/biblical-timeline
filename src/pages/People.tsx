import { useState } from "react";
import AddPersonModal from "../components/Person/AddPersonModal";
import EditPersonModal from "../components/Person/EditPersonModal";
import type { Person } from "../types/genealogy";

type PeopleProps = {
  people: Person[];
  onAddPerson: (newPerson: Person) => void;
  onUpdatePerson: (updatedPerson: Person) => void;
  onDeletePerson?: (personId: string) => void;
};

export default function People({
  people,
  onAddPerson,
  onUpdatePerson,
  onDeletePerson,
}: PeopleProps) {
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  const filteredPeople = people.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (person: Person) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${person.name}?`
    );

    if (confirmed && onDeletePerson) {
      onDeletePerson(person.id);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>People</h2>
          <p>Manage individuals in the genealogy database.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => setIsAddModalOpen(true)}
        >
          + Add Person
        </button>
      </div>

      <input
        className="search-input"
        type="search"
        placeholder="Search people..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="events-grid">
        {filteredPeople.map((person) => (
          <div className="event-card" key={person.id}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3>{person.name}</h3>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  className="btn-secondary"
                  onClick={() => setEditingPerson(person)}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(person)}
                  style={{
                    padding: "4px 10px",
                    background: "#ef4444",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>

            <p>Gender: {person.gender}</p>

            {person.birth?.year !== undefined && (
              <p>
                Birth: {Math.abs(person.birth.year)}{" "}
                {person.birth.year < 0 ? "BC" : "AD"}
              </p>
            )}

            {person.death?.year !== undefined && (
              <p>
                Death: {Math.abs(person.death.year)}{" "}
                {person.death.year < 0 ? "BC" : "AD"}
              </p>
            )}

            {person.yearsLived ? <p>Lifespan: {person.yearsLived} years</p> : null}

            {person.notes && <p>{person.notes}</p>}
          </div>
        ))}
      </div>

      {isAddModalOpen && (
        <AddPersonModal
          existingPeople={people}
          onAddPerson={onAddPerson}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {editingPerson && (
        <EditPersonModal
          person={editingPerson}
          existingPeople={people}
          onSavePerson={onUpdatePerson}
          onClose={() => setEditingPerson(null)}
        />
      )}
    </div>
  );
}