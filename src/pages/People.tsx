import { useState } from "react";
import AddPersonModal from "../components/Person/AddPersonModal";
import EditPersonModal from "../components/Person/EditPersonModal";
import type { Person } from "../types/genealogy";

type PeopleProps = {
  people: Person[];
  onAddPerson: (newPerson: Person) => void;
  onUpdatePerson: (updatedPerson: Person) => void;
};

function People({ people, onAddPerson, onUpdatePerson }: PeopleProps) {
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  const filteredPeople = people.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>People</h2>
          <p>Browse or click on any person to edit their details.</p>
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

      <div className="people-grid">
        {filteredPeople.map((person) => (
          <div className="person-card" key={person.id}>
            <div className="person-card-header">
              <h3
                className="clickable-name"
                onClick={() => setEditingPerson(person)}
                title="Click to edit person"
              >
                {person.name}
              </h3>

              <div className="card-actions">
                <span className="gender-badge">{person.gender}</span>
                <button
                  className="btn-edit-icon"
                  onClick={() => setEditingPerson(person)}
                  title="Edit details"
                >
                  ✏️
                </button>
              </div>
            </div>

            {person.birth && (
              <p>
                Born:{" "}
                {person.birth.year
                  ? `${Math.abs(person.birth.year)} ${
                      person.birth.year < 0 ? "BC" : "AD"
                    }`
                  : "Unknown"}
              </p>
            )}

            {person.death && (
              <p>
                Died:{" "}
                {person.death.year
                  ? `${Math.abs(person.death.year)} ${
                      person.death.year < 0 ? "BC" : "AD"
                    }`
                  : "Unknown"}
              </p>
            )}

            {person.yearsLived ? (
              <p>Lifespan: {person.yearsLived} years</p>
            ) : null}

            {person.biblicalReferences && person.biblicalReferences.length > 0 && (
              <p className="references">
                {person.biblicalReferences.join(", ")}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <AddPersonModal
          existingPeople={people}
          onAddPerson={onAddPerson}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {/* Edit Modal */}
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

export default People;