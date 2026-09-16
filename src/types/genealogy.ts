import type { EventType } from "../data/biblicalEventTypes";
export type { EventType };

export type Gender = "male" | "female";

export type DatePrecision = "exact" | "approximate" | "about" | "calculated";

export type DateInfo = {
  year?: number;
  precision?: DatePrecision;
};

export interface Person {
  id: string;
  name: string;
  arabicName?: string;
  gender: "male" | "female";
  fatherId?: string;
  motherId?: string;
  husbandId?: string;
  wifeId?: string;
  spouseIds?: string[];
  fatherAgeAtBirth?: number;
  anchorPersonId?: string;
  anchorPersonAgeAtBirth?: number;
  husbandMarriageAge?: number;
  wifeMarriageAge?: number;
  yearsLived?: number;
  birth?: { year?: number; precision?: DatePrecision };
  death?: { year?: number; precision?: DatePrecision };
  placeOfBirth?: string;
  country?: string;
  notes?: string;
  arabicNotes?: string;
  biblicalReferences?: string[];
}

export interface BiblicalEvent {
  id: string;
  title: string;
  arabicTitle?: string;
  eventType?: EventType;
  description?: string;
  arabicDescription?: string;
  location?: string;
  locations?: string[];
  locationId?: string;
  coordinates?: [number, number];
  country?: string;
  countries?: string[];
  date?: { year?: number; precision?: DatePrecision };
  personIds?: string[];
  biblicalReferences?: string[];
  anchorPersonId?: string;
  anchorAge?: number;
  anchorPersonAgeAtEvent?: number;
  anchorPersonAgeAtBirth?: number;
}

export interface GenealogyData {
  version?: number;
  creationYearBC?: number;
  people: Person[];
  events: BiblicalEvent[];
}

export type Language = "en" | "ar";
export type ThemeMode = "light" | "dark";

export type BiblicalLocation = {
  id: string;
  name: string;
  arabicName: string;
  modernName: string; // e.g., "Tell el-Muqayyar, Iraq" for Ur
  modernCountry?: string;
  coordinates: [number, number]; // [lat, lng]
  region: "Mesopotamia" | "Canaan" | "Egypt" | "Sinai" | "Anatolia" | string;
  biblicalEra?: "Patriarchal" | "Exodus" | "United Monarchy" | string;
  keyEvents: string[]; // IDs linking to events in our Gist database
  description: string;
  arabicDescription: string;
  biblicalReferences: string[];
  placeType?: string;
  certainty?: string;
  aliases?: string[];
};
