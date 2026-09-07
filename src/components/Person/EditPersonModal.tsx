import { useState, useEffect } from "react";
import type { Person } from "../../types/genealogy";

export type EditPersonModalProps = {
  person: Person | null;
  existingPeople?: Person[];
  people?: Person[];
  isOpen?: boolean;
  onClose: () => void;
  onSavePerson?: (updatedPerson: Person) => void;
  onSave?: (updatedPerson: Person) => void;
  onAddPerson?: (person: Person) => void;
};

export default function EditPersonModal({
  person,
  existingPeople,
  people,
  isOpen = true,
  onClose,
  onSavePerson,
  onSave,
}: EditPersonModalProps) {
  const personList = existingPeople || people || [];

  const [formData, setFormData] = useState({
    name: "",
    gender: "male" as "male" | "female",
    placeOfBirth: "",
    fatherId: "",
    motherId: "",
    anchorPersonId: "",
    anchorAgeAtBirth: 0,
    husbandId: "",
    wifeId: "",
    husbandMarriageAge: "" as string | number,
    wifeMarriageAge: "" as string | number,
    yearsLived: 0,
    biblicalReferences: "",
    notes: "",
  });

  useEffect(() => {
    if (person) {
      const existingSpouseId = person.spouseIds?.[0] || "";
      setFormData({
        name: person.name || "",
        gender: person.gender || "male",
        placeOfBirth: person.placeOfBirth || "",
        fatherId: person.fatherId || "",
        motherId: person.motherId || "",
        anchorPersonId: person.anchorPersonId || "",
        anchorAgeAtBirth: person.anchorPersonAgeAtBirth ?? person.fatherAgeAtBirth ?? 0,
        husbandId: person.husbandId || (person.gender === "female" ? existingSpouseId : ""),
        wifeId: person.wifeId || (person.gender === "male" ? existingSpouseId : ""),
        husbandMarriageAge: person.husbandMarriageAge ?? "",
        wifeMarriageAge: person.wifeMarriageAge ?? "",
        yearsLived: person.yearsLived ?? 0,
        biblicalReferences: person.biblicalReferences ? person.biblicalReferences.join(", ") : "",
        notes: person.notes || "",
      });
    }
  }, [person]);

  if (!isOpen || !person) return null;

  const males = personList.filter((p) => p.gender === "male" && p.id !== person.id);
  const females = personList.filter((p) => p.gender === "female" && p.id !== person.id);
  const availableAnchors = personList.filter((p) => p.id !== person.id);
  const hasSpouse = Boolean(formData.husbandId || formData.wifeId);

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
    const spouseId = formData.gender === "female" ? formData.husbandId : formData.wifeId;

    const updatedPerson: Person = {
      ...person,
      name: formData.name,
      gender: formData.gender,
      placeOfBirth: formData.placeOfBirth || undefined,
      fatherId: formData.fatherId || undefined,
      motherId: formData.motherId || undefined,
      anchorPersonId: selectedAnchor || undefined,
      anchorPersonAgeAtBirth: Number(formData.anchorAgeAtBirth) || undefined,
      fatherAgeAtBirth: Number(formData.anchorAgeAtBirth) || undefined,
      husbandId: formData.husbandId || undefined,
      wifeId: formData.wifeId || undefined,
      husbandMarriageAge:
        formData.husbandMarriageAge !== "" ? Number(formData.husbandMarriageAge) : undefined,
      wifeMarriageAge:
        formData.wifeMarriageAge !== "" ? Number(formData.wifeMarriageAge) : undefined,
      yearsLived: Number(formData.yearsLived) || undefined,
      spouseIds: spouseId ? [spouseId] : person.spouseIds || [],
      biblicalReferences: formData.biblicalReferences
        ? formData.biblicalReferences.split(",").map((r) => r.trim()).filter(Boolean)
        : [],
      notes: formData.notes || undefined,
    };

    if (onSavePerson) onSavePerson(updatedPerson);
    if (onSave) onSave(updatedPerson);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Person</h3>
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gender: e.target.value as "male" | "female",
                    husbandId: "",
                    wifeId: "",
                  })
                }
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

          {/* Anchor Person Section */}
          <div className="form-row">
            <div className="form-group">
              <label>Anchor Person (Timeline Reference)</label>
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
              onChange={(e) =>
                setFormData({ ...formData, yearsLived: Number(e.target.value) })
              }
            />
          </div>

          {/* Spouse Selection */}
          {formData.gender === "female" ? (
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
          ) : (
            <div className="form-group">
              <label>Wife / Spouse (Optional)</label>
              <select
                value={formData.wifeId}
                onChange={(e) => setFormData({ ...formData, wifeId: e.target.value })}
              >
                <option value="">-- Select Wife --</option>
                {females.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Marriage Ages (Visible when a Spouse is selected) */}
          {hasSpouse && (
            <div className="form-row">
              <div className="form-group">
                <label>Husband's Age at Marriage</label>
                <input
                  type="number"
                  placeholder="e.g. 40"
                  min="0"
                  value={formData.husbandMarriageAge}
                  onChange={(e) =>
                    setFormData({ ...formData, husbandMarriageAge: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Wife's Age at Marriage</label>
                <input
                  type="number"
                  placeholder="e.g. 20"
                  min="0"
                  value={formData.wifeMarriageAge}
                  onChange={(e) =>
                    setFormData({ ...formData, wifeMarriageAge: e.target.value })
                  }
                />
              </div>
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}