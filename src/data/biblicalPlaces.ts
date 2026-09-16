import type { BiblicalPlace, PlaceType, PlaceCertainty } from "../types/biblicalPlace";
import { LEVANT_PLACES } from "./places/levant";
import { EGYPT_SINAI_PLACES } from "./places/egyptSinai";
import { MESOPOTAMIA_PLACES } from "./places/mesopotamia";
import { PERSIA_MEDIA_PLACES } from "./places/persiaMedia";
import { ANATOLIA_MED_ARABIA_PLACES } from "./places/anatoliaMedArabia";
import type { Language } from "../types/genealogy";

export * from "../types/biblicalPlace";

export const ALL_BIBLICAL_PLACES: BiblicalPlace[] = [
  ...LEVANT_PLACES,
  ...EGYPT_SINAI_PLACES,
  ...MESOPOTAMIA_PLACES,
  ...PERSIA_MEDIA_PLACES,
  ...ANATOLIA_MED_ARABIA_PLACES,
];

export const BIBLICAL_PLACES_BY_ID: Record<string, BiblicalPlace> = ALL_BIBLICAL_PLACES.reduce(
  (acc, place) => {
    acc[place.id] = place;
    return acc;
  },
  {} as Record<string, BiblicalPlace>
);

export function getPlaceById(id: string): BiblicalPlace | undefined {
  return BIBLICAL_PLACES_BY_ID[id];
}

export function searchBiblicalPlaces(query: string): BiblicalPlace[] {
  if (!query || !query.trim()) return ALL_BIBLICAL_PLACES;
  const q = query.trim().toLowerCase();

  return ALL_BIBLICAL_PLACES.filter((p) => {
    if (p.name.toLowerCase().includes(q)) return true;
    if (p.arabicName && p.arabicName.toLowerCase().includes(q)) return true;
    if (p.modernName && p.modernName.toLowerCase().includes(q)) return true;
    if (p.region && p.region.toLowerCase().includes(q)) return true;
    if (p.aliases && p.aliases.some((a) => a.toLowerCase().includes(q))) return true;
    if (p.biblicalNames && p.biblicalNames.some((b) => b.toLowerCase().includes(q))) return true;
    if (p.description && p.description.toLowerCase().includes(q)) return true;
    return false;
  });
}

export function getPlacesByType(type: PlaceType): BiblicalPlace[] {
  return ALL_BIBLICAL_PLACES.filter((p) => p.type === type);
}

export function getPlacesByRegion(region: string): BiblicalPlace[] {
  return ALL_BIBLICAL_PLACES.filter((p) => p.region === region);
}

export interface PlaceTypeDefinition {
  id: PlaceType;
  labelEn: string;
  labelAr: string;
  color: string;
  dotColor: string;
}

export const PLACE_TYPE_INFO: Record<PlaceType, PlaceTypeDefinition> = {
  city: { id: "city", labelEn: "City", labelAr: "مدينة", color: "text-amber-700 dark:text-amber-300", dotColor: "#B45309" },
  town: { id: "town", labelEn: "Town", labelAr: "بلدة", color: "text-blue-700 dark:text-blue-300", dotColor: "#1D4ED8" },
  village: { id: "village", labelEn: "Village", labelAr: "قرية", color: "text-teal-700 dark:text-teal-300", dotColor: "#0F766E" },
  settlement: { id: "settlement", labelEn: "Settlement", labelAr: "مستوطنة / جزيرة", color: "text-indigo-700 dark:text-indigo-300", dotColor: "#4338CA" },
  region: { id: "region", labelEn: "Region / Land", labelAr: "إقليم / أرض", color: "text-purple-700 dark:text-purple-300", dotColor: "#7E22CE" },
  country: { id: "country", labelEn: "Country", labelAr: "بلاد", color: "text-purple-800 dark:text-purple-200", dotColor: "#6B21A8" },
  kingdom: { id: "kingdom", labelEn: "Kingdom", labelAr: "مملكة", color: "text-amber-800 dark:text-amber-200", dotColor: "#92400E" },
  mountain: { id: "mountain", labelEn: "Mountain / Peak", labelAr: "جبل / قمة", color: "text-emerald-700 dark:text-emerald-300", dotColor: "#047857" },
  hill: { id: "hill", labelEn: "Hill", labelAr: "تلة / مرتفعة", color: "text-emerald-600 dark:text-emerald-400", dotColor: "#059669" },
  valley: { id: "valley", labelEn: "Valley", labelAr: "وادي / سهل", color: "text-green-700 dark:text-green-300", dotColor: "#15803D" },
  river: { id: "river", labelEn: "River / Stream", labelAr: "نهر / مجرى مائي", color: "text-cyan-700 dark:text-cyan-300", dotColor: "#0E7490" },
  sea: { id: "sea", labelEn: "Sea", labelAr: "بحر", color: "text-sky-700 dark:text-sky-300", dotColor: "#0369A1" },
  lake: { id: "lake", labelEn: "Lake", labelAr: "بحيرة", color: "text-sky-600 dark:text-sky-400", dotColor: "#0284C7" },
  desert: { id: "desert", labelEn: "Desert", labelAr: "صحراء", color: "text-yellow-700 dark:text-yellow-300", dotColor: "#A16207" },
  wilderness: { id: "wilderness", labelEn: "Wilderness", labelAr: "برية / قفر", color: "text-orange-700 dark:text-orange-300", dotColor: "#C2410C" },
  plain: { id: "plain", labelEn: "Plain", labelAr: "سهل فسيح", color: "text-lime-700 dark:text-lime-300", dotColor: "#4D7C0F" },
  pass: { id: "pass", labelEn: "Pass / Gorge", labelAr: "ممر جبلي", color: "text-stone-700 dark:text-stone-300", dotColor: "#57534E" },
  spring: { id: "spring", labelEn: "Spring", labelAr: "عين ماء", color: "text-teal-600 dark:text-teal-400", dotColor: "#0D9488" },
  oasis: { id: "oasis", labelEn: "Oasis", labelAr: "واحة", color: "text-teal-700 dark:text-teal-300", dotColor: "#0F766E" },
  well: { id: "well", labelEn: "Well", labelAr: "بئر", color: "text-blue-600 dark:text-blue-400", dotColor: "#2563EB" },
  camp: { id: "camp", labelEn: "Encampment", labelAr: "معسكر / محطة رحيل", color: "text-rose-700 dark:text-rose-300", dotColor: "#BE123C" },
  other: { id: "other", labelEn: "Place", labelAr: "موقع", color: "text-stone-600 dark:text-stone-400", dotColor: "#78716C" },
};

export function getCertaintyBadge(certainty: PlaceCertainty, lang: Language = "en") {
  if (certainty === "certain") {
    return {
      label: lang === "ar" ? "مؤكد تاريخياً" : "Certain Site",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    };
  }
  if (certainty === "probable") {
    return {
      label: lang === "ar" ? "مُرجّح أثرياً" : "Probable Site",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
    };
  }
  return {
    label: lang === "ar" ? "تقريبي / غير مؤكد" : "Uncertain Site",
    badgeClass: "bg-stone-100 text-stone-600 border-stone-300 dark:bg-stone-900 dark:text-stone-400 dark:border-stone-700",
  };
}
