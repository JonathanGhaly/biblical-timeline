export type Gender = "male" | "female";

export type DatePrecision = "exact" | "approximate" | "about" | "calculated";

export type DateInfo = {
  year?: number;
  precision?: DatePrecision;
};
export interface Person {
  id: string;
  name: string;
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
  birth?: { year?: number };
  death?: { year?: number };
  placeOfBirth?: string;
  notes?: string;
  biblicalReferences?: string[];
}

export interface BiblicalEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  date?: { year?: number };
  personIds?: string[];
  biblicalReferences?: string[];
  anchorPersonId?: string;
  anchorAge?: number;
  anchorPersonAgeAtEvent?: number;
  anchorPersonAgeAtBirth?: number;
}
export type GenealogyData = {
  people: Person[];
  events: BiblicalEvent[];
};