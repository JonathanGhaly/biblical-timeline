import type { Person } from "../types/genealogy";

export interface ComputedPerson extends Person {
  birthYearBC?: number;
  deathYearBC?: number;
  anchorAgeUsed?: number;
}

export function computeAllDates(
  people: Person[],
  baseYearBC = 4000
): ComputedPerson[] {
  const map = new Map<string, ComputedPerson>();
  const visiting = new Set<string>();

  function resolvePerson(person: Person): ComputedPerson {
    if (map.has(person.id)) return map.get(person.id)!;

    // Support both anchorPersonId and fatherId
    const refId = person.anchorPersonId || person.fatherId;
    const hasRefAge =
      person.anchorPersonAgeAtBirth !== undefined ||
      person.fatherAgeAtBirth !== undefined;
    const refAge = person.anchorPersonAgeAtBirth ?? person.fatherAgeAtBirth;

    let birthYearBC: number | undefined = undefined;

    if (refId && !visiting.has(refId)) {
      visiting.add(person.id);
      const anchorPerson = people.find((p) => p.id === refId);

      if (anchorPerson) {
        const computedAnchor = resolvePerson(anchorPerson);
        if (computedAnchor.birthYearBC !== undefined && hasRefAge && refAge !== undefined) {
          // BC dates count backwards: birth = reference birth BC minus age at fatherhood
          birthYearBC = computedAnchor.birthYearBC - refAge;
        } else if (computedAnchor.birthYearBC !== undefined) {
          // Child doesn't know when they were born: place them during their father's life
          const fatherLifespan = anchorPerson.yearsLived || 70;
          const siblings = people.filter(
            (p) => (p.fatherId === anchorPerson.id || p.anchorPersonId === anchorPerson.id)
          );
          const sIdx = siblings.findIndex((p) => p.id === person.id);
          const safeIdx = sIdx >= 0 ? sIdx : 0;
          const baseOffset = fatherLifespan > 300 ? 70 : 30;
          const offset = Math.min(fatherLifespan - 15, baseOffset + safeIdx * 5);
          birthYearBC = computedAnchor.birthYearBC - Math.max(18, offset);
        }
      }
      visiting.delete(person.id);
    } else if (person.id.toLowerCase() === "adam" || person.name.toLowerCase() === "adam") {
      // Adam / creation default
      birthYearBC = baseYearBC;
    } else if (person.birth?.year !== undefined) {
      birthYearBC = person.birth.year;
    } else if (!refId) {
      birthYearBC = baseYearBC;
    }

    const deathYearBC =
      birthYearBC !== undefined && person.yearsLived !== undefined
        ? birthYearBC - person.yearsLived
        : person.death?.year;

    const result: ComputedPerson = {
      ...person,
      birthYearBC,
      deathYearBC,
      anchorAgeUsed: hasRefAge ? refAge : undefined,
    };

    map.set(person.id, result);
    return result;
  }

  return people.map((p) => resolvePerson(p));
}