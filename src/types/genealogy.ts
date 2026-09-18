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

export type LawCategory =
  | "moral"              // Ten Commandments & moral foundations
  | "covenant"           // Covenants with Noah, Abraham, Sinai, etc.
  | "civil_judicial"     // Civil justice, restitution, liability, protection
  | "ceremonial_worship" // Tabernacle, sacrifices, priesthood, blessing
  | "festivals_sabbath"  // Sabbath, Sabbatical Year, Jubilee, feasts
  | "holiness_ethics"    // Holiness code, love neighbor, purity, diet
  | "other";

export interface BiblicalLaw {
  id: string;
  title: string;
  arabicTitle?: string;
  spokenTo: string;             // Recipient (e.g., "Moses and the Children of Israel")
  arabicSpokenTo?: string;       // Recipient in Arabic (e.g., "موسى وبنو إسرائيل")
  spokenBy?: string;             // Setting / divine delivery (e.g., "God from Mount Sinai")
  arabicSpokenBy?: string;       // Divine delivery in Arabic (e.g., "الله من جبل سيناء")
  category: LawCategory;
  scriptureReference: string;    // e.g., "Exodus 20:1-17"
  arabicScriptureReference?: string; // e.g., "خروج 20: 1-17"
  commandmentTextEn: string;     // The spoken words of God in English
  commandmentTextAr?: string;    // The spoken words of God in Arabic
  summaryEn?: string;            // Summary / theological context
  summaryAr?: string;
  biblicalYearBC?: number;       // Approximate historical year BC (e.g. 1446)
  location?: string;             // e.g., "Mount Sinai"
  arabicLocation?: string;       // e.g., "جبل سيناء"
  keyPrinciples?: string[];      // e.g., ["Monotheism", "Justice"]
  linkedPersonIds?: string[];    // Associated people IDs (e.g., ["moses", "aaron"])
}

export interface GenealogyData {
  version?: number;
  creationYearBC?: number;
  people: Person[];
  events: BiblicalEvent[];
  laws?: BiblicalLaw[];
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
