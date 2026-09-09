import type { Person, BiblicalEvent } from "../../types/genealogy";

export interface TimelinePersonItem {
  person: Person;
  birthYear: number;
  deathYear: number;
  duration: number;
  startYear: number;
  endYear: number;
  laneIndex?: number;
  isEstimatedBirth?: boolean;
  fatherId?: string;
  fatherName?: string;
}

export interface TimelineMarriageItem {
  id: string;
  title: string;
  arabicTitle: string;
  year: number;
  startYear: number;
  endYear: number;
  husbandName: string;
  wifeName: string;
  husbandAge?: number;
  wifeAge?: number;
  references?: string[];
  description?: string;
  arabicDescription?: string;
  laneIndex?: number;
}

export interface TimelineEventItem {
  event: BiblicalEvent;
  year: number;
  startYear: number;
  endYear: number;
  laneIndex?: number;
}

export type TimelineSelectedItem =
  | { type: "person"; data: Person; birthYear: number; deathYear: number; isEstimatedBirth?: boolean; fatherName?: string }
  | { type: "marriage"; data: TimelineMarriageItem }
  | { type: "event"; data: BiblicalEvent };

export type TimelineViewMode = "compact" | "expanded";

export type EraId = "all" | "antediluvian" | "patriarchs" | "exodus" | "monarchy";

export interface EraDefinition {
  id: EraId;
  labelKey: string;
  minYear: number;
  maxYear: number;
  descriptionEn: string;
  descriptionAr: string;
}

export const BIBLICAL_ERAS: EraDefinition[] = [
  {
    id: "all",
    labelKey: "allEras",
    minYear: -4004,
    maxYear: -400,
    descriptionEn: "From the Creation of Adam down through the Kings & Prophets (~4000 to ~400 BC)",
    descriptionAr: "من بدء الخليقة وآدم مروراً بالآباء والملوك والأنبياء (~4000 إلى ~400 ق.م)",
  },
  {
    id: "antediluvian",
    labelKey: "eraAntediluvian",
    minYear: -4004,
    maxYear: -2348,
    descriptionEn: "From Adam through Seth, Enoch, Methuselah, and the Great Flood of Noah",
    descriptionAr: "من آدم وشيث وأخنوخ ومتوشالح وحتى طوفان نوح العظيم",
  },
  {
    id: "patriarchs",
    labelKey: "eraPatriarchs",
    minYear: -2348,
    maxYear: -1700,
    descriptionEn: "From Noah & Shem to Abraham, Isaac, Jacob, and Joseph in Egypt",
    descriptionAr: "من نوح وسام إلى إبراهيم وإسحق ويعقوب ويوسف في أرض مصر",
  },
  {
    id: "exodus",
    labelKey: "eraExodus",
    minYear: -1700,
    maxYear: -1050,
    descriptionEn: "Moses, Aaron, Joshua, and the period of the Judges in Canaan",
    descriptionAr: "موسى وهارون ويشوع وحقبة القضاة في كنعان",
  },
  {
    id: "monarchy",
    labelKey: "eraMonarchy",
    minYear: -1050,
    maxYear: -400,
    descriptionEn: "Saul, King David, Solomon, the Temple, and Old Testament Prophets",
    descriptionAr: "شاول والملك داود وسليمان والهيكل وأنبياء العهد القديم",
  },
];

/**
 * Checks if a person's birth year is estimated from their father
 * (i.e. neither birth.year nor fatherAgeAtBirth was explicitly recorded)
 */
export const isBirthYearEstimated = (person: Person): boolean => {
  const pAny = person as any;
  if (
    person.birth?.year !== undefined ||
    typeof person.birth === "number" ||
    pAny.birthYear !== undefined ||
    pAny.birth_year !== undefined ||
    pAny.dateOfBirth?.year !== undefined
  ) {
    return false;
  }
  const ageAtBirth =
    person.anchorPersonAgeAtBirth ??
    person.fatherAgeAtBirth ??
    pAny.ageAtBirth ??
    pAny.father_age_at_birth;
  return ageAtBirth === undefined || ageAtBirth === null || isNaN(Number(ageAtBirth));
};

export const getBirthYear = (
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

  if (visited.has(person.id)) return -4004;
  visited.add(person.id);

  const parentId =
    person.anchorPersonId ||
    person.fatherId ||
    pAny.parentId ||
    pAny.father_id ||
    person.motherId;

  const ageAtBirth =
    person.anchorPersonAgeAtBirth ??
    person.fatherAgeAtBirth ??
    pAny.ageAtBirth ??
    pAny.father_age_at_birth;

  if (parentId) {
    const parent = peopleList.find((p) => p.id === parentId);
    if (parent) {
      const parentBirth = getBirthYear(parent, peopleList, visited);

      // If father's age at child's birth is known:
      if (ageAtBirth !== undefined && ageAtBirth !== null && !isNaN(Number(ageAtBirth))) {
        return parentBirth + Number(ageAtBirth);
      }

      // If birth date is NOT known: put the child during their father's lifespan (under their father)
      const parentLifespan = parent.yearsLived || (parent as any).lifespan || 70;

      // Check siblings under the same father to order them chronologically
      const siblings = peopleList.filter(
        (p) =>
          p.fatherId === parent.id ||
          p.anchorPersonId === parent.id ||
          (p as any).parentId === parent.id
      );
      const childIdx = siblings.findIndex((p) => p.id === person.id);
      const safeIdx = childIdx >= 0 ? childIdx : 0;

      let baseOffset = 30;
      let stepOffset = 4;
      if (parentLifespan > 300) {
        // Antediluvian patriarchs lived 900+ years and had children around 65-130
        baseOffset = Math.min(130, Math.max(65, Math.round(parentLifespan * 0.12)));
        stepOffset = 12;
      } else if (parentLifespan > 150) {
        baseOffset = 40;
        stepOffset = 6;
      }

      const offset = baseOffset + safeIdx * stepOffset;
      const cappedOffset = Math.min(Math.max(18, offset), Math.max(25, parentLifespan - 10));
      return parentBirth + cappedOffset;
    }
  }

  // If spouse is known, place close to spouse
  const spouseId = person.wifeId || person.husbandId || person.spouseIds?.[0];
  if (spouseId) {
    const spouse = peopleList.find((p) => p.id === spouseId);
    if (spouse) {
      const spouseBirth = getBirthYear(spouse, peopleList, visited);
      return spouseBirth + 2;
    }
  }

  // Adam / default
  return -4004;
};

/**
 * Packs interval items into the minimum number of parallel lanes.
 * Supports a preferredLane callback to place children in lanes directly under their father!
 */
export function packIntoLanes<T extends { startYear: number; endYear: number; laneIndex?: number }>(
  items: T[],
  bufferYears: number = 20,
  getPreferredLane?: (item: T, lanes: { items: T[]; lastEndYear: number }[]) => number | undefined
): { lanes: T[][]; laneCount: number } {
  if (items.length === 0) {
    return { lanes: [], laneCount: 0 };
  }

  // Sort ascending by chronological order (early years are more negative)
  const sorted = [...items].sort((a, b) => a.startYear - b.startYear || a.endYear - b.endYear);

  const lanes: { items: T[]; lastEndYear: number }[] = [];

  for (const item of sorted) {
    let placed = false;

    // Check if item has a preferred lane (e.g. directly below its father's lane)
    if (getPreferredLane) {
      const pref = getPreferredLane(item, lanes);
      if (pref !== undefined && pref >= 0) {
        // Ensure lanes up to pref exist
        while (lanes.length <= pref) {
          lanes.push({ items: [], lastEndYear: -99999 });
        }
        const targetLane = lanes[pref];
        if (item.startYear >= targetLane.lastEndYear + bufferYears) {
          item.laneIndex = pref;
          targetLane.items.push(item);
          targetLane.lastEndYear = Math.max(targetLane.lastEndYear, item.endYear);
          placed = true;
        }
      }
    }

    // Otherwise find first available lane
    if (!placed) {
      for (let i = 0; i < lanes.length; i++) {
        const lane = lanes[i];
        if (item.startYear >= lane.lastEndYear + bufferYears) {
          item.laneIndex = i;
          lane.items.push(item);
          lane.lastEndYear = Math.max(lane.lastEndYear, item.endYear);
          placed = true;
          break;
        }
      }
    }

    if (!placed) {
      const newLaneIndex = lanes.length;
      item.laneIndex = newLaneIndex;
      lanes.push({
        items: [item],
        lastEndYear: item.endYear,
      });
    }
  }

  return {
    lanes: lanes.map((l) => l.items),
    laneCount: lanes.length,
  };
}

export function deriveMarriages(
  people: Person[],
  peopleWithLifespans: TimelinePersonItem[]
): TimelineMarriageItem[] {
  const list: TimelineMarriageItem[] = [];
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

      const hNameEn = husband.name;
      const hNameAr = husband.arabicName || husband.name;
      const wNameEn = wife.name;
      const wNameAr = wife.arabicName || wife.name;

      list.push({
        id: `marriage_${coupleKey}`,
        title: `Marriage of ${hNameEn} & ${wNameEn}`,
        arabicTitle: `زواج ${hNameAr} و${wNameAr}`,
        year: marriageYear,
        startYear: marriageYear,
        endYear: marriageYear + 25, // Give it a slight duration for collision spacing
        husbandName: hNameEn,
        wifeName: wNameEn,
        husbandAge: husbandAge !== undefined ? Number(husbandAge) : undefined,
        wifeAge: wifeAge !== undefined ? Number(wifeAge) : undefined,
        description: `Marriage union between ${hNameEn} and ${wNameEn}.`,
        arabicDescription: `اقتران الزواج بين ${hNameAr} و${wNameAr}.`,
        references: Array.from(new Set(refs)),
      });
    }
  });

  return list.sort((a, b) => a.year - b.year);
}

export function generateTicks(minYear: number, maxYear: number): number[] {
  const span = maxYear - minYear;
  let step = 250;

  if (span > 3000) step = 500;
  else if (span > 1500) step = 250;
  else if (span > 800) step = 100;
  else if (span > 400) step = 50;
  else step = 25;

  const roundedMin = Math.floor(minYear / step) * step;
  const roundedMax = Math.ceil(maxYear / step) * step;

  const ticks: number[] = [];
  for (let yr = roundedMin; yr <= roundedMax; yr += step) {
    ticks.push(yr);
  }
  return ticks;
}
