import type { Person, BiblicalEvent } from "../types/genealogy";
import { getBirthYear } from "../components/Timeline/timelineUtils";

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

  // Ensure base creation year is negative (e.g. -4000 for 4000 BC)
  const creationYear = -Math.abs(baseYearBC);

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
          // Negative BC dates advance chronologically towards 0 (e.g. -4000 + 130 = -3870 BC)
          birthYearBC = computedAnchor.birthYearBC + Number(refAge);
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
          birthYearBC = computedAnchor.birthYearBC + Math.max(18, offset);
        }
      }
      visiting.delete(person.id);
    } else if (person.id.toLowerCase() === "adam" || person.name.toLowerCase() === "adam") {
      // Adam / creation default
      birthYearBC = creationYear;
    } else if (person.birth?.year !== undefined) {
      // In biblical genealogy, dates are BC (negative)
      birthYearBC = person.birth.year < 0 ? person.birth.year : -person.birth.year;
    } else if (!refId) {
      birthYearBC = creationYear;
    }

    const deathYearBC =
      birthYearBC !== undefined && person.yearsLived !== undefined
        ? birthYearBC + Number(person.yearsLived)
        : person.death?.year !== undefined
        ? (person.death.year < 0 ? person.death.year : -person.death.year)
        : undefined;

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

/**
 * Calculates historical year (signed: negative for BC, positive for AD)
 * based on an anchor person's computed birth date and their age at the event.
 */
export function calculateAnchorEventYear(
  anchorPersonId: string,
  anchorAge: number,
  people: Person[]
): number | undefined {
  if (!anchorPersonId || isNaN(Number(anchorAge))) return undefined;
  const anchor = people.find((p) => p.id === anchorPersonId);
  if (!anchor) return undefined;

  const birthYear = getBirthYear(anchor, people);
  if (birthYear === undefined || isNaN(birthYear)) return undefined;

  // birthYear is signed: negative for BC, positive for AD.
  // When an event happens at age N, year advances chronologically (towards 0 and into AD):
  let eventYear = birthYear + Number(anchorAge);
  if (birthYear < 0 && eventYear >= 0) {
    eventYear += 1; // No year zero in biblical/astronomical calendar
  }
  return eventYear;
}

/**
 * Resolves the effective year for an event:
 * Returns the explicit date.year if present, or calculates from anchor person and age.
 */
export function resolveEventYear(
  event: BiblicalEvent,
  people: Person[]
): number | undefined {
  if (event.date?.year !== undefined && !isNaN(Number(event.date.year))) {
    return Number(event.date.year);
  }
  const anchorId = event.anchorPersonId;
  const age =
    event.anchorAge ??
    event.anchorPersonAgeAtEvent ??
    event.anchorPersonAgeAtBirth;
  if (anchorId && age !== undefined && !isNaN(Number(age))) {
    return calculateAnchorEventYear(anchorId, Number(age), people);
  }
  return undefined;
}
