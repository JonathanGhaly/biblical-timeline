import type { BiblicalEvent, Person, Language } from "../types/genealogy";
import { computeAllDates } from "./chronology";

export type MillenniumId =
  | "all"
  | "5th-bc"
  | "4th-bc"
  | "3rd-bc"
  | "2nd-bc"
  | "1st-bc"
  | "1st-ad"
  | "undated";

export interface MillenniumDefinition {
  id: MillenniumId;
  nameEn: string;
  nameAr: string;
  spanEn: string;
  spanAr: string;
  shortLabelEn: string;
  shortLabelAr: string;
  minYear?: number;
  maxYear?: number;
  order: number;
}

export const BASE_MILLENNIA: MillenniumDefinition[] = [
  {
    id: "4th-bc",
    nameEn: "4th Millennium BC",
    nameAr: "الألفية الرابعة ق.م",
    spanEn: "4000 – 3001 BC",
    spanAr: "4000 – 3001 ق.م",
    shortLabelEn: "4th Mill. BC",
    shortLabelAr: "الألفية 4 ق.م",
    minYear: -4000,
    maxYear: -3001,
    order: 1,
  },
  {
    id: "3rd-bc",
    nameEn: "3rd Millennium BC",
    nameAr: "الألفية الثالثة ق.م",
    spanEn: "3000 – 2001 BC",
    spanAr: "3000 – 2001 ق.م",
    shortLabelEn: "3rd Mill. BC",
    shortLabelAr: "الألفية 3 ق.م",
    minYear: -3000,
    maxYear: -2001,
    order: 2,
  },
  {
    id: "2nd-bc",
    nameEn: "2nd Millennium BC",
    nameAr: "الألفية الثانية ق.م",
    spanEn: "2000 – 1001 BC",
    spanAr: "2000 – 1001 ق.م",
    shortLabelEn: "2nd Mill. BC",
    shortLabelAr: "الألفية 2 ق.م",
    minYear: -2000,
    maxYear: -1001,
    order: 3,
  },
  {
    id: "1st-bc",
    nameEn: "1st Millennium BC",
    nameAr: "الألفية الأولى ق.م",
    spanEn: "1000 – 1 BC",
    spanAr: "1000 – 1 ق.م",
    shortLabelEn: "1st Mill. BC",
    shortLabelAr: "الألفية 1 ق.م",
    minYear: -1000,
    maxYear: -1,
    order: 4,
  },
  {
    id: "1st-ad",
    nameEn: "1st Millennium AD",
    nameAr: "الألفية الأولى م",
    spanEn: "1 – 1000 AD",
    spanAr: "1 – 1000 م",
    shortLabelEn: "1st Mill. AD",
    shortLabelAr: "الألفية 1 م",
    minYear: 1,
    maxYear: 1000,
    order: 5,
  },
];

/**
 * Returns the effective historical year (negative for BC, positive for AD) for a biblical event.
 */
export function getEventEffectiveYear(
  event: BiblicalEvent,
  people: Person[]
): number | undefined {
  if (event.date?.year !== undefined) {
    return event.date.year;
  }
  if (event.anchorPersonId) {
    const computed = computeAllDates(people);
    const anchor = computed.find((p) => p.id === event.anchorPersonId);
    if (anchor && anchor.birthYearBC !== undefined) {
      const age = event.anchorAge ?? event.anchorPersonAgeAtEvent ?? 0;
      // In timeline BC coordinates: birthYearBC is positive BC, so historical year is -(birthYearBC - age)
      return -(anchor.birthYearBC - age);
    }
  }
  return undefined;
}

/**
 * Maps an effective year to its corresponding MillenniumId.
 */
export function getMillenniumIdForYear(year: number | undefined): MillenniumId {
  if (year === undefined) return "undated";
  if (year <= -4001) return "5th-bc";
  if (year >= -4000 && year <= -3001) return "4th-bc";
  if (year >= -3000 && year <= -2001) return "3rd-bc";
  if (year >= -2000 && year <= -1001) return "2nd-bc";
  if (year >= -1000 && year <= -1) return "1st-bc";
  if (year >= 1 && year <= 1000) return "1st-ad";
  return "undated";
}

export interface MillenniumSummaryItem {
  definition: MillenniumDefinition;
  count: number;
  percentage: number;
}

/**
 * Computes the complete list of millennia tabs along with event counts and percentages.
 */
export function computeMillenniumSummaries(
  events: BiblicalEvent[],
  people: Person[]
): {
  totalEvents: number;
  summaries: MillenniumSummaryItem[];
  allMillenniaCount: number;
  eventMillenniumMap: Map<string, MillenniumId>;
} {
  const eventMillenniumMap = new Map<string, MillenniumId>();
  const counts: Record<MillenniumId, number> = {
    all: events.length,
    "5th-bc": 0,
    "4th-bc": 0,
    "3rd-bc": 0,
    "2nd-bc": 0,
    "1st-bc": 0,
    "1st-ad": 0,
    undated: 0,
  };

  for (const ev of events) {
    const year = getEventEffectiveYear(ev, people);
    const mId = getMillenniumIdForYear(year);
    eventMillenniumMap.set(ev.id, mId);
    counts[mId] = (counts[mId] || 0) + 1;
  }

  const list: MillenniumDefinition[] = [...BASE_MILLENNIA];

  // If there are events in the 5th Millennium BC, prepend it
  if (counts["5th-bc"] > 0) {
    list.unshift({
      id: "5th-bc",
      nameEn: "5th Millennium BC",
      nameAr: "الألفية الخامسة ق.م",
      spanEn: "5000 – 4001 BC",
      spanAr: "5000 – 4001 ق.م",
      shortLabelEn: "5th Mill. BC",
      shortLabelAr: "الألفية 5 ق.م",
      minYear: -5000,
      maxYear: -4001,
      order: 0,
    });
  }

  // If there are undated events, append them
  if (counts["undated"] > 0) {
    list.push({
      id: "undated",
      nameEn: "Undated / Anchor Events",
      nameAr: "أحداث بأعمار مقترنة",
      spanEn: "Relative Anchors",
      spanAr: "تواريخ نسبية",
      shortLabelEn: "Undated",
      shortLabelAr: "غير محدد",
      order: 99,
    });
  }

  const summaries: MillenniumSummaryItem[] = list.map((def) => {
    const c = counts[def.id] || 0;
    const pct = events.length > 0 ? Math.round((c / events.length) * 100) : 0;
    return {
      definition: def,
      count: c,
      percentage: pct,
    };
  });

  return {
    totalEvents: events.length,
    summaries,
    allMillenniaCount: events.length,
    eventMillenniumMap,
  };
}

export function getMillenniumDisplayLabel(
  def: MillenniumDefinition,
  lang: Language
): string {
  return lang === "ar" ? def.nameAr : def.nameEn;
}

export function getMillenniumSpanDisplay(
  def: MillenniumDefinition,
  lang: Language
): string {
  return lang === "ar" ? def.spanAr : def.spanEn;
}
