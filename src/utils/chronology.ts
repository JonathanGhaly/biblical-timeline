import type { Person } from "../types/genealogy";

export interface ComputedPerson extends Person {
  birthYearBC: number;
  deathYearBC: number;
  anchorAgeUsed: number;
}

export function computeAllDates(
  people: Person[],
  baseYearBC = 4000
): ComputedPerson[] {
  const map = new Map<string, ComputedPerson>();
  const visiting = new Set<string>();

  function resolvePerson(person: Person): ComputedPerson {
    if (map.has(person.id)) return map.get(person.id)!;

    // Fallback default: Root creation year (4000 BC)
    let birthYearBC = baseYearBC;

    // Support both anchorPersonId and fatherId
    const refId = person.anchorPersonId || person.fatherId;
    const refAge = person.anchorPersonAgeAtBirth ?? person.fatherAgeAtBirth ?? 0;

    if (refId && !visiting.has(refId)) {
      visiting.add(person.id);
      const anchorPerson = people.find((p) => p.id === refId);

      if (anchorPerson) {
        const computedAnchor = resolvePerson(anchorPerson);
        // BC dates count backwards: birth = reference birth BC minus age at fatherhood
        birthYearBC = computedAnchor.birthYearBC - refAge;
      }
      visiting.delete(person.id);
    }

    const lifespan = person.yearsLived || 0;
    const deathYearBC = birthYearBC - lifespan;

    const result: ComputedPerson = {
      ...person,
      birthYearBC,
      deathYearBC,
      anchorAgeUsed: refAge,
    };

    map.set(person.id, result);
    return result;
  }

  return people.map((p) => resolvePerson(p));
}