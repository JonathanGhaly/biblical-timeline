import { useState } from "react";
import type { BiblicalEvent, DateInfo, Person } from "../../types/genealogy";

type AddEventModalProps = {
  existingPeople: Person[];
  onAddEvent: (newEvent: BiblicalEvent) => void;
  onClose: () => void;
};

export default function AddEventModal({
  existingPeople = [],
  onAddEvent,
  onClose,
}: AddEventModalProps) {
  const [dateType, setDateType] = useState<"direct" | "anchor">("direct");
  const [formData, setFormData] = useState({
    title: "",
    year: "",
    era: "BC",
    anchorPersonId: "",
    anchorAge: "",
    location: "",
    description: "",
    biblicalReferences: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let computedDate: DateInfo | undefined = undefined;

    if (dateType === "direct" && formData.year) {
      const numericYear = Number(formData.year);
      const signedYear =
        formData.era === "BC" ? -Math.abs(numericYear) : Math.abs(numericYear);
      computedDate = { year: signedYear, precision: "exact" };
    }

    const newEvent: BiblicalEvent = {
      id: formData.title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
      title: formData.title,
      date: computedDate,
      anchorPersonId:
        dateType === "anchor" ? formData.anchorPersonId || undefined : undefined,
      anchorAge:
        dateType === "anchor" && formData.anchorAge
          ? Number(formData.anchorAge)
          : undefined,
      location: formData.location || undefined,
      description: formData.description || undefined,
      biblicalReferences: formData.biblicalReferences
        ? formData.biblicalReferences.split(",").map((r) => r.trim())
        : [],
    };

    onAddEvent(newEvent);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Event</h3>
          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-person-form">
          <div className="form-group">
            <label>Event Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Date Method</label>
            <div className="radio-group" style={{ display: "flex", gap: "16px", margin: "8px 0" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <input
                  type="radio"
                  name="dateType"
                  value="direct"
                  checked={dateType === "direct"}
                  onChange={() => setDateType("direct")}
                />
                Direct Year (e.g. 2348 BC)
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <input
                  type="radio"
                  name="dateType"
                  value="anchor"
                  checked={dateType === "anchor"}
                  onChange={() => setDateType("anchor")}
                />
                Anchor Person + Age
              </label>
            </div>
          </div>

          {dateType === "direct" ? (
            <div className="form-row">
              <div className="form-group">
                <label>Year</label>
                <input
                  type="number"
                  placeholder="e.g. 2348"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Era</label>
                <select
                  value={formData.era}
                  onChange={(e) =>
                    setFormData({ ...formData, era: e.target.value })
                  }
                >
                  <option value="BC">BC</option>
                  <option value="AD">AD</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="form-row">
              <div className="form-group">
                <label>Anchor Person</label>
                <select
                  required
                  value={formData.anchorPersonId}
                  onChange={(e) =>
                    setFormData({ ...formData, anchorPersonId: e.target.value })
                  }
                >
                  <option value="">-- Select Person --</option>
                  {existingPeople.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Person's Age at Event</label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="e.g. 600"
                  value={formData.anchorAge}
                  onChange={(e) =>
                    setFormData({ ...formData, anchorAge: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Location (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Mount Sinai"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Scripture References (Comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Genesis 7:11"
              value={formData.biblicalReferences}
              onChange={(e) =>
                setFormData({ ...formData, biblicalReferences: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}