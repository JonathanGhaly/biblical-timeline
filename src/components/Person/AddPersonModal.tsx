import { useState } from "react";
import type { Person } from "../../types/genealogy";

type AddPersonModalProps = {
  existingPeople: Person[];
  onAddPerson: (newPerson: Person) => void;
  onClose: () => void;
};

export default function AddPersonModal({
  existingPeople,
  onAddPerson,
  onClose,
}: AddPersonModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    gender: "male",
    placeOfBirth: "",
    fatherId: "",
    motherId: "",
    anchorPersonId: "",
    anchorAgeAtBirth: 0,
    husbandId: "",
    yearsLived: 0,
    biblicalReferences: "",
    notes: "",
  });

  const males = existingPeople.filter((p) => p.gender === "male");
  const females = existingPeople.filter((p) => p.gender === "female");

  // Automatically select Father as anchor when Father changes (if Anchor hasn't been set manually)
  const handleFatherChange = (fatherId: string) => {
    setFormData((prev) => ({
      ...prev,
      fatherId,
      anchorPersonId: prev.anchorPersonId ? prev.anchorPersonId : fatherId,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedAnchor = formData.anchorPersonId || formData.fatherId;

    const newPerson: Person = {
      id: formData.name.toLowerCase().replace(/\s+/g, "-"),
      name: formData.name,
      gender: formData.gender as "male" | "female",
      placeOfBirth: formData.placeOfBirth || undefined,
      fatherId: formData.fatherId || undefined,
      motherId: formData.motherId || undefined,
      anchorPersonId: selectedAnchor || undefined,
      fatherAgeAtBirth: Number(formData.anchorAgeAtBirth) || 0,
      yearsLived: Number(formData.yearsLived) || 0,
      spouseIds: formData.gender === "female" && formData.husbandId ? [formData.husbandId] : [],
      biblicalReferences: formData.biblicalReferences
        ? formData.biblicalReferences.split(",").map((r) => r.trim())
        : [],
      notes: formData.notes,
    };

    onAddPerson(newPerson);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Person</h3>
          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-person-form">
          <div className="form-group">
            <label>Name *</label>
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
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="form-group">
              <label>Place of Birth (Optional)</label>
              <input
                type="text"
                value={formData.placeOfBirth}
                onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
              />
            </div>
          </div>

          {/* Lineage Details */}
          <div className="form-row">
            <div className="form-group">
              <label>Father</label>
              <select
                value={formData.fatherId}
                onChange={(e) => handleFatherChange(e.target.value)}
              >
                <option value="">-- Select Father --</option>
                {males.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Mother (Optional)</label>
              <select
                value={formData.motherId}
                onChange={(e) => setFormData({ ...formData, motherId: e.target.value })}
              >
                <option value="">-- Select Mother --</option>
                {females.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Separate Anchor Person Section */}
          <div className="form-row">
            <div className="form-group">
              <label>Anchor Person (Timeline Reference)</label>
              <select
                value={formData.anchorPersonId}
                onChange={(e) => setFormData({ ...formData, anchorPersonId: e.target.value })}
              >
                <option value="">-- Choose Any Person --</option>
                {existingPeople.map((p) => (
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
              onChange={(e) =>
                setFormData({ ...formData, yearsLived: Number(e.target.value) })
              }
            />
          </div>

          {formData.gender === "female" && (
            <div className="form-group">
              <label>Husband / Spouse (Optional)</label>
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
            <label>Scripture Reference (Comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Genesis 5:3, Genesis 11:10"
              value={formData.biblicalReferences}
              onChange={(e) =>
                setFormData({ ...formData, biblicalReferences: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Notes / Details</label>
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
              Save Person
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}