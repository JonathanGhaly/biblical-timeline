export type Gender = "male" | "female";

export type DatePrecision = "exact" | "approximate" | "about" | "calculated";

export type DateInfo = {
  year?: number;
  precision?: DatePrecision;
};

export type Person = {
  id: string;
  name: string;
  gender: Gender;
  placeOfBirth?: string;
  fatherId?: string;
  motherId?: string;
  anchorPersonId?: string;
  anchorPersonAgeAtBirth?: number;
  fatherAgeAtBirth?: number;
  yearsLived?: number;
  spouseIds?: string[];
  biblicalReferences?: string[];
  notes?: string;
  birth?: DateInfo;
  death?: DateInfo;
};

export type BiblicalEvent = {
  id: string;
  title: string;
  date?: DateInfo;
  anchorPersonId?: string;
  anchorAge?: number;
  location?: string;
  description?: string;
  biblicalReferences?: string[];
  personIds?: string[];
};

export type GenealogyData = {
  people: Person[];
  events: BiblicalEvent[];
};