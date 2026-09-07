import { useState } from "react";
import type { Gender, Person } from "../../types/genealogy";

type EditPersonModalProps = {
  person: Person;
  existingPeople: Person[];
  onSavePerson: (updatedPerson: Person) => void;
  onClose: () => void;
};

export default function EditPersonModal({
  person,
  existingPeople,
  onSavePerson,
  onClose,
}: EditPersonModalProps) {
  const [formData, setFormData] = useState({
    name: person.name,
    gender: person.gender,
    placeOfBirth: person.placeOfBirth || "",
    fatherId: person.fatherId || "",
    motherId: person.motherId || "",
    anchorPersonId: person.anchorPersonId || person.fatherId || "",
    anchorAgeAtBirth: person.anchorPersonAgeAtBirth || person.fatherAgeAtBirth || 0,
    husbandId: person.spouseIds?.[0] || "",
    yearsLived: person.yearsLived || 0,
    biblicalReferences: person.biblicalReferences ? person.biblicalReferences.join(", ") : "",
    notes: person.notes || "",
  });

  const availableAnchors = existingPeople.filter((p) => p.id !== person.id);
  const males = availableAnchors.filter((p) => p.gender === "male");
  const females = availableAnchors.filter((p) => p.gender === "female");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedAnchor = formData.anchorPersonId || formData.fatherId;

    const updatedPerson: Person = {
      ...person,
      name: formData.name,
      gender: formData.gender as Gender,
      placeOfBirth: formData.placeOfBirth || undefined,
      fatherId: formData.fatherId || undefined,
      motherId: formData.motherId || undefined,
      anchorPersonId: selectedAnchor || undefined,
      anchorPersonAgeAtBirth: Number(formData.anchorAgeAtBirth) || 0,
      fatherAgeAtBirth: Number(formData.anchorAgeAtBirth) || 0,
      yearsLived: Number(formData.yearsLived) || 0,
      spouseIds:
        formData.gender === "female" && formData.husbandId
          ? [formData.husbandId]
          : person.spouseIds || [],
      biblicalReferences: formData.biblicalReferences
        ? formData.biblicalReferences.split(",").map((r) => r.trim())
        : [],
      notes: formData.notes,
    };

    onSavePerson(updatedPerson);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Person: {person.name}</h3>
          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-person-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Gender</label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value as Gender })
                }
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="form-group">
              <label>Place of Birth</label>
              <input
                type="text"
                value={formData.placeOfBirth}
                onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Father</label>
              <select
                value={formData.fatherId}
                onChange={(e) => setFormData({ ...formData, fatherId: e.target.value })}
              >
                <option value="">-- None / Root --</option>
                {males.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Mother</label>
              <select
                value={formData.motherId}
                onChange={(e) => setFormData({ ...formData, motherId: e.target.value })}
              >
                <option value="">-- None / Root --</option>
                {females.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Anchor Person</label>
              <select
                value={formData.anchorPersonId}
                onChange={(e) => setFormData({ ...formData, anchorPersonId: e.target.value })}
              >
                <option value="">-- Choose Any Person --</option>
                {availableAnchors.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.gender})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Age of Anchor Person at Birth</label>
              <input
                type="number"
                min="0"
                value={formData.anchorAgeAtBirth}
                onChange={(e) =>
                  setFormData({ ...formData, anchorAgeAtBirth: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label>Lifespan (Years Lived)</label>
            <input
              type="number"
              min="0"
              value={formData.yearsLived}
              onChange={(e) => setFormData({ ...formData, yearsLived: Number(e.target.value) })}
            />
          </div>

          {formData.gender === "female" && (
            <div className="form-group">
              <label>Husband</label>
              <select
                value={formData.husbandId}
                onChange={(e) => setFormData({ ...formData, husbandId: e.target.value })}
              >
                <option value="">-- Select Husband --</option>
                {males.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Scripture References</label>
            <input
              type="text"
              value={formData.biblicalReferences}
              onChange={(e) => setFormData({ ...formData, biblicalReferences: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}