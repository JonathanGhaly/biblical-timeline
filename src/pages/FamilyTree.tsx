import { computeAllDates } from "../utils/chronology";
import type { Person } from "../types/genealogy";

type FamilyTreeProps = {
  people: Person[];
};

export default function FamilyTree({ people = [] }: FamilyTreeProps) {
  const computedPeople = computeAllDates(people);
  const findPerson = (id?: string) => computedPeople.find((p) => p.id === id);

  // Patriarchs (male lineage roots)
  const patriarchs = computedPeople.filter((p) => p.gender === "male");

  return (
    <div className="page-container">
      <h2>Biblical Lineage & Family Tree</h2>
      <p className="subtitle">
        Hierarchical view distinguishing Parent Generations (Mother & Father) from Current Marriages (Wife) and Children.
      </p>

      <div className="tree-container">
        {patriarchs.map((husband) => {
          // 1. Mother & Father (Parent Generation Above)
          const father = findPerson(husband.fatherId);
          const mother = findPerson(husband.motherId);

          // 2. Wife/Spouses (Current Marriage Generation)
          const wives = husband.spouseIds
            .map((id) => findPerson(id))
            .filter(Boolean);

          // 3. Children (Next Generation Below)
          const children = computedPeople.filter((p) => p.fatherId === husband.id);

          return (
            <div key={husband.id} className="family-unit-card">
              
              {/* PARENT GENERATION (Mother & Father) */}
              <div className="parents-header">
                <span className="section-label">Parents (Prior Generation)</span>
                <div className="parents-row">
                  <div className="parent-pill father">
                    <span className="pill-role">Father</span>
                    <strong>{father ? father.name : "Creation / Root"}</strong>
                  </div>
                  <div className="parent-connector">+</div>
                  <div className="parent-pill mother">
                    <span className="pill-role">Mother</span>
                    <strong>{mother ? mother.name : (husband.fatherId ? "Unrecorded Mother" : "Creation / Root")}</strong>
                  </div>
                </div>
              </div>

              <div className="vertical-tree-line" />

              {/* CURRENT MARRIAGE GENERATION (Husband & Wife) */}
              <div className="marriage-block">
                {/* Husband */}
                <div className="person-box husband-box">
                  <span className="box-role">Husband / Patriarch</span>
                  <h3 className="person-name">{husband.name}</h3>
                  <p className="person-dates">
                    {Math.abs(husband.birthYearBC)} BC – {Math.abs(husband.deathYearBC)} BC
                  </p>
                  <span className="lifespan-badge">{husband.yearsLived} years</span>
                </div>

                <div className="marriage-ring">💍</div>

                {/* Wife/Wives */}
                <div className="wives-container">
                  {wives.length > 0 ? (
                    wives.map((wife) => (
                      <div key={wife!.id} className="person-box wife-box">
                        <span className="box-role">Wife</span>
                        <h3 className="person-name">{wife!.name}</h3>
                        <p className="person-dates">Spouse of {husband.name}</p>
                        {wife!.yearsLived && (
                          <span className="lifespan-badge">{wife!.yearsLived} years</span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="person-box wife-box unrecorded">
                      <span className="box-role">Wife</span>
                      <h3 className="person-name">Unrecorded Wife</h3>
                      <p className="person-dates">Genesis 5 Record</p>
                    </div>
                  )}
                </div>
              </div>

              {/* NEXT GENERATION (Children & Their Mother Link) */}
              {children.length > 0 && (
                <>
                  <div className="vertical-tree-line" />
                  <div className="children-section">
                    <span className="section-label">Children</span>
                    <div className="children-grid">
                      {children.map((child) => {
                        const childMother = findPerson(child.motherId);
                        return (
                          <div key={child.id} className={`child-card ${child.gender}`}>
                            <div className="child-info">
                              <strong className="child-name">{child.name}</strong>
                              <span className="child-gender-tag">{child.gender}</span>
                            </div>
                            <div className="child-mother-badge">
                              Mother: <strong>{childMother ? childMother.name : "Unrecorded"}</strong>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}