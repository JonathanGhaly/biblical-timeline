export type DatePrecision = "exact" | "approximate" | "range";

export type DateInfo = {
  year?: number;
  startYear?: number;
  endYear?: number;
  precision: DatePrecision;
};

export type Gender = "male" | "female" | "unknown";

export type Person = {
  id: string;
  name: string;
  gender: Gender;
  
  // Dynamic birth anchor
  anchorPersonId?: string;       // ID of any referenced person (e.g., Adam, Noah, Methuselah)
  anchorPersonAgeAtBirth?: number; // Age of that person when this individual was born
  
  yearsLived?: number;            // Lifespan in years
  
  // Genealogical relationships
  fatherId?: string;
  motherId?: string;
  spouseIds: string[];
  
  biblicalReferences: string[];
  notes?: string;
};
export type BiblicalEvent = {
  id: string;
  title: string;

  date?: DateInfo;

  personIds: string[];

  location?: string;
  description?: string;

  biblicalReferences: string[];
};

export type GenealogyData = {
  version: number;
  people: Person[];
  events: BiblicalEvent[];
};