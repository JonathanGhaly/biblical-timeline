import { useState } from "react";
import type { Person } from "../../types/genealogy";

type PersonFormProps = {
  existingPeople: Person[];
  onAddPerson: (newPerson: Person) => void;
};

export default function PersonForm({ existingPeople, onAddPerson }: PersonFormProps) {
  const [name, setName] = useState("");
  const [gender] = useState<Person["gender"]>("male");
  const [yearsLived, setYearsLived] = useState<number | string>("");
  
  // Search & Anchor selection state
  const [searchAnchor, setSearchAnchor] = useState("");
  const [anchorPersonId, setAnchorPersonId] = useState<string>("");
  const [anchorAge, setAnchorAge] = useState<number | string>("");

  const filteredAnchors = existingPeople.filter((p) =>
    p.name.toLowerCase().includes(searchAnchor.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedYears = yearsLived !== "" && !isNaN(Number(yearsLived)) ? Number(yearsLived) : undefined;
    const parsedAnchorAge = anchorAge !== "" && !isNaN(Number(anchorAge)) ? Number(anchorAge) : undefined;

    const newPerson: Person = {
      id: name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
      name,
      gender,
      yearsLived: parsedYears,
      anchorPersonId: anchorPersonId || undefined,
      anchorPersonAgeAtBirth: parsedAnchorAge,
      fatherAgeAtBirth: parsedAnchorAge,
      spouseIds: [],
      biblicalReferences: [],
    };

    onAddPerson(newPerson);
    
    // Reset inputs
    setName("");
    setSearchAnchor("");
    setAnchorPersonId("");
  };

  return (
    <form onSubmit={handleSubmit} className="person-form">
      <h3>Add New Individual</h3>

      <div className="form-group">
        <label>Full Name:</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
      </div>

      <div className="form-group">
        <label>Total Lifespan (Years Lived):</label>
        <input 
          type="number" 
          value={yearsLived} 
          onChange={(e) => setYearsLived(Number(e.target.value))} 
          required 
        />
      </div>

      <div className="form-group">
        <label>Search Reference Person:</label>
        <input
          type="text"
          placeholder="Type to search (e.g. Adam, Noah)..."
          value={searchAnchor}
          onChange={(e) => setSearchAnchor(e.target.value)}
        />
        
        {searchAnchor && (
          <select 
            size={4} 
            value={anchorPersonId} 
            onChange={(e) => setAnchorPersonId(e.target.value)}
            className="anchor-select"
          >
            {filteredAnchors.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {anchorPersonId && (
        <div className="form-group">
          <label>
            Born when <strong>{existingPeople.find(p => p.id === anchorPersonId)?.name}</strong> was age:
          </label>
          <input 
            type="number" 
            value={anchorAge} 
            onChange={(e) => setAnchorAge(Number(e.target.value))} 
            required 
          />
        </div>
      )}

      <button type="submit" className="primary-button">
        Save Person
      </button>
    </form>
  );
}