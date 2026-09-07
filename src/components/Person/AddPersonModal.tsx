import { useState } from "react";
import type { Person } from "../../types/genealogy";

export type AddPersonModalProps = {
  existingPeople?: Person[];
  people?: Person[];
  isOpen?: boolean;
  onClose: () => void;
  onAddPerson?: (newPerson: Person) => void;
  onSave?: (newPerson: Partial<Person>) => void;
  onSavePerson?: (newPerson: Person) => void;
};

export default function AddPersonModal({
  existingPeople,
  people,
  isOpen = true,
  onClose,
  onAddPerson,
  onSave,
  onSavePerson,
}: AddPersonModalProps) {
  const personList = existingPeople || people || [];

  const [formData, setFormData] = useState<Partial<Person>>({
    name: "",
    gender: "female",
    husbandId: "",
    wifeId: "",
    husbandMarriageAge: undefined,
    wifeMarriageAge: undefined,
    fatherId: "",
    fatherAgeAtBirth: undefined,
    yearsLived: undefined,
    notes: "",
  });

  if (!isOpen) return null;

  const malePeople = personList.filter((p) => p.gender === "male");
  const femalePeople = personList.filter((p) => p.gender === "female");
  const hasSpouse = Boolean(formData.husbandId || formData.wifeId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPerson: Person = {
      id: formData.id || `person_${Date.now()}`,
      name: formData.name || "Unknown",
      gender: formData.gender || "female",
      ...formData,
    };

    if (onAddPerson) onAddPerson(newPerson);
    if (onSavePerson) onSavePerson(newPerson);
    if (onSave) onSave(formData);
    onClose();
  };

  return (
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
      onClick={onClose}
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
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a" }}>Add Person</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem" }}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "bold", marginBottom: "4px" }}>
              Name
            </label>
            <input
              type="text"
              required
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "bold", marginBottom: "4px" }}>
              Gender
            </label>
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
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>

          {formData.gender === "female" ? (
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "bold", marginBottom: "4px" }}>
                Husband / Spouse
              </label>
              <select
                value={formData.husbandId || ""}
                onChange={(e) => setFormData({ ...formData, husbandId: e.target.value || undefined })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
              >
                <option value="">None / Unknown</option>
                {malePeople.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "bold", marginBottom: "4px" }}>
                Wife / Spouse
              </label>
              <select
                value={formData.wifeId || ""}
                onChange={(e) => setFormData({ ...formData, wifeId: e.target.value || undefined })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
              >
                <option value="">None / Unknown</option>
                {femalePeople.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {hasSpouse && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                background: "#f8fafc",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "bold", marginBottom: "4px" }}>
                  Husband's Age at Marriage
                </label>
                <input
                  type="number"
                  placeholder="e.g. 40"
                  value={formData.husbandMarriageAge ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      husbandMarriageAge: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "bold", marginBottom: "4px" }}>
                  Wife's Age at Marriage
                </label>
                <input
                  type="number"
                  placeholder="e.g. 20"
                  value={formData.wifeMarriageAge ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      wifeMarriageAge: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "bold", marginBottom: "4px" }}>
              Lifespan (Years Lived)
            </label>
            <input
              type="number"
              placeholder="e.g. 127"
              value={formData.yearsLived ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  yearsLived: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "12px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: "8px 16px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ padding: "8px 16px", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: "6px", fontWeight: "bold" }}
            >
              Save Person
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}