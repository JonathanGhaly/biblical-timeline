import { useState, useMemo } from "react";
import type { Person, BiblicalEvent } from "../types/genealogy";

type TimelinePageProps = {
  people: Person[];
  events: BiblicalEvent[];
};

type MarriageItem = {
  id: string;
  title: string;
  year: number;
  husbandName: string;
  wifeName: string;
  husbandAge?: number;
  wifeAge?: number;
  references?: string[];
};

type SelectedItem =
  | { type: "person"; data: Person; birthYear: number; deathYear: number }
  | { type: "event"; data: BiblicalEvent }
  | { type: "marriage"; data: MarriageItem };

export default function TimelinePage({ people, events }: TimelinePageProps) {
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const getBirthYear = (
    person: Person,
    peopleList: Person[],
    visited = new Set<string>()
  ): number => {
    const pAny = person as any;

    if (person.birth?.year !== undefined) return person.birth.year;
    if (typeof person.birth === "number") return person.birth;
    if (pAny.birthYear !== undefined) return pAny.birthYear;
    if (pAny.birth_year !== undefined) return pAny.birth_year;
    if (pAny.dateOfBirth?.year !== undefined) return pAny.dateOfBirth.year;

    if (visited.has(person.id)) return -4000;
    visited.add(person.id);

    const anchorId = person.anchorPersonId || person.fatherId || pAny.parentId;
    const ageAtBirth =
      person.anchorPersonAgeAtBirth ?? person.fatherAgeAtBirth ?? pAny.ageAtBirth;

    if (anchorId && ageAtBirth !== undefined) {
      const anchor = peopleList.find((p) => p.id === anchorId);
      if (anchor) {
        return getBirthYear(anchor, peopleList, visited) + Number(ageAtBirth);
      }
    }

    return -4000;
  };

  const peopleWithLifespans = useMemo(() => {
    const list = people.map((person) => {
      const birthYear = getBirthYear(person, people);
      const pAny = person as any;
      const duration =
        person.yearsLived ||
        pAny.lifespan ||
        (person.death?.year !== undefined
          ? person.death.year - birthYear
          : 70);
      const deathYear = birthYear + duration;

      return {
        person,
        birthYear,
        deathYear,
        duration,
      };
    });

    return list.sort((a, b) => a.birthYear - b.birthYear);
  }, [people]);

  const derivedMarriages = useMemo(() => {
    const list: MarriageItem[] = [];
    const processedPairs = new Set<string>();

    peopleWithLifespans.forEach(({ person }) => {
      const spouseId =
        person.gender === "female"
          ? person.husbandId || person.spouseIds?.[0]
          : person.wifeId || person.spouseIds?.[0];

      if (!spouseId) return;

      const spouse = people.find((p) => p.id === spouseId);
      if (!spouse) return;

      const coupleKey = [person.id, spouse.id].sort().join("_");
      if (processedPairs.has(coupleKey)) return;
      processedPairs.add(coupleKey);

      const husband = person.gender === "male" ? person : spouse;
      const wife = person.gender === "female" ? person : spouse;

      const husbandBirth = getBirthYear(husband, people);
      const wifeBirth = getBirthYear(wife, people);

      let marriageYear: number | null = null;
      const husbandAge = husband.husbandMarriageAge;
      const wifeAge = wife.wifeMarriageAge;

      if (husbandAge !== undefined && husbandAge !== null) {
        marriageYear = husbandBirth + Number(husbandAge);
      } else if (wifeAge !== undefined && wifeAge !== null) {
        marriageYear = wifeBirth + Number(wifeAge);
      }

      if (marriageYear !== null) {
        const refs = [
          ...(husband.biblicalReferences || []),
          ...(wife.biblicalReferences || []),
        ];

        list.push({
          id: `marriage_${coupleKey}`,
          title: `${husband.name} & ${wife.name}`,
          year: marriageYear,
          husbandName: husband.name,
          wifeName: wife.name,
          husbandAge: husbandAge !== undefined ? Number(husbandAge) : undefined,
          wifeAge: wifeAge !== undefined ? Number(wifeAge) : undefined,
          references: Array.from(new Set(refs)),
        });
      }
    });

    return list.sort((a, b) => a.year - b.year);
  }, [people, peopleWithLifespans]);

  const validEvents = useMemo(
    () => events.filter((e) => e.date?.year !== undefined),
    [events]
  );

  // Search Filter Logic
  const term = searchTerm.trim().toLowerCase();

  const filteredPeople = useMemo(() => {
    if (!term) return peopleWithLifespans;
    return peopleWithLifespans.filter(({ person }) =>
      person.name.toLowerCase().includes(term) ||
      (person.notes && person.notes.toLowerCase().includes(term)) ||
      (person.biblicalReferences || []).some((r) => r.toLowerCase().includes(term))
    );
  }, [peopleWithLifespans, term]);

  const filteredMarriages = useMemo(() => {
    if (!term) return derivedMarriages;
    return derivedMarriages.filter(
      (m) =>
        m.title.toLowerCase().includes(term) ||
        m.husbandName.toLowerCase().includes(term) ||
        m.wifeName.toLowerCase().includes(term) ||
        (m.references || []).some((r) => r.toLowerCase().includes(term))
    );
  }, [derivedMarriages, term]);

  const filteredEvents = useMemo(() => {
    if (!term) return validEvents;
    return validEvents.filter(
      (e) =>
        e.title.toLowerCase().includes(term) ||
        (e.description && e.description.toLowerCase().includes(term)) ||
        (e.location && e.location.toLowerCase().includes(term)) ||
        (e.biblicalReferences || []).some((r) => r.toLowerCase().includes(term))
    );
  }, [validEvents, term]);

  const { minYear, maxYear, ticks } = useMemo(() => {
    const allYears: number[] = [
      ...peopleWithLifespans.map((p) => p.birthYear),
      ...peopleWithLifespans.map((p) => p.deathYear),
      ...validEvents.map((e) => e.date!.year!),
      ...derivedMarriages.map((m) => m.year),
    ];

    const rawMin = allYears.length ? Math.min(...allYears) : -4000;
    const rawMax = allYears.length ? Math.max(...allYears) : -1000;

    const min = Math.floor(rawMin / 250) * 250;
    const max = Math.ceil(rawMax / 250) * 250;

    const generatedTicks: number[] = [];
    for (let yr = min; yr <= max; yr += 250) {
      generatedTicks.push(yr);
    }

    return { minYear: min, maxYear: max, ticks: generatedTicks };
  }, [peopleWithLifespans, validEvents, derivedMarriages]);

  const totalYears = maxYear - minYear || 1;
  const timelineWidth = 2600;

  const getLeftPx = (year: number) => {
    const ratio = (year - minYear) / totalYears;
    return Math.max(0, Math.min(timelineWidth, ratio * timelineWidth));
  };

  const getWidthPx = (duration: number) => {
    return (duration / totalYears) * timelineWidth;
  };

  const formatYearLabel = (year: number) => {
    return year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;
  };

  return (
    <div className="timeline-page-container" style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "20px",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "bold", margin: "0 0 4px 0", color: "#0f172a" }}>
            Integrated Biblical Timeline
          </h2>
          <p style={{ color: "#64748b", margin: 0, fontSize: "0.95rem" }}>
            Scroll horizontally to explore overlapping lifespans, marriages, and historical events.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search timeline (e.g. Abraham, Genesis, Ur)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px 14px",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            width: "300px",
            fontSize: "0.9rem",
            outline: "none",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        />
      </div>

      <div
        style={{
          overflowX: "auto",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "24px 20px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ position: "relative", width: `${timelineWidth + 180}px` }}>
          {/* Header Axis */}
          <div
            style={{
              display: "flex",
              marginLeft: "150px",
              position: "relative",
              height: "36px",
              borderBottom: "2px solid #cbd5e1",
              marginBottom: "20px",
            }}
          >
            {ticks.map((yr) => (
              <div
                key={yr}
                style={{
                  position: "absolute",
                  left: `${getLeftPx(yr)}px`,
                  transform: "translateX(-50%)",
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  color: "#475569",
                  whiteSpace: "nowrap",
                }}
              >
                {formatYearLabel(yr)}
              </div>
            ))}
          </div>

          {/* Guidelines */}
          <div
            style={{
              position: "absolute",
              top: "36px",
              bottom: 0,
              left: "150px",
              width: `${timelineWidth}px`,
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            {ticks.map((yr) => (
              <div
                key={yr}
                style={{
                  position: "absolute",
                  left: `${getLeftPx(yr)}px`,
                  top: 0,
                  bottom: 0,
                  borderLeft: "1px dashed #e2e8f0",
                }}
              />
            ))}
          </div>

          {/* MAJOR EVENTS */}
          {filteredEvents.length > 0 && (
            <div style={{ position: "relative", zIndex: 1, marginBottom: "32px" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: "800", color: "#334155", letterSpacing: "0.05em", marginBottom: "16px" }}>
                MAJOR EVENTS ({filteredEvents.length})
              </div>
              <div style={{ position: "relative", marginLeft: "150px", width: `${timelineWidth}px`, height: "60px" }}>
                {filteredEvents.map((evt, idx) => {
                  const year = evt.date!.year!;
                  const left = getLeftPx(year);
                  const topOffset = (idx % 2) * 32;

                  return (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedItem({ type: "event", data: evt })}
                      style={{
                        position: "absolute",
                        left: `${left}px`,
                        top: `${topOffset}px`,
                        transform: "translateX(-50%)",
                        background: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "10px",
                        padding: "4px 10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        fontSize: "0.75rem",
                      }}
                    >
                      <span style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", borderRadius: "50%", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem" }}>
                        📍
                      </span>
                      <div>
                        <div style={{ fontWeight: "700", color: "#1e293b", lineHeight: "1.2" }}>{evt.title}</div>
                        <div style={{ fontSize: "0.65rem", color: "#64748b" }}>{formatYearLabel(year)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MARRIAGES & UNIONS */}
          {filteredMarriages.length > 0 && (
            <div style={{ position: "relative", zIndex: 1, marginBottom: "32px" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: "800", color: "#334155", letterSpacing: "0.05em", marginBottom: "16px" }}>
                MARRIAGES & UNIONS ({filteredMarriages.length})
              </div>
              <div style={{ position: "relative", marginLeft: "150px", width: `${timelineWidth}px`, height: "60px" }}>
                {filteredMarriages.map((marriage, idx) => {
                  const left = getLeftPx(marriage.year);
                  const topOffset = (idx % 2) * 32;

                  return (
                    <div
                      key={marriage.id}
                      onClick={() => setSelectedItem({ type: "marriage", data: marriage })}
                      style={{
                        position: "absolute",
                        left: `${left}px`,
                        top: `${topOffset}px`,
                        transform: "translateX(-50%)",
                        background: "#ffffff",
                        border: "1px solid #fbcfe8",
                        borderRadius: "10px",
                        padding: "4px 10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        fontSize: "0.75rem",
                      }}
                    >
                      <span style={{ background: "#fdf2f8", border: "1px solid #f472b6", borderRadius: "50%", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem" }}>
                        💍
                      </span>
                      <div>
                        <div style={{ fontWeight: "700", color: "#831843", lineHeight: "1.2" }}>{marriage.title}</div>
                        <div style={{ fontSize: "0.65rem", color: "#9d174d" }}>{formatYearLabel(marriage.year)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PATRIARCH LIFESPANS */}
          {filteredPeople.length > 0 && (
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "0.8rem", fontWeight: "800", color: "#334155", letterSpacing: "0.05em", marginBottom: "16px" }}>
                PATRIARCH LIFESPANS ({filteredPeople.length})
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {filteredPeople.map(({ person, birthYear, deathYear, duration }) => {
                  const left = getLeftPx(birthYear);
                  const width = Math.max(140, getWidthPx(duration));

                  return (
                    <div key={person.id} style={{ display: "flex", alignItems: "center", height: "30px" }}>
                      <div style={{ width: "140px", flexShrink: 0, paddingRight: "10px", fontSize: "0.85rem", fontWeight: "700", color: "#1e293b", textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {person.name}
                      </div>
                      <div style={{ position: "relative", width: `${timelineWidth}px`, flexShrink: 0, height: "100%" }}>
                        <div
                          onClick={() => setSelectedItem({ type: "person", data: person, birthYear, deathYear })}
                          style={{
                            position: "absolute",
                            left: `${left}px`,
                            width: `${width}px`,
                            height: "28px",
                            background: "#2563eb",
                            color: "#ffffff",
                            borderRadius: "14px",
                            display: "flex",
                            alignItems: "center",
                            padding: "0 12px",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                          }}
                        >
                          {person.name} ({formatYearLabel(birthYear)} - {formatYearLabel(deathYear)} | {duration} yrs)
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Item Details Overlay */}
      {selectedItem && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          onClick={() => setSelectedItem(null)}
        >
          <div
            style={{ background: "#ffffff", borderRadius: "12px", padding: "24px", maxWidth: "500px", width: "90%", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a" }}>
                {selectedItem.type === "person"
                  ? selectedItem.data.name
                  : selectedItem.type === "marriage"
                  ? `Marriage: ${selectedItem.data.title}`
                  : selectedItem.data.title}
              </h3>
              <button onClick={() => setSelectedItem(null)} style={{ background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer", color: "#64748b" }}>
                ✕
              </button>
            </div>

            {selectedItem.type === "person" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.9rem", color: "#334155" }}>
                <p style={{ margin: 0 }}><strong>Gender:</strong> {selectedItem.data.gender}</p>
                <p style={{ margin: 0 }}><strong>Born:</strong> {formatYearLabel(selectedItem.birthYear)}</p>
                <p style={{ margin: 0 }}><strong>Died:</strong> {formatYearLabel(selectedItem.deathYear)}</p>
                {selectedItem.data.yearsLived && <p style={{ margin: 0 }}><strong>Lifespan:</strong> {selectedItem.data.yearsLived} years</p>}
                {selectedItem.data.placeOfBirth && <p style={{ margin: 0 }}><strong>Birthplace:</strong> {selectedItem.data.placeOfBirth}</p>}
                {selectedItem.data.notes && <p style={{ margin: 0 }}><strong>Notes:</strong> {selectedItem.data.notes}</p>}
                {(selectedItem.data.biblicalReferences || []).length > 0 && (
                  <p style={{ margin: 0 }}>
                    <strong>References:</strong> {(selectedItem.data.biblicalReferences || []).join(", ")}
                  </p>
                )}
              </div>
            )}

            {selectedItem.type === "marriage" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.9rem", color: "#334155" }}>
                <p style={{ margin: 0 }}><strong>Date:</strong> {formatYearLabel(selectedItem.data.year)}</p>
                <p style={{ margin: 0 }}><strong>Husband:</strong> {selectedItem.data.husbandName} {selectedItem.data.husbandAge !== undefined ? `(Age ${selectedItem.data.husbandAge})` : ""}</p>
                <p style={{ margin: 0 }}><strong>Wife:</strong> {selectedItem.data.wifeName} {selectedItem.data.wifeAge !== undefined ? `(Age ${selectedItem.data.wifeAge})` : ""}</p>
                {(selectedItem.data.references || []).length > 0 && (
                  <p style={{ margin: 0 }}>
                    <strong>References:</strong> {(selectedItem.data.references || []).join(", ")}
                  </p>
                )}
              </div>
            )}

            {selectedItem.type === "event" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.9rem", color: "#334155" }}>
                {selectedItem.data.date?.year !== undefined && (
                  <p style={{ margin: 0 }}><strong>Date:</strong> {formatYearLabel(selectedItem.data.date.year)}</p>
                )}
                {selectedItem.data.location && <p style={{ margin: 0 }}><strong>Location:</strong> {selectedItem.data.location}</p>}
                {selectedItem.data.description && <p style={{ margin: 0 }}>{selectedItem.data.description}</p>}
                {(selectedItem.data.personIds || []).length > 0 && (
                  <p style={{ margin: 0 }}>
                    <strong>People:</strong>{" "}
                    {(selectedItem.data.personIds || [])
                      .map((id) => people.find((p) => p.id === id)?.name || id)
                      .join(", ")}
                  </p>
                )}
                {(selectedItem.data.biblicalReferences || []).length > 0 && (
                  <p style={{ margin: 0 }}>
                    <strong>References:</strong> {(selectedItem.data.biblicalReferences || []).join(", ")}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}